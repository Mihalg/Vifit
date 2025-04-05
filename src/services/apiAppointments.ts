import supabase from "./supabase";

type AppointmentData = {
  age: number;
  weight: number;
  height: number;
  fat_weight: number;
  water_weight: number;
  muscle_weight: number;
  pal: number;
  date: string;
  notes: string;
};

export async function getAppointmentData(id: number | null) {
  if (!id) throw new Error("Wystąpił błąd");

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select(
      "id, date, notes, age, height, weight, water_weight, fat_weight, muscle_weight, pal, users!patient_id(sex)",
    )
    .eq("id", id)
    .single();

  if (error) throw new Error("Nie udało się załadować wizyty");

  return appointment;
}

export async function editAppointment({
  data,
  id,
}: {
  data: AppointmentData;
  id: number;
}) {
  const { data: appointment, error } = await supabase
    .from("appointments")
    .update(data)
    .eq("id", id)
    .select();

  if (error) {
    console.log(error.message);
    throw new Error("Nie udało się edytować wizyty");
  }

  return appointment;
}

export async function addAppointment({
  data,
  patientId,
  dietitianId,
}: {
  data: AppointmentData;
  patientId: number | null;
  dietitianId: string | undefined;
}) {
  if (!patientId || !dietitianId) throw new Error("Nie udało się dodać wizyty");

  const { data: appointment, error } = await supabase
    .from("appointments")
    .insert([{ ...data, patient_id: patientId, dietitian_id: dietitianId }])
    .select();

  if (error) {
    console.log(error);
    throw new Error("Nie udało się dodać wizyty.");
  }

  return appointment;
}

export async function getPatientAppointmentsList(id: number | null) {
  if (!id) throw new Error("Wystąpił błąd");

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("date, id")
    .eq("patient_id", id);

  if (error) throw new Error("Nie udało się pobrać historii wizyt");

  return appointments;
}

export async function getSummaryForCharts(patient_id: number | undefined) {
  if (!patient_id) throw new Error("Wystąpił błąd");

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("weight, fat_weight, muscle_weight, water_weight")
    .eq("patient_id", patient_id);

  if (error) throw new Error("Nie udało się pobrać historii wizyt");

  return appointments;
}
