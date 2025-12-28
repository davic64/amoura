"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Package,
  Film,
  UtensilsCrossed,
  Plus,
  ExternalLink,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
  timestamp: number;
  link?: string;
};

type QuickAccess = {
  id: string;
  title: string;
  icon: any;
  items: ListItem[];
  color: string;
  bgColor: string;
};

const INITIAL_LISTS: QuickAccess[] = [
  {
    id: "compras",
    title: "Artículos",
    icon: Package,
    items: [
      {
        id: "1",
        text: "Leche deslactosada",
        completed: false,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: "2",
        text: "Aguacates maduros",
        completed: true,
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
      },
    ],
    color: "#F43E5C",
    bgColor: "#FFE5EB",
  },
  {
    id: "pelis",
    title: "Películas",
    icon: Film,
    items: [
      {
        id: "3",
        text: "Deadpool & Wolverine",
        completed: false,
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
      },
    ],
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
  },
  {
    id: "restaurantes",
    title: "Restaurantes",
    icon: UtensilsCrossed,
    items: [
      {
        id: "4",
        text: "Takumi Sushi",
        completed: true,
        timestamp: Date.now() - 1000 * 60 * 60 * 8,
        link: "https://takumisushi.com",
      },
    ],
    color: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    id: "wishlist",
    title: "Wishlist",
    icon: Heart,
    items: [
      {
        id: "5",
        text: "Viaje a París",
        completed: false,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
        link: "https://paris.fr",
      },
    ],
    color: "#EC4899",
    bgColor: "#FCE7F3",
  },
];

