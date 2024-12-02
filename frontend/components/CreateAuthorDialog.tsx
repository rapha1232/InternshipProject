"use client";

import { postData, putData } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllBooks } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  biography: z.string(),
  authorImage: z.any(),
  bookIds: z.string().array().optional(),
});

export default function AddAuthorDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading: booksLoading, isError, error } = useGetAllBooks();

  const form = useForm<z.infer<typeof AddAuthorSchema>>({
    resolver: zodResolver(AddAuthorSchema),
    defaultValues: {
      name: "",
      biography: "",
      authorImage: null,
      bookIds: [],
    },
  });

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const onSubmit = async (values: z.infer<typeof AddAuthorSchema>) => {
    setIsLoading(true);

    // Prepare FormData for the author creation
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("biography", values.biography);
    formData.append("authorImageUrl", values.authorImage);

    try {
      // Step 1: Create the author
      const data = await postData(
        "Author",
        { body: formData },
        "multipart/form-data"
      );

      if (data.message.toLowerCase().includes("success")) {
        queryClient.invalidateQueries({ queryKey: ["allAuthor"] });

        // Step 2: Add books to the author using FormData
        const bookFormData = new FormData();
        selectedBooks.forEach((bookId) =>
          bookFormData.append("BookIds", bookId)
        );

        const bookData = await putData(
          `Author/${data.author.id}/add-books`,
          { body: bookFormData }, // Pass FormData directly
          "multipart/form-data" // Explicitly specify the content type
        );

        if (bookData.message.toLowerCase().includes("success")) {
          queryClient.invalidateQueries({ queryKey: ["allAuthor"] });
          queryClient.invalidateQueries({ queryKey: ["allBook"] });
          queryClient.invalidateQueries({ queryKey: ["allReviews"] });
          toast.success("Books added to author successfully.");
        } else {
          toast.error("Error adding books to the author.");
        }

        toast.success("Author added successfully.");
      } else {
        toast.error("Failed to add author. Please try again.");
      }
    } catch (error) {
      console.error("Error adding author:", error);
      toast.error("Failed to add author.");
    } finally {
      setIsLoading(false);
    }
  };

  if (booksLoading) return <div>Loading books...</div>;
  if (isError) return <div>Error loading books: {error?.message}</div>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 text-foreground hover:bg-violet-800 w-full h-16">
          Add Author
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[425px] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Author</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Fill in the details below to add a new author.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Input placeholder="Author Biography" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  width={100}
                  height={100}
                  src={imagePreview}
                  alt="Image preview"
                  className="w-24 h-24 object-cover"
                  loader={({ src }) => src}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="bookIds"
              render={() => (
                <FormItem>
                  <FormLabel>Books written by Author</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={true}
                          className="w-[200px] justify-between"
                        >
                          {selectedBooks.length
                            ? `${selectedBooks.length} books selected`
                            : "Select Books..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search for a book..." />
                          <CommandList>
                            <CommandEmpty>No books found.</CommandEmpty>
                            <CommandGroup>
                              {data?.books
                                ?.filter((b) => !b.author)
                                .map((b) => (
                                  <CommandItem
                                    key={b.id}
                                    onSelect={() => toggleBookSelection(b.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedBooks.includes(b.id)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {b.title}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-6 items-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-800 text-foreground"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <DialogClose>Cancel</DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
