import { supabase } from "./supabase";
import type { Plan } from "./types";

export async function getPlans(userId: string): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return data || [];
}

export async function createPlan(
  userId: string,
  plan: Partial<Plan>,
): Promise<Plan> {
  const { data, error } = await supabase
    .from("plans")
    .insert({
      ...plan,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating plan:", error);
    throw new Error("Error al crear plan");
  }

  return data;
}

export async function updatePlan(
  planId: string,
  userId: string,
  updates: Partial<Plan>,
): Promise<void> {
  const { error } = await supabase
    .from("plans")
    .update(updates)
    .eq("id", planId)
    .eq("created_by", userId);

  if (error) {
    console.error("Error updating plan:", error);
    throw new Error("Error al actualizar plan");
  }
}

export async function deletePlan(
  planId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId)
    .eq("created_by", userId);

  if (error) {
    console.error("Error deleting plan:", error);
    throw new Error("Error al eliminar plan");
  }
}
