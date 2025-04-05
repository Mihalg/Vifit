import Loader from "@/components/ui/Loader";
import { convertTime } from "@/lib/utils";
import { getMealsList } from "@/services/apiMeals";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useParams } from "react-router";

function PatientMenu() {
  const { pathname } = useLocation();
  const { patientId, mealId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["meals", patientId],
    queryFn: () => getMealsList(patientId),
  });

  if (pathname.includes("nowy-posi%C5%82ek") || mealId) return <Outlet />;

  if (isLoading) return <Loader />;

  if (data)
    return (
      <div className="grid grid-cols-1 gap-4 px-4 py-2">
        {data.map((meal, i) => {
          return (
            <Link
              to={String(meal.id)}
              key={i}
              className="grid grid-cols-1 gap-4 rounded-md bg-primary-600 px-2 py-2 text-center text-xl text-white transition-colors hover:bg-primary-800 lg:grid-cols-2"
            >
              <div className="flex justify-around">
                <p>{meal.name}</p>
                <p>Godzina: {convertTime(meal.time)}</p>
                <p>Kcal: {meal.calories}</p>
              </div>
              <div className="flex justify-around">
                <p>W: {meal.carbs}</p>
                <p>T: {meal.fat}</p>
                <p>B: {meal.proteins}</p>
              </div>
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
    );
}

export default PatientMenu;
