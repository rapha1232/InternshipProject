import { AuthorDto } from "@/types";
import { Loader2 } from "lucide-react";
import AuthorCard from "../Authors/AuthorCard";

interface LESProps {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  authors: AuthorDto[] | undefined;
}

export default function LES({
  isLoading,
  isError,
  isSuccess,
  authors,
}: LESProps) {
  if (isLoading) return <Loader2 className="mr-2 h-8 w-8 animate-spin" />;
  if (isError) return <div>Sorry, there was an error.</div>;
  if (isSuccess && authors && authors.length === 0)
    return <div>No authors found.</div>;

  return (
    <>
      {isSuccess &&
        authors &&
        authors.length > 0 &&
        authors.map((author) => <AuthorCard author={author} key={author.id} />)}
    </>
  );
}
