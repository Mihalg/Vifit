import { stringOrDate } from "react-big-calendar";
import supabase from "./supabase";

export async function getCalendar() {
  const { data, error } = await supabase
    .from("planned_appointments")
    .select("id, start, end, title");

  if (error) throw new Error("Wystąpił błąd");

  const planned_appointments = data.map((item) => {
    return {
      ...item,
      start: new Date(item.start),
      end: new Date(item.end),
    };
  });

  return planned_appointments;
}

export async function editCalendar({
  dietitianId,
  events,
}: {
  dietitianId: string | undefined;
  events: {
    id?: number;
    start: stringOrDate;
    end: stringOrDate;
    title?: string;
  }[];
}) {
  if (!dietitianId) throw new Error("Nie udało się zapsiać kalendarza");

  const { error: deleteError } = await supabase
    .from("planned_appointments")
    .delete()
    .eq("dietitian_id", dietitianId);

  if (deleteError) {
    console.log(deleteError);
    throw new Error("Nie udało się zapsiać kalendarza");
  }

  const eventsToAdd = events.map((event) => {
    return {
      start: String(event.start),
      end: String(event.end),
      title: event.title,
      dietitian_id: dietitianId,
    };
  });

  const { error: addError } = await supabase
    .from("planned_appointments")
    .insert(eventsToAdd);

  if (addError) {
    console.log(addError);
    throw new Error("Nie udało się zapsiać kalendarza");
  }
}
