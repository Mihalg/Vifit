import { Button } from "@/components/ui/Button";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useState } from "react";

type MenuMealProps = {
  meal: {
    name: string;
    time: string;
    meal_dishes: {
      dish_id: {
        id: number | undefined;
        name: string;
        description: string;
        dish_ingredients: {
          quantity: number;
          quantity_in_words: string;
          ingredient_id: { name: string; unit: string };
        }[];
      };
    }[];
  };
};

function MenuMeal({ meal }: MenuMealProps) {
  const ref = useOutsideClick(() => {
    setIsModalOpen(false);
  });

  const [selectedDish, setSelectedDish] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div
        className={`${isModalOpen ? "absolute" : "hidden"} left-0 top-0 z-10 h-full w-full bg-black/40`}
      >
        <div
          ref={ref}
          className={`absolute left-1/2 top-1/2 flex max-h-[75%] w-3/4 -translate-x-1/2 -translate-y-1/2 flex-col items-start rounded-md bg-secondary-50 px-8 py-4 dark:border-none dark:bg-secondary-500 lg:w-fit`}
        >
          <div className="w-full divide-y-2 overflow-y-auto divide-primary-600">
            {meal.meal_dishes.map((dish, i) => (
              <button
                className="w-full px-2 py-2 text-left text-lg transition-colors hover:bg-primary-600 hover:text-white"
                key={i}
                onClick={() => {
                  setSelectedDish(i);
                  setIsModalOpen(false);
                }}
              >
                {dish.dish_id.name}
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              setIsModalOpen((open) => !open);
            }}
            className="ml-auto mt-4"
          >
            Zamknij
          </Button>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-secondary-100 px-4 py-4 dark:bg-secondary-500">
        <div className="flex flex-col items-center gap-4 text-3xl md:flex-row">
          <div className="flex gap-4">
            <p>{meal.name}</p>
            <p>{meal.time.slice(0, 5)}</p>
          </div>
          <Button
            onClick={() => {
              setIsModalOpen((open) => !open);
            }}
            className="w-full md:w-fit lg:ml-10"
          >
            Wymień posiłek
          </Button>
        </div>

        <div>
          <p className="my-3 text-2xl text-primary-600 dark:text-primary-50">
            {meal.meal_dishes.at(selectedDish)?.dish_id.name}
          </p>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:justify-between">
            <div>
              <p className="mb-1 text-lg">Składniki:</p>
              {meal.meal_dishes
                .at(selectedDish)
                ?.dish_id.dish_ingredients.map((ingredient, i) => (
                  <div
                    key={i}
                    className="mb-2 grid grid-cols-3 border-l-2 border-primary-600 py-1 pl-2"
                  >
                    <p>{ingredient.ingredient_id.name}</p>
                    <p>
                      {ingredient.quantity}
                      {ingredient.ingredient_id.unit}
                    </p>
                    <p>{ingredient.quantity_in_words}</p>
                  </div>
                ))}
            </div>
            <div>
              <p className="mb-1 text-lg">Przygotowanie:</p>
              <p className="border-l-2 border-primary-600 pl-2">
                {meal.meal_dishes.at(selectedDish)?.dish_id.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuMeal;
