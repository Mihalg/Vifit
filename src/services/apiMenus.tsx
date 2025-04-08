import supabase from "./supabase";

export async function getMenusList() {
  const { data: menus, error } = await supabase
    .from("menus")
    .select("id, name, calories");

  if (error) throw new Error("Nie udało się pobrać listy jadłospisów.");

  return menus;
}

export async function getMenu(id: number | null) {
  if (!id) return;
  const { data: menu, error } = await supabase
    .from("menus")
    .select(
      `
      name, 
      dishes_menus (
        dish_id (
          id,
          name, 
          category, 
          calories,
          carbs,
          fat,
          proteins
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

  return menu;
}

export async function addEditMenu({
  menu,
  menuId,
  dietitianId,
}: {
  menu: {
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    proteins: number;
    menu_meals: {
      name: string;
      calories: number;
      time: string;
      dishes: {
        id: number | undefined;
        category: string;
        name: string;
        calories: number;
        carbs: number;
        fat: number;
        proteins: number;
      }[];
    }[];
  };
  menuId: string | undefined;
  dietitianId: string | undefined;
}) {
  //ADD
  if (!dishId && dietitianId) {
    const menuToAdd = {
      name: menu.name,
      calories: menu.calories,
      carbs: menu.carbs,
      fat: menu.fat,
      proteins: menu.proteins,
      dietitian_id: dietitianId,
    };

    const { data, error: menuError } = await supabase
      .from("menus")
      .insert(menuToAdd)
      .select()
      .single();

    const dishesToAdd = menu.menu_meals.map((meal) => {
      return {
        ingredient_id: meal.id,
        dish_id: ?.id,
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

export async function deleteMenu(id: number | number[]) {
  if (typeof id === "number") {
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) {
      console.log(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  } else {
    const { error } = await supabase.from("menus").delete().in("id", id);
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
      "dietitian_id, name, description, calories, category, carbs, fat, proteins, dish_ingredients(dish_id, ingredient_id, quantity, quantity_in_words)",
    )
    .eq("id", id)
    .single();

  if (getDishError) throw new Error("Nie udało się zduplikować posiłku");

  const dishToDuplicate = {
    name: dish.name,
    dietitian_id: dish.dietitian_id,
    description: dish.description,
    calories: dish.calories,
    category: dish.category,
    carbs: dish.carbs,
    fat: dish.fat,
    proteins: dish.proteins,
  };

  const { error: addDishError } = await supabase
    .from("dishes")
    .insert(dishToDuplicate);

  if (addDishError) {
    console.log(addDishError);
    throw new Error("Nie udało się zduplikować posiłku");
  }

  const ingredientsToDuplicate = dish.dish_ingredients;

  const { error: addIngredientsError } = await supabase
    .from("dish_ingredients")
    .insert(ingredientsToDuplicate);

  if (addIngredientsError) throw new Error("Nie udało się zduplikować posiłku");
}
