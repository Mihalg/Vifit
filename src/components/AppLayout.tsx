import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    void async function () {
      if (!isAuthenticated && !isLoading) {
        await navigate("/login");
      }
    };
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated)
    return (
      <div className="flex flex-col bg-white xl:flex-row">
        <main className="flex grow justify-center">
          <Outlet />
        </main>
      </div>
    );
}

export default AppLayout;
