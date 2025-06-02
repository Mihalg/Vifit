import { formatTime } from "@/lib/utils";
import supabase from "./supabase";

export type GeminiResponse = {
  name: string;
  calories: number;
  macronutrients: {
    carbs: number;
    fat: number;
    proteins: number;
  };
  meals: {
    name: string;
    calories: number;
    time: string;
    dishes: {
      name: string;
      group: string;
      category: string;
      calories: number;
      description: string;
      macronutrients: {
        carbs: number;
        fat: number;
        proteins: number;
      };
      ingredients: {
        name: string;
        category: string;
        quantity: string;
        unit: string;
        quantityInWords: string;
        calories: number;
        macronutrients: {
          carbs: number;
          fat: number;
          proteins: number;
        };
      }[];
    }[];
  }[];
};

export async function generateMenu(menuData: {
  nameOfMenu: string;
  numberOfMeals: number;
  excludedIngredients: string;
  goal: string;
  diseases: string;
  age: number;
  height: number;
  weight: number;
  sex: string;
  pal: number;
}) {
  const query = Object.entries(menuData)
    .map((item) => `${item[0]}: ${item[1]}`)
    .join("\n");

  const res = await supabase.functions.invoke<GeminiResponse>(
    "generate-meal-plan",
    {
      body: { query },
    },
  );

  if (res.error) {
    console.error(res.error);
    throw new Error(
      "Nie udało się stworzyć jadłospisu. Spróbuj ponownie później",
    );
  }

  if (res.data?.name) res.data.name = menuData.nameOfMenu;
  return res.data;
}

