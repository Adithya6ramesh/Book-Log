import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksQueryOptions, deleteBookMutationOptions } from "../queries/books.queries";
import { CreateBookForm } from "./create-book-form";
import { EditBookModal } from "./edit-book-modal";
import { Button } from "@repo/ui/button";

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
    console.log("Calculated starValue:", starValue);

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            style={{ color: i < starValue ? '#fbbf24' : '#94a3b8' }}
          >
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
        <h1
          className="text-5xl font-bold mb-6"
          style={{
            background: 'linear-gradient(to right, #ec4899, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Book Logs
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="dashboard-card">
            <div className="metric-label">Total Books</div>
            <div className="metric-value">{books.length}</div>
            <div className={books.length > 0 ? "metric-change-positive" : "metric-change-neutral"}>
              {books.length > 0 ? "↑" : ""} {books.length} titles in your collection
            </div>
          </div>

          <div className="dashboard-card">
            <div className="metric-label">Currently Reading</div>
            <div className="metric-value">{readingCount}</div>
            <div className="metric-change-positive">
              {readingCount > 0 ? `${Math.round((readingCount / Math.max(1, books.length)) * 100)}%` : "0%"} of your collection
            </div>
          </div>

          <div className="dashboard-card">
            <div className="metric-label">Books Completed</div>
            <div className="metric-value">{doneCount}</div>
            <div className="metric-change-positive">
              {doneCount > 0 ? `${Math.round((doneCount / Math.max(1, books.length)) * 100)}%` : "0%"} completion rate
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as BookFilter)}
              className="px-4 py-2 bg-[#1a1a1c] border border-[#2a2a2c] rounded-lg text-gray-200"
            >
              <option value="all">All Books</option>
              <option value="reading">Currently Reading</option>
              <option value="done">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 bg-[#1a1a1c] border border-[#2a2a2c] rounded-lg text-gray-200"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="stars">Sort by Rating</option>
            </select>
          </div>

          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Book
          </Button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#1a1a1c] p-6 rounded-lg max-w-md w-full mx-4 border border-[#2a2a2c] shadow-xl">
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
      <h2 className="text-xl font-semibold mb-4">Your Books</h2>
      {filteredAndSortedBooks.length === 0 ? (
        <div className="dashboard-card text-center py-8">
          <p className="text-gray-400 mb-4">
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedBooks.map((book) => (
            <div key={book.id} className="dashboard-card hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-400">by {book.author}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    book.status === "reading"
                      ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                      : "bg-green-900/30 text-green-400 border border-green-700/50"
                  }`}
                >
                  {book.status === "reading" ? "Reading" : "Completed"}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Rating</div>
                <div className="flex items-center">
                  {renderStars(book.stars)}
                </div>
              </div>

              {/* Review */}
              {book.review && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">Review</div>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    "{book.review}"
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-3">
                Added {new Date(book.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#2a2a2c]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingBook(book)}
                  className="bg-transparent text-gray-300 border-[#2a2a2c] hover:bg-[#2a2a2c]"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBook(book.id)}
                  className="bg-transparent text-red-400 border-[#2a2a2c] hover:bg-red-900/30"
                  disabled={deleteBookMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}