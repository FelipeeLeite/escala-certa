"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Settings, PlusCircle, Home, Sun, Moon, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const items = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Hoje", href: "/dashboard" },
  { icon: Calendar, label: "Escala", href: "/calendario" },
  { icon: FileBarChart, label: "Mês", href: "/relatorio" },
  { icon: PlusCircle, label: "Notas", href: "/eventos" },
  { icon: Settings, label: "Ajustes", href: "/configuracoes" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDarkMode = theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-lg border-t p-2 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen md:p-6 md:flex md:flex-col md:bg-background shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <div className="hidden md:flex items-center gap-3 px-2 py-8 mb-8">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-2xl tracking-tight">Escala Certa</span>
      </div>
      <div className="flex justify-around md:flex-col md:gap-3 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all md:flex-row md:gap-4 md:px-5 md:py-4 active:scale-90 md:active:scale-95 touch-none",
                isActive 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6", isActive && "animate-in zoom-in-75 duration-300")} />
              <span className="text-[10px] md:text-sm font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="hidden md:block pt-6 border-t mt-auto">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 w-full px-5 py-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-2xl transition-all active:scale-95"
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className="text-sm font-semibold tracking-wide">{isDark ? "Modo Claro" : "Modo Escuro"}</span>
        </button>
      </div>
    </nav>
  );
}
