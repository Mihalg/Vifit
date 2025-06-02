import { UseDarkModeContext } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import useDietitianId from "@/hooks/useDietitianId";
import { formatTime } from "@/lib/utils";
import { addPatientMenu, getMealsList } from "@/services/apiMeals";
import { getMenusList } from "@/services/apiMenus";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

export default function PatientMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { patientId, mealId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["meals", patientId],
    queryFn: () => getMealsList(patientId),
  });

  if (
    pathname.includes("nowy-posi%C5%82ek") ||
    pathname.includes("generuj-nowy") ||
    mealId
  )
    return <Outlet />;

  if (isLoading) return <Loader />;

  return (
    <div className="px-4 py-4">
      <div className="flex gap-4">
        <Button
          onClick={() => {
            void navigate("generuj-nowy");
          }}
        >
          Wygeneruj nowy <Sparkles />
        </Button>
        <SelectMenuPopover patientId={patientId} />
      </div>
      {data ? (
        <div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
          {data.map((meal, i) => {
            return (
              <Link
                to={String(meal.id)}
                key={i}
                className="flex flex-col gap-4 rounded-md bg-secondary-100 px-6 py-2 text-xl shadow-md transition-colors hover:bg-secondary-200 dark:bg-secondary-400 dark:text-white dark:hover:bg-secondary-500"
              >
                <div className="flex justify-between border-b border-b-primary-600 py-1 text-xl">
                  <p>{meal.name}</p>
                  <p>Godzina: {formatTime(meal.time)}</p>
                  <p>{meal.calories} kcal</p>
                </div>
                <div className="space-y-1">
                  {meal.meal_dishes.map((dish) => {
                    return (
                      <div
                        key={dish.dish_id.id}
                        className="flex justify-between text-lg"
                      >
                        <p className="max-w-[70%] overflow-clip text-ellipsis text-nowrap">
                          {dish.dish_id.name}
                        </p>
                        <p>{dish.dish_id.calories} kcal</p>
                      </div>
                    );
                  })}
                </div>
              </Link>
            );
          })}
          <Link
            className="col-start-1 rounded-md bg-primary-600 px-2 py-2 text-center font-medium text-white transition-colors hover:bg-primary-800 lg:col-end-3"
            to="nowy-posiłek"
          >
            Dodaj nowy posiłek
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function SelectMenuPopover({ patientId }: { patientId: string | undefined }) {
  const [searchBar, setSearchBar] = useState("");
  const dietitianId = useDietitianId();
  const queryClient = useQueryClient();
  const { isDarkModeOn } = UseDarkModeContext();

  const { data: menus } = useQuery({
    queryKey: ["menusList"],
    queryFn: getMenusList,
  });

  const { mutateAsync } = useMutation({
    mutationFn: addPatientMenu,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["meals", patientId] });
    },
  });

  return (
    <Popover modal={true}>
      <PopoverTrigger className="text-primary-950 mx-4 my-2 flex w-fit items-end gap-1 text-lg md:text-xl">
        <span>Wybierz gotowy jadłospis</span>
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent
        className={`w-[350px] md:w-[400px] lg:w-[500px] ${isDarkModeOn ? "text-secondary-100" : ""}`}
      >
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
          <div className="grid grid-cols-[200px_1fr_0.5fr_0.5fr_0.5fr] gap-1 rounded-sm px-2 py-1 text-center">
            <span className="text-left">Nazwa</span>
            <span>Kcal</span>
            <span>W</span>
            <span>T</span>
            <span>B</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {menus?.map((menu, i) => {
              if (menu.name.toLowerCase().includes(searchBar.toLowerCase())) {
                return (
                  <PopoverClose
                    onClick={() => {
                      void toast.promise(
                        mutateAsync({
                          menuId: menu.id,
                          patientId,
                          dietitianId,
                        }),
                        {
                          loading: "Ładowanie...",
                          success: "Sukces",
                          error: "Nie udało się przypisać jadłospisu.",
                        },
                      );
                    }}
                    title={menu.name}
                    key={i}
                    className={`grid w-full cursor-pointer grid-cols-[200px_1fr_0.5fr_0.5fr_0.5fr] gap-1 rounded-sm px-2 py-1 text-center transition-colors ${isDarkModeOn ? "hover:bg-secondary-300" : "hover:bg-primary-50"}`}
                  >
                    <span className="overflow-clip text-ellipsis text-nowrap text-start">
                      {menu.name}
                    </span>
                    <span>{menu.calories}</span>
                    <span>{menu.carbs}</span>
                    <span>{menu.fat}</span>
                    <span>{menu.proteins}</span>
                  </PopoverClose>
                );
              }
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
