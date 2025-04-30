import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notes")({
  component: Notes,
});

function Notes() {
  return <div className="p-2">Hello from Notes!</div>;
}
