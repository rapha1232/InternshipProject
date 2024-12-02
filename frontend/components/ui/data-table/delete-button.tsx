"use client";
import { deleteData } from "@/api";
import { useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../button";

interface DelBtnProps<TData> {
  table: Table<TData>;
  tableName: string;
}
export default function DelBtn<TData>({
  table,
  tableName,
}: DelBtnProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const ids = selectedRows.map((row) => (row.original as any).id);
    ids.forEach(async (id) => {
      setIsLoading(true);
      const data = await deleteData(`${tableName}/${id}`);
      if (data.message.toLowerCase().includes("success")) {
        table.resetRowSelection();
        toast.success(`Item with ID: ${id} deleted successfully`);
        queryClient.invalidateQueries({ queryKey: [`all${tableName}`] });
        setIsLoading(false);
      } else {
        toast.error(`Item with ID: ${id} failed to delete`);
        setIsLoading(false);
      }
    });
  };

  return (
    <Button variant={"destructive"} className="mx-8" onClick={handleClick}>
      {isLoading ? "Deleting..." : "Delete all selected items"}
    </Button>
  );
}
