"use client";
import { Button } from "@/components/ui/button";
import { useGetWishlist } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { useRouter } from "next/navigation";
import WishlistList from "./WishlistList";

function MyWishlistPage() {
  const { user, loading } = useUser();
  const { data, isError, isFetching } = useGetWishlist(user?.id || "");
  const router = useRouter();

  if (loading || isFetching) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  if (isError) return <div>Error</div>;
  if (!data?.wishlist) return <div>No wishlist</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {data?.wishlist?.length === 0 ? (
        <div>
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button onClick={() => router.push("/books")} className="mt-4">
            Browse Books
          </Button>
        </div>
      ) : (
        <WishlistList wishlist={data.wishlist} />
      )}
    </div>
  );
}

export default MyWishlistPage;
