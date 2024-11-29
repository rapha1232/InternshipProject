"use client";
import {
  useGetAllAuthors,
  useGetAllBooks,
  useGetAllReviews,
} from "@/lib/hooks";
import Panel from "./panel";

const AdminPanel = () => {
  const { data: booksData } = useGetAllBooks();
  const { data: authorsData } = useGetAllAuthors();
  const { data: reviewsData } = useGetAllReviews();

  // Define table columns

  return (
    <>
      <Panel
        booksData={booksData?.books || []}
        authorsData={authorsData?.authors || []}
        reviewsData={reviewsData?.reviews || []}
      />
    </>
  );
};

export default AdminPanel;
