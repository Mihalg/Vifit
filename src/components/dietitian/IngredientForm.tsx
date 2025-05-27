import useDietitianId from "@/hooks/useDietitianId";
import { useIngredientToEdit } from "@/hooks/useIngredientToEdit";
import { useMoveBack } from "@/hooks/useMoveBack";
import {
  addEditIngredient,
  getUniqueIngredientsCategories,
  getUniqueUnitsList,
} from "@/services/apiIngredients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Loader from "../ui/Loader";
import ComboInput from "../ui/ComboInput";

type FormFields = {
  name: string;
  unit: string;
  category: string;
  calories: number;
  carbs: number;
  fat: number;
  proteins: number;
};

function IngredientForm() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const { ingredientId } = useParams();

  const { ingredient, isLoading } = useIngredientToEdit(ingredientId);

  const { register, handleSubmit, reset, control } = useForm<FormFields>({
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      calories: 0,
      carbs: 0,
      fat: 0,
      proteins: 0,
    },
    values: ingredient,
  });

  const { mutate } = useMutation({
    mutationFn: addEditIngredient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ingredientsList"] });
      toast.success("Sukces!");
      await moveBack();
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate({ ingredient: data, ingredientId, dietitianId });
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
        className="grid grid-cols-1 gap-4 px-6 pb-8 pt-4 lg:grid-cols-2"
      >
        <div>
          <Label htmlFor="name">Nazwa</Label>
          <Input id="name" type="text" required {...register("name")} />
        </div>
        <div>
          <Label htmlFor="category">Kategoria</Label>
          <ComboInput
            control={control}
            register={register}
            inputId="category"
            queryFunction={getUniqueIngredientsCategories}
            queryKey="ingredientsCategories"
            defaultValue={ingredient?.category}
          />
        </div>
        <div>
          <Label htmlFor="unit">Jednostka</Label>
          <ComboInput
            control={control}
            register={register}
            inputId="unit"
            queryFunction={getUniqueUnitsList}
            queryKey="unitsList"
            defaultValue={ingredient?.unit}
          />
        </div>
        <div>
          <Label htmlFor="calories">Kalorie</Label>
          <Input
            id="calories"
            type="number"
            required
            {...register("calories")}
          />
        </div>
        <div>
          <Label htmlFor="carbs">Węglowodany</Label>
          <Input id="carbs" type="number" required {...register("carbs")} />
        </div>
        <div>
          <Label htmlFor="protiens">Białko</Label>
          <Input
            id="proteins"
            type="number"
            required
            {...register("proteins")}
          />
        </div>
        <div>
          <Label htmlFor="fat">Tłuszcz</Label>
          <Input id="fat" type="number" required {...register("fat")} />
        </div>
        <Button className="ml-auto mt-auto min-w-[100px] lg:col-start-2">
          Zapisz
        </Button>
      </form>
    </div>
  );
}

export default IngredientForm;
