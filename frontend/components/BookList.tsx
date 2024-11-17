"use client";
import { getData } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetAllBooksResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function BookList() {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryFn: async (): Promise<GetAllBooksResponse> => await getData("Book"),
    queryKey: ["allBooks"],
  });

  return (
    <div className="flex flex-col mx-10">
      {/* Container to align the SearchBar and the grid */}
      <div className="flex flex-col gap-6 mx-8">
        {/* SearchBar alignment */}
        <div className="w-full">
          <SearchBar />
        </div>
        {/* Grid of books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading && <Loader2 className="mr-2 h-8 w-8 animate-spin" />}
          {isError && <div>Sorry, there was an error.</div>}
          {isSuccess &&
            data.books &&
            data.books.map((book, i) => (
              <Card key={i} className="h-full max-w-[400px]">
                <Link href="#" prefetch={false}>
                  <Image
                    src={book.bookImageUrl}
                    width={300}
                    height={400}
                    alt={`${book.title}`}
                    className="rounded-t-lg object-cover w-full aspect-[3/4]"
                  />
                </Link>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Link
                      href="#"
                      className="text-lg font-bold hover:underline"
                      prefetch={false}
                    >
                      {book.title}
                    </Link>
                    <p className="text-muted-foreground">{book.author.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <StarIcon className="h-4 w-4 fill-primary" />
                    <span>{book.averageRating}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{book.reviews?.length} reviews</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
