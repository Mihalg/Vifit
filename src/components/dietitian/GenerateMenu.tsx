import { useMoveBack } from "@/hooks/useMoveBack";
import { UsePatientData } from "@/hooks/usePatientData";
import {
  AddGeneratedMenu,
  GeminiResponse,
  generateMenu,
} from "@/services/apiGemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Loader from "../ui/Loader";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { capitalize, formatTime } from "@/lib/utils";
import useDietitianId from "@/hooks/useDietitianId";

type Meal = {
  name: string;
  calories: number;
  time: string;
  dishes?: {
    name: string;
    group: string;
    category: string;
    calories: number;
    description: string;
    macronutrients: {
      carbs: number;
      fat: number;
      proteins: number;
    };
    ingredients: {
      name: string;
      category: string;
      quantity: string;
      quantityInWords: string;
      calories: number;
      macronutrients: {
        carbs: number;
        fat: number;
        proteins: number;
      };
    }[];
  }[];
};

type FormFields = {
  nameOfMenu: string;
  numberOfMeals: number;
  excludedIngredients: string;
  goal: string;
  diseases: string;
  age: number;
  height: number;
  weight: number;
  sex: string;
  pal: number;
};

export default function GenerateMenu() {
  const { patientId } = useParams();
  const { patientData, isLoading } = UsePatientData(patientId);
  const moveBack = useMoveBack();
  const [geminiRes, setGeminiRes] = useState<GeminiResponse | null>(null);
  const { register, handleSubmit, reset } = useForm<FormFields>({
    values: patientData
      ? {
          ...patientData,
          nameOfMenu: "",
          numberOfMeals: 3,
          excludedIngredients: "",
          goal: "",
          diseases: "",
        }
      : {
          nameOfMenu: "",
          numberOfMeals: 3,
          excludedIngredients: "",
          goal: "",
          diseases: "",
          age: 0,
          height: 0,
          weight: 0,
          sex: "female",
          pal: 1.2,
        },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: generateMenu,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const res = await toast.promise(mutateAsync(data), {
      loading: "Generowanie jadłospisu...",
      success: "Sukces!",
      error: (err: Error) => err.message,
    });
    setGeminiRes(res);
  };

  if (isLoading) return <Loader />;

  return geminiRes !== null ? (
    <GeneratedMenuPresentation menu={geminiRes} patientId={patientId} />
  ) : (
    <div className="relative px-4 xl:max-h-screen">
      <Button
        className="mt-4"
        onClick={() => {
          void moveBack();
        }}
      >
        <ArrowLeft /> Powrót
      </Button>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-4 py-4 pb-8"
      >
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="nameOfMenu">Nazwa jadłospisu</Label>
            <Input
              id="nameOfMenu"
              type="text"
              required
              {...register("nameOfMenu")}
              disabled={isPending}
            />
          </div>
          <div className="mt-auto flex shrink flex-col space-y-1 pt-1">
            <Label htmlFor="numberOfMeals">Liczba posiłków</Label>
            <select
              disabled={isPending}
              {...register("numberOfMeals")}
              id="numberOfMeals"
              className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 dark:border-none dark:border-neutral-800 dark:bg-neutral-600 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="mt-auto flex shrink flex-col space-y-1 pt-1">
            <Label htmlFor="sex">Płeć</Label>
            <select
              disabled={isPending}
              {...register("sex")}
              id="sex"
              className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 dark:border-none dark:border-neutral-800 dark:bg-neutral-600 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            >
              <option value={"female"}>Kobieta</option>
              <option value={"male"}>Mężczyzna</option>
            </select>
          </div>
          <div>
            <Label htmlFor="age">Wiek</Label>
            <Input
              id="age"
              type="number"
              required
              {...register("age")}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="weight">Waga</Label>
            <Input
              id="weight"
              type="number"
              required
              {...register("weight")}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="height">Wzrost</Label>
            <Input
              id="height"
              type="number"
              required
              {...register("height")}
              disabled={isPending}
            />
          </div>
          <div className="mt-auto flex shrink flex-col space-y-1 pt-1">
            <Label htmlFor="pal">Współczynnik aktywności fizycznej</Label>
            <select
              disabled={isPending}
              {...register("pal")}
              id="pal"
              className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 dark:border-none dark:border-neutral-800 dark:bg-neutral-600 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            >
              <option value={1.2}>
                Brak aktywności fizycznej, siedziący tryb życia
              </option>
              <option value={1.4}>
                Niska aktywność fizyczna, niewielki ruch
              </option>
              <option value={1.6}>
                Średnia aktywność, np. 2-3 treningi w tygodniu
              </option>
              <option value={1.8}>
                Wysoka aktywność fizyczna, regularne treningi
              </option>
              <option value={2}>
                Bardzo wysoka aktywność, praca fizyczna lub zawodowy sport
              </option>
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
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="excludedIngredients">Wykluczone składniki</Label>
            <Input
              placeholder="np. orzechy, mleko..."
              id="excludedIngredients"
              type="text"
              {...register("excludedIngredients")}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="diseases">Choroby</Label>
            <Input
              placeholder="np. cukrzyca, nadciśnienie..."
              id="diseases"
              type="text"
              {...register("diseases")}
              disabled={isPending}
            />
          </div>
        </div>
        <Button disabled={isPending} className="ml-auto min-w-[100px]">
          Generuj
        </Button>
      </form>
    </div>
  );
}

function GeneratedMenuPresentation({
  menu,
  patientId,
}: {
  menu: GeminiResponse;
  patientId: string | undefined;
}) {
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: AddGeneratedMenu,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meals", patientId] });
      await moveBack();
    },
  });

  function onSubmit() {
    void toast.promise(mutateAsync({ menu, dietitianId, patientId }), {
      loading: "Zapisywanie jadłospisu...",
      success: "Sukces!",
      error: (err: Error) => err.message,
    });
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-wrap gap-6 pb-4 text-2xl">
        <p>{menu.name}</p>
        <p>{menu.calories} Kcal</p>
        <p>Węglowodany: {menu.macronutrients.carbs}</p>
        <p>Białko: {menu.macronutrients.proteins}</p>
        <p>Tłuszcz: {menu.macronutrients.fat}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {menu.meals.map((meal, i) => (
          <MenuMeal meal={meal} key={i} />
        ))}
      </div>

      <Button disabled={isPending} onClick={onSubmit}>
        Zapisz
      </Button>
    </div>
  );
}

