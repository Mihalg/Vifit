import { getAppointmentData } from "@/services/apiAppointments";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Loader from "../ui/Loader";
import { getBMI, getBMR, getTMR } from "@/lib/utils";
import { useMoveBack } from "@/hooks/useMoveBack";
import { Button } from "../ui/Button";
import { ArrowLeft } from "lucide-react";

function AppointmentData() {
  const moveBack = useMoveBack();
  const { appointmentId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointmentData(appointmentId ? +appointmentId : null),
  });

  if (isLoading) return <Loader />;
  if (data) {
    const bmr = getBMR(data.users.sex, data.weight, data.height, data.age);
    const tmr = getTMR(bmr ? +bmr : 0, data.pal);
    const bmi = getBMI(data.weight, data.height);
    return (
      <div className="grid grid-cols-1 px-4">
        <div className="mb-4 mt-4 flex items-baseline gap-4">
          <Button
            onClick={() => {
              void moveBack();
            }}
          >
            <ArrowLeft /> Powrót
          </Button>
          <p className="text-2xl">Wizyta: {data.date}</p>
        </div>
        <div className="grid grid-cols-1 gap-x-4 divide-y-2 divide-primary-700 text-lg lg:grid-cols-2">
          <div className="flex h-fit items-center justify-between border-t-2 border-primary-700 px-2 py-3">
            <p>Wiek</p>
            <p>{data.age}</p>
          </div>
          <div className="col-start-1 flex h-fit items-center justify-between px-2 py-3">
            <p>Wzrost</p>
            <p>{data.height} cm</p>
          </div>
          <div className="col-start-1 flex h-fit items-center justify-between px-2 py-3">
            <p>Masa ciała</p>
            <p>{data.weight} kg</p>
          </div>
          <div className="flex h-fit items-center justify-between border-t-2 border-primary-700 px-2 py-3 lg:col-start-2 lg:row-start-1">
            <p>Wskaźnik BMI</p>
            <p>{bmi}</p>
          </div>

          <div className="flex h-fit items-center justify-between px-2 py-3 lg:col-start-2 lg:row-start-2">
            <p>Podstawowa przemiana materii</p>
            <p>{bmr} kcal</p>
          </div>

          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Całkowita przemiana materii</p>
            <p>{tmr}</p>
          </div>

          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Masa wody w organizmie</p>
            <p>{data.water_weight} kg</p>
          </div>
          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Procent wody w organizmie</p>
            <p>{((data.water_weight / data.weight) * 100).toFixed(2)}</p>
          </div>
          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Masa tkanki tłuszczowej</p>
            <p>{data.fat_weight} kg</p>
          </div>
          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Procent tkanki tłuszczowej</p>
            <p>{((data.fat_weight / data.weight) * 100).toFixed(2)}</p>
          </div>
          <div className="flex h-fit items-center justify-between px-2 py-3">
            <p>Masa mięśni</p>
            <p>{data.muscle_weight} kg</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentData;
