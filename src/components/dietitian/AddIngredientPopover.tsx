import useDietitianId from "@/hooks/useDietitianId";
import {
  addEditIngredient,
  getIngredientsList,
  getUniqueIngredientsCategories,
  getUniqueUnitsList,
} from "@/services/apiIngredients";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, UseFieldArrayAppend, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import ComboInput from "../ui/ComboInput";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

type AddIngredientPopoverProps = {
  append: UseFieldArrayAppend<
    {
      name: string;
      category: string;
      group: string;
      calories: number;
      carbs: number;
      fat: number;
      proteins: number;
      ingredients: {
        id: number;
        name: string;
        unit: string;
        category: string;
        calories: number;
        carbs: number;
        proteins: number;
        fat: number;
        quantity: number;
        quantity_in_words: string;
      }[];
      description: string;
    },
    never
  >;
};

type FormFields = {
  name: string;
  category: string;
  unit: string;
  calories: number;
  carbs: number;
  proteins: number;
  fat: number;
};

function AddIngredientPopover({ append }: AddIngredientPopoverProps) {
  const queryClient = useQueryClient();
  const id = useDietitianId();

  const { data: ingredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredientsList,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addEditIngredient,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      append(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { handleSubmit, register, reset, control } = useForm<FormFields>();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchBar, setSearchBar] = useState("");

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate({ ingredient: data, dietitianId: id });
    setIsPopoverOpen(false);
  };

  return (
    <Popover
      open={isPopoverOpen}
      modal={true}
      onOpenChange={(open) => {
        setIsPopoverOpen(open);
        if (open) {
          setIsFormOpen(false);
          reset();
        }
      }}
    >
      <PopoverTrigger className="text-medium text-primary-950 mt-1 flex scale-105 items-end gap-1 md:text-lg">
        <span>Wybierz lub dodaj nową pozycję</span>
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent className="w-[375px] overflow-x-auto dark:text-secondary-100 lg:w-[450px]">
        {isFormOpen ? (
          <div >
            <form
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              id="item"
              name="item"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div>
                <Label htmlFor="name">Nazwa</Label>
                <Input
                  {...register("name")}
                  id="name"
                  type="text"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <div className="grow">
                  <Label htmlFor="category">Kategoria</Label>
                  <ComboInput
                    control={control}
                    register={register}
                    inputId="category"
                    queryFunction={getUniqueIngredientsCategories}
                    queryKey="ingredientsCategories"
                  />
                </div>
                <div className="grow">
                  <Label htmlFor="unit">Jednostka</Label>
                  <ComboInput
                    control={control}
                    register={register}
                    inputId="unit"
                    queryFunction={getUniqueUnitsList}
                    queryKey="unitsList"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="grow">
                  <Label htmlFor="calories">Kalorie</Label>
                  <Input
                    id="calories"
                    disabled={isPending}
                    {...register("calories")}
                    type="text"
                    required
                  />
                </div>
                <div className="grow">
                  <Label htmlFor="carbs">Węglowodany</Label>
                  <Input
                    id="carbs"
                    disabled={isPending}
                    {...register("carbs")}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="grow">
                  <Label htmlFor="proteins">Białko</Label>
                  <Input
                    id="proteins"
                    disabled={isPending}
                    {...register("proteins")}
                    type="text"
                    required
                  />
                </div>
                <div className="grow">
                  <Label htmlFor="fat">Tłuszcz</Label>
                  <Input
                    id="fat"
                    disabled={isPending}
                    {...register("fat")}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="text-primary-950 flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsFormOpen((open) => !open);
                    reset();
                  }}
                >
                  <ArrowLeftIcon className="h-5" /> Powrót
                </button>
                <Button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={handleSubmit(onSubmit)}
                  className="rounded-md bg-primary-600 px-4 py-2 font-medium text-primary-50 transition-colors hover:bg-primary-800"
                >
                  Dodaj
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="min-w-[400px]">
            <Input
              value={searchBar}
              onChange={(e) => {
                setSearchBar(e.target.value);
              }}
              placeholder="Wyszukaj nazwę"
            />
            <div className="flex items-center justify-between gap-6 border-b-[1px] border-primary-100 px-1 py-2">
              <span>Wybierz składnik</span>
              <button
                onClick={() => {
                  setIsFormOpen((open) => !open);
                }}
                className="text-primary-950"
              >
                + Dodaj
              </button>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              <div className="grid w-full grid-cols-[100px_85px_0.8fr_0.5fr_0.5fr_0.5fr] gap-1 rounded-sm px-2 py-1 text-center">
                <span className="text-left">Nazwa</span>
                <span className="text-left">Kategoria</span>
                <span>Kcal</span>
                <span>W</span>
                <span>B</span>
                <span>T</span>
              </div>
              {ingredients?.map((ingredient, i) => {
                if (ingredient.name.toLowerCase().includes(searchBar))
                  return (
                    <PopoverClose
                      onClick={() => {
                        const ingredientToAdd = {
                          ...ingredient,
                          quantity: 1,
                        };

                        append(ingredientToAdd);
                      }}
                      key={i}
                      className="grid w-full cursor-pointer grid-cols-[100px_85px_0.8fr_0.5fr_0.5fr_0.5fr] gap-1 rounded-sm px-2 py-1 transition-colors hover:bg-primary-50 dark:hover:bg-secondary-300"
                    >
                      <span className="overflow-clip text-ellipsis text-nowrap text-left">
                        {ingredient.name}
                      </span>
                      <span className="max-w-[85px] overflow-clip text-ellipsis text-nowrap text-left">
                        {ingredient.category}
                      </span>
                      <span>{ingredient.calories}</span>
                      <span>{ingredient.carbs}</span>
                      <span>{ingredient.proteins}</span>
                      <span>{ingredient.carbs}</span>
                    </PopoverClose>
                  );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default AddIngredientPopover;
