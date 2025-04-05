import supabase from "./supabase";

export async function getIngredientsList() {
  const { data: ingredients, error } = await supabase
    .from("ingredients")
    .select("id, name, unit, category");

  if (error) throw new Error("Wystąpił błąd");

  return ingredients;
}

export async function getIngredient(id: number | null) {
  if (!id) return;

  const { data: ingredient, error } = await supabase
    .from("ingredients")
    .select("name, category, unit, dietitian_id")
    .eq("id", id)
    .single();

  if (error) throw new Error("Wystąpił błąd");

  return ingredient;
}

export async function getShoppingListIngredients() {
  const { data: ingredients, error } = await supabase
    .from("meals")
    .select(
      "meal_dishes ( dish_id ( dish_ingredients (quantity, quantity_in_words, ingredient_id(id, category, name, unit))))",
    );


  if (error) throw new Error("Nie udało się pobrać listy zakupów");

  return ingredients;
}

export async function deleteIngredient(id: number | number[]) {
  if (typeof id === "number") {
    const { error } = await supabase.from("ingredients").delete().eq("id", id);
    if (error) {
      console.log(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  } else {
    const { error } = await supabase.from("ingredients").delete().in("id", id);
    if (error) {
      console.log(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  }
}

export async function addEditIngredient({
  ingredient,
  ingredientId,
  dietitianId,
}: {
  ingredient: {
    name: string;
    category: string;
    unit: string;
  };
  ingredientId?: string | undefined;
  dietitianId?: string | undefined;
}) {
  //ADD
  if (dietitianId) {
    const { data, error } = await supabase
      .from("ingredients")
      .insert({ ...ingredient, dietitian_id: dietitianId })
      .select()
      .single();

    if (error) throw new Error("Nie udało się dodać składnika.");

    return data;
  } else if (ingredientId) {
    const { error } = await supabase
      .from("ingredients")
      .update(ingredient)
      .eq("id", +ingredientId);

    if (error) throw new Error("Nie udało się dodać składnika.");
  }
}

export async function duplicateIngredient(id: number) {
  const ingredient = await getIngredient(id);

  if (!ingredient) return;

  const { error: insertError } = await supabase
    .from("ingredients")
    .insert(ingredient);

  if (insertError) throw new Error("Wystąpił błąd");
}
