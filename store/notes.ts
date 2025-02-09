import { notes, IEntry, INote } from '@/db/schema';
import { getDb } from '@/utils/db';
import { and, eq } from 'drizzle-orm';
import { create } from 'zustand';

interface NotesState {
  notes: INote[];
  //   createEntry: (data: Pick<IEntry, 'title' | 'project_id'>) => Promise<boolean>;
  getnotes: () => void;
  //   getNote: (id: number) => Promise<INote | null>;
  //   getCompletednotesCount: (projectId: number) => Promise<number>;
  //   updateEntryStatus: (entryId: number, completed: boolean) => Promise<boolean>;
  //   isAllCompleted: boolean;
  //   resetAllnotesStatus: (projectId: number) => Promise<boolean>;
}

const db = getDb();

const useNotesStore = create<NotesState>()(set => ({
  notes: [],
  getnotes: async () => {
    const allnotes = await db.query.notes.findMany();
    set({
      notes: allnotes,
    });
  },
  //   createEntry: async data => {
  //     const [newEntry] = await db
  //       .insert(entrySchema)
  //       .values({ project_id: data.project_id, title: data.title, createdAt: new Date() })
  //       .returning({
  //         id: entrySchema.id,
  //         title: entrySchema.title,
  //         createdAt: entrySchema.createdAt,
  //         completed: entrySchema.completed,
  //         project_id: entrySchema.project_id,
  //       });

  //     if (newEntry) {
  //       set(state => {
  //         const newnotes = [...state.notes, newEntry];
  //         return {
  //           notes: newnotes,
  //           isAllCompleted: newnotes.every(entry => entry.completed),
  //         };
  //       });
  //       return true;
  //     }
  //     return false;
  //   },
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
  const getNotes = useNotesStore(state => state.getnotes);
  //   const createEntry = useNotesStore(state => state.createEntry);
  //   const getCompletednotesCount = useNotesStore(state => state.getCompletednotesCount);
  //   const updateEntryStatus = useNotesStore(state => state.updateEntryStatus);
  //   const resetAllnotesStatus = useNotesStore(state => state.resetAllnotesStatus);

  return {
    notes,
    getNotes,
    // isAllCompleted,
    // getnotes,
    // createEntry,
    // getCompletednotesCount,
    // updateEntryStatus,
    // resetAllnotesStatus,
  };
};
