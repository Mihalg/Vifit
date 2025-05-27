import supabase from "./supabase";

export async function getIngredientsList() {
  const { data: ingredients, error } = await supabase
    .from("ingredients")
    .select("id, name, unit, category, calories, carbs, fat, proteins");

  if (error) throw new Error("Wystąpił błąd");

  return ingredients;
}

export async function getIngredient(id: number | null) {
  if (!id) return;

  const { data: ingredient, error } = await supabase
    .from("ingredients")
    .select(
      "name, category, unit, dietitian_id, carbs, fat, calories, proteins",
    )
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
    calories: number;
    carbs: number;
    fat: number;
    proteins: number;
  };
  ingredientId?: string | undefined;
  dietitianId?: string | undefined;
}) {
  //ADD
  if (dietitianId) {
    const { data: existingIngredients, error: existingIngredientsError } =
      await supabase.from("ingredients").select("name");

    if (existingIngredientsError) {
      console.error(existingIngredientsError);
      throw new Error("Wystąpił błąd. Nie udało się dodać składnika");
    }
    const ingredientExists = existingIngredients
      .map((ing) => ing.name.toLowerCase())
      .includes(ingredient.name);

    if (ingredientExists) {
      throw new Error(`Składnik o nazwie "${ingredient.name}" już istnieje.`);
    }

    const { data, error } = await supabase
      .from("ingredients")
      .insert({
        ...ingredient,
        name: ingredient.name.toLowerCase(),
        dietitian_id: dietitianId,
      })
      .select()
      .single();

    if (error) throw new Error("Wystąpił błąd. Nie udało się dodać składnika.");

    return data;
  } else if (ingredientId) {
    //EDIT
    const { error } = await supabase
      .from("ingredients")
      .update(ingredient)
      .eq("id", +ingredientId);

    if (error) throw new Error("Nie udało się edytować składnika.");
  }
}

export async function duplicateIngredient(id: number) {
  const ingredient = await getIngredient(id);

  if (!ingredient) return;

  const { error: insertError } = await supabase
    .from("ingredients")
    .insert(ingredient);

  if (insertError) {
    console.error(insertError);
    throw new Error("Nie udało się zduplikować składnika");
  }
}

export async function getUniqueUnitsList() {
  const { data, error } = await supabase.rpc("get_unique_units");

  if (error) {
    console.error(error);
    throw new Error("Nie udało się pobrać listy jednostek.");
  }

  return data.map((item) => {
    const objWithName = {
      id: item.id,
      name: item.unit,
    };

    return objWithName;
  });
}
export async function getUniqueIngredientsCategories() {
  const { data, error } = await supabase.rpc(
    "get_unique_igredients_categories",
  );

  if (error) {
    console.error(error);
    throw new Error("Nie udało się pobrać listy kategorii.");
  }

  return data.map((item) => {
    const objWithName = {
      id: item.id,
      name: item.category,
    };

    return objWithName;
  });
}
