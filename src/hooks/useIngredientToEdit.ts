import { getIngredient } from "@/services/apiIngredients";
import { useQuery } from "@tanstack/react-query";

export function useIngredientToEdit(ingredientId: string | undefined) {
  const { data, isLoading } = useQuery({
    enabled: !!ingredientId,
    queryKey: ["ingredient", ingredientId],
    queryFn: () => getIngredient(ingredientId ? +ingredientId : null),
  });

  return { ingredient: data, isLoading };
}
