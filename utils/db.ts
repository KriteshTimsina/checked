import * as SQLite from 'expo-sqlite';
import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/expo-sqlite';

import { DATABASE_NAME } from '@/constants/constants';

type Schema = typeof schema;

let db: ReturnType<typeof drizzle<Schema>> | null = null;

export const getDb = () => {
  if (!db) {
    const sqlite = SQLite.openDatabaseSync(DATABASE_NAME);
    sqlite.execSync('PRAGMA foreign_keys = ON;');
    db = drizzle(sqlite, { schema });
  }
  return db;
};
