import { filterOptions } from "@/constants";
import { Options } from "nuqs";
import SearchBar from "../SearchBar";
import { Button } from "../ui/button";
import { DataTableFilterBox } from "./Filter";
import Sorting from "./Sorting";

interface SearchParamsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  ratingFilter?: string;
  setRatingFilter?: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  sortOption: string;
  setSortOption: (value: string) => void;
  page: string;
}

export default function SearchParams({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
  sortOption,
  setSortOption,
  page,
}: SearchParamsProps) {
  const handleClear = () => {
    setSearchQuery("");
    if (setRatingFilter) {
      setRatingFilter("");
    }
    setSortOption("title-asc"); // Reset to default sort

    // Clear URL search parameters
    const params = new URLSearchParams();
    params.set("sort", "title-asc"); // Default sort value
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Search Bar: Full Width on Small Screens */}
      <div className="w-full lg:w-auto">
        <SearchBar
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search by title or author..."
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
        {page === "books" && (
          <DataTableFilterBox
            title="Rating"
            options={filterOptions.rating}
            filterValue={ratingFilter || ""}
            setFilterValue={(value) =>
              setRatingFilter
                ? setRatingFilter(value)
                : Promise.resolve(new URLSearchParams())
            }
          />
        )}
        <Sorting
          sortOption={sortOption}
          setSortOption={setSortOption}
          page={page}
        />
        <Button
          variant="outline"
          onClick={handleClear}
          className="bg-violet-600 hover:bg-violet-800 border-none outline-none"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
