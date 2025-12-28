"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  ChevronLeft,
  Copy,
  Check,
  LogOut,
  Settings,
  UserPlus,
  ArrowRight,
  Mail,
  Lock,
  X,
  CalendarDays,
  Camera,
  HeartOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  getProfile,
  getPartnerProfile,
  linkPartner,
  unlinkPartner,
  updateTogetherSince,
} from "@/lib/profile";
import { signOut } from "@/lib/auth";

export default function PerfilPage() {
  const router = useRouter();
  const [hasPartner, setHasPartner] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form states
  const [userName, setUserName] = useState("David Victoria");
  const [userEmail, setUserEmail] = useState("david@amoura.com");
  const [userPass, setUserPass] = useState("•••••");
  const [partnerSince, setPartnerSince] = useState("15 de Octubre, 2021");

  // Data states
  const [userData, setUserData] = useState<{ myCode: string }>({
    myCode: "AM-8293-XV",
  });
  const [partnerData, setPartnerData] = useState<{
    name: string;
    email: string;
  }>({
    name: "Amour",
    email: "amor@amoura.com",
  });

  const copyCode = () => {
    navigator.clipboard.writeText(userData.myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      try {
        const profile = await getProfile(user.id);
        if (!profile) return;

        setHasPartner(!!profile.partner_id);
        setUserData({
          myCode: profile.invite_code || "AM-XXXX-XX",
        });
        setUserName(profile.full_name || "");
        setUserEmail(profile.email || "");

        if (profile.partner_id) {
          const partner = await getPartnerProfile(user.id);
          if (partner) {
            setPartnerData({
              name: partner.full_name || "",
              email: partner.email || "",
            });
            setPartnerSince(
              profile.together_since
                ? new Date(profile.together_since).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""
            );
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F6] pb-32">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Mi Perfil
          </h1>
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 active:scale-95 transition-all text-gray-400"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {!hasPartner && (
        <div className="px-6">
          <p className="text-center text-sm font-medium text-gray-500 mb-4">
            Comparte tu código de invitación con tu pareja para comenzar a compartir momentos.
          </p>
          <button
            onClick={copyCode}
            className="w-full h-16 rounded-2xl bg-[#FFE5EB] border border border-[#FFD1DC] flex items-center justify-between px-6 cursor-pointer active:scale-[0.98] transition-all group"
          >
            <span className="text-base font-bold text-gray-700 tracking-wider font-mono">
              {userData.myCode}
            </span>
            {copied ? (
              <Check className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
            ) : (
              <Copy className="h-5 w-5 text-gray-300 group-hover:text-[#F43E5C] transition-colors" />
            )}
          </button>
        </div>
      )}
      </div>

      <div className="px-6 flex flex-col gap-8">
        {/* User Card */}
        <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-black/2 ring-1 ring-black/3 flex flex-col items-center text-center animate-scale-in delay-200">
          <div className="h-24 w-24 rounded-[32px] bg-[#FFE5EB] flex items-center justify-center text-gray-300 shadow-inner">
            <User className="h-12 w-12" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {userName || "Bienvenido"}
            </h2>
          <p className="text-sm font-medium text-gray-400 mt-1">{userEmail}</p>
          </div>
        </section>

        {/* Partner Section */}
        <section className="space-y-4 animate-slide-up delay-400">
          {hasPartner ? (
            <>
              <div className="flex items-center justify-between px-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                  Mi Pareja
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingPartner(true)}
                  className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-[#F43E5C] transition-colors"
                  >
                  Editar relación
                </button>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-6 shadow-xl shadow-[#F43E5C]/5 ring-1 ring-black/3 flex items-center gap-5 relative overflow-hidden">
              <div className="h-16 w-16 shrink-0 rounded-[24px] bg-[#F8F5F6] flex items-center justify-center text-gray-300 shadow-inner">
                <User className="h-8 w-8" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                  {partnerData.name}
                </h4>
                <div className="flex flex-col mt-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Juntos desde
                  </span>
                  <span className="text-sm font-bold text-[#F43E5C] leading-none">
                    {partnerSince}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
          ) : (
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-black/2 ring-1 ring-black/3 text-center space-y-6">
              <div className="h-20 w-20 rounded-[28px] bg-gray-50 flex items-center justify-center text-gray-300 mx-auto">
                <UserPlus className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black text-gray-900">
                  Unirme a mi pareja
                </h4>
                <p className="text-sm font-medium text-gray-500 px-8">
                  Ingresa el código de invitación de tu pareja para comenzar a compartir momentos.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <Input
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Ej: AM-0000-XX"
                  className="h-14 rounded-2xl border-none bg-[#F8F5F6] px-6 text-center text-base font-bold tracking-wider placeholder:tracking-normal font-mono"
                />
                <Button
                  type="button"
                  onClick={handleLinkPartner}
                  disabled={loading || !inviteCode.trim()}
                  className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-black text-base shadow-lg active:scale-95 transition-all"
                >
                  {loading ? "Vinculando..." : "Conectar ahora"}
                  {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="max-w-none w-screen h-dvh m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100 animate-in slide-in-from-bottom duration-300">
          <div className="relative flex flex-col h-full px-6 pt-6">
            <div className="absolute top-6 right-6 z-110">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <header className="flex flex-col gap-1 py-4 mb-4">
              <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                Editar Perfil
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-gray-500">
                Actualiza tu información personal
              </DialogDescription>
            </header>

            <div className="flex-1 overflow-y-auto space-y-6 pt-4 pb-32 -mx-6 px-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-[32px] bg-white shadow-md flex items-center justify-center text-gray-300 ring-4 ring-white">
                    <User className="h-12 w-12" />
                  <button
                    type="button"
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-[#F43E5C] text-white flex items-center justify-center shadow-lg border-4 border-white active:scale-90 transition-all"
                    >
                    <Camera className="h-4 w-4" />
                  </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1">
                  Nombre Completo
                </label>
                <Input
                  htmlFor="fullName"
                  id="fullName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1">
                  Correo Electrónico
                </label>
                <Input
                  htmlFor="email"
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-6 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={userPass}
                    onChange={(e) => setUserPass(e.target.value)}
                    className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5">
              <Button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="h-16 w-full rounded-[24px] bg-[#F43E5C] text-white font-black shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all text-lg"
              >
                Guardar Cambios
              </Button>
            </footer>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditingPartner} onOpenChange={setIsEditingPartner}>
        <DialogContent className="max-w-none w-screen h-dvh m-0 p-0 bg-[#F8F5F6] border-none rounded-none overflow-hidden flex flex-col z-100 animate-in slide-in-from-bottom duration-300">
          <div className="relative flex flex-col h-full px-6 pt-6">
            <div className="absolute top-6 right-6 z-110">
              <button
                type="button"
                onClick={() => setIsEditingPartner(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm ring-1 ring-black/5 active:scale-95 transition-all"
              >
                <X className="h-5 w-5 text-gray-900" />
              </button>
            </div>

            <header className="flex flex-col gap-1 py-4 mb-8">
              <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                Nuestra Relación
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-gray-500">
                Edita la fecha en la que comenzó su historia
              </DialogDescription>
            </header>

            <div className="flex 1 overflow-y-auto space-y-6 pb-32 -mx-6 px-6">
                <div className="space-y-3">
                  <label htmlFor="togetherSince" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1">
                    Juntos desde
                  </label>
                  <div className="relative">
                    <Input
                      id="togetherSince"
                      type="date"
                      value={partnerSince}
                      onChange={(e) => setPartnerSince(e.target.value)}
                      placeholder="Ej: 15 de Octubre, 2021"
                      className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-bold"
                    />
                    <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col items-center">
                <button
                  type="button"
                    onClick={() => {
                      if (confirm("¿Estás seguro de que quieres desvincular a tu pareja? Esta acción no se puede deshacer fácilmente.")) {
                        handleUnlinkPartner();
                      }
                    }}
                    className="flex items-center gap-2 text-red-500 font-bold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <HeartOff className="h-4 w-4" />
                    Desvincular a mi pareja
                  </button>
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 font-medium mt-2 text-center px-8">
                  Al desvincularte, dejarás de compartir momentos y planes con esta persona.
                </p>
              </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#F8F5F6]/90 backdrop-blur-xl border-t border-black/5">
              <Button
                onClick={() => {
                  handleUpdateTogetherSince();
                  setIsEditingPartner(false);
                }}
                className="h-16 w-full rounded-[24px] bg-[#F43E5C] text-white font-black shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all text-lg"
              >
                Guardar Fecha
              </Button>
            </footer>
          </div>
        </Dialog>
      </Dialog>

      {/* Action Buttons */}
      <section className="flex flex-col gap-3 animate-slide-up delay-600">
        <Button
          variant="ghost"
          className="h-14 w-full rounded-2xl justify-between px-6 bg-white shadow-sm ring-1 ring-black/5 hover:bg-gray-50 group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-gray-700">Soporte y Ayuda</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300" />
        </div>
        </Button>

        <Button
          variant="ghost"
          type="button"
          onClick={handleLogout}
          className="h-14 w-full rounded-2xl justify-start px-6 bg-white shadow-sm ring-1 ring-black/5 hover:bg-red-50 group transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-bold text-red-500">Cerrar Sesión</span>
          </div>
        </Button>
      </section>

      {/* Version Info */}
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 text-center mt-4 animate-fade-in delay-800">
        Amoura v1.0.4 • Hecho con amor
      </p>
    </main>
  );
}
ENDOFILE'