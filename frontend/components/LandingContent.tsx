import { Card, CardContent } from "@/components/ui/card";
import { EditIcon, HeartIcon, ListIcon, StarIcon, User } from "lucide-react";

export default function LandingContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 bg-background">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to <span className="text-violet-600">Book Rep</span>
      </h1>
      <p className="text-center text-lg max-w-2xl mb-10">
        Discover, manage, and explore books. Add and rate books, leave comments,
        and create your own library of favorites and wishlists.
      </p>

      <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
        <FeatureCard
          title="Add Books & Authors"
          description="Enrich the repository by adding new books and authors."
          icon={<EditIcon className="h-8 w-8 text-violet-600" />}
          className="col-span-1 row-span-2 max-md:col-span-1 max-md:row-span-1 max-lg:col-span-1 max-lg:row-span-1 max-sm:col-span-1 max-sm:row-span-1"
        />
        <FeatureCard
          title="View Books & Authors"
          description="Browse through a comprehensive list of books and authors."
          icon={<ListIcon className="h-8 w-8 text-violet-600" />}
          className="col-span-2 row-span-1 max-md:col-span-1 max-md:row-span-1 max-lg:col-span-1 max-lg:row-span-1 max-sm:col-span-1 max-sm:row-span-1"
        />
        <FeatureCard
          title="Comments & Ratings"
          description="Share your thoughts and rate your favorite books."
          icon={<StarIcon className="h-8 w-8 text-violet-600" />}
          className="col-span-1 row-span-1 max-md:col-span-1 max-md:row-span-1 max-sm:col-span-1 max-sm:row-span-1"
        />
        <FeatureCard
          title="Favorites & Wishlists"
          description="Curate lists of your favorites and books you wish to read."
          icon={<HeartIcon className="h-8 w-8 text-violet-600" />}
          className="col-span-1 row-span-1 max-md:col-span-1 max-md:row-span-1 max-sm:col-span-1 max-sm:row-span-1"
        />
        <FeatureCard
          title="Profile Management"
          description="Edit and manage your profile to personalize your experience."
          icon={<User className="h-8 w-8 text-violet-600" />}
          className="col-span-2 row-span-1 max-sm:col-span-1 max-sm:row-span-1"
        />
      </div>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

function FeatureCard({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={`border-violet-600/50 h-full flex items-center justify-center ${className}`}
    >
      <CardContent className="p-4 flex flex-col items-center  text-center">
        <div className="mb-3">{icon}</div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
