import { client } from "../utils/hono-client";
import {
  createMutationOptions,
  createQueryOptions,
} from "../utils/query-utils";

/**
 * Query Options Definition File
 *
 * This file is intended for defining query and mutation options that interact with the Hono server.
 * Files ending with `.queries.ts` (like this one) are the recommended place to centralize and organize
 * your application's query options.
 *
 * By defining your query options here, you can easily reuse them across the entire app.
 * These options are created using the createQueryOptions and createMutationOptions utilities.
 *
 * @example
 * // Import and use a query option in your component
 * import { notesQueryOptions } from "../queries/notes.queries";
 * const { data } = useQuery(notesQueryOptions());
 */

export const notesQueryOptions = createQueryOptions(
  ["notes"],
  client.notes.$get
);

// This is not used in the example app, however it's to demonstrate how you could pass parameters to the query key
export const noteByIdQueryOptions = createQueryOptions(
  ({ param: { id } }) => ["notes", id],
  client.notes[":id"].$get
);

export const createNoteMutationOptions = createMutationOptions(
  client.notes.$post
);
