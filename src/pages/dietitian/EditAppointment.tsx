import AppointmentForm from "@/components/dietitian/AppointmentData";
import Loader from "@/components/ui/Loader";
import { getAppointmentData } from "@/services/apiAppointments";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function EditAppointment() {
  const { appointmentId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointmentData(appointmentId ? +appointmentId : null),
  });

  if (isLoading) return <Loader />;
  if (data) return <AppointmentForm data={data} />;
}

export default EditAppointment;
