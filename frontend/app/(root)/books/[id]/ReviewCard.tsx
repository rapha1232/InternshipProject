"use client";
import { useDeleteReview, useGetUserName } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { Review } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Trash, User } from "lucide-react";
import { toast } from "sonner";
import { UpdateDialog } from "./UpdateDialog";

export default function ReviewCard({
  review,
  bookId,
}: {
  review: Review;
  bookId: string;
}) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const onSuccess = (data: any) => {
    toast.success(data.message);
    queryClient.invalidateQueries({ queryKey: ["oneBook", bookId] });
  };

  const onError = (error: any) => {
    toast.error(error.message);
  };

  const { deleteReview } = useDeleteReview(onSuccess, onError);
  return (
    <div className="p-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg shadow-md w-5/6 max-w-2xl">
      <div className="flex justify-between mb-2">
        <div className="flex gap-3 items-center">
          <User />
          <Username userId={review.userId} />
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <div className="text-sm text-gray-500">
            {review.reviewDate.split("T")[0]} at{" "}
            {review.reviewDate.split("T")[1].split(".")[0]}
          </div>
        </div>
        <div>
          <RenderStars rating={review.rating} />
        </div>
      </div>
      <p
        className="text-foreground mb-2 break-words overflow-wrap break-word"
        style={{ maxWidth: "100%" }}
      >
        {review.content}
      </p>
      {review.userId === user?.id && (
        <div className="flex justify-end space-x-4">
          <UpdateDialog bookId={bookId} reviewId={review.id} />
          <button
            className="flex items-center px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => deleteReview(review.id)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

const Username = ({ userId }: { userId: string }) => {
  const { data } = useGetUserName(userId);
  return (
    <div className="text-xs font-semibold">
      {data?.userName ? (
        data.userName
      ) : (
        <span>
          user not found <span className="text-red-600">X</span>
        </span>
      )}
    </div>
  );
};

const RenderStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-gray-300 ${index < rating ? "text-yellow-500" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};
