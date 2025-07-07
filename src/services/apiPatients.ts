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
    .single()

  if (getPatientError) {
    console.error(getPatientError);
    throw new Error("Nie znaleziono pacjenta o podanym adresie e-mail.");
  }

  const { error } = await supabase
    .from("patients")
    .insert({ dietitian_id: dietitianId, patient_id: patientId.user_id });

  if (error) {
    console.error(error);
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

export async function getPatientData(patient_id: string | undefined){
if (!patient_id)
    throw new Error("Wystąpił błąd");

  const { data: appointmentData, error:appointmentError } = await supabase
    .from("appointments")
    .select(
      "age, height, weight, pal",
    )
    .eq("patient_id", +patient_id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (appointmentError) {
    console.error(appointmentError);
    if(appointmentError.code === 'PGRST116') return
    throw new Error("Wystąpił błąd.");
  }

  const {data: usersData, error: usersError} = await supabase.from('users').select('sex').eq('id', +patient_id).single()


  if (usersError) {
    console.error(usersError);
    throw new Error("Wystąpił błąd.");
  }

  return {...usersData, ...appointmentData}
}