import { createFileRoute } from "@tanstack/react-router";
import { BookList } from "../components/book-list";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <BookList />;
}
