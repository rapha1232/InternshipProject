"use client";

import { postData } from "@/api";
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
import { useGetAllAuthors } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  summary: z.string(),
  bookImage: z.any(),
  authorId: z.string().optional(),
});

export default function AddBookDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(
    "00000000-0000-0000-0000-000000000000"
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // Fetch authors using the hook
  const {
    data,
    isLoading: authorsLoading,
    isError,
    error,
  } = useGetAllAuthors();

  const form = useForm<z.infer<typeof AddBookSchema>>({
    resolver: zodResolver(AddBookSchema),
    defaultValues: {
      title: "",
      description: "",
      summary: "",
      bookImage: undefined,
      authorId: "00000000-0000-0000-0000-000000000000",
    },
  });

  const onSubmit = async (values: z.infer<typeof AddBookSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("summary", values.summary);
    formData.append("authorId", selectedAuthor); // Use selectedAuthor instead of form value
    formData.append("bookImage", values.bookImage); // selectedFile is your file object
    try {
      const data = await postData(
        "Book",
        { body: formData },
        "multipart/form-data"
      );
      if (data.message.toLowerCase().includes("success")) {
        queryClient.invalidateQueries({ queryKey: ["allBook"] });
        toast.success("Book added successfully.");
      } else {
        toast.error("Failed to add book. Please try again.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authorsLoading) return <div>Loading authors...</div>;
  if (isError) return <div>Error loading authors: {error?.message}</div>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 text-foreground hover:bg-violet-800 w-full h-16">
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[425px] max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Fill in the details below to add a new book.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Book Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Book Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input placeholder="Book Summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookImage"
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
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={true}
                          className="w-[200px] justify-between"
                        >
                          {selectedAuthor !==
                          "00000000-0000-0000-0000-000000000000"
                            ? data?.authors?.find(
                                (author) => author.id === selectedAuthor
                              )?.name
                            : "Select Author..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search for an author..." />
                          <CommandList>
                            <CommandEmpty>No author found.</CommandEmpty>
                            <CommandGroup>
                              {data?.authors?.map((author) => (
                                <CommandItem
                                  key={author.id}
                                  value={author.id + "authorname" + author.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(
                                      currentValue.split("authorname")[0]
                                    );
                                    setSelectedAuthor(
                                      currentValue === selectedAuthor
                                        ? ""
                                        : currentValue.split("authorname")[0]
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedAuthor === author.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {author.name}
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
