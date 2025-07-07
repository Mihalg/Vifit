import { getBMI, getBMR, getTMR } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editAppointment } from "@/services/apiAppointments";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { Textarea } from "../ui/Textarea";

type AppointmentFormProps = {
  data: {
    id: number;
    date: string | null;
    notes: string | null;
    age: number | null;
    height: number | null;
    weight: number | null;
    water_weight: number | null;
    fat_weight: number | null;
    muscle_weight: number | null;
    pal: number;
    users: {
      sex: "female" | "male" | null;
    } | null;
  };
};

type AppointmentFormFields = {
  age: number;
  weight: number;
  height: number;
  fat_weight: number;
  water_weight: number;
  muscle_weight: number;
  pal: number;
  date: string;
  notes: string;
  tmr: number;
  bmr: number;
  bmi: number;
};

function AppointmentForm({ data }: AppointmentFormProps) {
  const { patientId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<AppointmentFormFields>();
  const { mutate, isPending } = useMutation({
    mutationFn: editAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["appointmentsList", patientId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["appointment", String(data.id)],
      });
      await navigate(-1);
      toast.success("Edytowano wizytę!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<AppointmentFormFields> = (formData) => {
    mutate({ data: formData, id: data.id });
  };

  const bmr = getBMR(
    data.users ? data.users.sex : null,
    data.weight,
    data.height,
    data.age,
  );
  const tmr = getTMR(bmr ? +bmr : 0, data.pal);
  const bmi = getBMI(data.weight, data.height);

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
          defaultValue={data.age ? data.age : 0}
          id="age"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="weight">Masa ciała</Label>
        <Input
          required
          disabled={isPending}
          {...register("weight")}
          defaultValue={data.weight ? data.weight : 0}
          id="weight"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="height">Wzrost</Label>
        <Input
          required
          disabled={isPending}
          {...register("height")}
          defaultValue={data.height ? data.height : 0}
          id="height"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="waterWeight">Masa wody w organizmie</Label>
        <Input
          disabled={isPending}
          defaultValue={data.water_weight ? data.water_weight : 0}
          {...register("water_weight")}
          id="waterWeight"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="fatWeight">Masa tkanki tłuszczowej</Label>
        <Input
          disabled={isPending}
          {...register("fat_weight")}
          defaultValue={data.fat_weight ? data.fat_weight : 0}
          id="fatWeight"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="muscleWeight">Masa mięśni</Label>
        <Input
          {...register("muscle_weight")}
          disabled={isPending}
          defaultValue={data.muscle_weight ? data.muscle_weight : 0}
          id="muscleWeight"
          type="number"
        />
      </div>
      <div className="flex flex-col pt-1">
        <Label htmlFor="pal">Współczynnik aktywności fizycznej</Label>
        <select
          {...register("pal")}
          defaultValue={data.pal}
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
        <Label htmlFor="bmr">Podstawowa przemiana materii</Label>
        <Input disabled defaultValue={bmr} id="bmr" type="number" />
      </div>
      <div>
        <Label htmlFor="tmr">Całkowita przemiana materii</Label>
        <Input defaultValue={tmr} disabled id="tmr" type="number" />
      </div>
      <div>
        <Label htmlFor="bmi">Wskaźnik BMI</Label>
        <Input disabled defaultValue={bmi} id="bmi" type="number" />
      </div>
      <div>
        <Label htmlFor="waterPercentage">Procent wody w organizmie</Label>
        <Input
          defaultValue={
            data.water_weight && data.weight
              ? ((data.water_weight / data.weight) * 100).toFixed(2)
              : 0
          }
          disabled
          id="waterPercentage"
          type="number"
        />
      </div>

      <div>
        <Label htmlFor="fatPercentage">Procent tkanki tłuszczowej</Label>
        <Input
          defaultValue={
            data.fat_weight && data.weight
              ? ((data.fat_weight / data.weight) * 100).toFixed(2)
              : 0
          }
          disabled
          id="fatPercentage"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="date">Data</Label>
        <Input
          {...register("date")}
          required
          defaultValue={data.date ? data.date : ""}
          id="date"
          type="date"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notatki</Label>
        <Textarea
          disabled={isPending}
          {...register("notes")}
          defaultValue={data.notes ? data.notes : ""}
          id="notes"
        />
      </div>

      <Button
        disabled={isPending}
        className="ml-auto mt-auto w-40 lg:col-start-2"
      >
        Zapisz
      </Button>
    </form>
  );
}

export default AppointmentForm;
