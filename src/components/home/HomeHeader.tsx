"use client";

import { Heart, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, getPartnerProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

export function HomeHeader() {
  const [loading, setLoading] = useState(true);
  const [hasPartner, setHasPartner] = useState(false);
  const [daysTogether, setDaysTogether] = useState(0);
  const [userName, setUserName] = useState("");
  const [partnerName, setPartnerName] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        if (!profile) return;

        setHasPartner(!!profile.partner_id);
        setDaysTogether(profile.days_together || 0);
        setUserName(profile.full_name || "");

        if (profile.partner_id) {
          const partner = await getPartnerProfile(user.id);
          if (partner) {
            setPartnerName(partner.full_name || "");
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-6 text-white shadow-lg animate-pulse">
        <div className="h-32" />
      </div>
    );
  }

  if (!hasPartner) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              TU PERFIL
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                {userName || "Bienvenido"}
              </span>
              <UserPlus className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B92] via-[#E84C93] to-[#B345D1] p-6 text-white shadow-lg">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
            DÍAS JUNTOS
          </p>
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold tracking-tight">
              {daysTogether}
            </span>
            <Heart className="h-6 w-6 fill-white text-white animate-float" />
          </div>
        </div>

        <div className="flex -space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm group hover:z-10 transition-all duration-300">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm group hover:z-10 transition-all duration-300">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
