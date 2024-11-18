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
}

export default function Sorting({ sortOption, setSortOption }: SortingProps) {
  return (
    <div className="flex items-center gap-2 max-w-[200px]">
      <Select value={sortOption} onValueChange={(val) => setSortOption(val)}>
        <SelectTrigger className="focus:ring-transparent">
          <SelectValue placeholder="Sort by:" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
            <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
            <SelectItem value="reviews-asc">Reviews (Low to High)</SelectItem>
            <SelectItem value="reviews-desc">Reviews (High to Low)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
