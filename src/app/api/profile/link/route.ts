import { NextResponse } from "next/server";
import { linkPartner } from "@/lib/profile";
import { createClient } from "@/lib/server-supabase";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inviteCode } = await req.json();

  try {
    await linkPartner(user.id, inviteCode);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in link API:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
