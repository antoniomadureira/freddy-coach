import Link from "next/link";
import { Home, Heart, Moon, Footprints, Bot, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/heart-rate", label: "Frequência Cardíaca", icon: Heart },
  { href: "/sleep", label: "Sono", icon: Moon },
  { href: "/steps", label: "Passos", icon: Footprints },
  { href: "/ai-coach", label: "AI Coach", icon: Bot },
  { href: "/records", label: "Recordes & Provas", icon: Trophy },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold">
          <span className="text-primary">freddy</span>
          <span className="text-foreground">.coach</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Long Distance Intelligence</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              "hover:bg-primary/10 hover:text-primary",
              "text-muted-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            F
          </div>
          <div>
            <div className="text-sm font-medium">Freddy</div>
            <div className="text-xs text-muted-foreground">Plano Pro</div>
          </div>
        </div>
      </div>
    </aside>
  );
}