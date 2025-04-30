import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { notesQueryOptions } from "../queries/notes.queries";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const notesQuery = useQuery(notesQueryOptions());
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {notesQuery.data?.map((note) => <div key={note.id}>{note.title}</div>)}
    </div>
  );
}
