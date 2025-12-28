import { supabase } from "./supabase";
import type { Mood, Event, MissYouLog } from "./types";

// MOODS
export async function submitMood(userId: string, mood: Mood): Promise<void> {
  const { error } = await supabase.from("moods").insert({
    user_id: userId,
    mood: mood.mood,
    emoji: mood.emoji,
  });

  if (error) {
    console.error("Error submitting mood:", error);
    throw new Error("Error al guardar ánimo");
  }
}

export async function getRecentMoods(userId: string): Promise<{
  myMood: Mood | null;
  partnerMood: Mood | null;
}> {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("user_id", userId)
    .single();

  const partnerId = profiles?.partner_id;
  if (!partnerId) {
    return { myMood: null, partnerMood: null };
  }

  const [myMoodResult, partnerMoodResult] = await Promise.all([
    supabase
      .from("moods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("moods")
      .select("*")
      .eq("user_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return {
    myMood: myMoodResult.data || null,
    partnerMood: partnerMoodResult.data || null,
  };
}

// EVENTS
export async function getUpcomingEvents(userId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString().split("T")[0])
    .in("status", ["pending", "accepted"])
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data || [];
}

export async function createEvent(
  userId: string,
  event: Partial<Event>,
): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...event,
      created_by: userId,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    throw new Error("Error al crear evento");
  }

  return data;
}

export async function updateEvent(
  eventId: string,
  userId: string,
  updates: Partial<Event>,
): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", eventId)
    .eq("created_by", userId);

  if (error) {
    console.error("Error updating event:", error);
    throw new Error("Error al actualizar evento");
  }
}

export async function deleteEvent(
  eventId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("created_by", userId);

  if (error) {
    console.error("Error deleting event:", error);
    throw new Error("Error al eliminar evento");
  }
}

// MISS YOU LOGS
export async function submitMissYou(
  userId: string,
  message?: string,
): Promise<void> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("user_id", userId)
    .single();

  const { error } = await supabase.from("miss_you_logs").insert({
    sender_id: userId,
    receiver_id: profile?.partner_id || null,
    message: message || null,
  });

  if (error) {
    console.error("Error submitting miss you:", error);
    throw new Error("Error al enviar");
  }
}

export async function getRecentMissYouCount(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("miss_you_logs")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .gte(
      "created_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    );

  if (error) {
    console.error("Error fetching miss you count:", error);
    return 0;
  }

  return data?.length || 0;
}
