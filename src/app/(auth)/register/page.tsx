"use client";

import { AlertCircle, Lock, Mail, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AuthError, signUp } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [_isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if (document.body.classList.contains("is-ready")) {
        setIsReady(true);
      }
    };
    checkReady();
    const timer = setInterval(checkReady, 50);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-svh bg-[#F8F5F6] flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto overflow-x-hidden"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="fixed -top-[20%] -right-[20%] w-full h-[60%] bg-linear-to-br from-[#FF6B92]/25 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed -bottom-[15%] -left-[15%] w-[80%] h-[50%] bg-linear-to-br from-[#B345D1]/15 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm z-10">
        <header className="flex flex-col items-center text-center mb-6 sm:mb-10 animate-fade-in">
          <div className="h-16 w-16 rounded-[20px] overflow-hidden shadow-xl shadow-[#F43E5C]/20 mb-4">
            <Image
              src="/amoura_icon.png"
              alt="Amoura Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Empieza tu viaje compartido hoy.
          </p>
        </header>

        <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-xl shadow-black/3 ring-1 ring-black/5 animate-scale-in">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1"
              >
                Tu Nombre
              </label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre real"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-medium"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Input
                  id="email"
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
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] ml-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-white px-12 shadow-sm ring-1 ring-black/5 focus-visible:ring-[#F43E5C]/40 text-base font-medium"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              disabled={loading}
              className="w-full h-16 rounded-[24px] bg-[#F43E5C] hover:bg-[#F43E5C]/90 text-white font-black text-lg shadow-2xl shadow-[#F43E5C]/30 active:scale-95 transition-all mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Registrarme
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 sm:mt-10 text-center text-sm font-medium text-gray-500 animate-fade-in">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-[#F43E5C] font-black hover:underline transition-all"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
