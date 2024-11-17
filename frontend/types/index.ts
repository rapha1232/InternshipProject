export type ApplicationUser = {
  id: string;
  userName: string;
  email: string;
  wishlist: WishlistItemWithoutUserDto[];
  favorites: FavoriteWithoutUserDto[];
};

type WishlistItemWithoutUserDto = {
  id: string;
  userId: string;
  bookId: string;
  read: boolean;
};

type FavoriteWithoutUserDto = {
  id: string;
  userId: string;
  bookId: string;
};

export type GetAllBooksResponse = {
  message: string;
  books?: BookDto[];
  details?: string;
};

// Define the BookDto type based on what is expected in each book-related response
export interface BookDto {
  id: string;
  title: string;
  description: string;
  summary: string;
  bookImageUrl: string;
  authorId: string;
  toBeShown: boolean;
  averageRating?: number;
  reviews?: Review[];
  author: AuthorDto;
}

export interface AuthorDto {
  id: string;
  name: string;
  biography: string;
  authorImageUrl: string;
}

export type Review = {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  content: string;
  reviewDate: string;
};
