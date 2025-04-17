import { logout } from "@/services/apiAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";

function LogoutButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await navigate("/", { replace: true });
      queryClient.removeQueries();
    },
  });

  return (
    <button
      onClick={() => {
        mutate();
      }}
    >
      <LogOutIcon size={28} />
    </button>
  );
}

export default LogoutButton;
