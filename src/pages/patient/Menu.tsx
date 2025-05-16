import Loader from "@/components/ui/Loader";
import { getPatientMeals } from "@/services/apiMeals";
import { useQuery } from "@tanstack/react-query";
import MenuMeal from "../../components/patient/MenuMeal";

function Menu() {
  const { data, isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: getPatientMeals,
  });

  if (isLoading) return <Loader />;

  if (data)
    return (
      <div className="px-6 py-4 ">
        <p className="text-3xl">Jadłospis</p>
        <div className="mt-6">
          {data.map((meal, i) => (
            <MenuMeal key={i} meal={meal} />
          ))}
        </div>
      </div>
    );
}

export default Menu;
