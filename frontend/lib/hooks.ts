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
  GetAllBooksResponse,
  GetSingleBookResponse,
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

export const useGetAllBooks = () =>
  useQuery({
    queryFn: async (): Promise<GetAllBooksResponse> => await getData("Book"),
    queryKey: ["allBooks"],
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
      await postData(`Wishlist`, {
        body: { bookId, userId, read },
      }),
    onSuccess,
    onError,
  });

  return { addToWishlist };
};

export const useRemoveFromWishlist = (
  bookId: string,
  user: ApplicationUser,
  onSuccess: onSuccess,
  onError: onError
) => {
  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      const wishlistItem = user.wishlist.find((w) => w.bookId === bookId);
      if (!wishlistItem) throw new Error("Item not found in wishlist.");
      return await deleteData(`Wishlist/${wishlistItem.id}`);
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
      await postData("Reviews", { body: values }),
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
      await putData(`Reviews/${reviewId}`, { body: values }),
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
      await putData(`User/update/${userId}`, { body: values }),
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
