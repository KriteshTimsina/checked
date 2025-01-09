import { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_VERSION = 1;

async function batchAsync(db: SQLiteDatabase, queries: string[]) {
  await db.execAsync(queries.join(';'));
}

export async function runMigration(db: SQLiteDatabase) {
  db.withExclusiveTransactionAsync(async () => {
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = result ? result.user_version : 0;
    if (currentDbVersion === DATABASE_VERSION) return;

    console.log(`[Migration] Migrating db from ${currentDbVersion} to ${DATABASE_VERSION}`);

    if (currentDbVersion === 0) {
      await batchAsync(db, [
        `CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY NOT NULL,
            version INTEGER,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            position INTEGER DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS entry_tags (
            entry_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,
            PRIMARY KEY (entry_id, tag_id),
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE recordings (
            id INTEGER PRIMARY KEY NOT NULL,
            recording_uri TEXT NOT NULL,
            recorded_at INTEGER NOT NULL,
            length INTEGER NOT NULL,
            entry_id INTEGER NOT NULL,
            FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
        )`,
      ]);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    console.log('[Migration] Migration successful');
  });
}
