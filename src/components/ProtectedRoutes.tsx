import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router";

function ProtectedRoutes({
  allowedRole,
}: {
  allowedRole: "dietitian" | "user";
}) {
  const { role } = useAuth();

  if (role === allowedRole) {
    return <Outlet />;
  } else {
    console.log("object");
  }
}

export default ProtectedRoutes;
