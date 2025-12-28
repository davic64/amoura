"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, User } from "lucide-react";
import Link from "next/link";

export function TopHeader() {
  const unreadCount = 2; // Mock unread count, in a real app this would come from state or context

  return (
    <header className="flex items-center justify-between px-4 py-6 bg-[#F8F5F6]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm bg-white">
            <AvatarFallback className="bg-[#FFE5EB] text-[#F43E5C]">
              <User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-[#4ADE80]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#F43E5C]">¡Hola!</span>
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Ana & Luis
          </h2>
        </div>
      </div>

      <Link href="/notifications">
        <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE5EB] text-[#F43E5C] shadow-sm transition-all active:scale-95 border border-[#FFD1DC]">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#FFE5EB] bg-[#F43E5C]" />
          )}
        </button>
      </Link>
    </header>
  );
}
