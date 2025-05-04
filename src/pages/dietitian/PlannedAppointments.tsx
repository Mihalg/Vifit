import useDietitianId from "@/hooks/useDietitianId";
import { UseDarkModeContext } from "@/lib/utils";
import {
  createEditEvent,
  deleteEvent,
  getCalendar,
} from "@/services/apiCalendar";
import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { createTheme, ThemeProvider } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pl } from "date-fns/locale/pl";
import toast from "react-hot-toast";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#4f46e5",
    },
    grey: {
      "300": "#696969",
    },
    background: {
      paper: "#161617",
    },
    error: {
      main: "#4f46e5",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#4f46e5",
    },
    error: {
      main: "#4f46e5",
    },
  },
});

function PlannedAppointments() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const { isDarkModeOn } = UseDarkModeContext();

  const { refetch } = useQuery<ProcessedEvent[]>({
    queryKey: ["calendar"],
    queryFn: getCalendar,
    enabled: false,
  });

  const { mutateAsync: handleAddEdit } = useMutation({
    mutationFn: createEditEvent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutateAsync: handleDelete } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="relative z-0 mt-12 px-4 py-4 xl:mt-0">
      <ThemeProvider theme={isDarkModeOn ? darkTheme : lightTheme}>
        <Scheduler
          hourFormat="24"
          draggable={false}
          getRemoteEvents={async () => {
            const { data } = await refetch();
            return data;
          }}
          onDelete={(eventId) => handleDelete(eventId)}
          onConfirm={async (event) =>
            await handleAddEdit({ dietitianId, event })
          }
          timeZone="CET"
          locale={pl}
          day={{
            startHour: 7,
            endHour: 21,
            step: 60,
            navigation: true,
          }}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: 7,
            endHour: 21,
            step: 60,
            navigation: true,
          }}
          month={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: 7,
            endHour: 21,
            step: 60,
            navigation: true,
          }}
          translations={{
            navigation: {
              month: "Miesiąc",
              week: "Tydzień",
              day: "Dzień",
              today: "Dziś",
              agenda: "Plan",
            },
            form: {
              addTitle: "Dodaj wydarzenie",
              editTitle: "Edytuj wydarzenie",
              confirm: "Zapisz",
              delete: "Usuń",
              cancel: "Anuluj",
            },
            event: {
              title: "Tytuł",
              subtitle: "Podtytuł",
              start: "Start",
              end: "Koniec",
              allDay: "Cały dzień",
            },
            validation: {
              required: "Wymagane",
              invalidEmail: "Niepoprawny e-mail",
              onlyNumbers: "Tylko cyfry",
              min: "Minimalnie 3 litery",
              max: "Za dużo znaków",
            },
            moreEvents: "Więcej...",
            noDataToDisplay: "Brak danych do wyświetlenia",
            loading: "Ładowanie...",
          }}
        />
      </ThemeProvider>
    </div>
  );
}

export default PlannedAppointments;
