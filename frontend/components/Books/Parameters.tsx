import { Options } from "nuqs";
import SearchBar from "../SearchBar";
import { Button } from "../ui/button";
import { DataTableFilterBox } from "./Filter";
import Sorting from "./Sorting";

interface SearchParamsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  ratingFilter: string;
  setRatingFilter: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  sortOption: string;
  setSortOption: (value: string) => void;
}

export default function SearchParams({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
  sortOption,
  setSortOption,
}: SearchParamsProps) {
  const handleClear = () => {
    setSearchQuery("");
    setRatingFilter("");
    setSortOption("title-asc"); // Reset to default sort

    // Clear URL search parameters
    const params = new URLSearchParams();
    params.set("sort", "title-asc"); // Default sort value
    window.history.replaceState(null, "", `?${params.toString()}`);
  };
  return (
    <div className="flex items-center gap-4">
      <SearchBar
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        placeholder="Search by title or author..."
      />
      <DataTableFilterBox
        title="Rating"
        options={[
          { label: "1 Star", value: "1" },
          { label: "2 Stars", value: "2" },
          { label: "3 Stars", value: "3" },
          { label: "4 Stars", value: "4" },
          { label: "5 Stars", value: "5" },
        ]}
        filterValue={ratingFilter}
        setFilterValue={(value) => setRatingFilter(value)}
      />
      <Sorting sortOption={sortOption} setSortOption={setSortOption} />
      <Button
        variant="outline"
        onClick={handleClear}
        className="bg-violet-600 hover:bg-violet-800 border-none outline-none"
      >
        Clear
      </Button>
    </div>
  );
}
