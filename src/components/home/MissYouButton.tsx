"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function MissYouButton() {
  return (
    <Button
      variant="ghost"
      className="mt-6 w-full h-16 rounded-2xl bg-[#FFE5EB] hover:bg-[#FFD1DC] text-[#F43E5C] font-semibold text-lg flex items-center justify-center gap-3 border border-[#FFD1DC] transition-all duration-300 active:scale-95"
    >
      <Heart className="h-5 w-5" />
      Te Extraño
    </Button>
  );
}
