import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookMutationOptions, booksQueryOptions } from "../queries/books.queries";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

interface Book {
  id: number;
  title: string;
  author: string;
  status: "reading" | "done";
  stars?: number | null;
  review?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
}

export function EditBookModal({ book, onClose }: EditBookModalProps) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [status, setStatus] = useState<"reading" | "done">(book.status);
  const [stars, setStars] = useState<number | undefined>(book.stars !== null ? book.stars : undefined);
  const [review, setReview] = useState(book.review || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // @ts-expect-error Type mismatch in hono-react-query
  const updateBookMutation = useMutation({
    ...updateBookMutationOptions(),
    throwOnError: () => false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksQueryOptions().queryKey });
      onClose();
    },
    onError: (error: unknown) => {
      console.error("Error updating book:", error);
      setErrors({ general: "Failed to update book. Please try again." });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!author.trim()) {
      newErrors.author = "Author is required";
    }
    
    if (stars && (stars < 1 || stars > 5)) {
      newErrors.stars = "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      status,
      ...(stars !== undefined && { stars }),
      review: review.trim() || null,
    };

    updateBookMutation.mutate({ param: { id: book.id.toString() }, json: bookData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-3xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Book</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`text-black ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <span className="text-sm text-red-600">{errors.title}</span>
            )}
          </div>

          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`text-black ${errors.author ? "border-red-500" : ""}`}
            />
            {errors.author && (
              <span className="text-sm text-red-600">{errors.author}</span>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "reading" | "done")}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-black"
            >
              <option value="reading">Currently Reading</option>
              <option value="done">Completed</option>
            </select>
          </div>

          <div>
            <Label htmlFor="stars">Rating (1-5 stars)</Label>
            <select
              id="stars"
              value={stars || ""}
              onChange={(e) => setStars(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-black"
            >
              <option value="">No rating</option>
              <option value={1}>1 ⭐</option>
              <option value={2}>2 ⭐⭐</option>
              <option value={3}>3 ⭐⭐⭐</option>
              <option value={4}>4 ⭐⭐⭐⭐</option>
              <option value={5}>5 ⭐⭐⭐⭐⭐</option>
            </select>
            {errors.stars && (
              <span className="text-sm text-red-600">{errors.stars}</span>
            )}
          </div>

          <div>
            <Label htmlFor="review">Review (optional)</Label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you think about this book?"
              rows={3}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl resize-none text-black"
            />
            <div className="text-xs text-gray-500 text-right">
              {review.length}/1000 characters
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={updateBookMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateBookMutation.isPending ? "Updating..." : "Update Book"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateBookMutation.isPending}
              className="text-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}