"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Moon, Bot, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/heart-rate", label: "FC", icon: Heart },
  { href: "/sleep", label: "Sono", icon: Moon },
  { href: "/ai-coach", label: "Coach", icon: Bot },
  { href: "/records", label: "Recordes", icon: Trophy },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border bg-card/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}