import { getMenu } from "@/services/apiMenus";
import { useQuery } from "@tanstack/react-query";

export default function useMenuToEdit(menuId: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["menu", menuId],
    enabled: !!menuId,
    queryFn: () => getMenu(menuId ? +menuId : null),
  });

  if (data) {
    const menu = {
      ...data,
      menu_meals: Object.values(
        data.dishes_menus.reduce<
          Record<
            string,
            {
              name: string;
              time: string;
              calories: number;
              dishes: {
                id: number | undefined;
                category: string;
                name: string;
                calories: number;
                carbs: number;
                fat: number;
                proteins: number;
              }[];
            }
          >
        >((acc, item) => {
          const key = `${item.name}-${item.time}`;
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!acc[key]) {
            acc[key] = {
              name: item.name,
              time: item.time,
              calories: item.calories,
              dishes: [],
            };
          }
          acc[key].dishes.push(item.dish_id);
          return acc;
        }, {}),
      ),
    };

    return { menu, isLoading };
  } else return { menu: null, isLoading };
}
