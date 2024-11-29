"use client";
import { useUser } from "@/Providers/UserProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SignedIn from "./SignedIn";

const ProfileButton = () => {
  const { loading, logout } = useUser();
  const router = useRouter();
  return (
    <>
      {loading ? (
        <Loader2 className="h-8 w-8 animate-spin" />
      ) : (
        <SignedIn>
          {({ user }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer flex items-center justify-center hover:text-accent-foreground rounded-full transition-colors">
                  <AvatarImage
                    src="/icons/avatar.svg"
                    alt="@shadcn"
                    className="size-3/4"
                  />
                  <AvatarFallback className="bg-showcase">
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
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="bg-red-600 focus:bg-red-700"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SignedIn>
      )}
    </>
  );
};

export default ProfileButton;
