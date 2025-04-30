import { client } from "../utils/hono-client";
import { createQueryOptions } from "../utils/query-utils";

export const notesQueryOptions = createQueryOptions(
  ["notes"],
  client.notes.$get
);

export const noteByIdQueryOptions = createQueryOptions(
  ({ param: { id } }) => ["notes", id],
  client.notes[":id"].$get
);
