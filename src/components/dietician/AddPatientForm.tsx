import useDietitianId from "@/hooks/useDietitianId";
import { addNewPatient } from "@/services/apiPatients";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

function AddPatientForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const id = useDietitianId();

  const { mutate } = useMutation({
    mutationFn: addNewPatient,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(
        "Dodano pacjenta! Na podany adres e-mail wysłano wiadomość do potwierdzenia rejestracji.",
        {
          duration: 6500,
        },
      );
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (id) mutate({ email, fullName, dietitianId: id });
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
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
          }}
          placeholder="Imię i nazwisko"
        />
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
