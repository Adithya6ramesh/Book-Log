import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookMutationOptions, booksQueryOptions } from "../queries/books.queries";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

interface CreateBookFormProps {
  onClose: () => void;
}

export function CreateBookForm({ onClose }: CreateBookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"reading" | "done">("reading");
  const [stars, setStars] = useState<number | undefined>();
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // @ts-expect-error Type mismatch in hono-react-query
  const createBookMutation = useMutation({
    ...createBookMutationOptions(),
    throwOnError: () => false,
    onSuccess: () => {
      // Force a full refresh of the books query
      queryClient.invalidateQueries({ queryKey: booksQueryOptions().queryKey });
      onClose();
    },
    onError: (error: unknown) => {
      console.error("Error creating book:", error);
      setErrors({ general: "Failed to create book. Please try again." });
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
      ...(review.trim() && { review: review.trim() }),
    };

    createBookMutation.mutate({ json: bookData });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Book</h2>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800/50 text-red-400 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-300">Title *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`bg-[#232328] border-[#2a2a2c] text-gray-200 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <span className="text-sm text-red-400">{errors.title}</span>
          )}
        </div>

        <div>
          <Label htmlFor="author" className="text-gray-300">Author *</Label>
          <Input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={`bg-[#232328] border-[#2a2a2c] text-gray-200 ${errors.author ? "border-red-500" : ""}`}
          />
          {errors.author && (
            <span className="text-sm text-red-400">{errors.author}</span>
          )}
        </div>

        <div>
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "reading" | "done")}
            className="w-full px-3 py-2 bg-[#232328] border-[#2a2a2c] border rounded-md text-gray-200"
          >
            <option value="reading">Currently Reading</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div>
          <Label htmlFor="stars" className="text-gray-300">Rating (1-5 stars)</Label>
          <select
            id="stars"
            value={stars || ""}
            onChange={(e) => setStars(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-[#232328] border-[#2a2a2c] border rounded-md text-gray-200"
          >
            <option value="">No rating</option>
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐⭐</option>
            <option value={3}>3 ⭐⭐⭐</option>
            <option value={4}>4 ⭐⭐⭐⭐</option>
            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
          </select>
          {errors.stars && (
            <span className="text-sm text-red-400">{errors.stars}</span>
          )}
        </div>

        <div>
          <Label htmlFor="review" className="text-gray-300">Review (optional)</Label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think about this book?"
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 bg-[#232328] border-[#2a2a2c] border rounded-md resize-none text-gray-200"
          />
          <div className="text-xs text-gray-500 text-right">
            {review.length}/1000 characters
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={createBookMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createBookMutation.isPending ? "Creating..." : "Create Book"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={createBookMutation.isPending}
            className="bg-transparent border-[#2a2a2c] hover:bg-[#232328] text-gray-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}