import { getSummaryForCharts } from "@/services/apiAppointments";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function AppointmentsSummaryCharts({
  patientId,
}: {
  patientId: number | undefined;
}) {
  const { data } = useQuery({
    queryKey: ["appointmentsCharts", patientId],
    queryFn: () => getSummaryForCharts(patientId),
  });

  const formatedData = data?.map((appointment) => {
    const data = {
      fatPercentage: (
        (appointment.fat_weight / appointment.weight) *
        100
      ).toFixed(1),
      waterPercentage: (
        (appointment.water_weight / appointment.weight) *
        100
      ).toFixed(1),
      musclesWeight: appointment.muscle_weight,
      weight: appointment.weight,
    };

    return data;
  });

  return (
    <div className="flex h-[85dvh] flex-col">
      <p className="text-center text-xl lg:text-2xl">Masa ciała</p>
      <ResponsiveContainer width="100%" height="20%">
        <AreaChart
          data={formatedData}
          margin={{
            top: 10,
            left: -30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data?.length} />
          <YAxis domain={["dataMin", "dataMax"]} dataKey="weight" />
          <Tooltip />
          <Area
            type="linear"
            dataKey="weight"
            stroke="#4f46e5"
            strokeWidth={4}
            fill="#4f46e5"
            fillOpacity={0.8}
            name="Masa ciała"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center text-xl lg:text-2xl">
        Procent tkanki tłuszczowej
      </p>
      <ResponsiveContainer width="100%" height="20%">
        <AreaChart
          margin={{
            top: 10,
            left: -30,
          }}
          data={formatedData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data?.length} />
          <YAxis dataKey="fatPercentage" />
          <Tooltip />
          <Area
            type="linear"
            dataKey="fatPercentage"
            stroke="#4f46e5"
            strokeWidth={4}
            fill="#4f46e5"
            fillOpacity={0.8}
            name="Procent tkanki tłuszczowej"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center text-xl lg:text-2xl">
        Masa mięśni w organizmie
      </p>
      <ResponsiveContainer width="100%" height="20%">
        <AreaChart
          margin={{
            top: 10,
            left: -30,
          }}
          data={formatedData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data?.length} />
          <YAxis dataKey="musclesWeight" />
          <Tooltip />
          <Area
            type="linear"
            dataKey="musclesWeight"
            stroke="#4f46e5"
            strokeWidth={4}
            fill="#4f46e5"
            fillOpacity={0.8}
            name="Masa mięśni w organizmie"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-center text-xl lg:text-2xl">
        Procent wody w organizmie
      </p>
      <ResponsiveContainer width="100%" height="20%">
        <AreaChart
          margin={{
            top: 10,
            left: -30,
          }}
          data={formatedData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data?.length} />
          <YAxis dataKey="waterPercentage" />
          <Tooltip />
          <Area
            type="linear"
            dataKey="waterPercentage"
            stroke="#4f46e5"
            strokeWidth={4}
            fill="#4f46e5"
            fillOpacity={0.8}
            name="Procent wody w organizmie"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AppointmentsSummaryCharts;
