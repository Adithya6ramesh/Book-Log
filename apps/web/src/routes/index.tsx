import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AuthShowcase } from "../components/auth-showcase";
import { CreateNote } from "../components/create-note";
import { Notes } from "../components/notes";
import { notesQueryOptions } from "../queries/notes.queries";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const notesQuery = useQuery(notesQueryOptions());

  return (
    <div className="p-2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to Bruh Stack
        </h1>
        <AuthShowcase />
      </div>
      <CreateNote />
      {notesQuery.data && <Notes notes={notesQuery.data} />}
    </div>
  );
}
