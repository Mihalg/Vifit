import { getMeal } from "@/services/apiMeals";
import { useQuery } from "@tanstack/react-query";

export function useMealToEdit(mealId: string | undefined) {
  const { data: meal, isLoading } = useQuery({
    enabled: !!mealId,
    queryKey: ["meal", mealId],
    queryFn: () => getMeal(mealId ? mealId : null),
    select: (data) => {
      if (data) {
        return {
          ...data,
          meal_dishes: data.meal_dishes.map((dish) => {
            return { ...dish.dish_id };
          }),
        };
      }
    },
  });

  return { meal, isLoading };
}
