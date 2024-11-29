"use client";
import { Button } from "@/components/ui/button";
import { useGetFavorites } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { useRouter } from "next/navigation";
import FavoritesList from "./FavoritesList";

function MyFavoritesPage() {
  const { user, loading } = useUser();
  const { data, isError, isFetching } = useGetFavorites(user?.id || "");
  const router = useRouter();

  if (loading || isFetching) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  if (isError) return <div>Error</div>;
  if (!data?.favorites) return <div>No favorites</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {data?.favorites?.length === 0 ? (
        <div>
          <p className="text-muted-foreground">You have no favorites yet.</p>
          <Button onClick={() => router.push("/books")} className="mt-4">
            Browse Books
          </Button>
        </div>
      ) : (
        <FavoritesList favorites={data.favorites} />
      )}
    </div>
  );
}

export default MyFavoritesPage;
