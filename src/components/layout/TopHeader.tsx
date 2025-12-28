"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export function TopHeader() {
  const unreadCount = 5; // Mock unread count

  return (
    <header className="flex items-center justify-between px-4 py-8 bg-[#F8F5F6]">
      {/* Profile Left */}
      <div className="flex items-center gap-3">
        <Link href="/perfil">
          <div className="relative group active:scale-95 transition-all">
            <Avatar className="h-12 w-12 border-2 border-white shadow-lg bg-white overflow-hidden rounded-2xl cursor-pointer">
              <AvatarFallback className="bg-[#FFE5EB] text-[#F43E5C] rounded-none">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-[-2px] right-[-2px] h-4 w-4 rounded-full border-2 border-white bg-[#4ADE80] shadow-sm" />
          </div>
        </Link>

        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F43E5C] leading-none mb-1">
            ¡Hola!
          </span>
          <h2 className="text-lg font-black text-gray-900 leading-tight">
            Ana & Luis
          </h2>
        </div>
      </div>

      {/* Notifications Right */}
      <Link href="/notifications">
        <button className="relative flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-gray-400 shadow-sm ring-1 ring-black/5 transition-all active:scale-95 group">
          <Bell className="h-6 w-6 group-hover:text-[#F43E5C] transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-[#F43E5C] text-white text-[10px] font-black border-2 border-[#F8F5F6] animate-in zoom-in duration-300">
              {unreadCount}
            </span>
          )}
        </button>
      </Link>
    </header>
  );
}
