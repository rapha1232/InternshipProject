import {
  deleteData,
  getData,
  loginUser,
  postData,
  putData,
  registerUser,
} from "@/api";
import { LoginResponseDto } from "@/Dtos/authDtos";
import {
  ApplicationUser,
  FavoriteWithoutUserDto,
  GetAllAuthorsResponse,
  GetAllBooksResponse,
  GetAllReviewsResponse,
  GetSingleAuthorResponse,
  GetSingleBookResponse,
  GetSingleUserResponse,
  WishlistItemWithoutUserDto,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type onSuccess =
  | ((
      data: any,
      variables: any,
      context: unknown
    ) => Promise<unknown> | unknown)
  | undefined;

type onError =
  | ((
      error: Error,
      variables: any,
      context: unknown
    ) => Promise<unknown> | unknown)
  | undefined;

type onMutate =
  | ((variables: any) => void | Promise<void | undefined> | undefined)
  | undefined;

export const useGetSingleBook = (bookId: string) =>
  useQuery({
    queryFn: async (): Promise<GetSingleBookResponse> =>
      await getData(`Book/${bookId}`),
    queryKey: ["oneBook", bookId],
  });
export const useGetSingleAuthor = (authorId: string) =>
  useQuery({
    queryFn: async (): Promise<GetSingleAuthorResponse> =>
      await getData(`Author/${authorId}`),
    queryKey: ["oneAuthor", authorId],
  });

export const useGetAllBooks = () =>
  useQuery({
    queryFn: async (): Promise<GetAllBooksResponse> => await getData("Book"),
    queryKey: ["allBook"],
  });
export const useGetAllPublishedBooks = () =>
  useQuery({
    queryFn: async (): Promise<GetAllBooksResponse> =>
      await getData("Book/published"),
    queryKey: ["allPublishedBooks"],
  });
export const useGetAllAuthors = () =>
  useQuery({
    queryFn: async (): Promise<GetAllAuthorsResponse> =>
      await getData("Author"),
    queryKey: ["allAuthor"],
  });
export const useGetAllReviews = () =>
  useQuery({
    queryFn: async (): Promise<GetAllReviewsResponse> =>
      await getData("Reviews"),
    queryKey: ["allReviews"],
  });

export const useAddToWishlist = (
  bookId: string,
  userId: string,
  read: boolean,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: addToWishlist } = useMutation({
    mutationFn: async (): Promise<{ message: string; wishlistItem: any }> =>
      await postData(
        `Wishlist`,
        {
          body: { bookId, userId, read },
        },
        "application/json"
      ),
    onSuccess,
    onError,
  });

  return { addToWishlist };
};

export const useRemoveFromWishlist = (
  user: ApplicationUser,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: async (options: {
      wishlistItemId?: string;
      bookId?: string;
    }): Promise<{
      message: string;
      wishlistItem?: WishlistItemWithoutUserDto;
    }> => {
      const { wishlistItemId, bookId } = options;
      if (bookId) {
        // Find the wishlist item by bookId
        const wishlistItem = user.wishlist.find((w) => w.bookId === bookId);
        if (!wishlistItem) {
          throw new Error("Item not found in wishlist.");
        }
        return await deleteData(`Wishlist/${wishlistItem.id}`);
      } else if (wishlistItemId) {
        // Use the provided wishlistItemId
        return await deleteData(`Wishlist/${wishlistItemId}`);
      } else {
        throw new Error("Either bookId or wishlistItemId must be provided.");
      }
    },
    onSuccess,
    onError,
  });

  return { removeFromWishlist };
};

export const useDeleteReview = (onSuccess: onSuccess, onError: onError) => {
  const { mutate: deleteReview } = useMutation({
    mutationFn: async (reviewId: string): Promise<{ message: string }> =>
      await deleteData(`Reviews/${reviewId}`),
    onSuccess,
    onError,
  });

  return { deleteReview };
};

export const usePostReview = (
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: postReview } = useMutation({
    mutationFn: async (values: {
      userId: string;
      bookId: string;
      content: string;
      rating: number;
    }): Promise<{ message: string }> =>
      await postData("Reviews", { body: values }, "application/json"),
    onSuccess,
    onError,
    onMutate,
  });

  return { postReview };
};

export const useEditReview = (
  reviewId: string,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: editReview } = useMutation({
    mutationFn: async (values: {
      content: string;
      rating: number;
    }): Promise<{ message: string }> =>
      await putData(
        `Reviews/${reviewId}`,
        { body: values },
        "application/json"
      ),
    onSuccess,
    onError,
  });

  return { editReview };
};

export const useDeleteAccount = (
  userId: string,
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: deleteUser } = useMutation({
    mutationFn: async () => await deleteData(`User/delete/${userId}`),
    onMutate,
    onSuccess,
    onError,
  });

  return { deleteUser };
};

