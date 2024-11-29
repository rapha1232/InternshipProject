"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for password reset
const ResetPasswordFormSchema = z
  .object({
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

const ResetPasswordFormPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token and email from query parameters
  const token = searchParams?.get("token");
  const email = searchParams?.get("email");

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Redirect if token and email are missing
    if (!token || !email) {
      toast.error("Invalid request. Please try again.");
      router.push("/auth/login"); // Redirect to login page
    }
  }, [token, email, router]);

  const handlePasswordReset = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      // Call your backend API to reset the password
      const body = JSON.stringify({
        email,
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      const response = await fetch(
        `https://localhost:7060/api/User/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || "Your password has been successfully reset!"
        );
        router.push("/auth/login"); // Redirect to login after successful password reset
      } else {
        const errorMessage = Array.isArray(data.message) // Check if `message` is an array of errors
          ? data.message
              .map(
                (err: { code: string; description: string }) => err.description
              )
              .join(", ") // Concatenate error descriptions
          : data.message || "Failed to reset password."; // Fallback for single error or unknown structure
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Your Password
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordReset)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordFormPage;
