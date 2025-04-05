import { useQueryClient } from "@tanstack/react-query";

function useDietitianId() {
  const queryClient = useQueryClient();

  const data: { data: { user: { id: string } } } | undefined =
    queryClient.getQueryData(["user"]);

  return data?.data.user.id;
}

export default useDietitianId;
