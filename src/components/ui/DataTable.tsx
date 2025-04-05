import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  searchbarPlaceholder: string;
  deleteFn: (id: number | number[]) => Promise<void>;
  queryToInvalidate: string;
  defaultSorting?: { id: string; desc: boolean };
};

export function DataTable<T extends { id?: number | undefined }>({
  columns,
  data,
  searchbarPlaceholder,
  deleteFn,
  queryToInvalidate,
  defaultSorting,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSorting ? [defaultSorting] : [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const selectedRows = Object.keys(table.getState().rowSelection);
  const selectedRowsIds = selectedRows.map(
    (row) => table.getRow(row).original.id as number,
  );

  const { mutate: delSelected } = useMutation({
    mutationFn: deleteFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryToInvalidate] });
      toast.success("Usunięto zaznaczone");
      setRowSelection({});
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const filterValue = table.getAllColumns().at(1)?.id || "";

  return (
    <div className="w-full px-8">
      <div className="flex items-center gap-3 py-4">
        <Input
          placeholder={searchbarPlaceholder}
          value={table.getColumn(filterValue)?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn(filterValue)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {selectedRowsIds.length > 0 && (
          <Button
            onClick={() => {
              delSelected(selectedRowsIds);
            }}
            className="ml-4 flex items-center gap-2"
          >
            Usuń ({table.getFilteredSelectedRowModel().rows.length})
            <Trash2 size={22} />
          </Button>
        )}

        <Button
          onClick={() => {
            void navigate("nowy-posiłek");
          }}
          className="ml-auto"
        >
          <span className="flex items-center gap-1">
            Dodaj <Plus className="h-5" />
          </span>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Brak wyników
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Zaznaczono {table.getFilteredSelectedRowModel().rows.length} z{" "}
          {table.getFilteredRowModel().rows.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