export async function AddGeneratedMenu({
  menu,
  dietitianId,
  patientId,
}: {
  menu: GeminiResponse;
  dietitianId: string | undefined;
  patientId: string | undefined;
}) {
  if (!dietitianId || !patientId)
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");

  const { data: insertedMenu, error: menusError } = await supabase
    .from("menus")
    .insert({
      dietitian_id: dietitianId,
      name: menu.name,
      calories: menu.calories,
      carbs: menu.macronutrients.carbs,
      proteins: menu.macronutrients.proteins,
      fat: menu.macronutrients.fat,
    })
    .select()
    .single();

  if (menusError) {
    console.error(menusError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const mealsToAdd = menu.meals.map((meal) => {
    return {
      dietitian_id: dietitianId,
      patient_id: patientId,
      name: meal.name,
      time: meal.time,
      calories: meal.calories,
    };
  });

  const { error: deleteMealsError } = await supabase
    .from("meals")
    .delete()
    .eq("patient_id", +patientId);

  if (deleteMealsError) {
    console.error(deleteMealsError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const { data: insertedMeals, error: mealsError } = await supabase
    .from("meals")
    .insert(mealsToAdd)
    .select();

  if (mealsError) {
    console.error(mealsError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const dishesToAdd = menu.meals.flatMap((meal) =>
    meal.dishes.map((dish) => {
      return {
        dietitian_id: dietitianId,
        name: dish.name,
        description: dish.description,
        calories: dish.calories,
        category: dish.category,
        group: dish.group,
        carbs: dish.macronutrients.carbs,
        proteins: dish.macronutrients.proteins,
        fat: dish.macronutrients.fat,
      };
    }),
  );

  const { data: insertedDishes, error: dishesError } = await supabase
    .from("dishes")
    .insert(dishesToAdd)
    .select();

  if (dishesError) {
    console.error(dishesError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const { data: ingredientsNames, error: ingredientsNamesError } =
    await supabase.from("ingredients").select("id, name");

  if (ingredientsNamesError) {
    console.error(ingredientsNamesError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const ingredientsToAdd = menu.meals.flatMap((meal) =>
    meal.dishes.flatMap((dish) =>
      dish.ingredients.map((ingredient) => {
        return {
          dietitian_id: dietitianId,
          name: ingredient.name,
          category: ingredient.category,
          unit: ingredient.unit,
          calories: ingredient.calories,
          carbs: ingredient.macronutrients.carbs,
          proteins: ingredient.macronutrients.proteins,
          fat: ingredient.macronutrients.fat,
        };
      }),
    ),
  );

  const existingIngredientNames = new Set(
    ingredientsNames.map((ing) => ing.name.toLowerCase()),
  );

  const seenNewIngredientNames = new Set<string>();

  const uniqueIngredients = ingredientsToAdd.filter((ingredient) => {
    const nameLower = ingredient.name.toLowerCase();
    if (existingIngredientNames.has(nameLower)) return false;
    if (seenNewIngredientNames.has(nameLower)) return false;
    seenNewIngredientNames.add(nameLower);
    return true;
  });

  const { data: insertedIngredients, error: ingredientsError } = await supabase
    .from("ingredients")
    .insert(uniqueIngredients)
    .select();

  if (ingredientsError) {
    console.error(ingredientsError);
    throw new Error("Wystąpił błąd. Spróbuj ponownie później");
  }

  const allIngredients = [...ingredientsNames, ...insertedIngredients];

  const relations = createRelations({
    menu,
    menuId: insertedMenu.id,
    insertedMeals,
    insertedDishes,
    allIngredients,
  });

  const { error: dishIngredientsError } = await supabase
    .from("dish_ingredients")
    .insert(relations.dishIngredients);
  const { error: mealDishes } = await supabase
    .from("meal_dishes")
    .insert(relations.mealDishes);
  const { error: dishesMenus } = await supabase
    .from("dishes_menus")
    .insert(relations.dishesMenus);

  if (dishIngredientsError || mealDishes || dishesMenus) {
    console.error(dishIngredientsError, mealDishes, dishesMenus);
    throw new Error("Wystąpił bład...");
  }
}

type InsertedDish = {
  id: number;
  name: string;
};

type InsertedMeal = {
  id: number;
  name: string;
  time: string;
};

type InsertedIngredient = {
  id: number;
  name: string;
};

export function createRelations({
  menu,
  menuId,
  insertedMeals,
  insertedDishes,
  allIngredients,
}: {
  menu: GeminiResponse;
  menuId: number;
  insertedMeals: InsertedMeal[];
  insertedDishes: InsertedDish[];
  allIngredients: InsertedIngredient[];
}) {
  const dishIngredients: {
    dish_id: number;
    ingredient_id: number;
    quantity: number;
    quantity_in_words: string;
  }[] = [];

  const mealDishes: {
    dish_id: number;
    meal_id: number;
  }[] = [];

  const dishesMenus: {
    dish_id: number;
    menu_id: number;
    name: string;
    calories: number;
    time: string;
  }[] = [];

  let dishIndex = 0;

  for (const meal of menu.meals) {

    const mealMatch = insertedMeals.find(
      (m) =>{

      return  m.name.toLowerCase() === meal.name.toLowerCase() &&
        formatTime(m.time) === meal.time}
    );

    if (!mealMatch) continue;

    for (const dish of meal.dishes) {
      const dishMatch = insertedDishes[dishIndex];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!dishMatch) continue;

      dishesMenus.push({
        dish_id: dishMatch.id,
        menu_id: menuId,
        name: meal.name,
        calories: meal.calories,
        time: meal.time,
      });

      mealDishes.push({
        dish_id: dishMatch.id,
        meal_id: mealMatch.id,
      });

      for (const ingredient of dish.ingredients) {
        const ingredientMatch = allIngredients.find(
          (i) => i.name.toLowerCase() === ingredient.name.toLowerCase(),
        );
        if (!ingredientMatch) continue;

        dishIngredients.push({
          dish_id: dishMatch.id,
          ingredient_id: ingredientMatch.id,
          quantity: +ingredient.quantity,
          quantity_in_words: ingredient.quantityInWords,
        });
      }

      dishIndex++;
    }
  }

  return {
    dishIngredients,
    mealDishes,
    dishesMenus,
  };
}
