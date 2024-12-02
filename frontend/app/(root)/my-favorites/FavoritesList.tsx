"use client";

import { useRemoveFromFavorite } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const FavoritesList = ({ favorites }: { favorites?: any[] }) => {
  const queryClient = useQueryClient();
  const { user, loading, setUser } = useUser();

  if (!favorites) return <div>No favorites</div>;
  if (!user || loading) return <div>Loading...</div>;

  const { removeFromFavorite } = useRemoveFromFavorite(
    user,
    (data) => {
      if (!data.favItem) return;

      const updatedFavorites = user.favorites.filter(
        (w) => w.bookId !== data.favItem.bookId
      );

      const updatedUser = { ...user, favorites: updatedFavorites };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["favorites", user.id] });
    },
    () => toast.error("Failed to remove from favorites")
  );

  return (
    <div className="space-y-4">
      {favorites.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        favorites.map((item) => (
          <FavoritesItem
            key={item.book.id}
            item={item}
            removeFromFavorites={removeFromFavorite}
          />
        ))
      )}
    </div>
  );
};

export default FavoritesList;

const FavoritesEmptyState = () => {
  return <div>No items in your favorites.</div>;
};

const FavoritesItem = ({
  item,
  removeFromFavorites,
}: {
  item: any;
  removeFromFavorites: (options: {
    favoriteItemId?: string;
    bookId?: string;
  }) => void;
}) => {
  return (
    <div
      className={`flex items-center p-4 bg-neutral-100 dark:bg-neutral-900 shadow-md rounded-lg border-2`}
    >
      <Image
        src={item.book.bookImageUrl}
        alt={item.book.title}
        width={100}
        height={150}
        className="rounded-lg object-cover w-[100px] h-[150px]"
        loader={({ src }) => src}
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">
          <Link href={`/books/${item.book.id}`} className="hover:underline">
            {item.book.title}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground">
          {item.book.author ? (
            <>
              <span>by </span>
              <Link
                href={`/authors/${item.book.author.id}`}
                className="text-violet-600 hover:underline"
              >
                {item.book.author.name}
              </Link>
            </>
          ) : (
            "Author not found"
          )}
        </p>
        <Link
          href={`/books/${item.book.id}`}
          className="text-sm text-violet-600 hover:underline mt-1 inline-block"
        >
          View Details
        </Link>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={() => removeFromFavorites({ favoriteItemId: item.id })}
          className="text-red-600 text-sm font-medium hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
