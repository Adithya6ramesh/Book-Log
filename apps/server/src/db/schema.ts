import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import * as authSchema from "./auth-schema";

export const bookStatusEnum = pgEnum('book_status', ['reading', 'done']);

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  status: bookStatusEnum('status').notNull().default('reading'),
  stars: integer('stars'),
  review: text('review'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Export auth schema tables
export const { user, session, account, verification } = authSchema;

const schema = {
  books,
  bookStatusEnum,
  // Auth tables
  ...authSchema,
};

export default schema;