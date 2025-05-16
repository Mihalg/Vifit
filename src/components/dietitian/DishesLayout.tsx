import { NavLink, Outlet } from "react-router";

function DishesLayout() {
  return (
    <>
      <div className="border-b-[1px] px-4 py-2 dark:border-b-secondary-400">
        <div className="flex w-fit gap-2 rounded-md bg-secondary-200 px-1 py-1 dark:bg-secondary-400">
          <NavLink
            to="posiłki"
            className="topBar-navlink rounded-md px-4 py-2 font-semibold transition-colors"
          >
            Posiłki
          </NavLink>
          <NavLink
            className="topBar-navlink rounded-md px-4 py-2 font-semibold transition-colors"
            to="składniki"
          >
            Składniki
          </NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default DishesLayout;
