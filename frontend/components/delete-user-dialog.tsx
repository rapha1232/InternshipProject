"use client";
import { deleteData, handleLogout } from "@/api";
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
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteUserDialog() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user")!);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const { mutate: deleteUser } = useMutation({
    mutationFn: async () => await deleteData(`User/delete/${user.id}`),
    onMutate: () => {
      setIsDeleteLoading(true);
    },
    onSuccess: (data) => {
      router.push("/auth/login");
      setIsDeleteLoading(false);
      toast.success(data.message);
      handleLogout();
    },
    onError: (error) => {
      setIsDeleteLoading(false);
      toast.error(error.message);
    },
  });
  return (
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
              onClick={() => deleteUser()}
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
  );
}
