import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { workspacesTable } from "./workspaces";

export const workspaceInvitesTable = pgTable("workspace_invites", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id").notNull().references(() => workspacesTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("editor"),
  token: text("token").notNull().unique(),
  invitedBy: integer("invited_by").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWorkspaceInviteSchema = createInsertSchema(workspaceInvitesTable).omit({ id: true, createdAt: true, acceptedAt: true });
export type InsertWorkspaceInvite = z.infer<typeof insertWorkspaceInviteSchema>;
export type WorkspaceInvite = typeof workspaceInvitesTable.$inferSelect;
