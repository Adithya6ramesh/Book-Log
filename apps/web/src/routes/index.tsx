import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AuthShowcase } from "../components/auth-showcase";
import { CreateNote } from "../components/create-note";
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
      {notesQuery.data?.map((note) => (
        <Card
          key={note.id}
          className="w-full max-w-lg shadow-md hover:shadow-lg transition-shadow bg-transparent text-white border-zinc-600"
        >
          <CardHeader>
            <CardTitle className="text-xl font-bold">{note.title}</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              {note.content}
            </CardDescription>
          </CardHeader>
          <CardFooter className="text-sm text-gray-300 flex justify-between items-center border-t border-zinc-600 pt-3">
            <span>Created by: {note.creatorName}</span>
            {note.isOwner && (
              <span className="text-blue-500 text-xs font-medium">
                You are the owner
              </span>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
