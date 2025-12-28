import { NextResponse } from "next/server";
import { submitMissYou } from "@/lib/home";
import { createClient } from "@/lib/server-supabase";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  try {
    await submitMissYou(user.id, message);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in miss-you POST API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
