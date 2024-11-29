"use client";
import { deleteData } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { Button } from "../button";

interface DelBtnProps<TData> {
  table: Table<TData>;
}
export default function DelBtn<TData>({ table }: DelBtnProps<TData>) {
  const queryClient = useQueryClient();
  const handleClick = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const bookIds = selectedRows.map((row) => (row.original as any).id);
    bookIds.forEach((id) => {
      deleteData(`Reviews/${id}`).then(() => {
        queryClient.invalidateQueries({ queryKey: ["allReviews"] });
      });
    });
  };
  return (
    <Button variant={"destructive"} className="mx-8" onClick={handleClick}>
      Delete all selected items
    </Button>
  );
}
