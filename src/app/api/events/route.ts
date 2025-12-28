import { NextResponse } from "next/server";
import { getUpcomingEvents, createEvent } from "@/lib/home";
import { createClient } from "@/lib/server-supabase";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const events = await getUpcomingEvents(user.id);
    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error in events GET API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventData = await req.json();

  try {
    const event = await createEvent(user.id, eventData);
    return NextResponse.json(event);
  } catch (error: any) {
    console.error("Error in events POST API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
