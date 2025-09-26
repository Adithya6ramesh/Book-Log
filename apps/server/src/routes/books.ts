import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { books } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { 
  createBookSchema, 
  updateBookSchema, 
  bookIdSchema 
} from "@repo/validators";
import type { HonoAppContext } from "../auth.js";

export const booksRouter = new Hono<HonoAppContext>()
  // Get all books
  .get("/", async (c) => {
    console.log("GET /books - Request received");
    try {
      const allBooks = await db.select().from(books).orderBy(books.createdAt);
      console.log(`GET /books - Found ${allBooks.length} books`);
      return c.json({ books: allBooks });
    } catch (error) {
      console.error("Error fetching books:", error);
      return c.json({ error: "Failed to fetch books" }, 500);
    }
  })
  
  // Get single book by ID
  .get("/:id", zValidator("param", bookIdSchema), async (c) => {
    try {
      const { id } = c.req.valid("param");
      const book = await db.select().from(books).where(eq(books.id, id)).limit(1);
      
      if (book.length === 0) {
        return c.json({ error: "Book not found" }, 404);
      }
      
      return c.json({ book: book[0] });
    } catch (error) {
      console.error("Error fetching book:", error);
      return c.json({ error: "Failed to fetch book" }, 500);
    }
  })
  
  // Create new book
  .post("/", zValidator("json", createBookSchema), async (c) => {
    try {
      const bookData = c.req.valid("json");
      const [newBook] = await db.insert(books).values({
        ...bookData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      return c.json({ book: newBook }, 201);
    } catch (error) {
      console.error("Error creating book:", error);
      return c.json({ error: "Failed to create book" }, 500);
    }
  })
  
  // Update book
  .put("/:id", zValidator("param", bookIdSchema), zValidator("json", updateBookSchema), async (c) => {
    try {
      const { id } = c.req.valid("param");
      const updateData = c.req.valid("json");
      console.log("Updating book", id, updateData);

      const [updatedBook] = await db
        .update(books)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(books.id, id))
        .returning();

      console.log("Updated book", updatedBook);

      if (!updatedBook) {
        return c.json({ error: "Book not found" }, 404);
      }

      return c.json({ book: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error);
      return c.json({ error: "Failed to update book" }, 500);
    }
  })
  
  // Delete book
  .delete("/:id", zValidator("param", bookIdSchema), async (c) => {
    try {
      const { id } = c.req.valid("param");
      
      const [deletedBook] = await db
        .delete(books)
        .where(eq(books.id, id))
        .returning({ id: books.id });
      
      if (!deletedBook) {
        return c.json({ error: "Book not found" }, 404);
      }
      
      return c.json({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      return c.json({ error: "Failed to delete book" }, 500);
    }
  });