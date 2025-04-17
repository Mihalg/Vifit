import supabase from "./supabase";

export async function addNewPatient({
  email,
  dietitianId,
}: {
  email: string;
  dietitianId: string;
}) {
  const { data: patientId, error: getPatientError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", email)
    .single();

  if (getPatientError) {
    console.error(getPatientError);
    throw new Error("Nie znaleziono pacjenta o podanym adresie e-mail.");
  }

  const { error } = await supabase
    .from("patients")
    .insert({ dietitian_id: dietitianId, patient_id: patientId.user_id });

  if (error) {
    console.log(error.message);
    throw new Error("Wystąpił błąd. Nie udało się dodać pacjenta.");
  }
}
export async function getPatientsList() {
  const { data: patients, error } = await supabase.from("patients").select(`
  users!patient_id (
    full_name,
    id
  )
`);

  if (error) throw new Error("Wystąpił błąd przy pobieraniu pacjentów");

  return patients;
}
