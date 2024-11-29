"use client";
import { putData } from "@/api";
import CreateBookDialog from "@/components/CreateBookDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserName } from "@/lib/hooks";
import { AuthorDto, BookDto, Review } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface PanelProps {
  booksData: BookDto[];
  authorsData: AuthorDto[];
  reviewsData: Review[];
}
const publishedStatus = [
  {
    value: "false",
    label: "Not Published",
    icon: X,
  },
  {
    value: "true",
    label: "Published",
    icon: Check,
  },
];

const ratingOptions = [
  {
    value: "1 ⭐",
    label: "1 ⭐",
  },
  {
    value: "2 ⭐",
    label: "2 ⭐",
  },
  {
    value: "3 ⭐",
    label: "3 ⭐",
  },
  {
    value: "4 ⭐",
    label: "4 ⭐",
  },
  {
    value: "5 ⭐",
    label: "5 ⭐",
  },
];

const Panel = ({ booksData, authorsData, reviewsData }: PanelProps) => {
  const queryClient = useQueryClient();
  const columnsForBooks: ColumnDef<BookDto>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
    },
    {
      accessorKey: "summary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Summary" />
      ),
    },
    {
      accessorKey: "averageRating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg Rating" />
      ),
    },
    {
      accessorKey: "toBeShown",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Published" />
      ),
      filterFn: (row, columnId, filterValue) => {
        return row.original.toBeShown === (filterValue[0] === "true");
      },
    },
  ];

  const handlePublishedChange = async (id: string, value: boolean) => {
    const data = await putData(`Book/show/${id}?toShow=${value}`, { body: "" });
    if ((data.message as string).includes("success")) {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allBooks"] });
    } else toast.error(data.message);
  };

  const columnsForAuthors: ColumnDef<AuthorDto>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "biography",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Biography" />
      ),
    },
  ];

  const columnsForReviews: ColumnDef<Review>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "bookTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Book Title" />
      ),
      cell: (info) => {
        const book = booksData.find(
          (book) => book.id === info.row.original.bookId
        );
        return book ? book.title : "N/A";
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: (info) => {
        const { data } = useGetUserName(info.row.original.userId);
        return data?.userName || "user not found ❌";
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rating" />
      ),
      cell: (info) => `${info.row.original.rating} ⭐`,
      filterFn: (row, columnId, filterValue) => {
        return row.original.rating === parseInt(filterValue, 10);
      },
    },
    {
      accessorKey: "content",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Content" />
      ),
    },
    {
      accessorKey: "reviewDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date Posted" />
      ),
      cell: (info) =>
        info.row.original.reviewDate.split("T")[0] +
        " at " +
        info.row.original.reviewDate.split("T")[1].split(".")[0],
    },
  ];
  return (
    <div className="flex flex-col mx-10">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <div className="mt-4">
        <h2 className="text-xl">Dashboard</h2>
        <div className="flex gap-6 mt-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium">Books</h3>
            <p>{booksData.length || 0}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium">Authors</h3>
            <p>{authorsData.length || 0}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium">Reviews</h3>
            <p>{reviewsData.length || 0}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <CreateBookDialog />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="books">
          <TabsList>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="books">
            <DataTable
              data={booksData || []}
              columns={columnsForBooks}
              search="title"
              filters={[
                {
                  title: "Published",
                  value: "toBeShown",
                  options: publishedStatus,
                },
              ]}
              onPublishedChange={handlePublishedChange}
            />
          </TabsContent>
          <TabsContent value="authors">
            <DataTable
              data={authorsData || []}
              columns={columnsForAuthors}
              search="name"
            />
          </TabsContent>
          <TabsContent value="reviews">
            <DataTable
              data={reviewsData || []}
              columns={columnsForReviews}
              search="content"
              filters={[
                { title: "Rating", value: "rating", options: ratingOptions },
                {
                  title: "User",
                  value: "user",
                  options: [
                    {
                      value: "user not found ❌",
                      label: "Deleted User",
                      icon: X,
                    },
                  ],
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Panel;

const Username = ({ userId }: { userId: string }) => {
  const { data } = useGetUserName(userId);
  return <div>{data?.userName ? data.userName : "user not found ❌"}</div>;
};
