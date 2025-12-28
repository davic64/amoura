"use client";

import { TopHeader } from "@/components/layout/TopHeader";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MoodSection } from "@/components/home/MoodSection";
import { MissYouButton } from "@/components/home/MissYouButton";
import { NextEventSection } from "@/components/home/NextEventSection";
import { useEffect, useState } from "react";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if splash has already finished or wait for it
    const checkReady = () => {
      if (document.body.classList.contains("is-ready")) {
        setIsReady(true);
      }
    };

    checkReady();
    const timer = setInterval(checkReady, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-[#F8F5F6] pb-32">
      <div className="animate-fade-in">
        <TopHeader />
      </div>
      <div className="mx-auto max-w-md px-4 pt-2 space-y-4">
        <div className="animate-slide-up delay-200">
          <HomeHeader />
        </div>
        <div className="animate-slide-up delay-400">
          <MoodSection />
        </div>
        <div className="animate-slide-up delay-600">
          <MissYouButton />
        </div>
        <div className="animate-slide-up delay-800">
          <NextEventSection />
        </div>
      </div>
    </main>
  );
}
