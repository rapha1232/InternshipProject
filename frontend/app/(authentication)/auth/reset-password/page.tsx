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
import { useResetPasswordRequest } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for email
const ResetPasswordRequestSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

const ResetPasswordRequestPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ResetPasswordRequestSchema>>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const { resetPasswordRequest } = useResetPasswordRequest(
    () => {
      setIsLoading(true);
    },
    () => {
      setIsLoading(false);
      toast.success("Verification code sent successfully");
      router.push("/auth/reset-password/verify");
    },
    () => {
      toast.error("Failed to send verification code");
      setIsLoading(false);
    }
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              resetPasswordRequest(values.email)
            )}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordRequestPage;
