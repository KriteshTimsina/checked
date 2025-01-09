import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
});

export const entries = sqliteTable('entries', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  status: integer({ mode: 'boolean' }),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id),
});

export type Project = typeof projects.$inferSelect;
export type Entry = typeof entries.$inferSelect;
