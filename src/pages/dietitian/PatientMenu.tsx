import { UseDarkModeContext } from "@/components/ThemeProvider";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import useDietitianId from "@/hooks/useDietitianId";
import { convertTime } from "@/lib/utils";
import { addPatientMenu, getMealsList } from "@/services/apiMeals";
import { getMenusList } from "@/services/apiMenus";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useParams } from "react-router";

export default function PatientMenu() {
  const { pathname } = useLocation();
  const { patientId, mealId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["meals", patientId],
    queryFn: () => getMealsList(patientId),
  });

  if (pathname.includes("nowy-posi%C5%82ek") || mealId) return <Outlet />;

  if (isLoading) return <Loader />;

  return (
    <>
      <SelectMenuPopover patientId={patientId} />
      {data ? (
        <div className="grid grid-cols-1 gap-4 px-4 py-2">
          {data.map((meal, i) => {
            return (
              <Link
                to={String(meal.id)}
                key={i}
                className="flex justify-around gap-4 rounded-md bg-secondary-400 px-2 py-2 text-center text-xl text-white transition-colors hover:bg-secondary-500"
              >
                <p>{meal.name}</p>
                <p>Godzina: {convertTime(meal.time)}</p>
                <p>Kcal: {meal.calories}</p>
              </Link>
            );
          })}
          <Link
            className="rounded-md bg-primary-600 px-2 py-2 text-center font-medium text-white transition-colors hover:bg-primary-800"
            to="nowy-posiłek"
          >
            Dodaj nowy posiłek
          </Link>
        </div>
      ) : null}
    </>
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
      <PopoverTrigger className="text-primary-950 w-fit mx-4 my-2 flex items-end gap-1 text-lg md:text-xl">
        <span>Wybierz gotowy jadłospis</span>
        <ChevronDown />
      </PopoverTrigger>
      <PopoverContent
        className={`w-[350px] lg:w-[500px] ${isDarkModeOn ? "text-secondary-100" : ""}`}
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
          <div className="flex w-full items-center justify-between rounded-sm px-2 py-1">
            <span className="w-[150px]">Nazwa</span>
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
                    className={`flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1 transition-colors ${isDarkModeOn ? "hover:bg-secondary-300" : "hover:bg-primary-50"}`}
                  >
                    <span className="w-[150px] overflow-clip text-ellipsis text-nowrap text-start">
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
