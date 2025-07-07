/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDishesList } from "@/services/apiDishes";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { memo, useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

type AddDishPopoverProps = { append: UseFieldArrayAppend<any> };

const AddDishPopover = memo(function AddDishPopover({
  append,
}: AddDishPopoverProps) {
  const [searchBar, setSearchBar] = useState("");

  const { data: dishes } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishesList,
  });

  return (
    <Popover modal={true}>
      <PopoverTrigger className="text-medium text-primary-950 mt-1 flex scale-105 items-end gap-1 md:text-lg">
        <span>Wybierz nową pozycję</span>
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent className="w-[350px] overflow-x-auto dark:text-secondary-100 lg:w-[550px]">
        <div className="min-w-[500px]">
          <Input
            value={searchBar}
            onChange={(e) => {
              setSearchBar(e.target.value);
            }}
            placeholder="Wyszukaj nazwę"
          />
          <div className="grid w-full grid-cols-[120px_0.6fr_0.45fr_0.22fr_0.15fr_0.15fr_0.15fr] rounded-sm px-2 py-1 text-center">
            <span className="text-left">Nazwa</span>
            <span>Grupa</span>
            <span>Kategoria</span>
            <span>Kcal</span>
            <span>W</span>
            <span>T</span>
            <span>B</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {dishes?.map((dish, i) => {
              if (dish.name.toLowerCase().includes(searchBar.toLowerCase()))
                return (
                  <PopoverClose
                    title={dish.name}
                    onClick={() => {
                      append(dish);
                    }}
                    key={i}
                    className="grid w-full cursor-pointer grid-cols-[120px_0.6fr_0.45fr_0.22fr_0.15fr_0.15fr_0.15fr] items-center rounded-sm px-2 py-1 transition-colors hover:bg-primary-50 dark:hover:bg-secondary-300"
                  >
                    <span className="overflow-clip text-ellipsis text-nowrap text-start">
                      {dish.name}
                    </span>
                    <span>{dish.group}</span>
                    <span>{dish.category}</span>
                    <span>{dish.calories}</span>
                    <span>{dish.carbs}</span>
                    <span>{dish.fat}</span>
                    <span>{dish.proteins}</span>
                  </PopoverClose>
                );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default AddDishPopover;
