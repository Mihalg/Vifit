import { Outlet } from "react-router";

function UserPanel() {
  return (
    <div>
      <h1>USERPANEL</h1>
      <Outlet />
    </div>
  );
}

export default UserPanel;
