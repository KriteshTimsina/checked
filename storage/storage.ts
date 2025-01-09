import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { runMigration } from './migration';

export class Storage {
  db: SQLiteDatabase | null = null;

  async initialize() {
    const db = await openDatabaseAsync('diary.db');

    try {
      runMigration(db);
    } catch (e) {
      await db.closeAsync();
      console.log('[Storage] Error while initializing db: ', e);
    }

    this.db = db;
  }
}
