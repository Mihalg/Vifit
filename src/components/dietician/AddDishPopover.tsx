/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDishesList } from "@/services/apiDishes";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { UseDarkModeContext } from "@/lib/utils";

type AddDishPopoverProps = {
  append: UseFieldArrayAppend<any>;
};

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
      <PopoverContent className="w-[350px] text-secondary-100 lg:w-[500px]">
        <div>
          <Input
            value={searchBar}
            onChange={(e) => {
              setSearchBar(e.target.value);
            }}
            placeholder="Wyszukaj nazwę"
            className={
              isDarkModeOn
                ? "border-neutral-800 bg-neutral-600 ring-offset-neutral-950 file:text-neutral-50 placeholder:text-neutral-400 focus-visible:ring-neutral-300"
                : ""
            }
          />
          <div className="flex w-full items-center justify-between rounded-sm px-2 py-1">
            <span className="w-[150px]">Nazwa</span>
            <span>Kcal</span>
            <span>W</span>
            <span>T</span>
            <span>B</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {dishes?.map((dish, i) => {
              if (dish.name.toLowerCase().includes(searchBar))
                return (
                  <PopoverClose
                    title={dish.name}
                    onClick={() => {
                      append(dish);
                    }}
                    key={i}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1 transition-colors ${isDarkModeOn ? "hover:bg-secondary-300" : "hover:bg-primary-50"}`}
                  >
                    <span className="w-[150px] overflow-clip text-ellipsis text-nowrap text-start">
                      {dish.name}
                    </span>
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
