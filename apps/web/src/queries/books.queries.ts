import { client } from "../utils/hono-client";
import {
  createHonoQueryOptions,
  createHonoMutationOptions,
} from "@reno-stack/hono-react-query";

// Query options for fetching all books
export const booksQueryOptions = createHonoQueryOptions(
  ["books"],
  client.books.$get
);

// Query options for fetching a single book by ID
export const bookByIdQueryOptions = createHonoQueryOptions(
  ({ param: { id } }) => ["books", id],
  client.books[":id"].$get
);

// Mutation options for creating a new book
export const createBookMutationOptions = createHonoMutationOptions(
  client.books.$post
);

// Mutation options for updating an existing book
export const updateBookMutationOptions = createHonoMutationOptions(
  client.books[":id"].$put
);

// Mutation options for deleting a book
export const deleteBookMutationOptions = createHonoMutationOptions(
  client.books[":id"].$delete
);