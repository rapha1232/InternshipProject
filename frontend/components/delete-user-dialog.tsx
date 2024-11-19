"use client";
import { handleLogout } from "@/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAccount } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteUserDialog() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Define `deleteUser` hook, but it won't be called if `!user`
  const { deleteUser } = useDeleteAccount(
    user?.id || "",
    () => {
      setIsDeleteLoading(true);
    },
    (data) => {
      setUser(null);
      router.push("/");
      setIsDeleteLoading(false);
      toast.success(data.message);
      handleLogout();
    },
    (error) => {
      setIsDeleteLoading(false);
      toast.error(error.message);
    }
  );

  // Render UI
  return (
    user && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => deleteUser(user.id)}
                disabled={isDeleteLoading}
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90 text-foreground"
              >
                {isDeleteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                )}
                Delete Profile
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
}
