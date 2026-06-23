"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/heart-rate", label: "FC" },
  { href: "/sleep", label: "Sono" },
  { href: "/steps", label: "Passos" },
  { href: "/ai-coach", label: "Coach" },
  { href: "/records", label: "Recordes" },
];

export function TopBar() {
  const pathname = usePathname();
  const hasConnection = typeof window !== "undefined" && localStorage.getItem("freddy_mcp_url");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="md:hidden flex items-center gap-2">
          <span className="font-bold text-lg">
            <span className="text-primary">freddy</span>
            <span className="text-foreground">.coach</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/settings/connections"
            className={cn(
              "p-2 rounded-full hover:bg-accent/10 transition-colors",
              !hasConnection && "text-warning"
            )}
            title="Configurar Conexão"
          >
            <Database className="w-5 h-5" />
          </Link>
          
          <button className="p-2 rounded-full hover:bg-accent/10 relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <Link
            href="/settings/connections"
            className="p-2 rounded-full hover:bg-accent/10"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}