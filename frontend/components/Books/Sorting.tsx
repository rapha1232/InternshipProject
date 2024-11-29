import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SortingProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  page: string;
}

export default function Sorting({
  sortOption,
  setSortOption,
  page,
}: SortingProps) {
  return (
    <div className="flex items-center gap-2 max-w-[200px]">
      <Select value={sortOption} onValueChange={(val) => setSortOption(val)}>
        <SelectTrigger className="focus:ring-transparent">
          <SelectValue placeholder="Sort by:" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value={page === "books" ? "title-asc" : "name-asc"}>
              {page === "books" ? "Title" : "Name"} (A-Z)
            </SelectItem>
            <SelectItem value={page === "books" ? "title-desc" : "name-desc"}>
              {page === "books" ? "Title" : "Name"} (Z-A)
            </SelectItem>
            {page === "books" && (
              <>
                <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                <SelectItem value="rating-desc">
                  Rating (High to Low)
                </SelectItem>
                <SelectItem value="reviews-asc">
                  Reviews (Low to High)
                </SelectItem>
                <SelectItem value="reviews-desc">
                  Reviews (High to Low)
                </SelectItem>
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
