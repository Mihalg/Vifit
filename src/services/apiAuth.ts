import supabase from "./supabase";

export async function getUserRole(id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("role, id")
    .eq("user_id", id)
    .single();

  if (error) {
    console.log(error);
    throw new Error("Wystąpił błąd podczas ładowania użytkownika");
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  const role = await getUserRole(data.user.id); // 'dietitian' or 'client'

  return { data, role };
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    if (error.status === 400) {
      throw new Error("Niepoprawne dane logowania");
    } else throw new Error("Nie udało się zalogować");
  }

  const role = await getUserRole(data.user.id);
  return { data, role };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function editPassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw new Error("Nie udało się zmienić hasła");
}

export async function recoverPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error)
    throw new Error("Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
}
