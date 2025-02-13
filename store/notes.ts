import { notes, INote, recordings } from '@/db/schema';
import { getDb } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { create } from 'zustand';

interface NotesState {
  notes: INote[];
  isLoading: boolean;
  createNote: (data: Pick<INote, 'title' | 'content'>) => Promise<boolean>;
  getNotes: () => void;
  getNote: (id: number) => Promise<INote | null>;
  deleteNote: (noteId: number) => Promise<boolean>;
  updateNote: (id: number, data: Pick<INote, 'title' | 'content'>) => Promise<boolean>;
}

const db = getDb();

const useNotesStore = create<NotesState>()(set => ({
  notes: [],
  isLoading: false,
  getNotes: async () => {
    set({ isLoading: true });
    try {
      const allNotes = await db.query.notes.findMany();
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
        position: notes.position,
      });

    if (newEntry) {
      set(state => {
        const newnotes = [...state.notes, newEntry];
        return {
          notes: newnotes,
        };
      });
      return true;
    }
    return false;
  },
  updateNote: async (id, data) => {
    const exists = await db.query.notes.findFirst({ where: eq(notes.id, id) });
    if (!exists) return false;
    const [updateEntry] = await db
      .update(notes)
      .set({ title: data.title, content: data.content, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        position: notes.position,
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
      const note = await db.query.notes.findFirst({
        where: eq(notes.id, noteId),
      });

      if (!note) {
        set({ isLoading: false });
        return false;
      }

      let isDeleted = false;

      await db.transaction(async tx => {
        await tx.delete(recordings).where(eq(recordings.noteId, noteId));

        const deleted = await tx.delete(notes).where(eq(notes.id, noteId));

        if (deleted.changes === 1) {
          isDeleted = true;
          set(state => ({
            notes: state.notes.filter(note => note.id !== noteId),
            isLoading: false,
          }));
        }
      });

      set({ isLoading: false });
      return isDeleted;
    } catch (error) {
      console.error('Error deleting note:', error);
      set({ isLoading: false });
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

  return {
    notes,
    isLoading,
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
};
