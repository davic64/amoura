"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { getRecentMoods } from "@/lib/home";
import { supabase } from "@/lib/supabase";

const ALL_MOODS = [
  { mood: "Feliz", emoji: "😊" },
  { mood: "Cansado", emoji: "😴" },
  { mood: "Enojado", emoji: "😠" },
  { mood: "Enamorado", emoji: "😍" },
  { mood: "Triste", emoji: "😢" },
  { mood: "Emocionado", emoji: "🤩" },
];

export function MoodSection() {
  const [myMood, setMyMood] = useState(ALL_MOODS[0]);
  const [partnerMood, setPartnerMood] = useState<(typeof ALL_MOODS)[0] | null>(
    null,
  );
  const [isPartnerLinked, setIsPartnerLinked] = useState(false);

  useEffect(() => {
    async function loadMoods() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const moods = await getRecentMoods(user.id);
        if (moods.myMood) {
          setMyMood(moods.myMood);
        }
        if (moods.partnerMood) {
          setPartnerMood(moods.partnerMood);
        }
        setIsPartnerLinked(!!moods.partnerMood);
      } catch (error) {
        console.error("Error loading moods:", error);
      }
    }

    loadMoods();
  }, []);

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-base font-semibold text-gray-500">
        Semáforo de Ánimo
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <Drawer>
          <DrawerTrigger asChild>
            <Card className="active:scale-95 transition-all cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <span className="mb-2 text-xs font-medium text-gray-400">
                  Yo
                </span>
                <span className="mb-2 text-4xl">{myMood.emoji}</span>
                <span className="text-sm font-bold text-gray-900">
                  {myMood.mood}
                </span>
              </CardContent>
            </Card>
          </DrawerTrigger>
          <DrawerContent className="bg-[#F8F5F6] border-none px-4 pb-12">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-200 mt-4 mb-6" />
            <DrawerHeader className="px-0 pt-0">
              <DrawerTitle className="text-2xl font-bold text-gray-900">
                ¿Cómo te sientes?
              </DrawerTitle>
              <DrawerDescription className="text-gray-500">
                Comparte tu estado de ánimo con tu pareja
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {ALL_MOODS.map((mood) => (
                <DrawerClose key={mood.mood} asChild>
                  <button
                    type="button"
                    onClick={() => setMyMood(mood)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-3xl p-4 transition-all active:scale-95",
                      myMood.mood === mood.mood
                        ? "bg-white ring-2 ring-[#F43E5C] shadow-md"
                        : "bg-white ring-1 ring-black/5 shadow-sm",
                    )}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs font-bold text-gray-900">
                      {mood.mood}
                    </span>
                  </button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        {partnerMood ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="mb-2 text-xs font-medium text-gray-400">
                Tu Pareja
              </span>
              <span className="mb-2 text-4xl">{partnerMood.emoji}</span>
              <span className="text-sm font-bold text-gray-900">Cariñosa</span>
            </CardContent>
          </Card>
        ) : isPartnerLinked ? (
          <Card className="opacity-60">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="mb-2 text-xs font-medium text-gray-400">
                Tu Pareja
              </span>
              <span className="mb-2 text-4xl">❓</span>
              <span className="text-sm font-bold text-gray-900">
                Sin actualizar
              </span>
            </CardContent>
          </Card>
        ) : (
          <Card className="opacity-60">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <span className="mb-2 text-xs font-medium text-gray-400">
                Tu Pareja
              </span>
              <span className="mb-2 text-4xl">🚫</span>
              <span className="text-sm font-bold text-gray-900">
                No vinculada
              </span>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
