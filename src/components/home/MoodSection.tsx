"use client";

import { useState } from "react";
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

const ALL_MOODS = [
  { status: "Feliz", emoji: "😊" },
  { status: "Cansado", emoji: "😴" },
  { status: "Enojado", emoji: "😠" },
  { status: "Enamorado", emoji: "😍" },
  { status: "Triste", emoji: "😢" },
  { status: "Emocionado", emoji: "🤩" },
];

export function MoodSection() {
  const [myMood, setMyMood] = useState(ALL_MOODS[0]);

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
                  {myMood.status}
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
                <DrawerClose key={mood.status} asChild>
                  <button
                    onClick={() => setMyMood(mood)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-3xl p-4 transition-all active:scale-95",
                      myMood.status === mood.status
                        ? "bg-white ring-2 ring-[#F43E5C] shadow-md"
                        : "bg-white ring-1 ring-black/5 shadow-sm"
                    )}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs font-bold text-gray-900">
                      {mood.status}
                    </span>
                  </button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <span className="mb-2 text-xs font-medium text-gray-400">
              María
            </span>
            <span className="mb-2 text-4xl">🥰</span>
            <span className="text-sm font-bold text-gray-900">Cariñosa</span>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
