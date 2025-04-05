import DataTableMenu from "@/components/dietician/DataTableMenu";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DataTable } from "@/components/ui/DataTable";
import Loader from "@/components/ui/Loader";
import {
  deleteIngredient,
  duplicateIngredient,
  getIngredientsList,
} from "@/services/apiIngredients";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Outlet, useLocation, useParams } from "react-router";

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  category: string;
};

const columns: ColumnDef<Ingredient>[] = [
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
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <Button
          className="w-full"
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Jednostka
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("unit")}</div>;
    },
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      if (row.original.id)
        return (
          <DataTableMenu
            id={row.original.id}
            queryKey="ingredientsList"
            deleteFn={deleteIngredient}
            duplicateFn={duplicateIngredient}
          />
        );
    },
  },
];

function Ingredients() {
  const { pathname } = useLocation();
  const { ingredientId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["ingredientsList"],
    queryFn: getIngredientsList,
  });

  if (
    pathname === "/panel/baza/sk%C5%82adniki/nowy-sk%C5%82adnik" ||
    ingredientId
  )
    return <Outlet />;

  if (isLoading) return <Loader />;

  if (data)
    return (
      <DataTable<Ingredient>
        columns={columns}
        data={data}
        searchbarPlaceholder="Wyszukaj po nazwie"
        queryToInvalidate="ingredientsList"
        deleteFn={deleteIngredient}
      />
    );
}

export default Ingredients;
