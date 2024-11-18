import { BookDto } from "@/types";

export const filterBooks = (
  books: BookDto[],
  searchQuery: string,
  ratingFilter: string
): BookDto[] => {
  return books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = !ratingFilter
      ? true
      : book.averageRating &&
        book.averageRating >= parseFloat(ratingFilter) &&
        book.averageRating < parseFloat(ratingFilter) + 1;

    return matchesSearch && matchesRating;
  });
};
