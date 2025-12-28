"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Calendar } from "lucide-react";
import { getUpcomingEvents } from "@/lib/home";
import { getProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

export function NextEventSection() {
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [hasPartner, setHasPartner] = useState(false);

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        if (profile) {
          setHasPartner(!!profile.partner_id);
        }

        const events = await getUpcomingEvents(user.id);
        setUpcomingEvents(events);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-gray-500">
          Próximo Evento
        </h2>
        <Card className="overflow-hidden animate-pulse">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-32" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!hasPartner) {
    return (
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-gray-500">
          Próximo Evento
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="flex items-center justify-center p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Utensils className="h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">
                No hay eventos próximos
              </p>
              <p className="text-xs text-gray-400">
                Vincula tu pareja para planear juntos
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-gray-500">
          Próximo Evento
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="flex items-center justify-center p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Calendar className="h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">
                No hay eventos próximos
              </p>
              <p className="text-xs text-gray-400">¡Crea el primero!</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const nextEvent = upcomingEvents[0];

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
              {nextEvent.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(nextEvent.event_date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                {nextEvent.event_time}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
