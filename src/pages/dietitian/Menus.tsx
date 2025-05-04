import DataTableMenu from "@/components/dietician/DataTableMenu";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataTable } from "@/components/ui/DataTable";
import Loader from "@/components/ui/Loader";
import { deleteMenu, duplicateMenu, getMenusList } from "@/services/apiMenus";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Outlet, useLocation, useParams } from "react-router";

type Menu = {
  id?: number;
  name: string;
  calories: number;
  carbs: number | undefined;
  fat: number | undefined;
  proteins: number | undefined;
};

const columns: ColumnDef<Menu>[] = [
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Zaznacz wszystkie"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Zaznacz wiersz"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Nazwa
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "calories",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Kalorie
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("calories")}</div>
    ),
  },
  {
    accessorKey: "carbs",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Węglowodany
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("carbs")}</div>
    ),
  },
  {
    accessorKey: "fat",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Tłuszcze
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("fat")}</div>
    ),
  },
  {
    accessorKey: "proteins",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Białko
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("proteins")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.original.id)
        return (
          <DataTableMenu
            id={+row.original.id}
            queryKey="menusList"
            deleteFn={deleteMenu}
            duplicateFn={duplicateMenu}
          />
        );
    },
  },
];

function Menus() {
  const { pathname } = useLocation();
  const { menuId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["menusList"],
    queryFn: getMenusList,
  });

  if (pathname === "/panel/baza-jad%C5%82ospis%C3%B3w/nowy" || menuId)
    return <Outlet />;

  if (isLoading) return <Loader />;

  if (data)
    return (
      <DataTable<Menu>
        columns={columns}
        data={data}
        searchbarPlaceholder="Wyszukaj po nazwie"
        queryToInvalidate="menusList"
        deleteFn={deleteMenu}
      />
    );
}

export default Menus;
