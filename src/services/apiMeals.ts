import { getMenu } from "./apiMenus";
import supabase from "./supabase";

export async function getMealsList(patientId: string | undefined) {
  if (!patientId) throw new Error("Wystąpił błąd");

  const { data: meals, error } = await supabase
    .from("meals")
    .select(
      `id, name,calories, time,  
      meal_dishes (
      dish_id (
        id,
        name,
        calories
      )
    )`,
    )
    .eq("patient_id", patientId)
    .order("time", { ascending: true });

  if (error) throw new Error("Nie udało się pobrać listy posiłków.");

  return meals;
}

export async function getMeal(id: string | null) {
  if (!id) return;
  const { data: meal, error } = await supabase
    .from("meals")
    .select(
      `
    name, 
    time, 
    calories, 
    meal_dishes (
      dish_id (
        id,
        name,
        calories, 
        carbs, 
        fat,
        proteins
      )
    )
  `,
    )
    .eq("id", +id)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Wystąpił błąd");
  }

  return {
      ...meal,
      meal_dishes: meal.meal_dishes.map((dish) => {
        return { ...dish.dish_id };
      }),
  };
}

export async function addEditMeal({
  meal,
  mealId,
  patientId,
  dietitianId,
}: {
  meal: {
    name: string;
    time: string;
    calories: number;
    meal_dishes: {
      id: number;
      name: string;
      calories: number;
      carbs: number;
      fat: number;
      proteins: number;
    }[];
  };
  mealId: string | undefined;
  patientId: string | undefined;
  dietitianId: string | undefined;
}) {
  //ADD
  if (!mealId && dietitianId && patientId) {
    const mealToAdd = {
      name: meal.name,
      time: meal.time,
      calories: meal.calories,
      patient_id: patientId,
      dietitian_id: dietitianId,
    };

    const { data, error: addMealError } = await supabase
      .from("meals")
      .insert(mealToAdd)
      .select()
      .single();

    const dishesToAdd = meal.meal_dishes.map((dish) => {
      return {
        meal_id: data?.id,
        dish_id: dish.id,
      };
    });

    const { error: meal_dishesError } = await supabase
      .from("meal_dishes")
      .insert(dishesToAdd)
      .select();

    if (addMealError || meal_dishesError)
      throw new Error("Nie udało się dodać posiłku.");

    return data;
  } else if (mealId) {
    const mealToEdit = {
      name: meal.name,
      time: meal.time,
      calories: meal.calories,
    };

    const { error: editMealError } = await supabase
      .from("meals")
      .update(mealToEdit)
      .eq("id", +mealId);

    const { error: deleteDishesError } = await supabase
      .from("meal_dishes")
      .delete()
      .eq("meal_id", +mealId);

    const dishesToAdd = meal.meal_dishes.map((dish) => {
      return {
        meal_id: +mealId,
        dish_id: dish.id,
      };
    });

    const { error: meal_dishesError } = await supabase
      .from("meal_dishes")
      .insert(dishesToAdd);

    if (editMealError || deleteDishesError || meal_dishesError)
      throw new Error("Nie udało się edytować posiłku.");
  }
}

export async function deleteMeal(mealId: string | undefined){
  if(!mealId) throw new Error ('Wystąpił błąd.')

    const {error}= await supabase.from('meals').delete().eq('id', +mealId)

    if(error){
      console.error(error)
      throw new Error('Nie udało się usunąć posiłku')
    }
}

export async function addPatientMenu({
  menuId,
  patientId,
  dietitianId,
}: {
  menuId: number;
  patientId: string | undefined;
  dietitianId: string | undefined;
}) {
  if (!patientId || !dietitianId) return;

  const menu = await getMenu(menuId);

  if (!menu) return;

  const { error: deleteMenuError } = await supabase
    .from("meals")
    .delete()
    .eq("patient_id", patientId);

  if (deleteMenuError) {
    console.log(deleteMenuError);
    throw new Error("Nie udało się przypisać jadłospisu");
  }

  const mealsToAdd = Object.values(
    menu.dishes_menus.reduce<
      Record<
        string,
        {
          name: string;
          calories: number;
          time: string;
          patient_id: string;
          dietitian_id: string;
        }
      >
    >((acc, dish) => {
      if (!(dish.name in acc)) {
        acc[dish.name] = {
          dietitian_id: dietitianId,
          patient_id: patientId,
          name: dish.name,
          calories: dish.calories,
          time: dish.time,
        };
      }
      return acc;
    }, {}),
  );

  const { data, error: addMealsError } = await supabase
    .from("meals")
    .insert(mealsToAdd)
    .select();

  if (addMealsError) {
    console.log(addMealsError);
    throw new Error("Nie udało się przypisać jadłospisu");
  }

  const dishesToAdd = menu.dishes_menus.map((item) => {
    const meal = data.find((el) => el.name === item.name);
    return { dish_id: item.dish_id.id, meal_id: meal?.id };
  });

  const { error: addDishesError } = await supabase
    .from("meal_dishes")
    .insert(dishesToAdd);

  if (addDishesError) {
    console.log(addDishesError);
    throw new Error("Nie udało się przypisać jadłospisu");
  }
}

export async function getPatientMeals() {
  const { data: meals, error } = await supabase
    .from("meals")
    .select(
      "name, time, meal_dishes ( dish_id (id, name, description, dish_ingredients (quantity, quantity_in_words, ingredient_id(name, unit))))",
    );

  if (error) throw new Error("Nie udało się pobrać jadłospisu");

  return meals;
}
