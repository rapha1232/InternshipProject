"use client";
import {
  useAddToFavorite,
  useAddToWishlist,
  useGetSingleBook,
  useRemoveFromFavorite,
  useRemoveFromWishlist,
} from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { ApplicationUser, BookDto } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "sonner";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

const SingleBookPage = ({ id }: { id: string }) => {
  const { user, setUser, loading: isUserLoading } = useUser();
  const { data, isLoading, isError } = useGetSingleBook(id);

  if (isLoading) return <div>Loading...</div>;
  if (isUserLoading) return <div>Loading User...</div>;
  if (isError) return <div>Error loading book data.</div>;
  if (!data?.book) return <div>Book not found.</div>;

  const book = data.book;
  const reviews = book.reviews || [];
  const hasWishlist =
    user && Array.isArray(user.wishlist) && user.wishlist.length > 0;
  const hasFavorites =
    user && Array.isArray(user.favorites) && user.favorites.length > 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      {/* Left Section - Book Showcase */}
      <div className="w-full lg:w-1/4">
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
            hasFavorites
              ? user.favorites?.some((f) => f?.bookId === id) || false
              : false
          }
        />
      </div>

      {/* Middle Section - Reviews */}
      <div className="w-full lg:w-1/2 mx-auto flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Reviews
        </h3>
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

      {/* Right Section - Review Form */}
      <div className="w-full lg:w-1/4">
        <ReviewForm bookId={id} />
      </div>
    </div>
  );
};

export default SingleBookPage;

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
  setUser: (user: ApplicationUser) => void;
}) => {
  const normalizedUser = {
    ...user,
    wishlist: user.wishlist ?? [],
    favorites: user.favorites ?? [],
  };

  const { addToWishlist } = useAddToWishlist(
    book.id,
    normalizedUser.id,
    false,
    (data) => {
      const updatedWishlist = [...normalizedUser.wishlist, data.wishlistItem];
      const updatedUser = { ...normalizedUser, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
    },
    () => toast.error("Failed to add to wishlist")
  );

  const { removeFromWishlist } = useRemoveFromWishlist(
    user,
    (data) => {
      const updatedWishlist = normalizedUser.wishlist.filter(
        (w) => w?.bookId !== book.id
      );
      const updatedUser = { ...normalizedUser, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
    },
    () => toast.error("Failed to remove from wishlist")
  );

  const { addToFavorite } = useAddToFavorite(
    book.id,
    user.id,
    (data) => {
      const updatedFavorites = [...normalizedUser.favorites, data.favItem];
      const updatedUser = { ...normalizedUser, favorites: updatedFavorites };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
    },
    () => toast.error("Failed to add to favorites")
  );

  const { removeFromFavorite } = useRemoveFromFavorite(
    user,
    (data) => {
      const updatedFavorites = normalizedUser.favorites.filter(
        (f) => f?.bookId !== book.id
      );
      const updatedUser = { ...normalizedUser, favorites: updatedFavorites };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
    },
    (error) => toast.error("Failed to remove from favorites" + error.message)
  );

  return (
    <div className="relative bg-showcase text-white p-4 md:p-8 rounded-2xl shadow-2xl mx-auto border-2">
      <div className="relative z-10 flex flex-col items-center space-y-4 md:space-y-6">
        <div className="relative w-full max-w-md">
          <Image
            width={500}
            height={900}
            src={book.bookImageUrl || ""}
            alt={book.title || ""}
            className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            loader={({ src }) => src}
          />
          {read && (
            <div className="absolute top-2 right-2 bg-green-700 text-white text-sm md:text-lg px-2 py-1 rounded">
              Read
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
            {book.title}
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-white/90">
            By <span className="italic">{book.author?.name || "N/A"}</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <FavoriteButton
            inFavorites={inFavorites}
            addToFavorite={addToFavorite}
            removeFromFavorite={() => removeFromFavorite({ bookId: book.id })}
          />
          <WishlistButton
            inWishlist={inWishlist}
            addToWishlist={addToWishlist}
            removeFromWishlist={() => removeFromWishlist({ bookId: book.id })}
          />
        </div>
      </div>
    </div>
  );
};

const WishlistButton = ({
  inWishlist,
  addToWishlist,
  removeFromWishlist,
}: {
  inWishlist: boolean;
  addToWishlist: UseMutateFunction<
    {
      message: string;
      wishlistItem: any;
    },
    Error,
    any,
    unknown
  >;
  removeFromWishlist: UseMutateFunction<
    {
      message: string;
    },
    Error,
    any,
    unknown
  >;
}) => {
  return (
    <>
      {!inWishlist ? (
        <button
          className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transform hover:scale-105 transition-transform"
          onClick={addToWishlist}
        >
          Add to Wishlist
        </button>
      ) : (
        <button
          className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transform hover:scale-105 transition-transform"
          onClick={removeFromWishlist}
        >
          Remove from Wishlist
        </button>
      )}
    </>
  );
};

const FavoriteButton = ({
  inFavorites,
  addToFavorite,
  removeFromFavorite,
}: {
  inFavorites: boolean;
  addToFavorite: UseMutateFunction<
    {
      message: string;
      favItem: any;
    },
    Error,
    any,
    unknown
  >;
  removeFromFavorite: UseMutateFunction<
    {
      message: string;
    },
    Error,
    any,
    unknown
  >;
}) => {
  return (
    <>
      {!inFavorites ? (
        <button
          className="bg-white text-gray-400 p-3 rounded-full shadow-md transform hover:scale-110 transition-transform"
          aria-label="Add to Favorites"
          onClick={addToFavorite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#9ca3af"
            viewBox="0 0 24 24"
            className="h-6 w-6"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.5 4.5 5.5 4.5c1.54 0 3.04.99 3.57 2.36h1.87C15.46 5.49 17 4.5 18.5 4.5 20.5 4.5 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      ) : (
        <button
          className="bg-white text-red-600 p-3 rounded-full shadow-md transform hover:scale-110 transition-transform border-4 border-red-600"
          aria-label="Remove from Favorites"
          onClick={removeFromFavorite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#dc2626"
            viewBox="0 0 24 24"
            className="h-6 w-6"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.5 4.5 5.5 4.5c1.54 0 3.04.99 3.57 2.36h1.87C15.46 5.49 17 4.5 18.5 4.5 20.5 4.5 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      )}
    </>
  );
};
