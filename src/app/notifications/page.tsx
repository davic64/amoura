"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCheck, Bell } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "¡Luis te envió un beso!",
    time: "Hace 2 min",
    icon: "💋",
    unread: true,
  },
  {
    id: 2,
    title: "Tu cena romántica es mañana",
    time: "Hace 1 hora",
    icon: "🍷",
    unread: true,
  },
  {
    id: 3,
    title: "Nuevo cupón disponible",
    time: "Hace 3 horas",
    icon: "🎟️",
    unread: false,
  },
];

export default function NotificacionesPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <main className="bg-[#F8F5F6] pb-8">
      <header className="flex items-center justify-between px-4 py-6 bg-[#F8F5F6]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-black/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gray-900 shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex h-12 px-5 items-center gap-2 rounded-2xl bg-white text-[#F43E5C] text-sm font-bold shadow-sm ring-1 ring-black/5 active:scale-95 transition-all outline-none"
        >
          <CheckCheck className="h-5 w-5" />
          <span className="hidden sm:inline">Marcar leídas</span>
        </button>
      </header>

      <div className="mx-auto max-w-md px-4 mt-8 flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Alert
              key={n.id}
              className="relative overflow-hidden pr-10 border-none shadow-sm ring-1 ring-black/5 bg-white rounded-3xl p-5 flex gap-4 items-center"
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#F43E5C] transition-opacity duration-300"
                style={{ opacity: n.unread ? 1 : 0 }}
              />
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFE5EB] text-2xl">
                {n.icon}
              </div>
              <div className="flex flex-col gap-1">
                <AlertTitle className="text-sm font-bold text-gray-900 leading-none">
                  {n.title}
                </AlertTitle>
                <AlertDescription className="text-xs text-gray-400">
                  {n.time}
                </AlertDescription>
              </div>
              {n.unread && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-[#F43E5C]" />
              )}
            </Alert>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-sm ring-1 ring-black/5 mb-4 opacity-50">
              <Bell className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium text-sm">
              No tienes notificaciones pendientes
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
