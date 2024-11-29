"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/lib/hooks";
import { useUser } from "@/Providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PasswordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(60, "New password must be at most 60 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirmation password must be at least 8 characters")
      .max(60, "Confirmation password must be at most 60 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirmation password do not match",
  });

const PasswordChangePage = () => {
  const { user, loading } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Use the custom hook to handle password change logic
  const { changePassword } = useChangePassword(
    user?.id || "",
    // onMutate callback - can be used for setting loading state or optimistic updates
    () => setIsLoading(true),
    // onSuccess callback - will be called when mutation succeeds
    () => {
      toast.success("Password changed successfully");
      setIsLoading(false);
      form.reset();
    },
    // onError callback - will be called when mutation fails
    (error) => {
      toast.error(error.message || "An error occurred");
      setIsLoading(false);
    }
  );

  return (
    <div className="flex items-center justify-center mt-24 mx-auto px-4">
      <div className="w-full max-w-lg rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => changePassword(values))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your current password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Create a strong new password (8–60 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Re-enter your new password for confirmation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PasswordChangePage;
