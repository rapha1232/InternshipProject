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
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { loginUser } from "@/api";
import { LoginResponseDto } from "@/Dtos/authDtos";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const LoginSchema = z.object({
  userNameOrEmail: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(60, { message: "Password must be at most 60 characters long" }),
});

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userNameOrEmail: "",
      password: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (
      values: z.infer<typeof LoginSchema>
    ): Promise<LoginResponseDto> => await loginUser(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      Cookies.set("jwtToken", data.response.jwtToken, {
        expires: 7,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", data.response.refreshToken, {
        expires: 7,
        sameSite: "strict",
      });
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify(data.response.user));
      toast.success("Logged in successfully");
      router.push("/");
    },
    onError: () => {
      setIsLoading(false);
      toast.error("User not found or error");
    },
  });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="space-y-8 flex flex-col items-center justify-center"
        >
          <FormField
            control={form.control}
            name="userNameOrEmail"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>UserName Or Email</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="username123 or email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can enter your username or email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormDescription>This is your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
}
