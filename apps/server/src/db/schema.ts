import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

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

const schema = {
  books,
  bookStatusEnum,
};

export default schema;