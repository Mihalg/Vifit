import { ReactNode } from "react";
import supabase from "./supabase";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";

export async function getCalendar() {
  const { data, error } = await supabase
    .from("planned_appointments")
    .select("id, start, end, title, subtitle");

  if (error) throw new Error("Wystąpił błąd");

  const planned_appointments = data.map((item) => {
    return {
      event_id: item.id,
      start: new Date(item.start),
      end: new Date(item.end),
      title: item.title,
      subtitle: item.subtitle,
    };
  });

  return planned_appointments;
}

export async function createEditEvent({
  dietitianId,
  event,
}: {
  dietitianId: string | undefined;
  event: {
    event_id?: number | string;
    start: Date;
    end: Date;
    title: ReactNode;
    subtitle?: ReactNode;
  };
}): Promise<ProcessedEvent> {
  if (!dietitianId) throw new Error("Wystąpił błąd. Spróbuj ponownie później");

  if (!event.event_id) {
    delete event.event_id;
    //ADD
    const { data, error } = await supabase
      .from("planned_appointments")
      .insert({ dietitian_id: dietitianId, ...event })
      .select()
      .single();

    if (error) {
      console.log(error);
      throw new Error("Wystąpił błąd. Nie udało się dodać wydarzenia.");
    } else {
      return {
        event_id: data.id,
        start: event.start,
        end: event.end,
        title: data.title,
        subtitle: data.subtitle,
      };
    }
  } else {
    console.log(event);
    const { error } = await supabase
      .from("planned_appointments")
      .update({
        start: event.start,
        end: event.end,
        title: event.title,
        subtitle: event.subtitle,
      })
      .eq("id", +event.event_id);

    if (error) {
      console.log(error);
      throw new Error("Wystąpił błąd. Nie udało się edytować wydarzenia.");
    } else {
      return event as ProcessedEvent;
    }
  }
}

export async function deleteEvent(eventId: string | number) {
  const { error } = await supabase
    .from("planned_appointments")
    .delete()
    .eq("id", +eventId);
  if (error) {
    console.log(error);
    throw new Error("Wystąpił błąd. Nie udało się usunąć wydarzenia.");
  } else {
    return eventId;
  }
}
