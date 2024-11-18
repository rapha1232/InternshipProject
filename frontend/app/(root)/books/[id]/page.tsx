import Book from "./Book";

const SingleBookPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return <Book id={id} />;
};

export default SingleBookPage;
