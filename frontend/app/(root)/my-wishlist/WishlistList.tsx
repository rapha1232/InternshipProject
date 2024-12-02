"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRemoveFromWishlist, useSetReadStatus } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const WishlistList = ({ wishlist }: { wishlist?: any[] }) => {
  const queryClient = useQueryClient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { user, loading, setUser } = useUser();

  if (!wishlist) return <div>No wishlist</div>;
  if (!user || loading) return <div>Loading...</div>;

  const { setReadStatus } = useSetReadStatus(
    (data) => {
      if (data.message === "Read status updated") {
        setUser((prevUser) => {
          if (!prevUser || !prevUser.wishlist) return prevUser;

          const updatedWishlist = prevUser.wishlist.map((item) => {
            if (item.id === data.wishlistItem.id) {
              return { ...item, read: data.wishlistItem.read };
            }
            return item;
          });

          return { ...prevUser, wishlist: updatedWishlist };
        });
        toast.success("Read status updated");
        queryClient.invalidateQueries({ queryKey: ["wishlist", user.id] });
      } else {
        toast.error("Error updating read status");
      }
    },
    (error) => toast.error(error.message)
  );

  const { removeFromWishlist } = useRemoveFromWishlist(
    user,
    (data) => {
      if (!data.wishlistItem) return;

      const updatedWishlist = user.wishlist.filter(
        (w) => w.bookId !== data.wishlistItem.bookId
      );

      const updatedUser = { ...user, wishlist: updatedWishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["wishlist", user.id] });
    },
    () => toast.error("Failed to remove from wishlist")
  );

  const filteredWishlist = showUnreadOnly
    ? wishlist.filter((item) => !item.read)
    : wishlist;

  return (
    <div className="space-y-4">
      <WishlistFilter
        showUnreadOnly={showUnreadOnly}
        onToggle={() => setShowUnreadOnly(!showUnreadOnly)}
      />
      {filteredWishlist.length === 0 ? (
        <WishlistEmptyState showUnreadOnly={showUnreadOnly} />
      ) : (
        filteredWishlist.map((item) => (
          <WishlistItem
            key={item.book.id}
            item={item}
            setReadStatus={setReadStatus}
            removeFromWishlist={removeFromWishlist}
          />
        ))
      )}
    </div>
  );
};

export default WishlistList;

const WishlistFilter = ({
  showUnreadOnly,
  onToggle,
}: {
  showUnreadOnly: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="read-only"
          checked={showUnreadOnly}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-violet-600"
        />
        <Label htmlFor="read-only">Show Unread Only</Label>
      </div>
    </div>
  );
};

const WishlistEmptyState = ({
  showUnreadOnly,
}: {
  showUnreadOnly: boolean;
}) => {
  return <div>No {showUnreadOnly ? "unread" : ""} items in your wishlist.</div>;
};

const WishlistItem = ({
  item,
  setReadStatus,
  removeFromWishlist,
}: {
  item: any;
  setReadStatus: (options: { id: string; read: boolean }) => void;
  removeFromWishlist: (options: { wishlistItemId: string }) => void;
}) => {
  return (
    <div
      className={`flex items-center p-4 bg-neutral-100 dark:bg-neutral-900 shadow-md rounded-lg border-2 ${
        item.read ? "border-green-600" : "border-red-600"
      }`}
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
          onClick={() => setReadStatus({ id: item.id, read: !item.read })}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            item.read ? "bg-green-600 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {item.read ? "Read" : "Mark as Read"}
        </button>
        <button
          onClick={() => removeFromWishlist({ wishlistItemId: item.id })}
          className="text-red-600 text-sm font-medium hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
