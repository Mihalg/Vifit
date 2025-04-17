import { getDish } from "@/services/apiDishes";
import { useQuery } from "@tanstack/react-query";

export function useDishToEdit(dishId: string | undefined) {
  const { data, isLoading } = useQuery({
    enabled: !!dishId,
    queryKey: ["dish", dishId],
    queryFn: () => getDish(dishId ? +dishId : null),
  });

  if (data) {
    const mergedIngredients = data.dish_ingredients.map((ingredient) => {
      return {
        ...ingredient.ingredient_id,
        quantity: ingredient.quantity,
        quantity_in_words: ingredient.quantity_in_words,
      };
    });

    const dish = {
      name: data.name,
      calories: data.calories,
      category: data.category,
      description: data.description,
      ingredients: mergedIngredients,
      carbs: data.carbs,
      fat: data.fat,
      proteins: data.proteins,
    };

    return { dish, isLoading };
  } else return { dish: undefined, isLoading };
}
