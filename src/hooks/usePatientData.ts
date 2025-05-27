import { getPatientData } from "@/services/apiPatients";
import { useQuery } from "@tanstack/react-query";

export function UsePatientData(patient_id: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["patientData", patient_id],
    queryFn: () => getPatientData(patient_id),
  });

  return { patientData: data, isLoading };
}
