import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const boardsTable = pgTable("boards", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  status: text("status").notNull().default("learning"),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBoardSchema = createInsertSchema(boardsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBoard = z.infer<typeof insertBoardSchema>;
export type Board = typeof boardsTable.$inferSelect;
