import { sortAppointmentsByDate } from "@/lib/utils";
import { getPatientAppointmentsList } from "@/services/apiAppointments";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useParams } from "react-router";
import AppointmentsSummaryCharts from "./AppointmentsSummaryCharts";

function AppointmentsList() {
  const { patientId, appointmentId } = useParams();
  const { pathname } = useLocation();
  const { data, isPending } = useQuery({
    queryKey: ["appointmentsList", patientId],
    queryFn: () => getPatientAppointmentsList(patientId ? +patientId : null),
  });

  const sortedAppointments = sortAppointmentsByDate(data);

  if (appointmentId || pathname === `/panel/${patientId}/wizyty/nowa-wizyta`)
    return <Outlet />;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr]">
      <div className="px-6 py-4 lg:border-r-[1px] dark:border-secondary-400">
        <p className="mb-7 text-3xl">Historia Wizyt</p>
        <Link
          to={"nowa-wizyta"}
          className="mb-4 block w-full rounded-md bg-primary-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-500"
        >
          Dodaj Wizytę
        </Link>

        <div
          className={`scrollbar lg:max-h-[720px] ${!isPending ? "lg:overflow-y-auto" : ""} lg:px-1`}
        >
          {isPending ? (
            <div className="mx-auto h-[60px] w-[60px] animate-spin rounded-full border-2 border-t-2 border-primary-200 border-t-secondary-500 " />
          ) : (
            sortedAppointments?.map((appointment) => (
              <Link
                className="mb-2 block w-full rounded-md bg-secondary-200 hover:bg-secondary-300 px-2 py-2 text-center dark:bg-secondary-400 dark:hover:bg-secondary-500 transition-colors"
                key={appointment.id}
                to={String(appointment.id)}
              >
                {appointment.date}
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="px-6 py-4">
        {patientId ? (
          <AppointmentsSummaryCharts patientId={+patientId} />
        ) : null}
      </div>
    </div>
  );
}

export default AppointmentsList;
