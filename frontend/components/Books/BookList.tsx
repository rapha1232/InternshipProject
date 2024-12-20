"use client";

import { filterBooks } from "@/lib/filtering";
import { useGetAllPublishedBooks } from "@/lib/hooks";
import { sortBooks } from "@/lib/sorting";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddBookDialog from "../CreateBookDialog";
import LoadingErrorState from "./LoadingErrorState";
import SearchParams from "./Parameters";

export default function BookList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams?.get("search") || ""
  );
  const [ratingFilter, setRatingFilter] = useState<string>(
    searchParams?.get("rating") || ""
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams?.get("sort") || "title-asc"
  );

  const { data, isLoading, isError, isSuccess } = useGetAllPublishedBooks();

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (ratingFilter) params.set("rating", ratingFilter);
    if (sortOption) params.set("sort", sortOption);
    router.replace(`?${params.toString()}`);
  }, [searchQuery, ratingFilter, sortOption, router]);

  const updateFilter = async (
    value: string | ((old: string) => string | null) | null
  ): Promise<URLSearchParams> => {
    const newValue = typeof value === "function" ? value(ratingFilter) : value;
    setRatingFilter(newValue || "");
    const params = new URLSearchParams();
    if (newValue) {
      params.set("rating", newValue);
    }
    return params;
  };

  const filteredBooks = filterBooks(
    data?.books || [],
    searchQuery,
    ratingFilter
  );
  const sortedBooks = sortBooks(filteredBooks, sortOption);

  return (
    <div className="flex flex-col mx-10">
      <div className="flex flex-col gap-6 mx-8">
        <div className="flex gap-6 items-center">
          <SearchParams
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            ratingFilter={ratingFilter}
            setRatingFilter={updateFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
            page="books"
          />
          <AddBookDialog />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <LoadingErrorState
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            books={sortedBooks}
          />
        </div>
      </div>
    </div>
  );
}
