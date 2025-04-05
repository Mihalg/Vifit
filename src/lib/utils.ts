import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBMI(weight: number | null, height: number | null) {
  if (!weight || !height) return 0;
  const bmi = weight / ((height / 100) * (height / 100));
  return bmi.toFixed(2);
}

export function getBMR(
  sex: "female" | "male" | undefined | null,
  weight: number | null,
  height: number | null,
  age: number | null,
) {
  let bmr: number;
  if (sex && weight && height && age) {
    if (sex === "male") {
      bmr = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
    } else {
      bmr = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
    }
    return bmr.toFixed(2);
  }
}

export function getTMR(bmr: number, pal: number) {
  return (bmr * pal).toFixed(2);
}

export function sortAppointmentsByDate(
  data:
    | {
        date: string | null;
        id: number;
      }[]
    | undefined,
) {
  if (!data) return undefined;

  return data.sort((a, b) => {
    if (a.date === null && b.date === null) return 0;
    if (a.date === null) return 1;
    if (b.date === null) return -1;

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function convertTime(time: string) {
  const convertedTime = time.slice(0, -3);
  return convertedTime;
}

// export function sumIngredients(
//   mealDishes: {
//     meal_dishes: {
//       dish_id: {
//         dish_ingredients: {
//           quantity: number;
//           quantity_in_words: string;
//           ingredient_id: {
//             id: number;
//             category: string;
//             name: string;
//             unit: string;
//           };
//         }[];
//       };
//     }[];
//   }[],
// ) {
//   const ingredientTotals: Record<
//     number,
//     { name: string; category: string; unit: string; totalQuantity: number }
//   > = {};

//   mealDishes.forEach((meal) => {
//     meal.meal_dishes.forEach((dish) => {
//       dish.dish_id.dish_ingredients.forEach((ingredient) => {
//         const { id, name, unit, category } = ingredient.ingredient_id;
//         const quantity = ingredient.quantity;

//         if (!ingredientTotals[id]) {
//           ingredientTotals[id] = { name, category, unit, totalQuantity: 0 };
//         }
//         ingredientTotals[id].totalQuantity += quantity;
//       });
//     });
//   });

//   return Object.values(ingredientTotals);
// }

export function sumIngredients(
  mealDishes: {
    meal_dishes: {
      dish_id: {
        dish_ingredients: {
          quantity: number;
          quantity_in_words: string;
          ingredient_id: {
            id: number;
            category: string;
            name: string;
            unit: string;
          };
        }[];
      };
    }[];
  }[],
) {
  const ingredientTotals: {
    [key: string]: {
      category: string;
      ingredients: {
        id: number;
        name: string;
        unit: string;
        totalQuantity: number;
      }[];
    };
  } = {};

  mealDishes.forEach((meal) => {
    meal.meal_dishes.forEach((dish) => {
      dish.dish_id.dish_ingredients.forEach((ingredient) => {
        const { id, name, unit, category } = ingredient.ingredient_id;
        const quantity = ingredient.quantity;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!ingredientTotals[category]) {
          ingredientTotals[category] = {
            category: category,
            ingredients: [
              {
                id,
                name,
                unit,
                totalQuantity: quantity,
              },
            ],
          };
        } else {
          ingredientTotals[category].ingredients.forEach((ingredient) => {
            if (ingredient.id === id) ingredient.totalQuantity += quantity;
          });
        }
      });
    });
  });

  return Object.values(ingredientTotals);
}
