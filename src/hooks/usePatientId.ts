import { useQueryClient } from "@tanstack/react-query";

function usePatientId() {
  const queryClient = useQueryClient();

  const data: { role: { id: number } } | undefined = queryClient.getQueryData([
    "user",
  ]);

  return data?.role.id;
}

export default usePatientId;
