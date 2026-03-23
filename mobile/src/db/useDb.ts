import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';

export const useDb = () => {
  const databaseInstance = useSQLiteContext();
  const db = drizzle(databaseInstance, { schema });

  return db;
};
