import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile";
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
    const profile = await getProfile(user.id);
    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Error in profile API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
