"use client";
import { putData } from "@/api";
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
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
const profileFormSchema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const user = JSON.parse(localStorage.getItem("user")!);
  const defVal = user
    ? { userName: user.userName, email: user.email }
    : { userName: "", email: "" };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defVal,
  });

  const { mutate } = useMutation({
    mutationFn: async (values: ProfileFormValues) =>
      await putData(`User/update/${user.id}`, { body: values }),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      toast.success(data.message);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values))}
          className="space-y-6 sm:max-w-md mx-auto dark:bg-neutral-900 bg-neutral-100"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    className="w-full rounded-lg p-2 focus:outline-none dark:bg-neutral-950 bg-neutral-50"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="w-full rounded-lg p-2 focus:outline-none dark:bg-neutral-950 bg-neutral-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg shadow-md transition-colors dark:bg-neutral-950 bg-neutral-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </form>
      </Form>
    </>
  );
}
