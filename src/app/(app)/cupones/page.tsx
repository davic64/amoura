"use client";

import { useState } from "react";
import { Ticket, CheckCircle2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Coupon = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUsed: boolean;
};

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "1",
      title: "Vale por un masaje",
      description: "Un masaje relajante de 20 min",
      icon: "💆‍♂️",
      isUsed: false,
    },
    {
      id: "2",
      title: "Desayuno en la cama",
      description: "Preparo tu desayuno favorito",
      icon: "🍳",
      isUsed: false,
    },
    {
      id: "3",
      title: "Elegir la película",
      description: "Tú eliges qué vemos hoy",
      icon: "🎬",
      isUsed: true,
    },
    {
      id: "4",
      title: "Día sin quejas",
      description: "Prometo no quejarme de nada",
      icon: "😇",
      isUsed: false,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎁");

  const redeemCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isUsed: true } : c)),
    );
  };

  const addCoupon = () => {
    if (!newTitle.trim()) return;
    const coupon: Coupon = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      icon: newEmoji || "🎁",
      isUsed: false,
    };
    setCoupons([coupon, ...coupons]);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewEmoji("🎁");
  };

  return (
    <main className="min-h-screen bg-[#F8F5F6] pb-32">
      <header className="px-6 py-10 flex flex-col gap-1 animate-fade-in">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Mis Cupones
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Regalitos especiales para ti
        </p>
      </header>

      {/* Stats Summary */}
      <div className="px-6 mb-8 animate-scale-in delay-200">
        <div className="bg-white/50 backdrop-blur-sm rounded-[24px] p-4 flex items-center justify-around ring-1 ring-black/3">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F43E5C] mb-1">
              Disponibles
            </span>
            <span className="text-2xl font-black text-gray-900">
              {coupons.filter((c) => !c.isUsed).length}
            </span>
          </div>
          <div className="h-8 w-px bg-black/5" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              Canjeados
            </span>
            <span className="text-2xl font-black text-gray-400">
              {coupons.filter((c) => c.isUsed).length}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {coupons.map((coupon, index) => (
          <div
            key={coupon.id}
            style={{ animationDelay: `${400 + index * 150}ms` }}
            className={cn(
              "relative bg-white rounded-[32px] flex items-stretch transition-all overflow-hidden animate-slide-up",
              coupon.isUsed ? "opacity-60" : "shadow-sm shadow-[#F43E5C]/10",
            )}
          >
            {/* Ticket Notches */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 h-8 w-8 rounded-full bg-[#F8F5F6] z-10" />
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-8 w-8 rounded-full bg-[#F8F5F6] z-10" />

            {/* Icon Section */}
            <div
              className={cn(
                "w-24 shrink-0 flex items-center justify-center text-4xl",
                coupon.isUsed ? "bg-gray-50/50" : "bg-[#FFE5EB]/30",
              )}
            >
              {coupon.icon}
            </div>

            {/* Separator Perforation */}
            <div className="w-px border-l-2 border-dashed border-gray-100 my-4" />

            {/* Content Section */}
            <div className="flex-1 p-5 pr-8 flex flex-col">
              <div className="mb-4">
                <h3
                  className={cn(
                    "text-[17px] font-bold leading-[1.3] text-gray-900 tracking-tight",
                    coupon.isUsed && "text-gray-400 line-through",
                  )}
                >
                  {coupon.title}
                </h3>
                <p className="text-[11px] font-semibold text-gray-400 mt-1 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              <div className="flex justify-end mt-auto">
                {coupon.isUsed ? (
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#10B981] bg-[#D1FAE5]/50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    Completado
                  </div>
                ) : (
                  <Button
                    onClick={() => redeemCoupon(coupon.id)}
                    className="h-10 px-5 rounded-[16px] bg-[#F43E5C] hover:bg-[#F43E5C]/90 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#F43E5C]/20 active:scale-95 transition-all"
                  >
                    Canjear Cupón
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {coupons.filter((c) => !c.isUsed).length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-gray-200">
              <Ticket className="h-10 w-10" />
            </div>
            <p className="text-sm font-bold text-gray-400 max-w-[200px]">
              ¡Vaya! Parece que ya usaste todos tus cupones.
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button and Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogTrigger asChild>
          <button className="fixed bottom-32 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F43E5C] text-white shadow-2xl shadow-[#F43E5C]/40 active:scale-95 transition-all hover:scale-110">
            <Plus className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100">
          <div className="relative flex flex-col h-full overflow-hidden">
            <div className="absolute top-6 right-6 z-110">
              <button
                onClick={() => setIsAdding(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 flex flex-col gap-8">
              <header className="flex flex-col gap-1 py-2">
                <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                  Nuevo Cupón
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-gray-500">
                  Crea un regalo especial
                </DialogDescription>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    Título del regalo
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej: Vale por una cena..."
                    className="h-14 rounded-2xl border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    Descripción
                  </label>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Detalles del cupón..."
                    className="h-32 rounded-2xl border-none bg-white px-6 py-4 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    Elige un icono
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      "🎁",
                      "💆‍♂️",
                      "🍳",
                      "🎬",
                      "😇",
                      "🍕",
                      "🍷",
                      "✈️",
                      "🚗",
                      "🍿",
                      "🍦",
                      "☕",
                      "🛌",
                      "💖",
                      "🎟️",
                      "🎮",
                      "💐",
                      "🍔",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewEmoji(emoji)}
                        className={cn(
                          "h-12 w-12 flex items-center justify-center rounded-xl text-xl transition-all active:scale-90",
                          newEmoji === emoji
                            ? "bg-[#F43E5C] text-white shadow-lg shadow-[#F43E5C]/20"
                            : "bg-white ring-1 ring-black/5 hover:bg-white",
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5">
              <Button
                onClick={addCoupon}
                className="h-16 w-full rounded-[24px] bg-[#F43E5C] text-white font-black shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all text-lg"
              >
                Crear Cupón
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
