import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { registerUser } from "@/services/apiAuth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";

type FormFields = { email: ""; password: ""; full_name: ""; sex: "" };

export default function Register() {
  const { register, handleSubmit } = useForm<FormFields>();
  const [succes, setSucces] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setSucces(true);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data);
  };

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-secondary-600 px-4 py-2 text-secondary-400">
      {succes ? (
        <div className="mx-auto max-w-96 rounded-md border bg-white px-5 py-4 text-center lg:max-w-none">
          <img src="/logo-dark.png" alt="Logo" className="mx-auto w-60" />
          <p className="my-2 text-3xl lg:text-4xl">
            Dziękujemy za rejestrację!
          </p>
          <p className="text-xl">
            Wysłaliśmy Ci wiadomość e-mail w celu potwierdzenia rejestracji.
          </p>
          <p className="">Pamiętaj, aby sprawdzić spam.</p>

          <Link
            to="/"
            className="mx-auto mt-4 block h-10 w-fit rounded-sm bg-primary-600 px-4 py-2 text-neutral-50 transition-colors hover:bg-primary-600/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Zaloguj się
          </Link>
        </div>
      ) : (
        <div className="mx-auto min-w-80 rounded-md border bg-white px-5 py-4">
          <>
            <p className="mx-auto mb-4 w-fit border-b-[1px] border-primary-800 px-4 pb-2 text-center text-2xl">
              Zarejestruj się
            </p>

            <form
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Imię i nazwisko</Label>
                  <Input
                    {...register("full_name")}
                    id="fullName"
                    type="text"
                    required
                    maxLength={50}
                    disabled={isPending}
                    className="dark:border-neutral-200 dark:bg-white dark:ring-offset-white dark:focus-visible:ring-primary-600"
                  />
                </div>
                <div className="flex shrink flex-col gap-2">
                  <Label htmlFor="pal">Płeć</Label>
                  <select
                    {...register("sex")}
                    id="pal"
                    className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-0"
                    disabled={isPending}
                  >
                    <option value={"female"}>Kobieta</option>
                    <option value={"male"}>Mężczyzna</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    required
                    maxLength={50}
                    disabled={isPending}
                    className="dark:border-neutral-200 dark:bg-white dark:ring-offset-white dark:focus-visible:ring-primary-600"
                  />
                </div>
                <div className="mb-3 grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Hasło</Label>
                  </div>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={50}
                    disabled={isPending}
                    className="dark:border-neutral-200 dark:bg-white dark:ring-offset-white dark:focus-visible:ring-primary-600"
                  />
                </div>

                <div className="flex">
                  <Input required type="checkbox" className="mr-4 h-6 w-6" />
                  <Link
                    target="blank"
                    to="/polityka-prywatnosci"
                    className="underline"
                  >
                    Akceptuję politykę prywatności
                  </Link>
                </div>
                <div className="flex">
                  <Input required type="checkbox" className="mr-4 h-6 w-6" />
                  <Link target="blank" to="/regulamin" className="underline">
                    Akceptuję regulamin
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Ładowanie..." : "Zarejestruj się"}
                </Button>
              </div>
            </form>
          </>
        </div>
      )}
    </div>
  );
}
