import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import Loader from "@/components/ui/Loader";
import { sumIngredients } from "@/lib/utils";
import { getShoppingListIngredients } from "@/services/apiIngredients";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function ShoppingList() {
  const { data, isLoading } = useQuery({
    queryKey: ["shoppingList"],
    queryFn: getShoppingListIngredients,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  if (isLoading) return <Loader />;

  if (data) {
    const categoriesIngredients = sumIngredients(data);

    return (
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <p className="text-3xl">Lista Zakupów</p>
          <Button
            onClick={() => {
              reactToPrintFn();
            }}
          >
            Drukuj
          </Button>
        </div>

        <div
          ref={contentRef}
          className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 print:grid-cols-2 print:px-4"
        >
          {categoriesIngredients.map((category, i) => (
            <div
              className="rounded-md bg-secondary-100 px-4 py-4 dark:bg-secondary-400 print:border-[1px] print:bg-transparent"
              key={i}
            >
              <p className="mb-3 text-2xl capitalize print:text-secondary-600">
                {category.category}
              </p>

              <div className="space-y-2">
                {category.ingredients.map((ingredient) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-l-2 border-l-primary-600 py-1 pl-2 print:border-none print:text-secondary-600"
                  >
                    <p className="flex gap-2">
                      <Checkbox className="hidden size-6 print:block" />
                      {ingredient.name}
                    </p>
                    <p>
                      {ingredient.totalQuantity}
                      {ingredient.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ShoppingList;
