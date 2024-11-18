"use client";
import { deleteData, getData, postData } from "@/api";
import { useUser } from "@/Providers/UserProvider";
import { ApplicationUser, BookDto, GetSingleBookResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const Book = ({ id }: { id: string }) => {
  const { user, setUser, loading: isUserLoading } = useUser();
  const { data, isLoading, isError } = useQuery({
    queryFn: async (): Promise<GetSingleBookResponse> =>
      await getData(`Book/${id}`),
    queryKey: ["oneBook", id],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isUserLoading) return <div>Loading User...</div>;
  if (isError) return <div>Error loading book data.</div>;
  if (!data?.book) return <div>Book not found.</div>;

  const book = data.book;
  const reviews = book.reviews || [];
  const hasWishlist =
    user && Array.isArray(user.wishlist) && user.wishlist.length > 0;
  return (
    <div className="flex flex-row gap-8 p-8">
      <div className="w-1/4">
        <BookShowcase
          user={user!}
          setUser={setUser}
          book={book}
          read={
            hasWishlist
              ? user.wishlist.some(
                  (wi) => wi?.bookId === id && wi?.read === true
                )
              : false
          }
          inWishlist={
            hasWishlist ? user.wishlist.some((w) => w?.bookId === id) : false
          }
          inFavorites={
            hasWishlist
              ? user.favorites?.some((f) => f?.bookId === id) || false
              : false
          }
        />
      </div>

      <div className="w-1/2 mx-auto flex flex-col items-center">
        {/* Displaying Reviews */}
        <h3 className="text-2xl font-semibold mb-4 text-center">Reviews</h3>
        {reviews.length > 0 ? (
          <div className="space-y-4 w-full flex flex-col items-center">
            {reviews.map((r, i) => (
              <ReviewCard review={r} bookId={id} key={i} />
            ))}
          </div>
        ) : (
          <div className="text-center">No reviews yet.</div>
        )}
      </div>

      <div className="w-1/4">
        <ReviewForm bookId={id} />
      </div>
    </div>
  );
};

export default Book;

const BookShowcase = ({
  book,
  read,
  inWishlist,
  inFavorites,
  user,
  setUser,
}: {
  book: BookDto;
  read: boolean;
  inWishlist: boolean;
  inFavorites: boolean;
  user: ApplicationUser;
  setUser: (user: ApplicationUser) => void; // Function to update user state
}) => {
  const normalizedUser = { ...user, wishlist: user.wishlist ?? [] };

  // Add to Wishlist
  const { mutate: addToWishlist } = useMutation({
    mutationFn: async (): Promise<{ message: string; wishlistItem: any }> =>
      await postData(`Wishlist`, {
        body: { bookId: book.id, userId: normalizedUser.id, read: false },
      }),
    onSuccess: (data) => {
      const updatedWishlist = [...normalizedUser.wishlist, data.wishlistItem];
      const updatedUser = { ...normalizedUser, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
    },
  });

  // Remove from Wishlist
  const { mutate: removeFromWishlist } = useMutation({
    mutationFn: async (): Promise<{ message: string }> => {
      const wishlistItem = normalizedUser.wishlist.find(
        (w) => w.bookId === book.id
      );
      if (!wishlistItem) throw new Error("Item not found in wishlist.");
      return await deleteData(`Wishlist/${wishlistItem.id}`);
    },
    onSuccess: (data) => {
      // Filter out the item and ensure no `null` or invalid entries remain
      const updatedWishlist = normalizedUser.wishlist
        .filter((w) => w && w.bookId !== book.id)
        .filter(Boolean); // Removes falsy values like `null` or `undefined`

      console.log(updatedWishlist);

      const updatedUser = {
        ...normalizedUser,
        wishlist: updatedWishlist, // Empty array if nothing is left
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success(data.message);
    },
  });

  return (
    <div className="relative bg-gradient-to-b from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">
      {/* Book Showcase Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Book Image */}
        <div className="relative w-full max-w-md">
          <Image
            width={500}
            height={900}
            src={book.bookImageUrl || ""}
            alt={book.title || ""}
            className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {read && (
            <div className="absolute top-2 right-2 bg-red-700 text-white text-lg px-2 py-1 rounded">
              Read
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-wide">{book.title}</h1>
          <h2 className="text-xl font-medium text-white/90">
            By <span className="italic">{book.author.name}</span>
          </h2>
        </div>

        <div className="flex space-x-4">
          {/* Add to Favorites */}
          <button
            className={`bg-white ${
              inFavorites ? "text-red-600" : "text-gray-400"
            } p-3 rounded-full shadow-md transform hover:scale-110 transition-transform`}
            aria-label="Add to Favorites"
            onClick={() => {}}
          >
            {/* Heart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.5 4.5 5.5 4.5c1.54 0 3.04.99 3.57 2.36h1.87C15.46 5.49 17 4.5 18.5 4.5 20.5 4.5 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Add/Remove from Wishlist */}
          {!inWishlist && (
            <button
              className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transform hover:scale-105 transition-transform"
              onClick={() => addToWishlist()}
            >
              Add to Wishlist
            </button>
          )}
          {inWishlist && (
            <button
              className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transform hover:scale-105 transition-transform"
              onClick={() => removeFromWishlist()}
            >
              Remove from Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
