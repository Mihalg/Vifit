import supabase from "./supabase";

export async function getMealsList(patientId: string | undefined) {
  if (!patientId) throw new Error("Wystąpił błąd");

  const { data: meals, error } = await supabase
    .from("meals")
    .select("id, name,calories, time, carbs, fat, proteins")
    .eq("patient_id", patientId);

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
    carbs,
    fat,
    proteins, 
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
  return meal;
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
    carbs: number;
    fat: number;
    proteins: number;
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
      carbs: meal.carbs,
      fat: meal.fat,
      proteins: meal.proteins,
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
      carbs: meal.carbs,
      fat: meal.fat,
      proteins: meal.proteins,
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

export async function getPatientMeals() {
  const { data: meals, error } = await supabase
    .from("meals")
    .select(
      "name, time, meal_dishes ( dish_id (id, name, description, dish_ingredients (quantity, quantity_in_words, ingredient_id(name, unit))))",
    );

  

  if (error) throw new Error("Nie udało się pobrać jadłospisu");

  return meals;
}
