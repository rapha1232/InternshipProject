export type ApplicationUser = {
  id: string;
  userName: string;
  email: string;
  wishlist: WishlistItemWithoutUserDto[];
  favorites: FavoriteWithoutUserDto[];
};

export type WishlistItemWithoutUserDto = {
  id: string;
  userId: string;
  bookId: string;
  read: boolean;
};

export type FavoriteWithoutUserDto = {
  id: string;
  userId: string;
  bookId: string;
};

export type GetAllBooksResponse = {
  message: string;
  books?: BookDto[];
  details?: string;
};
export type GetAllAuthorsResponse = {
  message: string;
  authors?: AuthorDto[];
  details?: string;
};
export type GetAllReviewsResponse = {
  message: string;
  reviews?: Review[];
  details?: string;
};
export type GetSingleBookResponse = {
  message: string;
  book?: BookDto;
  details?: string;
};
export type GetSingleAuthorResponse = {
  message: string;
  author?: AuthorDto;
  details?: string;
  books?: BookWithoutAuthorDto[];
};
export type GetSingleUserResponse = {
  message: string;
  user?: ApplicationUser;
};

export interface BookWithoutAuthorDto {
  id: string;
  title: string;
  description: string;
  summary: string;
  bookImageUrl: string;
  toBeShown: boolean;
  averageRating?: number;
  reviewLen?: number;
}

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
