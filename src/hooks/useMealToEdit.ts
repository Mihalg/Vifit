import { getMeal } from "@/services/apiMeals";
import { useQuery } from "@tanstack/react-query";

export function useMealToEdit(mealId: string | undefined) {
  const { data: meal, isLoading } = useQuery({
    enabled: !!mealId,
    queryKey: ["meal", mealId],
    queryFn: () => getMeal(mealId ? mealId : null),
  });

   return{meal, isLoading}
  
}
