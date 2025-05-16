import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { useState } from "react";
import { editPassword } from "@/services/apiAuth";
import toast from "react-hot-toast";

function AccountSettings() {
  const { mutate, isPending } = useMutation({
    mutationFn: editPassword,
    onSuccess: () => {
      toast.success("Zmieniono hasło");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="h-full px-4 py-4">
      <p className="mb-7 text-3xl">Ustawienia konta</p>
      <form
        onSubmit={() => {
          mutate(confirmPassword);
        }}
        className="rounded-md px-4 py-4 shadow-md"
      >
        <p className="mb-2 text-2xl text-primary-600 dark:text-primary-50">
          Zmień hasło
        </p>
        <div>
          <Label htmlFor="password">Nowe hasło</Label>
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            name="password"
            disabled={isPending}
          />
        </div>
        <div className="mb-4 mt-2">
          <Label htmlFor="password">Powtórz hasło</Label>
          <Input
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            type="password"
            id="password-repeat"
            name="password-repeat"
            disabled={isPending}
          />
          <p
            className={`${confirmPassword !== password ? "block" : "hidden"} mt-1 text-red-700`}
          >
            Hasła muszą być takie same
          </p>
        </div>
        <Button className="ml-auto block" disabled={isPending}>
          Zapisz
        </Button>
      </form>
    </div>
  );
}

export default AccountSettings;
