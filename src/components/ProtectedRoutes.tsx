import PageNotFound from "@/pages/PageNotFound";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router";

function ProtectedRoutes({
  allowedRole,
}: {
  allowedRole: "dietitian" | "patient";
}) {
  const { role } = useAuth();

  if (role === allowedRole) {
    return <Outlet />;
  } else {
    return <PageNotFound />;
  }
}

export default ProtectedRoutes;
