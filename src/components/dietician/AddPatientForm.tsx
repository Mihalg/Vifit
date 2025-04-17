import useDietitianId from "@/hooks/useDietitianId";
import { addNewPatient } from "@/services/apiPatients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

function AddPatientForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const id = useDietitianId();

  const { mutate } = useMutation({
    mutationFn: addNewPatient,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Dodano pacjenta!", {
        duration: 6500,
      });
      void queryClient.invalidateQueries({ queryKey: ["patientsList"] });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (id) mutate({ email, dietitianId: id });
  }

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen((open) => !open);
        }}
        className="relative w-full"
        variant={"default"}
      >
        <span>Dodaj Pacjenta</span>
      </Button>
      <form
        onSubmit={handleSubmit}
        className={`${isOpen ? "max-h-[200px] py-2" : "max-h-0"} space-y-2 overflow-hidden rounded-md bg-secondary-100 px-2 py-0 transition-all`}
      >
        <Input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Adres e-mail"
        />
        <Button className="ml-auto block">Dodaj</Button>
      </form>
    </div>
  );
}

export default AddPatientForm;
