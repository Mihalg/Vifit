import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { login, recoverPassword } from "../services/apiAuth";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await navigate(
        `/${data.role.role === "dietitian" ? "panel" : "jadłospis"}`,
        { replace: true },
      );
      queryClient.setQueryData(["user"], data);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: recover, isPending: isRecovering } = useMutation({
    mutationFn: recoverPassword,
    onSuccess: async () => {
      await navigate("/login");
      toast.success("Wysłaliśmy wiadomość na podany adres.");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    void (async function () {
      if (isAuthenticated) {
        await navigate(
          `/${user?.role.role === "dietitian" ? "panel" : "jadłospis"}`,
          { replace: true },
        );
      }
    })();
  }, [isAuthenticated, navigate, user]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;

    if (!forgotPassword) {
      mutate(
        { email, password },
        {
          onSettled: () => {
            setEmail("");
            setPassword("");
          },
        },
      );
    } else {
      recover(email);
    }
  }

  if (!isAuthenticated)
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-secondary-600">
        <div className="relative mx-auto min-w-80 rounded-md border bg-white px-5 py-4">
          {forgotPassword ? (
            <>
              <p
                role="button"
                className="absolute top-[22px] flex items-center gap-2 border-primary-800 text-primary-600 hover:border-b-[1px]"
                onClick={() => {
                  setForgotPassword(false);
                }}
              >
                <ArrowLeftIcon size={20} /> Powrót
              </p>
              <p className="mx-auto mb-4 w-fit border-b-[1px] border-primary-800 px-4 pb-2 text-center text-2xl">
                Nie pamiętam hasła
              </p>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Podaj adres e-mail, na który wyślemy link do wygenerowania
                      nowego hasła.
                    </Label>
                    <Input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      id="email"
                      type="email"
                      required
                      disabled={isRecovering}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isRecovering ? "Ładowanie..." : "Przypomnij hasło"}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="mx-auto mb-4 w-fit border-b-[1px] border-primary-800 px-4 pb-2 text-center text-2xl">
                Zaloguj się
              </p>
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      id="email"
                      type="email"
                      required
                    />
                  </div>
                  <div className="mb-3 grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Hasło</Label>
                      <p
                        role="button"
                        onClick={() => {
                          setForgotPassword(true);
                        }}
                        className="ml-auto inline-block text-sm underline"
                      >
                        Nie pamiętasz hasła?
                      </p>
                    </div>
                    <Input
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isPending ? "Ładowanie..." : "Zaloguj się"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    );
}

export default Login;
