import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import * as authSchema from "./auth-schema";

export * from "./auth-schema";

export const note = pgTable("note", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => authSchema.user.id),
});

export const usersRelations = relations(authSchema.user, ({ many }) => ({
  notes: many(note),
}));

export const notesRelations = relations(note, ({ one }) => ({
  user: one(authSchema.user, {
    fields: [note.userId],
    references: [authSchema.user.id],
  }),
}));
