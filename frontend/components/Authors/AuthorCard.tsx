import { AuthorDto } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export default function AuthorCard({ author }: { author: AuthorDto }) {
  return (
    <Card className="h-full max-w-[400px] group overflow-hidden">
      <Link href={`/authors/${author.id}`} prefetch={false}>
        <Image
          src={author.authorImageUrl}
          width={300}
          height={300}
          alt={`${author.name}`}
          className="rounded-t-lg object-cover w-full aspect-square transform transition-transform duration-300 ease-in-out group-hover:scale-110"
          loader={({ src }) => src}
        />
      </Link>
      <CardContent className="p-4">
        <div className="mb-2 text-center">
          <Link
            href={`/authors/${author.id}`}
            className="text-lg font-bold hover:underline"
            prefetch={false}
          >
            {author.name}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {author.biography.length > 100
            ? `${author.biography.slice(0, 100)}...`
            : author.biography}
        </p>
        <Separator className="my-2" />
        <div className="flex justify-center gap-4">
          <Link
            href={`/authors/${author.id}`}
            className="text-violet-600 text-sm font-medium hover:underline"
          >
            View Details
          </Link>
          <Link
            href={`/books?search=${author.name}&sort=title-asc`}
            className="text-violet-600 text-sm font-medium hover:underline"
          >
            See Books
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
