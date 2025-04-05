import { Button } from "@/components/ui/Button";
import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { pl } from "date-fns/locale/pl";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer, stringOrDate } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import toast from "react-hot-toast";
import "../../react-big-calendar.css";
import useDietitianId from "@/hooks/useDietitianId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editCalendar, getCalendar } from "@/services/apiCalendar";
import Loader from "@/components/ui/Loader";

type CalendarEvent = {
  event: {
    id?: number;
    start?: stringOrDate;
    end?: stringOrDate;
    title?: string;
  };
  start: stringOrDate;
  end: stringOrDate;
};

const DnDCalendar = withDragAndDrop(Calendar);

const locales = {
  pl: pl,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function PlannedAppointments() {
  const queryClient = useQueryClient();
  const dietitianId = useDietitianId();
  const { data, isLoading } = useQuery({
    queryKey: ["calendar"],
    queryFn: getCalendar,
  });

  const isSucces = useRef(false);
  useEffect(() => {
    //Check if calendar has been already updated
    if (data && !isSucces.current) {
      setEvents(data);
      isSucces.current = true;
    }
  }, [isSucces, data]);

  const [events, setEvents] = useState<
    {
      id?: number;
      start: stringOrDate;
      end: stringOrDate;
      title?: string;
    }[]
  >([]);

  const { mutateAsync } = useMutation({
    mutationFn: editCalendar,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });

  function handleSelectEvent(event: {
    id?: number;
    start?: stringOrDate;
    end?: stringOrDate;
    title?: string;
  }) {
    toast((t) => (
      <div>
        Usunąć &quot;{event.title}&quot;?
        <Button
          className="ml-4"
          onClick={() => {
            toast.dismiss(t.id);
            setEvents((prev) => {
              const prevStringified = prev.map((e) => JSON.stringify(e));
              const idx = prevStringified.indexOf(JSON.stringify(event));
              const events = [...prev];
              events.splice(idx, 1);
              return events;
            });
          }}
        >
          Usuń
        </Button>
      </div>
    ));
  }

  function handleSelectSlot({
    start,
    end,
  }: {
    start: stringOrDate;
    end: stringOrDate;
  }) {
    const title = window.prompt("Podaj nazwę wydarzenia");
    if (title) {
      setEvents((prev) => [...prev, { start, end, title }]);
    }
  }

  function moveEvent({ event, start, end }: CalendarEvent) {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end }];
    });
  }

  function resizeEvent({ event, start, end }: CalendarEvent) {
    setEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end }];
    });
  }

  if (isLoading) return <Loader />;

  return (
    <div className="relative h-svh px-4 py-4">
      <DnDCalendar
        className="max-h-[93%]"
        messages={{
          week: "Tydzień",
          work_week: "Tydzień roboczy",
          day: "Dzień",
          month: "Miesiąc",
          previous: "Cofnij",
          next: "Następny",
          today: "Dziś",
          agenda: "Plan",
          date: "Data",
          time: "Godzina",
          event: "Wydarzenie",
          showMore: (total) => `+${total} więciej`,
        }}
        defaultDate={new Date()}
        defaultView="day"
        events={events}
        localizer={localizer}
        culture="pl"
        popup
        selectable
        resizable
        allDayMaxRows={0}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      <Button
        onClick={() => {
          void toast.promise(mutateAsync({ dietitianId, events }), {
            loading: "Zapisywanie...",
            success: "Sukces",
            error: "Nie udało się zapisać kalendarza",
          });
        }}
        className="ml-auto mt-4 block"
      >
        Zapisz
      </Button>
    </div>
  );
}

export default PlannedAppointments;
