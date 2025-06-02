import supabase from "./supabase";

export async function getDishesList() {
  const { data: dishes, error } = await supabase
    .from("dishes")
    .select("id, category, group, name, calories, carbs, fat, proteins");

  if (error) throw new Error("Nie udało się pobrać listy posiłków.");

  return dishes;
}

export async function getDish(id: number | null) {
  if (!id) return;
  const { data: dish, error } = await supabase
    .from("dishes")
    .select(
      `
    name, 
    category, 
    group,
    calories, 
    carbs,
    fat,
    proteins,
    description, 
    dish_ingredients (
      quantity, 
      quantity_in_words, 
      ingredient_id (
        id,
        name, 
        category, 
        unit,
        calories,
        carbs,
        proteins,
        fat
      )
    )
  `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Wystąpił błąd");
  }

  return dish;
}

export async function addEditDish({
  dish,
  dishId,
  dietitianId,
}: {
  dish: {
    name: string;
    category: string;
    group: string;
    calories: number;
    carbs: number;
    fat: number;
    proteins: number;
    ingredients: {
      id: number;
      name: string;
      unit: string;
      category: string;
      quantity: number;
      quantity_in_words: string;
    }[];
    description: string;
  };
  dishId: string | undefined;
  dietitianId: string | undefined;
}) {
  console.log(dish);

  //ADD
  if (!dishId && dietitianId) {
    const dishToAdd = {
      name: dish.name,
      calories: dish.calories,
      category: dish.category,
      group: dish.group,
      description: dish.description,
      carbs: dish.carbs,
      fat: dish.fat,
      proteins: dish.proteins,
      dietitian_id: dietitianId,
    };

    const { data, error: dishError } = await supabase
      .from("dishes")
      .insert(dishToAdd)
      .select()
      .single();

    const ingredientsToAdd = dish.ingredients.map((ingredient) => {
      return {
        ingredient_id: ingredient.id,
        dish_id: data?.id,
        quantity: ingredient.quantity,
        quantity_in_words: ingredient.quantity_in_words,
      };
    });

    const { error: dish_ingredientsErr } = await supabase
      .from("dish_ingredients")
      .insert(ingredientsToAdd)
      .select();

    if (dishError || dish_ingredientsErr)
      throw new Error("Nie udało się dodać posiłku.");

    return data;
  } else if (dishId) {
    //EDIT
    const dishToEdit = {
      name: dish.name,
      calories: dish.calories,
      category: dish.category,
      description: dish.description,
      carbs: dish.carbs,
      fat: dish.fat,
      proteins: dish.proteins,
    };

    const { error: dishError } = await supabase
      .from("dishes")
      .update(dishToEdit)
      .eq("id", +dishId);

    const { error: deleteIngredientsError } = await supabase
      .from("dish_ingredients")
      .delete()
      .eq("dish_id", +dishId);

    const ingredientsToAdd = dish.ingredients.map((ingredient) => {
      return {
        ingredient_id: ingredient.id,
        dish_id: +dishId,
        quantity: ingredient.quantity,
        quantity_in_words: ingredient.quantity_in_words,
      };
    });

    const { error: dish_ingredientsError } = await supabase
      .from("dish_ingredients")
      .insert(ingredientsToAdd);

    if (dishError || dish_ingredientsError || deleteIngredientsError)
      throw new Error("Nie udało się edytować posiłku.");
  }
}

export async function deleteDish(id: number | number[]) {
  if (typeof id === "number") {
    const { error } = await supabase.from("dishes").delete().eq("id", id);
    if (error) {
      console.log(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  } else {
    const { error } = await supabase.from("dishes").delete().in("id", id);
    if (error) {
      console.log(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  }
}

export async function duplicateDish(id: number) {
  const { data: dish, error: getDishError } = await supabase
    .from("dishes")
    .select(
      "dietitian_id, name, description, calories, category, group, carbs, fat, proteins, dish_ingredients( ingredient_id, quantity, quantity_in_words)",
    )
    .eq("id", id)
    .single();

  if (getDishError) {
    console.error(getDishError);
    throw new Error("Nie udało się zduplikować posiłku");
  }

  const dishToDuplicate = {
    name: dish.name,
    dietitian_id: dish.dietitian_id,
    description: dish.description,
    calories: dish.calories,
    category: dish.category,
    group: dish.group,
    carbs: dish.carbs,
    fat: dish.fat,
    proteins: dish.proteins,
  };

  const { data, error: addDishError } = await supabase
    .from("dishes")
    .insert(dishToDuplicate)
    .select()
    .single();

  if (addDishError) {
    console.error(addDishError);
    throw new Error("Nie udało się zduplikować posiłku");
  }

  const ingredientsToDuplicate = dish.dish_ingredients.map((item) => {
    return { ...item, dish_id: data.id };
  });

  const { error: addIngredientsError } = await supabase
    .from("dish_ingredients")
    .insert(ingredientsToDuplicate);

  if (addIngredientsError) throw new Error("Nie udało się zduplikować posiłku");
}

export async function getUniqueCategoriesList() {
  const { data, error } = await supabase.rpc("get_unique_categories");

  if (error) {
    console.error(error);
    throw new Error("Nie udało się pobrać listy kategorii.");
  }

  return data.map((item) => {
    const objWithName = { id: item.id, name: item.category };

    return objWithName;
  });
}

export async function getUniqueGroupsList() {
  const { data, error } = await supabase.rpc("get_unique_groups");

  if (error) {
    console.error(error);
    throw new Error("Nie udało się pobrać listy grup.");
  }

  return data.map((item) => {
    const objWithName = { id: item.id, name: item.group };

    return objWithName;
  });
}
