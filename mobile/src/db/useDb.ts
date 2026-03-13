import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from '@/db/schema';

export const useDb = () => {
  const databaseInstance = useSQLiteContext();
  const db = drizzle(databaseInstance, { schema });
  useDrizzleStudio(databaseInstance);

  return db;
};
