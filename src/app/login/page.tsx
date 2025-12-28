"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login for UX
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#F8F5F6] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[40%] bg-linear-to-br from-[#FF6B92]/20 to-transparent blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[40%] bg-linear-to-br from-[#B345D1]/10 to-transparent blur-[120px] rounded-full" />

      <div className="w-full max-w-sm z-10">
        <header className="flex flex-col items-center text-center mb-10">
          <div className="h-20 w-20 rounded-[24px] overflow-hidden shadow-xl shadow-[#F43E5C]/20 mb-6">
            <Image
              src="/amoura_icon.png"
              alt="Amoura Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Amoura
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Tu mundo compartido, con amor.
          </p>
        </header>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-8 shadow-xl shadow-black/3 ring-1 ring-black/5">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="hola@amor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-medium"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C]">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-gray-400 hover:text-[#F43E5C] transition-colors"
                >
                  ¿Olvidaste?
                </button>
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-medium"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full h-16 rounded-[24px] bg-[#F43E5C] hover:bg-[#F43E5C]/90 text-white font-black text-lg shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Iniciar Sesión
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-[#F43E5C] font-black hover:underline transition-all"
          >
            Únete ahora
          </Link>
        </p>
      </div>
    </main>
  );
}
