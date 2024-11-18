import { postData } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/Providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ReviewSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  content: z.string(),
  rating: z.number(),
});

const ReviewForm = ({ bookId }: { bookId: string }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isPostLoading, setIsPostLoading] = useState(false);
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      userId: user?.id,
      bookId: bookId,
      content: "",
      rating: 0,
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (
      values: z.infer<typeof ReviewSchema>
    ): Promise<{ message: string }> =>
      await postData("Reviews", { body: values }),
    onMutate: () => {
      setIsPostLoading(true);
    },
    onSuccess: (data) => {
      setIsPostLoading(false);
      toast.success(data.message);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["oneBook", bookId] });
    },
    onError: (e) => {
      setIsPostLoading(false);
      toast.error(e.message);
    },
  });

  return (
    <>
      <h3 className="text-2xl font-semibold mb-4">Add Your Review</h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="space-y-4"
        >
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
          <Button
            disabled={isPostLoading}
            type="submit"
            className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-800 text-white rounded-lg"
          >
            Submit Review
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ReviewForm;
