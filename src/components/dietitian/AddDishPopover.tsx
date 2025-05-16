/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDishesList } from "@/services/apiDishes";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { UseDarkModeContext } from "../ThemeProvider";

type AddDishPopoverProps = { append: UseFieldArrayAppend<any> };

function AddDishPopover({ append }: AddDishPopoverProps) {
  const [searchBar, setSearchBar] = useState("");
  const { isDarkModeOn } = UseDarkModeContext();

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
            // className="dark:border-neutral-800 bg-neutral-600 ring-offset-neutral-950 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300"
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
                    className={`grid items-center w-full cursor-pointer grid-cols-[120px_0.6fr_0.45fr_0.22fr_0.15fr_0.15fr_0.15fr] rounded-sm px-2 py-1 transition-colors ${isDarkModeOn ? "hover:bg-secondary-300" : "hover:bg-primary-50"}`}
                  >
                    <span className=" overflow-clip text-ellipsis text-nowrap text-start">
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
}

export default AddDishPopover;
