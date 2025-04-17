import useDietitianId from "@/hooks/useDietitianId";
import useMenuToEdit from "@/hooks/useMenuToEdit";
import { useMoveBack } from "@/hooks/useMoveBack";
import { addEditMenu } from "@/services/apiMenus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MinusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Control,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import Loader from "../ui/Loader";
import AddDishPopover from "./AddDishPopover";

type FormFields = {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  proteins: number;
  menu_meals: {
    name: string;
    calories: number;
    time: string;
    dishes: {
      id: number | undefined;
      category: string;
      name: string;
      calories: number;
      carbs: number;
      fat: number;
      proteins: number;
    }[];
  }[];
};

export default function MenusForm() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const moveBack = useMoveBack();
  const { menuId } = useParams();
  const { menu, isLoading } = useMenuToEdit(menuId);

  const { register, handleSubmit, control, reset } = useForm<FormFields>({
    defaultValues: {
      name: "",
      calories: 0,
      carbs: 0,
      fat: 0,
      proteins: 0,
      menu_meals: [
        {
          name: "",
          calories: 0,
          time: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menu_meals",
  });

  {
    const isReset = useRef(false);

    useEffect(() => {
      if (menu && !isReset.current) {
        reset(menu);
        isReset.current = true;
      }
    }, [menu, reset]);

    const { mutate } = useMutation({
      mutationFn: addEditMenu,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["menus"] });
        toast.success("Sukces!");
        await moveBack();
        reset();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
    
    const onSubmit: SubmitHandler<FormFields> = (data) => {
      mutate({ menu: data, menuId, dietitianId });
    };

    if (isLoading) return <Loader />;

    return (
      <div className="xl:max-h-screen overflow-y-auto">
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
          className="flex flex-col gap-4 px-6 py-4 pb-8 h-full"
        >
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div>
              <Label htmlFor="name">Nazwa</Label>
              <Input id="name" type="text" required {...register("name")} />
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
            <p className="text-3xl text-primary-600 lg:text-4xl">Posiłki</p>
          </div>
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="flex flex-col gap-6 rounded-md border px-4 py-4 shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="grow">
                  <Label htmlFor={`menu_meals.${i}.name`}>Nazwa</Label>
                  <Input
                    id={`meal_dishes.${i}.name`}
                    type="text"
                    required
                    {...register(`menu_meals.${i}.name`)}
                  />
                </div>
                <div className="">
                  <Label htmlFor={`menu_meals.${i}.calories`}>Kalorie</Label>
                  <Input
                    id={`meal_dishes.${i}.calories`}
                    type="text"
                    required
                    {...register(`menu_meals.${i}.calories`)}
                  />
                </div>
                <div>
                  <Label htmlFor={`menu_meals.${i}.time`}>Godzina</Label>
                  <Input
                    id={`menu_meals.${i}.time`}
                    type="time"
                    required
                    {...register(`menu_meals.${i}.time`)}
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
              <NestedDishesForm
                mealIndex={i}
                register={register}
                control={control}
              />
            </div>
          ))}
          <Button
            onClick={(e) => {
              e.preventDefault();
              append({
                name: "",
                calories: 0,
                time: "",
                dishes: [],
              });
            }}
          >
            Dodaj posiłek +
          </Button>

          {fields.length > 0 && (
            <Button className="ml-auto min-w-[100px]">Zapisz</Button>
          )}
        </form>
      </div>
    );
  }
}

function NestedDishesForm({
  mealIndex,
  register,
  control,
}: {
  mealIndex: number;
  register: UseFormRegister<FormFields>;
  control: Control<FormFields>;
}) {
  const {
    fields: dishesFields,
    append: appendDish,
    remove: removeDish,
  } = useFieldArray({
    control,
    name: `menu_meals.${mealIndex}.dishes`,
  });

  return (
    <div className="flex flex-col">
      <div className="flex gap-6">
        <p className="text-xl text-primary-600 lg:text-2xl">
          Pozycje wchodzące w skład posiłku
        </p>
        <AddDishPopover append={appendDish} />
      </div>

      <div className="mt-4 space-y-2">
        {dishesFields.map((field, i) => (
          <div className="flex flex-col gap-4 lg:flex-row" key={field.id}>
            <Input
              className="hidden"
              {...register(`menu_meals.${mealIndex}.dishes.${i}.id`)}
            />
            <div className="grow">
              <Label htmlFor={`menu_meals.${mealIndex}.dishes.${i}.name`}>
                Nazwa
              </Label>
              <Input
                disabled
                id={`menu_meals.${mealIndex}.dishes.${i}.name`}
                type="text"
                required
                {...register(`menu_meals.${mealIndex}.dishes.${i}.name`)}
              />
            </div>
            <div className="">
              <Label htmlFor={`menu_meals.${mealIndex}.dishes.${i}.calories`}>
                Kalorie
              </Label>
              <Input
                disabled
                id={`menu_meals.${mealIndex}.dishes.${i}.calories`}
                type="text"
                required
                {...register(`menu_meals.${mealIndex}.dishes.${i}.calories`)}
              />
            </div>
            <div>
              <Label htmlFor={`menu_meals.${mealIndex}.dishes.${i}.carbs`}>
                Węglowodany
              </Label>
              <Input
                disabled
                id={`menu_meals.${mealIndex}.dishes.${i}.carbs`}
                type="text"
                required
                {...register(`menu_meals.${mealIndex}.dishes.${i}.carbs`)}
              />
            </div>
            <div>
              <Label htmlFor={`menu_meals.${mealIndex}.dishes.${i}.fat`}>
                Tłuszcze
              </Label>
              <Input
                disabled
                id={`menu_meals.${mealIndex}.dishes.${i}.fat`}
                type="text"
                required
                {...register(`menu_meals.${mealIndex}.dishes.${i}.fat`)}
              />
            </div>
            <div>
              <Label htmlFor={`menu_meals.${mealIndex}.dishes.${i}.proteins`}>
                Białko
              </Label>
              <Input
                disabled
                id={`menu_meals.${mealIndex}.dishes.${i}.proteins`}
                type="text"
                required
                {...register(`menu_meals.${mealIndex}.dishes.${i}.proteins`)}
              />
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                removeDish(i);
              }}
              className="ml-auto mt-[13px] w-[50px] self-end"
            >
              <MinusIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
