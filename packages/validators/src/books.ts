import { z } from "zod";

export const bookStatus = z.enum(["reading", "done"]);

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  author: z.string().min(1, "Author is required").max(255, "Author too long"),
  status: bookStatus.default("reading"),
  stars: z.number().int().min(1).max(5).optional(),
  review: z.string().max(1000, "Review too long").optional(),
});

export const updateBookSchema = createBookSchema.partial();

export const bookIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid book ID").transform(Number),
});

export type BookStatus = z.infer<typeof bookStatus>;
export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;
export type BookId = z.infer<typeof bookIdSchema>;