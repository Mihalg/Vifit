import { invite } from "@/services/apiAuth";
import { useMutation } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { Button } from "../ui/Button";

function Dashboard() {
  const { mutate } = useMutation({
    mutationFn: invite,
  });

  return (
    <div className="flex flex-col xl:flex-row">
      <main className="flex grow justify-center">
        <Button
          onClick={() => {
            mutate();
          }}
        >
          Zarejestruj
        </Button>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
