import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Button } from "../ui/Button";

type Props = {
  id: number;
  queryKey: string;
  deleteFn: (id: number) => Promise<void>;
  duplicateFn: (id: number) => Promise<void>;
};

function DataTableMenu({ id, queryKey, deleteFn, duplicateFn }: Props) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: del } = useMutation({
    mutationFn: deleteFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  const { mutateAsync: duplicate } = useMutation({
    mutationFn: duplicateFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  
  });

  return (
    <div className="ml-auto flex w-fit space-x-2 text-right">
      <Button
       onClick={() => {
        void toast.promise(duplicate(id), {
          loading: "Duplikowanie...",
          success: "Sukces",
          error: "Nie udało się zduplikować pozycji.",
        });
      }}
        title="Duplikuj"
      >
        <CopyIcon />
      </Button>
      <Button
        onClick={() => {
          void navigate(String(id));
        }}
        title="Edytuj"
      >
        <Edit />
      </Button>
      <Button
        onClick={() => {
          void toast.promise(del(id), {
            loading: "Usuwanie...",
            success: "Sukces",
            error: "Nie udało się usunąć pozycji.",
          });
        }}
        title="Usuń"
      >
        <Trash />
      </Button>
    </div>
  );
}

export default DataTableMenu;
