import { entries as entrySchema, IEntry } from '@/db/schema';
import { getDb } from '@/utils/db';
import { and, eq } from 'drizzle-orm';
import { create } from 'zustand';

interface EntriesState {
  entries: IEntry[];
  createEntry: (data: Pick<IEntry, 'title' | 'project_id'>) => Promise<boolean>;
  getEntries: (projectId: string) => void;
  getCompletedEntriesCount: (projectId: number) => Promise<number>;
  updateEntryStatus: (entryId: number, completed: boolean) => Promise<boolean>;
}

const db = getDb();

const useEntriesStore = create<EntriesState>()(set => ({
  entries: [],
  getEntries: async projectId => {
    const allEntries = await db.query.entries.findMany({
      where: eq(entrySchema.project_id, Number(projectId)),
    });

    console.log(allEntries, 'NENAPs');

    set({
      entries: allEntries,
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
      set(state => ({
        entries: [...state.entries, newEntry],
      }));
      return true;
    }
    return false;
  },
  getCompletedEntriesCount: async projectId => {
    const completedCount = await db.$count(
      entrySchema,
      and(eq(entrySchema.completed, true), eq(entrySchema.project_id, projectId)),
    );

    return completedCount;
  },
  updateEntryStatus: async (entryId: number, completed: boolean) => {
    try {
      const updated = await db
        .update(entrySchema)
        .set({ completed })
        .where(eq(entrySchema.id, entryId));

      if (updated.changes) {
        set(state => ({
          entries: state.entries.map(entry =>
            entry.id === entryId ? { ...entry, completed } : entry,
          ),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating entry status:', error);
      return false;
    }
  },
}));

export const useEntries = () => {
  const entries = useEntriesStore(state => state.entries);
  const getEntries = useEntriesStore(state => state.getEntries);
  const createEntry = useEntriesStore(state => state.createEntry);
  const getCompletedEntriesCount = useEntriesStore(state => state.getCompletedEntriesCount);
  const updateEntryStatus = useEntriesStore(state => state.updateEntryStatus);

  return {
    entries,
    getEntries,
    createEntry,
    getCompletedEntriesCount,
    updateEntryStatus,
  };
};
