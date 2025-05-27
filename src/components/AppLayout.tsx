import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "./ui/Loader";

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    void (async function () {
      if (!isAuthenticated && !isLoading) {
        await navigate("/");
      }
    })();
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );

  if (isAuthenticated)
    return (
        <main>
          <Outlet />
        </main>
    );
}

export default AppLayout;
