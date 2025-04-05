import { NavLink, Outlet } from "react-router";

function Patients() {
  return (
    <div className="flex h-screen flex-col">
      <div className="border-b-[1px] px-4 py-2">
        <div className="flex w-fit gap-2 rounded-md bg-secondary-300 px-1 py-1">
          <NavLink
            to="wizyty"
            className="topBar-navlink rounded-md px-4 py-2 font-semibold transition-colors"
          >
            Wizyty
          </NavLink>
          <NavLink
            className="topBar-navlink rounded-md px-4 py-2 font-semibold transition-colors"
            to="jadłospis"
          >
            Jadłospis
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Patients;
