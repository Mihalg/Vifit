import { getIngredient } from "@/services/apiIngredients";
import { useQuery } from "@tanstack/react-query";

export function useIngredientToEdit(ingredientId: number | null) {
  const { data, isLoading } = useQuery({
    enabled: !!ingredientId,
    queryKey: ["ingredient", ingredientId],
    queryFn: () => getIngredient(ingredientId ),
  });

  return { ingredient: data, isLoading };
}
