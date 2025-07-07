import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { Textarea } from "@/components/ui/Textarea";
import { addAppointment, getLastAppointment } from "@/services/apiAppointments";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

export type AppointmentFormFields = {
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

type User = {
  data: {
    user: {
      id: string;
    };
  };
};

function AddAppointment() {
  const { patientId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const date = format(new Date(), "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["lastAppointment", patientId],
    queryFn: () => getLastAppointment(patientId),
  });

  const { register, handleSubmit } = useForm<AppointmentFormFields>({
    defaultValues: {
      age: 0,
      weight: 0,
      height: 0,
      fat_weight: 0,
      water_weight: 0,
      muscle_weight: 0,
      pal: 1,
      date: date,
      notes: "",
    },
    values: data ? { ...data, date: date } : undefined,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: addAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["appointmentsList", patientId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["appointmentCharts", patientId],
      });
      await navigate(-1);
      toast.success("Dodano wizytę!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const dietitianId = queryClient.getQueryData<User>(["user"])?.data.user.id;
  const onSubmit: SubmitHandler<AppointmentFormFields> = (formData) => {
    mutate({
      data: formData,
      patientId: patientId ? +patientId : null,
      dietitianId: dietitianId,
    });
  };

  if (isLoading) return <Loader />;

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-8 gap-y-4 px-4 py-4 lg:grid-cols-2"
    >
      <div>
        <Label htmlFor="age">Wiek</Label>
        <Input
          required
          disabled={isPending}
          {...register("age")}
          id="age"
          type="number"
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="weight">Masa ciała</Label>
        <Input
          required
          disabled={isPending}
          {...register("weight")}
          id="weight"
          type="number"
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="height">Wzrost</Label>
        <Input
          required
          disabled={isPending}
          {...register("height")}
          id="height"
          type="number"
          min={0}
        />
      </div>

      <div className="flex shrink flex-col pt-1">
        <Label htmlFor="pal">Współczynnik aktywności fizycznej</Label>
        <select
          {...register("pal")}
          id="pal"
          className="h-[40px] rounded-md border-[1px] border-neutral-200 bg-white px-3 py-2 dark:border-none dark:border-neutral-800 dark:bg-neutral-600 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
        >
          <option value={1.2}>
            Brak aktywności fizycznej, siedziący tryb życia
          </option>
          <option value={1.4}>Niska aktywność fizyczna, niewielki ruch</option>
          <option value={1.6}>
            Średnia aktywność, np. 2-3 treningi w tygodniu
          </option>
          <option value={1.8}>
            Wysoka aktywność fizyczna, regularne treningi
          </option>
          <option value={2}>
            Bardzo wysoka aktywność, praca fizyczna lub zawodowy sport
          </option>
        </select>
      </div>
      <div>
        <Label htmlFor="waterWeight">Masa wody w organizmie</Label>
        <Input
          disabled={isPending}
          {...register("water_weight")}
          id="waterWeight"
          type="number"
          min={0}
          required
        />
      </div>
      <div>
        <Label htmlFor="fatWeight">Masa tkanki tłuszczowej</Label>
        <Input
          disabled={isPending}
          {...register("fat_weight")}
          id="fatWeight"
          type="number"
          min={0}
          required
        />
      </div>
      <div>
        <Label htmlFor="muscleWeight">Masa mięśni</Label>
        <Input
          {...register("muscle_weight")}
          disabled={isPending}
          id="muscleWeight"
          type="number"
          min={0}
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Data</Label>
        <Input {...register("date")} required id="date" type="date" />
      </div>
      <div>
        <Label htmlFor="notes">Notatki</Label>
        <Textarea disabled={isPending} {...register("notes")} id="notes" />
      </div>

      <Button disabled={isPending} className="ml-auto mt-auto w-40">
        Zapisz
      </Button>
    </form>
  );
}

export default AddAppointment;
