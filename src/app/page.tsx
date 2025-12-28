import { TopHeader } from "@/components/layout/TopHeader";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MoodSection } from "@/components/home/MoodSection";
import { MissYouButton } from "@/components/home/MissYouButton";
import { NextEventSection } from "@/components/home/NextEventSection";

export default function Home() {
  return (
    <main className="bg-[#F8F5F6] pb-32">
      <div className="animate-fade-in">
        <TopHeader />
      </div>
      <div className="mx-auto max-w-md px-4 pt-2 space-y-4">
        <div className="animate-slide-up delay-100">
          <HomeHeader />
        </div>
        <div className="animate-slide-up delay-200">
          <MoodSection />
        </div>
        <div className="animate-slide-up delay-300">
          <MissYouButton />
        </div>
        <div className="animate-slide-up delay-400">
          <NextEventSection />
        </div>
      </div>
    </main>
  );
}
