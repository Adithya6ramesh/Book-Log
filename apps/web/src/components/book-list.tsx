import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksQueryOptions, deleteBookMutationOptions } from "../queries/books.queries";
import { CreateBookForm } from "./create-book-form";
import { EditBookModal } from "./edit-book-modal";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

type Book = {
  id: number;
  title: string;
  author: string;
  status: "reading" | "done";
  stars?: number | null;
  review?: string | null;
  createdAt: string;
  updatedAt: string;
};

type BookFilter = "all" | "reading" | "done";
type SortBy = "title" | "author" | "stars" | "createdAt";

export function BookList() {
  const [filter, setFilter] = useState<BookFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const queryClient = useQueryClient();
  
  const booksQuery = useQuery(booksQueryOptions());
  
  const deleteBookMutation = useMutation({
    ...deleteBookMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksQueryOptions().queryKey });
    },
  });

  const books = booksQuery.data?.books || [];
  
  // Debug log to see what data is coming from the API
  console.log("Books data from API:", books);

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter((book) => {
      if (filter === "all") return true;
      return book.status === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "stars":
          return (b.stars || 0) - (a.stars || 0);
        case "createdAt":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleDeleteBook = (bookId: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate({ param: { id: bookId.toString() } });
    }
  };

  const readingCount = books.filter((book) => book.status === "reading").length;
  const doneCount = books.filter((book) => book.status === "done").length;

  const renderStars = (stars?: number | null) => {
    // For debugging, log the value to see what's being passed
    console.log("Star rating value:", stars, typeof stars);
    
    if (stars === null || stars === undefined) return <span className="text-gray-400">No rating</span>;
    
    // Ensure stars is a number between 0-5
    const starValue = Math.max(0, Math.min(5, Number(stars) || 0));
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < starValue ? "text-yellow-400" : "text-gray-300"}>
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (booksQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading books...</div>
      </div>
    );
  }

  if (booksQuery.isError) {
    console.error("Error loading books:", booksQuery.error);
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-600">Error loading books</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Book Log</h1>
        
        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{readingCount}</div>
              <div className="text-sm text-gray-600">Currently Reading</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{doneCount}</div>
              <div className="text-sm text-gray-600">Books Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BookFilter)}
              className="px-3 py-2 border border-gray-300 rounded-xl"
            >
              <option value="all">All Books</option>
              <option value="reading">Currently Reading</option>
              <option value="done">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border border-gray-300 rounded-xl"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="stars">Sort by Rating</option>
            </select>
          </div>

          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New Book
          </Button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full mx-4">
            <CreateBookForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
        />
      )}

      {/* Books Grid */}
      {filteredAndSortedBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {filter === "all" 
              ? "No books in your library yet." 
              : `No ${filter} books found.`}
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{book.title}</CardTitle>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.status === "reading"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {book.status === "reading" ? "Currently Reading" : "Completed"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    {renderStars(book.stars)}
                  </div>

                  {/* Review */}
                  {book.review && (
                    <div>
                      <span className="text-sm font-medium">Review:</span>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {book.review}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBook(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteBookMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}