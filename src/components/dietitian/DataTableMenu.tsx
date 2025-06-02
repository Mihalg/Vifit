import { PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CopyIcon,
  Edit,
  EllipsisVertical,
  Trash
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Button } from "../ui/Button";
import { Popover, PopoverContent } from "../ui/Popover";

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
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical/>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex w-fit space-x-2">
          <Button
            onClick={() => {
              void toast.promise(duplicate(id), {
                loading: "Duplikowanie...",
                success: "Sukces",
                error: (err: Error) => err.message,
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
      </PopoverContent>
    </Popover>
  );
}

export default DataTableMenu;
