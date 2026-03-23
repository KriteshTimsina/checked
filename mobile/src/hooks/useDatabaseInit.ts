import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import * as schema from '@/db/schema';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export const useDatabaseInit = () => {
  const expoDb = useSQLiteContext();
  const db = drizzle(expoDb, { schema });
  const { success, error } = useMigrations(db, migrations);

  useDrizzleStudio(__DEV__ ? expoDb : null);
  if (error) console.error('Migration error:', error);

  return { success };
};
