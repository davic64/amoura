import { TopHeader } from "@/components/layout/TopHeader";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MoodSection } from "@/components/home/MoodSection";
import { MissYouButton } from "@/components/home/MissYouButton";
import { NextEventSection } from "@/components/home/NextEventSection";

export default function Home() {
  return (
    <main className="bg-[#F8F5F6] pb-32">
      <TopHeader />
      <div className="mx-auto max-w-md px-4 pt-2">
        <HomeHeader />
        <MoodSection />
        <MissYouButton />
        <NextEventSection />
      </div>
    </main>
  );
}
