import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const pillars = sqliteTable("pillars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  date: text("date").notNull().unique(),
  promptText: text("prompt_text"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const entryTags = sqliteTable(
  "entry_tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    entryId: integer("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    pillarId: integer("pillar_id")
      .notNull()
      .references(() => pillars.id, { onDelete: "cascade" }),
    confidence: real("confidence"),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueEntryPillar: uniqueIndex("unique_entry_pillar").on(
      table.entryId,
      table.pillarId
    ),
  })
);

export const prompts = sqliteTable("prompts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pillarId: integer("pillar_id").references(() => pillars.id, {
    onDelete: "set null",
  }),
  text: text("text").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
