import { Label } from "@radix-ui/react-label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { login } from "../services/apiAuth";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      await navigate("/", { replace: true });
      queryClient.setQueryData(["user"], data);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    void async function () {
      if (isAuthenticated) {
        await navigate("/", { replace: true });
      }
    };
  }, [isAuthenticated, navigate]);

  // if (isPending || isLoading) return <Loader />;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) return;
    mutate(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      },
    );
  }

  if (!isAuthenticated)
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-5">
        <div className="mx-auto min-w-80 rounded-md border bg-slate-600 px-5 py-4">
          <p className="border-primary-950 mx-auto mb-4 w-fit border-b-[1px] px-4 pb-2 text-center text-2xl">
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
                  autoComplete="username"
                  required
                />
              </div>
              <div className="mb-3 grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Hasło</Label>
                  <p className="ml-auto inline-block text-sm underline">
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
        </div>
      </div>
    );
}

export default Login;
