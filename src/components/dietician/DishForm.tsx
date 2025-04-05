import useDietitianId from "@/hooks/useDietitianId";
import { useDishToEdit } from "@/hooks/useDishToEdit";
import { useMoveBack } from "@/hooks/useMoveBack";
import { addEditDish } from "@/services/apiDishes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MinusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import AddIngredientPopover from "./AddIngredientPopover";
import Loader from "../ui/Loader";

type FormFields = {
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
};

function DishForm() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const { dishId } = useParams();
  const { dish, isLoading } = useDishToEdit(dishId);

  const { register, handleSubmit, control, reset } = useForm<FormFields>({
    defaultValues: {
      name: "",
      category: "",
      calories: 0,
      description: "",
      carbs: 0,
      fat: 0,
      proteins: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const isReset = useRef(false);

  useEffect(() => {
    if (dish && !isReset.current) {
      reset(dish);
      isReset.current = true;
    }
  }, [dish, reset]);

  const { mutate } = useMutation({
    mutationFn: addEditDish,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dish", dishId] });
      toast.success("Sukces!");
      await moveBack();
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate({ dish: data, dishId, dietitianId });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-h-[900px] scroll-mb-56 lg:overflow-y-auto">
      <Button
        className="ml-4 mt-4"
        onClick={() => {
          void moveBack();
        }}
      >
        <ArrowLeft /> Powrót
      </Button>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-6 pb-8 pt-4"
      >
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div>
            <Label htmlFor="name">Nazwa</Label>
            <Input id="name" type="text" required {...register("name")} />
          </div>
          <div className="col-start-1">
            <Label htmlFor="category">Kategoria</Label>
            <Input
              id="category"
              type="text"
              required
              {...register("category")}
            />
          </div>
          <div className="col-start-1">
            <Label htmlFor="calories">Kalorie</Label>
            <Input
              id="calories"
              type="number"
              required
              {...register("calories")}
            />
          </div>
          <div className="lg:col-start-2 lg:row-start-1">
            <Label htmlFor="carbs">Węglowodany</Label>
            <Input id="carbs" type="number" required {...register("carbs")} />
          </div>
          <div className="lg:col-start-2 lg:row-start-2">
            <Label htmlFor="fat">Tłuszcze</Label>
            <Input id="fat" type="number" required {...register("fat")} />
          </div>
          <div className="lg:col-start-2">
            <Label htmlFor="proteins">Białko</Label>
            <Input
              id="proteins"
              type="number"
              required
              {...register("proteins")}
            />
          </div>
          <div className="col-start-1 h-full lg:col-span-2">
            <Label htmlFor="description">Opis przygotowania</Label>
            <Textarea
              className="max-h-[200px]"
              id="description"
              required
              {...register("description")}
            />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <p className="text-3xl text-primary-600 lg:text-4xl">Składniki</p>
          <AddIngredientPopover append={append} />
        </div>
        {fields.map((field, i) => (
          <div className="flex flex-col gap-4 lg:flex-row" key={field.id}>
            <Input className="hidden" {...register(`ingredients.${i}.id`)} />
            <div className="grow">
              <Label htmlFor={`ingredients.${i}.name`}>Nazwa</Label>
              <Input
                disabled
                id={`ingredients.${i}.name`}
                type="text"
                required
                {...register(`ingredients.${i}.name`)}
              />
            </div>
            <div className="">
              <Label htmlFor={`ingredients.${i}.category`}>Kategoria</Label>
              <Input
                disabled
                id={`ingredients.${i}.category`}
                type="text"
                required
                {...register(`ingredients.${i}.category`)}
              />
            </div>
            <div>
              <Label htmlFor={`ingredients.${i}.unit`}>Jednostka miary</Label>
              <Input
                disabled
                id={`ingredients.${i}.unit`}
                type="text"
                required
                {...register(`ingredients.${i}.unit`)}
              />
            </div>
            <div>
              <Label htmlFor={`ingredients.${i}.quantity`}>Ilość</Label>
              <Input
                id={`ingredients.${i}.quantity`}
                type="text"
                required
                {...register(`ingredients.${i}.quantity`)}
              />
            </div>
            <div>
              <Label htmlFor={`ingredients.${i}.quantity_in_words`}>
                Ilość słownie
              </Label>
              <Input
                id={`ingredients.${i}.quantity_in_words`}
                type="text"
                required
                {...register(`ingredients.${i}.quantity_in_words`)}
              />
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                remove(i);
              }}
              className="ml-auto mt-[13px] w-[50px] self-end"
            >
              <MinusIcon />
            </Button>
          </div>
        ))}

        {fields.length > 0 && (
          <Button className="ml-auto min-w-[100px]">Zapisz</Button>
        )}
      </form>
    </div>
  );
}

export default DishForm;
