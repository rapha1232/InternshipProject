"use client";

import { useGetSingleAuthor } from "@/lib/hooks";
import { AuthorDto } from "@/types";
import Image from "next/image";
import Link from "next/link";

const Author = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useGetSingleAuthor(id);

  if (isLoading) return <div>Loading author information...</div>;
  if (isError || !data?.author) return <div>Author not found.</div>;

  const author: AuthorDto = data.author;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-showcase text-white rounded-lg shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Author Image */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-md">
          <Image
            src={author.authorImageUrl || "/placeholder-author.jpg"}
            alt={author.name}
            layout="fill"
            objectFit="cover"
            loader={({ src }) => src}
          />
        </div>

        {/* Author Details */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h1 className="text-4xl font-bold">{author.name}</h1>
          <p className="text-lg text-white/90">{author.biography}</p>
        </div>
      </div>

      {/* Books Section */}
      {data.books && data.books?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Books by {author.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.books?.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id} prefetch={false}>
                <div className="relative bg-neutral-100 dark:bg-neutral-900 text-foreground rounded-lg shadow-md p-4 hover:scale-105 transform transition">
                  <Image
                    src={book.bookImageUrl}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="rounded object-cover w-full h-48"
                    loader={({ src }) => src}
                  />
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {book.averageRating?.toFixed(1)} ★ | {book.reviewLen}{" "}
                      reviews
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Books Section */}
      {(!data.books || data.books.length === 0) && (
        <div className="mt-8 text-center text-white/80">
          <p>No books found for this author.</p>
        </div>
      )}
    </div>
  );
};

export default Author;
