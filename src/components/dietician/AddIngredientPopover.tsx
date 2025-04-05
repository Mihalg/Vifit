import useDietitianId from "@/hooks/useDietitianId";
import { addEditIngredient, getIngredientsList } from "@/services/apiIngredients";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, UseFieldArrayAppend, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

type AddIngredientPopoverProps = {
  append: UseFieldArrayAppend<
    {
      name: string;
      category: string;
      calories: number;
      carbs: number;
      fat: number;
      proteins: number;
      ingredients: {
        id: number;
        name: string;
        unit: string;
        category: string;
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

  const { handleSubmit, register, reset } = useForm<FormFields>();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      <PopoverContent className="w-[400px]">
        {isFormOpen ? (
          <div>
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
              <div>
                <Label htmlFor="unit">Jednostka miary</Label>
                <Input
                  id="unit"
                  disabled={isPending}
                  {...register("unit")}
                  type="text"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategoria</Label>
                <Input
                  id="category"
                  disabled={isPending}
                  {...register("category")}
                  type="text"
                  required
                />
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
                  className="rounded-md bg-primary-600 px-4 py-2 font-medium text-primary-50 transition-colors hover:bg-primary-900"
                >
                  Dodaj
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <Input placeholder="Wyszukaj nazwę" />
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
              {ingredients?.map((ingredient, i) => (
                <PopoverClose
                  onClick={() => {
                    const ingredientToAdd = {
                      ...ingredient,
                      quantity: 1,
                    };

                    append(ingredientToAdd);
                  }}
                  key={i}
                  className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1 transition-colors hover:bg-primary-50"
                >
                  <span className="text-start">{ingredient.name}</span>
                  <span>{ingredient.category}</span>
                </PopoverClose>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default AddIngredientPopover;
