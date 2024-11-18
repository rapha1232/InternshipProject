"use client";
import { putData } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateReviewSchema = z.object({
  content: z.string(),
  rating: z.number(),
});
export function UpdateDialog({
  bookId,
  reviewId,
}: {
  bookId: string;
  reviewId: string;
}) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof UpdateReviewSchema>>({
    resolver: zodResolver(UpdateReviewSchema),
    defaultValues: {
      content: "",
      rating: 0,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (
      values: z.infer<typeof UpdateReviewSchema>
    ): Promise<{ message: string }> =>
      await putData(`Reviews/${reviewId}`, { body: values }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["oneBook", bookId] }); // Refetch book data to update reviews
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit your review</DialogTitle>
          <DialogDescription>
            Make changes to your review below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="Write your review here..."
                      className="w-full p-4 border rounded-lg"
                      rows={4}
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="w-full flex items-center space-x-4">
                  <FormLabel className="text-lg">Rating: </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <span
                          key={value}
                          onClick={() => field.onChange(value)} // Update the rating value in the form state
                          className={`cursor-pointer text-2xl ${
                            field.value >= value
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button
                type="submit"
                variant={"outline"}
                className="bg-violet-600 hover:bg-violet-800 mt-4"
              >
                Save changes
              </Button>
            </DialogClose>
          </form>
        </Form>
        <DialogFooter>
          <Button variant={"outline"}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
