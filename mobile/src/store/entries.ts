import { entries as entrySchema, IEntry } from '@/db/schema';
import { getDb } from '@/utils/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import { create } from 'zustand';

interface EntriesState {
  entries: IEntry[];
  isAllCompleted: boolean;
  getEntries: (projectId: string) => Promise<void>;
  createEntry: (data: Pick<IEntry, 'title' | 'project_id'>) => Promise<boolean>;
  updateEntry: (entry: IEntry, updatedTitle: string) => Promise<boolean>;
  updateEntryStatus: (entryId: number, completed: boolean) => Promise<boolean>;
  resetAllEntriesStatus: (projectId: number) => Promise<boolean>;
  deleteEntry: (entryId: number) => Promise<boolean>;
  getCompletedEntriesCount: (projectId: number) => Promise<number>;
}

const sortEntries = (entries: IEntry[]) =>
  [...entries].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

const db = getDb();

const useEntriesStore = create<EntriesState>()(set => ({
  entries: [],
  isAllCompleted: false,

  getEntries: async projectId => {
    const allEntries = await db.query.entries.findMany({
      where: eq(entrySchema.project_id, Number(projectId)),
      orderBy: [asc(entrySchema.completed), desc(entrySchema.createdAt)],
    });
    set({
      entries: allEntries,
      isAllCompleted: allEntries.length > 0 && allEntries.every(e => e.completed),
    });
  },

  createEntry: async data => {
    const [newEntry] = await db
      .insert(entrySchema)
      .values({ project_id: data.project_id, title: data.title, createdAt: new Date() })
      .returning({
        id: entrySchema.id,
        title: entrySchema.title,
        createdAt: entrySchema.createdAt,
        completed: entrySchema.completed,
        project_id: entrySchema.project_id,
      });

    if (newEntry) {
      set(state => {
        const newEntries = sortEntries([newEntry, ...state.entries]);
        return {
          entries: newEntries,
          isAllCompleted: newEntries.every(e => e.completed),
        };
      });
      return true;
    }
    return false;
  },

  updateEntry: async (entry, title) => {
    const [updatedEntry] = await db
      .update(entrySchema)
      .set({ title })
      .where(eq(entrySchema.id, entry.id))
      .returning({
        id: entrySchema.id,
        title: entrySchema.title,
        createdAt: entrySchema.createdAt,
        completed: entrySchema.completed,
        project_id: entrySchema.project_id,
      });

    if (updatedEntry) {
      set(state => {
        const newEntries = sortEntries(
          state.entries.map(e => (e.id === updatedEntry.id ? updatedEntry : e)),
        );
        return {
          entries: newEntries,
          isAllCompleted: newEntries.length > 0 && newEntries.every(e => e.completed),
        };
      });
      return true;
    }
    return false;
  },

  updateEntryStatus: async (entryId, completed) => {
    try {
      const updated = await db
        .update(entrySchema)
        .set({ completed })
        .where(eq(entrySchema.id, entryId));

      if (updated.changes) {
        set(state => {
          const newEntries = sortEntries(
            state.entries.map(e => (e.id === entryId ? { ...e, completed } : e)),
          );
          return {
            entries: newEntries,
            isAllCompleted: newEntries.length > 0 && newEntries.every(e => e.completed),
          };
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating entry status:', error);
      return false;
    }
  },

  resetAllEntriesStatus: async projectId => {
    const updated = await db
      .update(entrySchema)
      .set({ completed: false })
      .where(eq(entrySchema.project_id, projectId));

    if (updated.changes) {
      set(state => ({
        entries: sortEntries(state.entries.map(e => ({ ...e, completed: false }))),
        isAllCompleted: false,
      }));
      return true;
    }
    return false;
  },

  deleteEntry: async entryId => {
    try {
      const deleted = await db.delete(entrySchema).where(eq(entrySchema.id, entryId));

      if (deleted.changes) {
        set(state => {
          const newEntries = state.entries.filter(e => e.id !== entryId);
          return {
            entries: newEntries,
            isAllCompleted: newEntries.length > 0 && newEntries.every(e => e.completed),
          };
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  },

  getCompletedEntriesCount: async projectId => {
    return await db.$count(
      entrySchema,
      and(eq(entrySchema.completed, true), eq(entrySchema.project_id, projectId)),
    );
  },
}));

export const useEntries = () => {
  const entries = useEntriesStore(state => state.entries);
  const isAllCompleted = useEntriesStore(state => state.isAllCompleted);
  const getEntries = useEntriesStore(state => state.getEntries);
  const createEntry = useEntriesStore(state => state.createEntry);
  const getCompletedEntriesCount = useEntriesStore(state => state.getCompletedEntriesCount);
  const updateEntryStatus = useEntriesStore(state => state.updateEntryStatus);
  const resetAllEntriesStatus = useEntriesStore(state => state.resetAllEntriesStatus);
  const updateEntry = useEntriesStore(state => state.updateEntry);
  const deleteEntry = useEntriesStore(state => state.deleteEntry);

  return {
    entries,
    isAllCompleted,
    getEntries,
    createEntry,
    getCompletedEntriesCount,
    updateEntryStatus,
    resetAllEntriesStatus,
    updateEntry,
    deleteEntry,
  };
};
