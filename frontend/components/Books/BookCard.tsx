import { BookDto } from "@/types";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export default function BookCard({ book }: { book: BookDto }) {
  return (
    <Card className="h-full max-w-[400px]">
      <Link href={`/books/${book.id}`} prefetch={false}>
        <Image
          src={book.bookImageUrl}
          width={300}
          height={400}
          alt={`${book.title}`}
          className="rounded-t-lg object-cover w-full aspect-[3/4]"
        />
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          <Link
            href="#"
            className="text-lg font-bold hover:underline"
            prefetch={false}
          >
            {book.title}
          </Link>
          <p className="text-muted-foreground">
            Written by:{" "}
            <span className="text-violet-600">{book.author.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <StarIcon className="h-4 w-4 fill-violet-600" color="#7c3aed" />
          <span>{book.averageRating?.toFixed(2)}</span>
          <Separator orientation="vertical" className="h-4" />
          <span>{book.reviews?.length} reviews</span>
        </div>
      </CardContent>
    </Card>
  );
}