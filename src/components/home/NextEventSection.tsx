"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Calendar } from "lucide-react";

export function NextEventSection() {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-base font-semibold text-gray-500">
        Próximo Evento
      </h2>
      <Card className="overflow-hidden">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFE5EB] text-[#F43E5C]">
            <Utensils className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-gray-900">
              Cena romántica
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="h-3 w-3" />
              <span>Lun 29 Dic • 20:00</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
