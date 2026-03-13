import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const entries = sqliteTable('entries', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  completed: integer({ mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const notes = sqliteTable('notes', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text(),
  position: integer().notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const recordings = sqliteTable('recordings', {
  id: integer().primaryKey({ autoIncrement: true }),
  recording_uri: text().notNull(),
  recordedAt: integer('recorded_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  noteId: integer('note_id')
    .notNull()
    .references(() => notes.id, { onDelete: 'cascade' }),
});

export type IProject = typeof projects.$inferSelect;
export type IEntry = typeof entries.$inferSelect;

export type INote = typeof notes.$inferSelect;
export type IRecording = typeof recordings.$inferSelect;
