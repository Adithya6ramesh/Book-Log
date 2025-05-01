import { client } from "../utils/hono-client";
import {
  createMutationOptions,
  createQueryOptions,
} from "../utils/query-utils";

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
