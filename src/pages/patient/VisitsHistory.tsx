import AppointmentsSummaryCharts from "@/components/dietician/AppointmentsSummaryCharts";
import usePatientId from "@/hooks/usePatientId";
import { sortAppointmentsByDate } from "@/lib/utils";
import { getPatientAppointmentsList } from "@/services/apiAppointments";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useParams } from "react-router";

function VisitsHistory() {
  const { appointmentId } = useParams();
  const patientId = usePatientId();
  const { data } = useQuery({
    queryKey: ["appointmentsList"],
    queryFn: () => getPatientAppointmentsList(patientId ? patientId : null),
  });
  const sortedAppointments = sortAppointmentsByDate(data);

  if (appointmentId) return <Outlet />;

  return (
    <div className="grid grid-cols-1 lg:min-h-full lg:grid-cols-[15rem_1fr]">
      <div className="px-6 py-4 lg:border-r-[1px]">
        <p className="mb-6 text-3xl">Historia Wizyt</p>
        <div className="scrollbar lg:max-h-[720px] lg:overflow-y-auto lg:px-1">
          {sortedAppointments?.map((appointment) => (
            <Link
              className="mb-2 block w-full rounded-md bg-secondary-200 px-2 py-2 text-center"
              key={appointment.id}
              to={String(appointment.id)}
            >
              {appointment.date}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-4">
        <AppointmentsSummaryCharts patientId={patientId} />
      </div>
    </div>
  );
}

export default VisitsHistory;
