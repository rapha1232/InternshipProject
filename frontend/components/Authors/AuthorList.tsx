"use client";

import { filterAuthors } from "@/lib/filtering";
import { useGetAllAuthors } from "@/lib/hooks";
import { sortAuthors } from "@/lib/sorting";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LES from "../Books/LES";
import SearchParams from "../Books/Parameters";

export default function AuthorsList() {
  const { data, isLoading, isError, isSuccess } = useGetAllAuthors();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams?.get("search") || ""
  );
  const [sortOption, setSortOption] = useState<string>(
    searchParams?.get("sort") || "name-asc"
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (sortOption) params.set("sort", sortOption);
    router.replace(`?${params.toString()}`);
  }, [searchQuery, sortOption, router]);

  const filteredAuthors = filterAuthors(data?.authors || [], searchQuery);
  const sortedAuthors = sortAuthors(filteredAuthors, sortOption);
  return (
    <div className="flex flex-col mx-10">
      <div className="flex flex-col gap-6 mx-8">
        <SearchParams
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          page="authors"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <LES
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            authors={sortedAuthors}
          />
        </div>
      </div>
    </div>
  );
}
