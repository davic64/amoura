import { NextResponse } from "next/server";
import { getPlans, createPlan } from "@/lib/plans";
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
    const plans = await getPlans(user.id);
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("Error in plans GET API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch plans" },
      { status: 500 }
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

  const planData = await req.json();

  try {
    const plan = await createPlan(user.id, planData);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error("Error in plans POST API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
