import { AuthorDto, BookDto } from "@/types";

export const sortBooks = (books: BookDto[], sortOption: string): BookDto[] => {
  return books.slice().sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "rating-asc":
        return (a.averageRating || 0) - (b.averageRating || 0);
      case "rating-desc":
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });
};

export const sortAuthors = (
  authors: AuthorDto[],
  sortOption: string
): AuthorDto[] => {
  return authors.slice().sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
};