function MenuMeal({ meal }: { meal: Meal }) {
  const ref = useOutsideClick(() => {
    setIsModalOpen(false);
  });

  const [selectedDish, setSelectedDish] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex">
      <div
        className={`${isModalOpen ? "absolute" : "hidden"} left-0 top-0 z-10 h-full w-full bg-black/40`}
      >
        <div
          ref={ref}
          className={`absolute left-1/2 top-1/2 flex max-h-[75%] w-3/4 -translate-x-1/2 -translate-y-1/2 flex-col items-start rounded-md bg-secondary-50 px-8 py-4 dark:border-none dark:bg-secondary-500 lg:w-fit`}
        >
          <div className="w-full divide-y-2 divide-primary-600 overflow-y-auto">
            {meal.dishes?.map((dish, i) => (
              <button
                className="w-full px-2 py-2 text-left text-lg transition-colors hover:bg-primary-600 hover:text-white"
                key={i}
                onClick={() => {
                  setSelectedDish(i);
                  setIsModalOpen(false);
                }}
              >
                {dish.name}
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              setIsModalOpen((open) => !open);
            }}
            className="ml-auto mt-4"
          >
            Zamknij
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-secondary-100 px-4 py-4 dark:bg-secondary-400">
        <div className="flex flex-col items-center gap-4 text-3xl md:flex-row">
          <div className="flex gap-4">
            <p>{capitalize(meal.name)}</p>
            <p>{formatTime(meal.time)}</p>
          </div>
          <Button
            onClick={() => {
              setIsModalOpen((open) => !open);
            }}
            className="w-full md:w-fit lg:ml-10"
          >
            Lista dań
          </Button>
        </div>

        <div>
          <p className="my-3 text-2xl text-primary-600 dark:text-primary-50">
            {meal.dishes?.at(selectedDish)?.name}
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:justify-between">
            <div>
              <p className="mb-1 text-lg">Składniki:</p>
              {meal.dishes
                ?.at(selectedDish)
                ?.ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="mb-2 flex justify-between border-l-2 border-primary-600 py-1 pl-2"
                  >
                    <p>{capitalize(ingredient.name)}</p>
                    <p>{ingredient.quantity}</p>
                    <p>{ingredient.quantityInWords}</p>
                  </div>
                ))}
            </div>
            <div>
              <p className="mb-1 text-lg">Przygotowanie:</p>
              <p className="border-l-2 border-primary-600 pl-2">
                {meal.dishes?.at(selectedDish)?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
