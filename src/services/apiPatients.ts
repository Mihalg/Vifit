import supabase from "./supabase";

export async function addNewPatient({
  email,
  fullName,
  dietitianId,
}: {
  email: string;
  fullName: string;
  dietitianId: string;
}) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { full_name: fullName, dietitian_id: dietitianId },
    },
  });

  if (error) {
    console.log(error.message);
    throw new Error("Nie udało się dodać pacjenta.");
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




