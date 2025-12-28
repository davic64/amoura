"use client";

import { useState, useMemo, useRef } from "react";
import {
  Plus,
  MoreVertical,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Trash2,
  Edit2,
  Unlock,
  Camera,
  X,
  MessageCircle,
  Send,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Moment = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  isSecret: boolean;
  unlockDate?: string;
  isNewUnlock?: boolean;
  comments?: { id: string; text: string; user: string; date: string }[];
};

const INITIAL_MOMENTS: Moment[] = [
  {
    id: "1",
    title: "Nuestra primera cita",
    description:
      "Inolvidable tarde café y risas que duraron horas. Nunca olvidaré cómo me miraste aquel día.",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    date: "2023-10-15",
    isSecret: false,
    comments: [
      {
        id: "c1",
        text: "¡El mejor día de mi vida! ❤️",
        user: "María",
        date: "2023-10-15",
      },
    ],
  },
  {
    id: "2",
    title: "TOP SECRET",
    description: "Algo especial está por venir...",
    image: "",
    date: "2025-12-31",
    isSecret: true,
    unlockDate: "2025-12-31",
  },
  {
    id: "3",
    title: "Carta de Aniversario",
    description:
      "Lo que escribí para ti cuando cumplimos nuestro primer año juntos. Eres mi persona favorita.",
    image:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    date: "2024-10-15",
    isSecret: true,
    unlockDate: "2024-10-15",
    isNewUnlock: true,
  },
];

