import useDietitianId from "@/hooks/useDietitianId";
import { useIngredientToEdit } from "@/hooks/useIngredientToEdit";
import { useMoveBack } from "@/hooks/useMoveBack";
import { addEditIngredient } from "@/services/apiIngredients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Loader from "../ui/Loader";

type FormFields = {
  name: string;
  unit: string;
  category: string;
};

function IngredientForm() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const { ingredientId } = useParams();

  const { ingredient, isLoading } = useIngredientToEdit(
    ingredientId ? +ingredientId : null,
  );

  const { register, handleSubmit, reset } = useForm<FormFields>({
    defaultValues: {
      name: "",
      category: "",
      unit: "",
    },
  });

  const isReset = useRef(false);

  useEffect(() => {
    if (ingredient && !isReset.current) {
      reset(ingredient);
      isReset.current = true;
    }
  }, [ingredient, reset]);

  const { mutate } = useMutation({
    mutationFn: addEditIngredient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ingredients"] });
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
        className="flex flex-col gap-4 px-6 pb-8 pt-4"
      >
        <div>
          <Label htmlFor="name">Nazwa</Label>
          <Input id="name" type="text" required {...register("name")} />
        </div>
        <div className="col-start-1">
          <Label htmlFor="category">Kategoria</Label>
          <Input id="category" type="text" required {...register("category")} />
        </div>
        <div className="col-start-1">
          <Label htmlFor="unit">Jednostka</Label>
          <Input id="unit" type="text" required {...register("unit")} />
        </div>

        <Button className="ml-auto min-w-[100px]">Zapisz</Button>
      </form>
    </div>
  );
}

export default IngredientForm;
