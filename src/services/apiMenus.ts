import supabase from "./supabase";

export async function getMenusList() {
  const { data: menus, error } = await supabase
    .from("menus")
    .select("id, name, calories, carbs, fat, proteins");

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
      calories,
      carbs,
      fat,
      proteins,
      dishes_menus (
      name,
      calories,
      time,
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
  if (!menuId && dietitianId) {
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

    const dishesToAdd = menu.menu_meals.flatMap((meal) => {
      return meal.dishes.map((dish) => {
        return {
          menu_id: data?.id,
          dish_id: dish.id,
          name: meal.name,
          calories: meal.calories,
          time: meal.time,
        };
      });
    });

    const { error: dishes_menusError } = await supabase
      .from("dishes_menus")
      .insert(dishesToAdd)
      .select();

    if (menuError || dishes_menusError)
      throw new Error("Nie udało się dodać jadłospisu.");

    return data;
  } else if (menuId) {
    //EDIT
    const menuToEdit = {
      name: menu.name,
      calories: menu.calories,
      carbs: menu.carbs,
      fat: menu.fat,
      proteins: menu.proteins,
      dietitian_id: dietitianId,
    };
    const { error: menuError } = await supabase
      .from("menus")
      .update(menuToEdit)
      .eq("id", +menuId);

    const { error: deleteIngredientsError } = await supabase
      .from("dishes_menus")
      .delete()
      .eq("menu_id", +menuId);

    const dishesToAdd = menu.menu_meals.flatMap((meal) => {
      return meal.dishes.map((dish) => {
        return {
          menu_id: +menuId,
          dish_id: dish.id,
          name: meal.name,
          calories: meal.calories,
          time: meal.time,
        };
      });
    });

    const { error: dishes_menusError } = await supabase
      .from("dishes_menus")
      .insert(dishesToAdd);

    if (menuError || dishes_menusError || deleteIngredientsError)
      console.error(menuError || dishes_menusError || deleteIngredientsError)
      throw new Error("Nie udało się edytować jadłospisu.");
  }
}

export async function deleteMenu(id: number | number[]) {
  if (typeof id === "number") {
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) {
      console.error(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  } else {
    const { error } = await supabase.from("menus").delete().in("id", id);
    if (error) {
      console.error(error);
      throw new Error("Nie udało się usunąć pozycji");
    }
  }
}

export async function duplicateMenu(id: number) {
  const { data: menu, error: getMenuError } = await supabase
    .from("menus")
    .select(
      "dietitian_id, name, calories, carbs, fat, proteins, dishes_menus(dish_id, name, calories, time)",
    )
    .eq("id", id)
    .single();

  if (getMenuError) {
    console.error(getMenuError)
    throw new Error("Nie udało się zduplikować jadłospisu");}

  const menuToDuplicate = {
    name: menu.name,
    dietitian_id: menu.dietitian_id,
    calories: menu.calories,
    carbs: menu.carbs,
    fat: menu.fat,
    proteins: menu.proteins,
  };

  const { data, error: addMenuError } = await supabase
    .from("menus")
    .insert(menuToDuplicate)
    .select()
    .single();

  if (addMenuError) {
    console.error(addMenuError);
    throw new Error("Nie udało się zduplikować jadłospisu");
  }

  const dishesToDuplicate = menu.dishes_menus.map((menu) => {
    return { ...menu, menu_id: data.id };
  });

  const { error: addDishesError } = await supabase
    .from("dishes_menus")
    .insert(dishesToDuplicate);

  if (addDishesError) {
    console.error(addDishesError)
    throw new Error("Nie udało się zduplikować jadłospisu");}
}