export const useUpdateProfile = (
  userId: string,
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (values: { userName: string; email: string }) =>
      await putData(
        `User/update/${userId}`,
        { body: values },
        "application/json"
      ),
    onMutate,
    onSuccess,
    onError,
  });

  return { updateProfile };
};

export const useLogin = (
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: login } = useMutation({
    mutationFn: async (values: {
      userNameOrEmail: string;
      password: string;
    }): Promise<LoginResponseDto> => await loginUser(values),
    onMutate,
    onSuccess,
    onError,
  });
  return { login };
};

export const useRegister = (onMutate: onMutate, onSuccess: onSuccess) => {
  const { mutate: register } = useMutation({
    mutationFn: async (values: {
      userName: string;
      email: string;
      password: string;
    }): Promise<{ message: string }> => await registerUser(values),
    onMutate,
    onSuccess,
  });

  return { register };
};

export const useAddToFavorite = (
  bookId: string,
  userId: string,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: addToFavorite } = useMutation({
    mutationFn: async (): Promise<{ message: string; favItem: any }> =>
      await postData(
        "Favorites",
        { body: { userId, bookId } },
        "application/json"
      ),
    onSuccess,
    onError,
  });

  return { addToFavorite };
};

export const useRemoveFromFavorite = (
  user: ApplicationUser,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: removeFromFavorite } = useMutation({
    mutationFn: async (options: {
      favoriteItemId?: string;
      bookId?: string;
    }): Promise<{
      message: string;
      favoriteItem?: FavoriteWithoutUserDto;
    }> => {
      const { favoriteItemId, bookId } = options;

      if (bookId) {
        const favoriteItem = user.favorites.find((f) => f.bookId === bookId);
        if (!favoriteItem) {
          throw new Error("Item not found in favorites.");
        }
        return await deleteData(`Favorites/${favoriteItem.id}`);
      } else if (favoriteItemId) {
        return await deleteData(`Favorites/${favoriteItemId}`);
      } else {
        throw new Error("Either bookId or favoriteItemId must be provided.");
      }
    },
    onSuccess,
    onError,
  });

  return { removeFromFavorite };
};

export const useGetSingleUser = (userId: string) =>
  useQuery({
    queryFn: async (): Promise<GetSingleUserResponse> =>
      await getData(`User/${userId}`),
    queryKey: ["oneUser", userId],
  });
export const useGetUserName = (userId: string) =>
  useQuery({
    queryFn: async (): Promise<{ message: string; userName: string }> =>
      await getData(`User/get-username/${userId}`),
    queryKey: ["oneUserName", userId],
  });

export const useGetWishlist = (userId: string) =>
  useQuery({
    queryFn: async (): Promise<{ message: string; wishlist?: any[] }> =>
      await getData(`Wishlist/${userId}`).then(async (res) => {
        let wishlist: any[] = [];
        for (const item of res.wishlist) {
          const book: GetSingleBookResponse = await getData(
            `Book/${item.bookId}`
          );
          if (book.book)
            wishlist.push({ id: item.id, read: item.read, book: book.book });
        }
        return { message: res.message, wishlist };
      }),
    queryKey: ["wishlist", userId],
  });
export const useGetFavorites = (userId: string) =>
  useQuery({
    queryFn: async (): Promise<{ message: string; favorites?: any[] }> =>
      await getData(`Favorites/${userId}`).then(async (res) => {
        let favorites: any[] = [];
        for (const item of res.favorites) {
          const book: GetSingleBookResponse = await getData(
            `Book/${item.bookId}`
          );
          if (book.book) favorites.push({ id: item.id, book: book.book });
        }
        return { message: res.message, favorites };
      }),
    queryKey: ["favorites", userId],
  });

export const useSetReadStatus = (onSuccess: onSuccess, onError: onError) => {
  const { mutate: setReadStatus } = useMutation({
    mutationFn: async ({
      id,
      read,
    }: {
      id: string;
      read: boolean;
    }): Promise<{ message: string }> =>
      await putData(
        `Wishlist/setReadStatus/${id}`,
        {
          body: read,
        },
        "application/json"
      ),
    onSuccess,
    onError,
  });

  return { setReadStatus };
};

export const useChangePassword = (
  userId: string,
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: changePassword } = useMutation({
    mutationFn: async (values: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }): Promise<{ message: string }> =>
      await putData(
        `User/change-password/${userId}`,
        { body: values },
        "application/json"
      ),
    onMutate,
    onSuccess,
    onError,
  });

  return { changePassword };
};

export const useResetPasswordRequest = (
  onMutate: onMutate,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: resetPasswordRequest } = useMutation({
    mutationFn: async (email: string): Promise<{ message: string }> =>
      await postData(
        "User/generate-reset-token",
        { body: { email } },
        "application/json"
      ),
    onMutate,
    onSuccess,
    onError,
  });

  return { resetPasswordRequest };
};
