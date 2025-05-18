import { useMoveBack } from "@/hooks/useMoveBack";
import { generateMenu } from "@/services/apiGemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

type FormFields = {
  name: string;
  numberOfMeals: number;
  excludedIngredients: string;
  goal: string;
  diseases: string;
};

export default function GenerateMenu() {
  const queryClient = useQueryClient();
  //   const dietitianId = useDietitianId();
  const moveBack = useMoveBack();

  const { register, handleSubmit, reset } = useForm<FormFields>({
    defaultValues: {
      name: "",
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: generateMenu,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["menusList"] });
      await moveBack();
      reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const res = await toast.promise(mutateAsync(data), {
      loading: "Generowanie jadłospisu...",
      success: "Sukces!",
      error: (err: Error) => err.message,
    });
    if (res) console.log(res.text);
  };

  return (
    <div className="overflow-y-auto xl:max-h-screen">
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
        className="flex h-full flex-col gap-4 px-6 py-4 pb-8"
      >
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-6">
          <div>
            <Label htmlFor="name">Nazwa</Label>
            <Input id="name" type="text" required {...register("name")} />
          </div>

          <div className="mt-auto flex shrink flex-col space-y-1 pt-1">
            <Label htmlFor="numberOfMeals">Liczba posiłków</Label>
            <select
              {...register("numberOfMeals")}
              id="numberOfMeals"
              className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 dark:border-none dark:border-neutral-800 dark:bg-neutral-600 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
          <div>
            <Label htmlFor="goal">Cel</Label>
            <Input
              placeholder="np. Utrata wagi przy umiarkowanej aktywności fizycznej"
              id="goal"
              type="text"
              required
              {...register("goal")}
            />
          </div>
          <div>
            <Label htmlFor="excludedIngredients">Wykluczone składniki</Label>
            <Input
              placeholder="np. orzechy, mleko..."
              id="excludedIngredients"
              type="text"
              {...register("excludedIngredients")}
            />
          </div>
          <div>
            <Label htmlFor="diseases">Choroby</Label>
            <Input
              placeholder="np. cukrzyca, nadciśnienie..."
              id="diseases"
              type="text"
              {...register("diseases")}
            />
          </div>
        </div>
        <Button className="ml-auto min-w-[100px]">Generuj</Button>
      </form>
    </div>
  );
}
