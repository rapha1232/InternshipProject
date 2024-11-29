"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "../button";
import { Input } from "../input";
import { DataTableViewOptions } from "./data-table-view-options";

import { ComponentType } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import DelBtn from "./delete-button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  filters?: {
    title: string;
    value: string;
    options: {
      value: string;
      label: string;
      icon?: ComponentType<{ className?: string | undefined }> | undefined;
    }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  search,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${search}...`}
          value={(table.getColumn(search)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(search)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filters &&
          filters.map((filter) => {
            const column = table.getColumn(filter.value); // Retrieve the column for the filter
            if (!column) return null; // Skip rendering if column doesn't exist
            return (
              <DataTableFacetedFilter
                key={filter.value} // Provide a unique key for each filter
                column={column}
                title={filter.title}
                options={filter.options}
              />
            );
          })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <DelBtn table={table} />
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
