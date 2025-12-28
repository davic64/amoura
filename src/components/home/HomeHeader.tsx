"use client";

import { Heart, User } from "lucide-react";

export function HomeHeader() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FF6B92] via-[#E84C93] to-[#B345D1] p-6 text-white shadow-lg">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
            DÍAS JUNTOS
          </p>
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold tracking-tight">1079</span>
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

      {/* Decorative circles to match the image bubbles */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
    </div>
  );
}
