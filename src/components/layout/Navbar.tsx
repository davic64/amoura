"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image, Calendar, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    label: "Momentos",
    href: "/momentos",
    icon: Image,
  },
  {
    label: "Planes",
    href: "/planes",
    icon: Calendar,
  },
  {
    label: "Cupones",
    href: "/cupones",
    icon: Ticket,
  },
];

export function Navbar() {
  const pathname = usePathname();

  if (pathname === "/notifications") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-90",
                "min-w-[70px] px-2 py-1"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                  isActive ? "bg-[#FFE5EB] text-[#F43E5C]" : "text-gray-400"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold tracking-tight transition-colors duration-300",
                  isActive ? "text-[#F43E5C]" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for mobile devices */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80 backdrop-blur-xl" />
    </nav>
  );
}
