import { NextResponse } from "next/server";
import { unlinkPartner } from "@/lib/profile";
import { createClient } from "@/lib/server-supabase";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await unlinkPartner(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in unlink API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
