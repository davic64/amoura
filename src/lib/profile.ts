import { supabase } from "./supabase";
import type { Profile } from "./types";

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function getPartnerProfile(
  userId: string,
): Promise<Profile | null> {
  const { data: user } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("user_id", userId)
    .single();

  if (!user?.partner_id) {
    return null;
  }

  const { data: partner, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.partner_id)
    .single();

  if (error) {
    console.error("Error fetching partner profile:", error);
    return null;
  }

  return partner;
}

export async function linkPartner(
  userId: string,
  inviteCode: string,
): Promise<void> {
  const { data: partnerProfile, error: findError } = await supabase
    .from("profiles")
    .select("id, user_id, partner_id")
    .eq("invite_code", inviteCode)
    .single();

  if (findError) {
    throw new Error("Código de invitación inválido");
  }

  if (partnerProfile.partner_id) {
    throw new Error("Esta persona ya tiene pareja");
  }

  if (partnerProfile.user_id === userId) {
    throw new Error("No puedes vincularte a ti mismo");
  }

  const { error: linkError } = await supabase.rpc("link_partners", {
    user1_id: userId,
    user2_id: partnerProfile.user_id,
  });

  if (linkError) {
    console.error("Error linking partners:", linkError);
    throw new Error("Error al vincular parejas");
  }
}

export async function unlinkPartner(userId: string): Promise<void> {
  const { data: user } = await supabase
    .from("profiles")
    .select("partner_id")
    .eq("user_id", userId)
    .single();

  if (!user?.partner_id) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      partner_id: null,
      together_since: null,
      days_together: 0,
    })
    .or(`user_id.eq.${userId},user_id.eq.${user.partner_id}`);

  if (error) {
    console.error("Error unlinking partner:", error);
    throw new Error("Error al desvincular pareja");
  }
}

export async function updateTogetherSince(
  userId: string,
  date: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ together_since: date })
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating together since:", error);
    throw new Error("Error al actualizar fecha de relación");
  }
}

export async function updateProfile(
  userId: string,
  data: {
    full_name?: string;
    avatar_url?: string;
  },
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error("Error al actualizar perfil");
  }
}
