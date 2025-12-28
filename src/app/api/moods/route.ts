import { NextResponse } from "next/server";
import { submitMood, getRecentMoods } from "@/lib/home";
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
    const moods = await getRecentMoods(user.id);
    return NextResponse.json(moods);
  } catch (error: any) {
    console.error("Error in moods GET API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch moods" },
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

  const { mood, emoji } = await req.json();

  try {
    await submitMood(user.id, { user_id: user.id, mood, emoji } as any);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in moods POST API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
