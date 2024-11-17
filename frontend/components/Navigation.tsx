"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "./ui/separator";

import { handleLogout } from "@/api";
import { useUser } from "@/Providers/UserProvider";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignedIn from "./Auth/SignedIn";
import { ModeToggle } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navigation = () => {
  const { loading } = useUser();
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between w-full fixed h-[60px] px-4 z-50">
      {/* Left-aligned Logo */}
      <Link href="/" className="text-2xl font-bold text-black dark:text-white">
        My Book Rep
      </Link>

      {/* Right-aligned Mode Toggle and Avatar */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <SignedIn>
            {({ user }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 cursor-pointer flex items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                    <AvatarImage src="/avatar.svg" alt="@shadcn" />
                    <AvatarFallback>
                      {user.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute right-0 mt-2">
                  <DropdownMenuLabel>{user.userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/my-wishlist")}>
                    My Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/my-favorites")}
                  >
                    My Favorites
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                      router.push("/auth/login");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SignedIn>
        )}
      </div>

      <Separator className="bg-black/30 w-full absolute bottom-0" />
    </nav>
  );
};

export default Navigation;
