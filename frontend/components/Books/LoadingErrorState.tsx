import { BookDto } from "@/types";
import { Loader2 } from "lucide-react";
import BookCard from "./BookCard";

interface LoadingErrorStateProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  books: BookDto[] | undefined;
}

export default function LoadingErrorState({
  isLoading,
  isError,
  isSuccess,
  books,
}: LoadingErrorStateProps) {
  if (isLoading) return <Loader2 className="mr-2 h-8 w-8 animate-spin" />;
  if (isError) return <div>Sorry, there was an error.</div>;
  if (isSuccess && books && books.length === 0)
    return <div>No books found.</div>;

  return (
    <>
      {isSuccess &&
        books &&
        books.length > 0 &&
        books.map((book) => <BookCard book={book} key={book.id} />)}
    </>
  );
}
