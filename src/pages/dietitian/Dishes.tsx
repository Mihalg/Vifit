import DataTableMenu from "@/components/dietician/DataTableMenu";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataTable } from "@/components/ui/DataTable";
import Loader from "@/components/ui/Loader";
import { deleteDish, duplicateDish, getDishesList } from "@/services/apiDishes";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Outlet, useLocation, useParams } from "react-router";

type Dish = {
  id?: number;
  name: string;
  category: string;
  calories: number;
};

const columns: ColumnDef<Dish>[] = [
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
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Kategoria
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("category")}</div>;
    },
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
          Kcal
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("calories")}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.original.id)
        return (
          <DataTableMenu
            id={row.original.id}
            queryKey="dishes"
            deleteFn={deleteDish}
            duplicateFn={duplicateDish}
          />
        );
    },
  },
];

function Dishes() {
  const { pathname } = useLocation();
  const { dishId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishesList,
  });

  if (
    pathname ===
      "/panel/baza/posi%C5%82ki/nowy" ||
    dishId
  )
    return <Outlet />;

  if (isLoading) return <Loader />;

  if (data)
    return (
      <DataTable<Dish>
        columns={columns}
        data={data}
        searchbarPlaceholder="Wyszukaj po nazwie"
        queryToInvalidate="dishesDatabase"
        deleteFn={deleteDish}
      />
    );
}

export default Dishes;
