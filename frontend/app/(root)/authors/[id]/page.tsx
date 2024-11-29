import Author from "./Author";

const SingleAuthorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;
  return <Author id={id} />;
};

export default SingleAuthorPage;
