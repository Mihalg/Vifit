import useDietitianId from "@/hooks/useDietitianId";
import { useMealToEdit } from "@/hooks/useMealToEdit";
import { useMoveBack } from "@/hooks/useMoveBack";
import { addEditMeal } from "@/services/apiMeals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MinusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Loader from "../ui/Loader";
import AddDishPopover from "./AddDishPopover";

type FormFields = {
  name: string;
  time: string;
  calories: number;
  carbs: number;
  fat: number;
  proteins: number;
  meal_dishes: {
    id: number;
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    proteins: number;
  }[];
};

function MealForm() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const { mealId, patientId } = useParams();
  const { meal, isLoading } = useMealToEdit(mealId);

  const { register, handleSubmit, control, reset } = useForm<FormFields>({
    defaultValues: {
      name: "",
      time: "",
      calories: 0,
      carbs: 0,
      fat: 0,
      proteins: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meal_dishes",
  });

  const isReset = useRef(false);

  useEffect(() => {
    if (meal && !isReset.current) {
      reset(meal);
      isReset.current = true;
    }
  }, [meal, reset]);

  const { mutate } = useMutation({
    mutationFn: addEditMeal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meal", mealId] });
      toast.success("Sukces!");
      await moveBack();
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate({ meal: data, patientId, mealId, dietitianId });
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
          <div>
            <Label htmlFor="time">Godzina</Label>
            <Input id="time" type="time" required {...register("time")} />
          </div>
          <div>
            <Label htmlFor="calories">Kalorie +-</Label>
            <Input
              id="calories"
              type="number"
              required
              {...register("calories")}
            />
          </div>
          <div>
            <Label htmlFor="carbs">Węglowodany +-</Label>
            <Input id="carbs" type="number" required {...register("carbs")} />
          </div>
          <div>
            <Label htmlFor="fat">Tłuszcze +-</Label>
            <Input id="fat" type="number" required {...register("fat")} />
          </div>
          <div>
            <Label htmlFor="proteins">Białko +-</Label>
            <Input
              id="proteins"
              type="number"
              required
              {...register("proteins")}
            />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <p className="text-3xl text-primary-600 lg:text-4xl">
            Dania do wyboru dla pacjenta
          </p>
          <AddDishPopover append={append} />
        </div>
        {fields.map((field, i) => (
          <div className="flex flex-col gap-4 lg:flex-row" key={field.id}>
            <Input className="hidden" {...register(`meal_dishes.${i}.id`)} />
            <div className="grow">
              <Label htmlFor={`meal_dishes.${i}.name`}>Nazwa</Label>
              <Input
                disabled
                id={`meal_dishes.${i}.name`}
                type="text"
                required
                {...register(`meal_dishes.${i}.name`)}
              />
            </div>
            <div className="">
              <Label htmlFor={`meal_dishes.${i}.calories`}>Kalorie</Label>
              <Input
                disabled
                id={`meal_dishes.${i}.calories`}
                type="text"
                required
                {...register(`meal_dishes.${i}.calories`)}
              />
            </div>
            <div>
              <Label htmlFor={`meal_dishes.${i}.carbs`}>Węglowodany</Label>
              <Input
                disabled
                id={`meal_dishes.${i}.carbs`}
                type="text"
                required
                {...register(`meal_dishes.${i}.carbs`)}
              />
            </div>
            <div>
              <Label htmlFor={`meal_dishes.${i}.fat`}>Tłuszcze</Label>
              <Input
                disabled
                id={`meal_dishes.${i}.fat`}
                type="text"
                required
                {...register(`meal_dishes.${i}.fat`)}
              />
            </div>
            <div>
              <Label htmlFor={`meal_dishes.${i}.proteins`}>Białko</Label>
              <Input
                disabled
                id={`meal_dishes.${i}.proteins`}
                type="text"
                required
                {...register(`meal_dishes.${i}.proteins`)}
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

export default MealForm;