export default function MomentosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [showSecrets, setShowSecrets] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newIsSecret, setNewIsSecret] = useState(false);
  const [newUnlockDate, setNewUnlockDate] = useState("");
  const [tempComments, setTempComments] = useState<Record<string, string>>({});
  const [expandedMoments, setExpandedMoments] = useState<Set<string>>(
    new Set()
  );

  const today = new Date().toISOString().split("T")[0];

  const toggleExpand = (id: string) => {
    const next = new Set(expandedMoments);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedMoments(next);
  };

  const addCommentToMoment = (momentId: string) => {
    const text = tempComments[momentId];
    if (!text?.trim()) return;

    setMoments(
      moments.map((m) =>
        m.id === momentId
          ? {
              ...m,
              comments: [
                ...(m.comments || []),
                {
                  id: Date.now().toString(),
                  text: text.trim(),
                  user: "Yo",
                  date: today,
                },
              ],
            }
          : m
      )
    );

    setTempComments({ ...tempComments, [momentId]: "" });
  };

  const filteredMoments = useMemo(() => {
    let list = moments.filter((m) => showSecrets || !m.isSecret);

    return list.sort((a, b) => {
      const aLocked = a.isSecret && a.unlockDate && a.unlockDate > today;
      const bLocked = b.isSecret && b.unlockDate && b.unlockDate > today;

      if (aLocked && !bLocked) return -1;
      if (!aLocked && bLocked) return 1;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [moments, showSecrets, today]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setNewImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddMoment = () => {
    const moment: Moment = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      image:
        newImage ||
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      date: today,
      isSecret: newIsSecret,
      unlockDate: newIsSecret ? newUnlockDate : undefined,
    };
    setMoments([...moments, moment]);
    resetForm();
    setIsAddOpen(false);
  };

  const handleEditMoment = () => {
    if (!editingMoment) return;
    setMoments(
      moments.map((m) =>
        m.id === editingMoment.id
          ? {
              ...m,
              title: newTitle,
              description: newDesc,
              image: newImage,
              isSecret: newIsSecret,
              unlockDate: newIsSecret ? newUnlockDate : undefined,
            }
          : m
      )
    );
    resetForm();
    setEditingMoment(null);
  };

  const deleteMoment = (id: string) => {
    setMoments(moments.filter((m) => m.id !== id));
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewImage("");
    setNewIsSecret(false);
    setNewUnlockDate("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (m: Moment) => {
    setEditingMoment(m);
    setNewTitle(m.title);
    setNewDesc(m.description);
    setNewImage(m.image);
    setNewIsSecret(m.isSecret);
    setNewUnlockDate(m.unlockDate || "");
    setIsAddOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#F8F5F6] pb-32">
      <header className="flex items-center justify-between px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Momentos</h1>

        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-sm ring-1 ring-black/5">
          {showSecrets ? (
            <Eye className="h-4 w-4 text-[#F43E5C]" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
          <Switch
            checked={showSecrets}
            onCheckedChange={setShowSecrets}
            className="scale-75"
          />
        </div>
      </header>

      {/* Floating Add Button */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddOpen(false);
            setEditingMoment(null);
            resetForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <button
            onClick={() => setIsAddOpen(true)}
            className="fixed bottom-32 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F43E5C] text-white shadow-2xl shadow-[#F43E5C]/40 active:scale-95 transition-all hover:scale-110"
          >
            <Plus className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-none w-screen h-screen m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100">
          <div className="relative flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 flex flex-col gap-8">
              <header className="flex flex-col gap-1 py-4">
                <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                  {editingMoment ? "Editar Momento" : "Nuevo Momento"}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-gray-500">
                  {editingMoment
                    ? "Actualiza tu recuerdo especial"
                    : "Captura un instante inolvidable"}
                </DialogDescription>
              </header>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                  Detalles
                </Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Dale un título..."
                  className="h-14 rounded-[24px] border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                />
                <Textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Cuenta la historia aquí..."
                  className="min-h-[140px] rounded-[24px] border-none bg-white p-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base leading-relaxed"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                  Imagen
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-3 rounded-[40px] border-2 border-dashed border-black/5 bg-white/50 p-10 transition-all hover:bg-white active:scale-[0.98] overflow-hidden",
                    newImage && "border-solid border-[#F43E5C]/10"
                  )}
                >
                  {newImage ? (
                    <>
                      <img
                        src={newImage}
                        alt="Preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                      <div className="relative z-10 flex flex-col items-center gap-2 text-white drop-shadow-lg">
                        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Camera className="h-6 w-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Cambiar foto
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#FFE5EB] text-[#F43E5C] mb-2 shadow-inner">
                        <Camera className="h-10 w-10" />
                      </div>
                      <div className="text-center">
                        <span className="text-base font-bold text-gray-900">
                          Sube una foto
                        </span>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          Vuestros momentos favoritos
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-sm ring-1 ring-black/5 space-y-8 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold text-gray-900">
                      Momento secreto
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Ocultar hasta una fecha especial
                    </span>
                  </div>
                  <Switch
                    checked={newIsSecret}
                    onCheckedChange={setNewIsSecret}
                  />
                </div>

                {newIsSecret && (
                  <div className="space-y-4 pt-6 border-t border-black/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Fecha de apertura
                    </Label>
                    <Input
                      type="date"
                      value={newUnlockDate}
                      onChange={(e) => setNewUnlockDate(e.target.value)}
                      className="h-14 rounded-2xl border-none bg-[#F8F5F6] px-6 shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5">
              <Button
                onClick={editingMoment ? handleEditMoment : handleAddMoment}
                className="h-16 w-full rounded-[24px] bg-[#F43E5C] text-white font-black shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all text-lg"
              >
                {editingMoment ? "Guardar cambios" : "Publicar momento"}
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 flex flex-col gap-4">
        {filteredMoments.map((m) => {
          const isLocked = m.isSecret && m.unlockDate && m.unlockDate > today;
          const daysLeft = isLocked
            ? Math.ceil(
                (new Date(m.unlockDate!).getTime() -
                  new Date(today).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : 0;

          return (
            <Card
              key={m.id}
              className={cn(
                "overflow-hidden transition-all duration-300 rounded-[32px] border-none shadow-md ring-1 ring-black/5",
                isLocked
                  ? "bg-linear-to-br from-gray-900 to-gray-800 text-white"
                  : "bg-white"
              )}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {isLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-md">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 animate-pulse">
                      <Lock className="h-10 w-10 text-white" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-[#F43E5C] mb-2">
                      Top Secret
                    </span>
                    <h3 className="text-xl font-bold text-center mb-4">
                      Este momento está bloqueado
                    </h3>
                    <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm border border-white/5">
                      <Calendar className="h-4 w-4" />
                      Faltan {daysLeft} días
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    {m.isNewUnlock && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#F43E5C] shadow-sm ring-1 ring-[#F43E5C]/20">
                        <Unlock className="h-3 w-3" />
                        ¡Desbloqueado!
                      </div>
                    )}
                  </>
                )}

                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md border border-white/20 shadow-lg active:scale-90 transition-all",
                          isLocked
                            ? "bg-white/10 text-white"
                            : "bg-white/40 text-gray-900"
                        )}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-2xl border-none bg-white p-2 shadow-2xl ring-1 ring-black/5"
                    >
                      <DropdownMenuItem
                        onClick={() => startEdit(m)}
                        className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-gray-700 hover:bg-[#F8F5F6] cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4 text-[#F43E5C]" /> Editar
                        momento
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMoment(m.id)}
                        className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" /> Eliminar momento
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className={cn(
                        "text-xl font-black tracking-tight leading-tight",
                        isLocked ? "text-white" : "text-gray-900"
                      )}
                    >
                      {isLocked ? "Momento Secreta" : m.title}
                    </h3>
                    <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-[#F8F5F6]/50 px-3 py-1 border border-black/5">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {new Date(m.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-sm leading-relaxed font-medium",
                      isLocked ? "text-gray-400 italic" : "text-gray-600"
                    )}
                  >
                    {isLocked
                      ? "No puedes ver la descripción todavía... ¡Ten paciencia!"
                      : m.description}
                  </p>

                  {!isLocked && (
                    <div className="mt-4 pt-4 border-t border-black/5 flex flex-col gap-3">
                      {m.comments && m.comments.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {m.comments.length > 1 && (
                            <button
                              onClick={() => toggleExpand(m.id)}
                              className="text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors text-left"
                            >
                              {expandedMoments.has(m.id)
                                ? "Ocultar comentarios"
                                : `Ver los ${m.comments.length} comentarios`}
                            </button>
                          )}

                          <div className="flex flex-col gap-4">
                            {(expandedMoments.has(m.id)
                              ? m.comments
                              : [m.comments[m.comments.length - 1]]
                            ).map((comment) => (
                              <div
                                key={comment.id}
                                className="flex gap-3 items-start group"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F5F6] border border-black/5 shadow-sm transition-transform group-hover:scale-105">
                                  <User className="h-4 w-4 text-[#F43E5C]" />
                                </div>
                                <div className="flex flex-col gap-0.5 pt-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black uppercase text-gray-900 tracking-tight">
                                      {comment.user}
                                    </span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                      {new Date(
                                        comment.date
                                      ).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-gray-600 font-medium leading-relaxed">
                                    {comment.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="relative mt-1">
                        <Input
                          value={tempComments[m.id] || ""}
                          onChange={(e) =>
                            setTempComments({
                              ...tempComments,
                              [m.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && addCommentToMoment(m.id)
                          }
                          placeholder="Añade un comentario..."
                          className="h-9 rounded-xl border-none bg-transparent p-0 text-[11px] font-medium placeholder:text-gray-300 focus-visible:ring-0 shadow-none"
                        />
                        {tempComments[m.id]?.trim() && (
                          <button
                            onClick={() => addCommentToMoment(m.id)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-black text-[#F43E5C] active:scale-95 transition-all bg-white"
                          >
                            Publicar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
