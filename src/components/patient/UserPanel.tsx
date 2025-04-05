import { Outlet } from "react-router";
import SideBar from "../SideBar";
import MainNav from "../navigation/MainNav";

function UserPanel() {
  return (
    <div className="flex flex-col xl:max-h-screen xl:flex-row xl:overflow-hidden">
      <SideBar>
        <MainNav.NavRow to="jadłospis">Jadłospis</MainNav.NavRow>
        <MainNav.NavRow to="wizyty">Wizyty</MainNav.NavRow>
        <MainNav.NavRow to="lista-zakupów">Lista zakupów</MainNav.NavRow>
      </SideBar>
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}

export default UserPanel;
