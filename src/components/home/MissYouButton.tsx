"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/lib/profile";
import { submitMissYou } from "@/lib/home";

export function MissYouButton() {
  const [hasPartner, setHasPartner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function checkPartner() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        if (profile) {
          setHasPartner(!!profile.partner_id);
        }
      } catch (error) {
        console.error("Error checking partner:", error);
      }
    }

    checkPartner();
  }, []);

  const handleClick = async () => {
    if (!hasPartner) return;

    setLoading(true);
    try {
      await submitMissYou();
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting miss you:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPartner) {
    return (
      <Button
        disabled={true}
        className="mt-6 w-full h-16 rounded-2xl bg-gray-200 text-gray-400 font-semibold text-lg flex items-center justify-center gap-3 cursor-not-allowed"
      >
        <Heart className="h-5 w-5" />
        Vincula tu pareja primero
      </Button>
    );
  }

  return (
    <Button
      disabled={loading || submitted}
      onClick={handleClick}
      variant="ghost"
      className="mt-6 w-full h-16 rounded-2xl bg-[#FFE5EB] hover:bg-[#FFD1DC] text-[#F43E5C] font-semibold text-lg flex items-center justify-center gap-3 border border-[#FFD1DC] transition-all duration-300 active:scale-95"
    >
      <Heart className="h-5 w-5" />
      {submitted ? "¡Enviado!" : "Te Extraño"}
    </Button>
  );
}
