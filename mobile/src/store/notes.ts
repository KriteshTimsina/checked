import { notes, INote } from '@/db/schema';
import { getDb } from '@/utils/db';
import { asc, desc, eq } from 'drizzle-orm';
import { create } from 'zustand';

interface NotesState {
  notes: INote[];
  isLoading: boolean;
  createNote: (data: Pick<INote, 'title' | 'content'>) => Promise<INote | null>;
  getNotes: () => void;
  getNote: (id: number) => Promise<INote | null>;
  deleteNote: (noteId: number) => Promise<boolean>;
  updateNote: (id: number, data: Pick<INote, 'title' | 'content'>) => Promise<boolean>;
  togglePin: (id: number) => Promise<boolean>;
}

const db = getDb();

const useNotesStore = create<NotesState>()(set => ({
  notes: [],
  isLoading: false,
  getNotes: async () => {
    set({ isLoading: true });
    try {
      const allNotes = await db.query.notes.findMany({
        orderBy: [desc(notes.pinned)],
      });
      set({
        notes: allNotes,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      set({ isLoading: false });
    }
  },
  createNote: async data => {
    const [newEntry] = await db
      .insert(notes)
      .values({ title: data.title, content: data.content })
      .returning({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        pinned: notes.pinned,
      });

    if (newEntry) {
      set(state => ({ notes: [...state.notes, newEntry] }));
      return newEntry;
    }
    return null;
  },
  updateNote: async (id, data) => {
    const exists = await db.query.notes.findFirst({ where: eq(notes.id, id) });
    if (!exists) return false;
    const [updateEntry] = await db
      .update(notes)
      .set({
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
        pinned: notes.pinned,
      })
      .where(eq(notes.id, id))
      .returning({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        pinned: notes.pinned,
      });

    if (updateEntry) {
      set(state => ({
        notes: state.notes.map(note => (note.id === id ? updateEntry : note)),
      }));
      return true;
    }
    return false;
  },
  getNote: async (id: number) => {
    const note = await db.query.notes.findFirst({ where: eq(notes.id, id) });
    if (note) return note;
    return null;
  },
  deleteNote: async noteId => {
    set({ isLoading: true });
    try {
      const deleted = await db.delete(notes).where(eq(notes.id, noteId));

      if (deleted.changes === 1) {
        set(state => ({
          notes: state.notes.filter(note => note.id !== noteId),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  togglePin: async (id: number) => {
    try {
      const exists = await db.query.notes.findFirst({ where: eq(notes.id, id) });
      if (!exists) return false;
      const [updateEntry] = await db
        .update(notes)
        .set({ pinned: !exists.pinned })
        .where(eq(notes.id, id))
        .returning({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          createdAt: notes.createdAt,
          updatedAt: notes.updatedAt,
          pinned: notes.pinned,
        });

      if (updateEntry) {
        set(state => {
          const updated = state.notes.map(note => (note.id === id ? updateEntry : note));

          updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));

          return { notes: updated };
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating entry status:', error);
      return false;
    }
  },
}));

export const useNotes = () => {
  const notes = useNotesStore(state => state.notes);
  const isLoading = useNotesStore(state => state.isLoading);
  const getNotes = useNotesStore(state => state.getNotes);
  const getNote = useNotesStore(state => state.getNote);
  const createNote = useNotesStore(state => state.createNote);
  const deleteNote = useNotesStore(state => state.deleteNote);
  const updateNote = useNotesStore(state => state.updateNote);
  const togglePin = useNotesStore(state => state.togglePin);

  return {
    notes,
    isLoading,
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  };
};
