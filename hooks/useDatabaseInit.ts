import { DATABASE_NAME } from '@/constants/constants';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export const useDatabaseInit = () => {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);
  return { success };
};
