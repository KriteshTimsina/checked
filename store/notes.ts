import { notes, IEntry, INote } from '@/db/schema';
import { getDb } from '@/utils/db';
import { and, eq } from 'drizzle-orm';
import { create } from 'zustand';

interface NotesState {
  notes: INote[];
  createNote: (data: Pick<INote, 'title' | 'content'>) => Promise<boolean>;
  getNotes: () => void;
  getNote: (id: number) => Promise<INote | null>;
  //   getCompletednotesCount: (projectId: number) => Promise<number>;
  updateNote: (id: number, data: Pick<INote, 'title' | 'content'>) => Promise<boolean>;
  //   isAllCompleted: boolean;
  //   resetAllnotesStatus: (projectId: number) => Promise<boolean>;
}

const db = getDb();

const useNotesStore = create<NotesState>()(set => ({
  notes: [],
  getNotes: async () => {
    const allnotes = await db.query.notes.findMany();
    set({
      notes: allnotes,
    });
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
    console.log(exists, 'WHATTTTT');
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

    console.log('UPDATE ENTTR', updateEntry);

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
  //   getCompletednotesCount: async projectId => {
  //     const completedCount = await db.$count(
  //       entrySchema,
  //       and(eq(entrySchema.completed, true), eq(entrySchema.project_id, projectId)),
  //     );

  //     return completedCount;
  //   },
  //   updateEntryStatus: async (entryId: number, completed: boolean) => {
  //     try {
  //       const updated = await db
  //         .update(entrySchema)
  //         .set({ completed })
  //         .where(eq(entrySchema.id, entryId));

  //       if (updated.changes) {
  //         set(state => {
  //           const newnotes = state.notes.map(entry =>
  //             entry.id === entryId ? { ...entry, completed } : entry,
  //           );
  //           return {
  //             notes: newnotes,
  //             isAllCompleted: newnotes.length > 0 && newnotes.every(entry => entry.completed),
  //           };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       console.error('Error updating entry status:', error);
  //       return false;
  //     }
  //   },
  //   resetAllnotesStatus: async (projectId: number) => {
  //     const updated = await db
  //       .update(entrySchema)
  //       .set({ completed: false })
  //       .where(eq(entrySchema.project_id, projectId));
  //     if (updated.changes) {
  //       set(state => ({
  //         notes: state.notes.map(entry => ({
  //           ...entry,
  //           completed: false,
  //         })),
  //         isAllCompleted: false,
  //       }));
  //       return true;
  //     }
  //     return false;
  //   },
}));

export const useNotes = () => {
  const notes = useNotesStore(state => state.notes);
  //   const isAllCompleted = useNotesStore(state => state.isAllCompleted);
  const getNotes = useNotesStore(state => state.getNotes);
  const getNote = useNotesStore(state => state.getNote);
  const createNote = useNotesStore(state => state.createNote);
  //   const getCompletednotesCount = useNotesStore(state => state.getCompletednotesCount);
  const updateNote = useNotesStore(state => state.updateNote);
  //   const resetAllnotesStatus = useNotesStore(state => state.resetAllnotesStatus);

  return {
    notes,
    getNotes,
    getNote,
    createNote,
    updateNote,
    // isAllCompleted,
    // getnotes,
    // createEntry,
    // getCompletednotesCount,
    // updateEntryStatus,
    // resetAllnotesStatus,
  };
};