export default function PlanesPage() {
  const [lists, setLists] = useState<QuickAccess[]>(INITIAL_LISTS);
  const [selectedList, setSelectedList] = useState<QuickAccess | null>(null);
  const [newItemText, setNewItemText] = useState("");
  const [newItemLink, setNewItemLink] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [targetListId, setTargetListId] = useState(INITIAL_LISTS[0].id);

  const toggleItem = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item,
          ),
        };
      }),
    );
  };

  const addItemToList = (listId: string, text: string, link?: string) => {
    if (!text.trim()) return;

    const newItem: ListItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: text,
      completed: false,
      timestamp: Date.now(),
      link: link?.trim() || undefined,
    };

    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return { ...list, items: [newItem, ...list.items] };
      }),
    );

    setNewItemText("");
    setNewItemLink("");
    setIsAddingItem(false);
  };

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return { ...list, items: list.items.filter((i) => i.id !== itemId) };
      }),
    );
  };

  const recentItems = useMemo(() => {
    const all = lists.flatMap((l) =>
      l.items.map((i) => ({
        ...i,
        listTitle: l.title,
        listBg: l.bgColor,
        listColor: l.color,
        listId: l.id,
      })),
    );
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
  }, [lists]);

  const currentSelectedList = selectedList
    ? lists.find((l) => l.id === selectedList.id)
    : null;

  return (
    <main className="min-h-screen bg-[#F8F5F6] pb-32">
      <header className="px-6 py-10 flex flex-col gap-1 animate-fade-in">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Planes
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Nuestras listas y deseos
        </p>
      </header>

      <section className="mb-10 px-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-600">
            Accesos Rápidos
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {lists.map((list, index) => {
            const Icon = list.icon;
            return (
              <button
                key={list.id}
                onClick={() => setSelectedList(list)}
                style={{ animationDelay: `${200 + index * 150}ms` }}
                className="bg-white rounded-[32px] p-5 flex flex-col items-start gap-4 shadow-sm ring-1 ring-black/5 active:scale-95 transition-all animate-scale-in"
              >
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: list.bgColor, color: list.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 block">
                    {list.title}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400">
                    {list.items.length} items
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-6 mb-10">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-600">Recientes</h2>
        </div>

        <div className="flex flex-col gap-3">
          {recentItems.map((item, index) => (
            <Card
              key={item.id}
              style={{ animationDelay: `${600 + index * 150}ms` }}
              className="overflow-hidden rounded-[24px] border-none shadow-sm ring-1 ring-black/5 active:scale-[0.98] transition-all animate-slide-up"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: item.listBg,
                      color: item.listColor,
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {item.text}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">
                        En {item.listTitle}
                      </p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-md hover:bg-black/5"
                        >
                          <ExternalLink className="h-2.5 w-2.5 text-[#F43E5C]" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-300">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Floating Add Button */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogTrigger asChild>
          <button className="fixed bottom-32 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F43E5C] text-white shadow-2xl shadow-[#F43E5C]/40 active:scale-95 transition-all hover:scale-110">
            <Plus className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100">
          <div className="relative flex flex-col h-full overflow-hidden">
            <div className="absolute top-6 right-6 z-110">
              <button
                onClick={() => setIsAddingItem(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 flex flex-col gap-8">
              <header className="flex flex-col gap-1 py-2">
                <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                  Nuevo Item
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-gray-500">
                  Agrega algo nuevo a nuestras listas
                </DialogDescription>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    ¿A qué lista?
                  </label>
                  <Select value={targetListId} onValueChange={setTargetListId}>
                    <SelectTrigger className="h-14 rounded-2xl border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus:ring-[#F43E5C]/20 text-base font-bold w-full">
                      <SelectValue placeholder="Seleccionar lista..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl ring-1 ring-black/5">
                      {lists.map((list) => (
                        <SelectItem
                          key={list.id}
                          value={list.id}
                          className="h-14 font-bold focus:bg-[#FFE5EB] focus:text-[#F43E5C] transition-colors px-6"
                        >
                          {list.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    Descripción
                  </label>
                  <Textarea
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Escribe aquí..."
                    className="h-32 rounded-2xl border-none bg-white px-6 py-4 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                    Link (Opcional)
                  </label>
                  <Input
                    value={newItemLink}
                    onChange={(e) => setNewItemLink(e.target.value)}
                    placeholder="https://..."
                    className="h-14 rounded-2xl border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                  />
                </div>
              </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5">
              <Button
                onClick={() =>
                  addItemToList(targetListId, newItemText, newItemLink)
                }
                className="h-16 w-full rounded-[24px] bg-[#F43E5C] text-white font-black shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all text-lg"
              >
                Guardar Item
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>

      {/* List Detail Dialog */}
      <Dialog
        open={!!selectedList}
        onOpenChange={(open) => !open && setSelectedList(null)}
      >
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100">
          <div className="relative flex flex-col h-full overflow-hidden">
            <div className="absolute top-6 right-6 z-110">
              <button
                onClick={() => setSelectedList(null)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32 flex flex-col">
              <header className="flex flex-col gap-4 py-8 mb-4">
                <div
                  className="h-16 w-16 rounded-3xl flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: currentSelectedList?.bgColor,
                    color: currentSelectedList?.color,
                  }}
                >
                  {currentSelectedList && (
                    <currentSelectedList.icon className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">
                    {currentSelectedList?.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-500 mt-1">
                    Gestiona tu lista de{" "}
                    {currentSelectedList?.title.toLowerCase()}
                  </DialogDescription>
                </div>
              </header>

              <div className="flex flex-col gap-2">
                {currentSelectedList?.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl transition-all group",
                      item.completed
                        ? "bg-white/40 opacity-60"
                        : "bg-white shadow-sm ring-1 ring-black/5",
                    )}
                  >
                    <button
                      onClick={() =>
                        currentSelectedList &&
                        toggleItem(currentSelectedList.id, item.id)
                      }
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-[#10B981] shrink-0" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-200 shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-bold tracking-tight truncate",
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-900",
                        )}
                      >
                        {item.text}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 flex items-center justify-center text-[#F43E5C] bg-[#FFE5EB] rounded-lg transition-all active:scale-90"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() =>
                          currentSelectedList &&
                          removeItemFromList(currentSelectedList.id, item.id)
                        }
                        className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {currentSelectedList?.items.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-gray-200">
                      {currentSelectedList && (
                        <currentSelectedList.icon className="h-10 w-10" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-400">
                      No hay nada en esta lista todavía.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <footer className="p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5 sticky bottom-0">
              <Button
                onClick={() => setSelectedList(null)}
                className="w-full h-14 rounded-2xl bg-white text-gray-900 font-black shadow-sm ring-1 ring-black/5 active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Cerrar lista
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
