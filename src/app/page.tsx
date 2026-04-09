import Link from "next/link";
import { Calendar, LayoutDashboard, Settings, FileBarChart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-hidden bg-[#030712] selection:bg-primary/30">
      {/* Background sophisticated layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary Glow - Top Right */}
        <div 
          className="absolute -top-[20%] -right-[10%] w-[100%] h-[100%] rounded-full opacity-20 blur-[120px] animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 100%)",
            animationDuration: "15s"
          }}
        />
        
        {/* Secondary Glow - Bottom Left */}
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] rounded-full opacity-15 blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.1) 50%, transparent 100%)",
            animationDuration: "20s"
          }}
        />

        {/* Center Accent Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full opacity-10 blur-[150px]"
          style={{
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)"
          }}
        />

        {/* Noise Overlay - Inline SVG */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Subtle Horizontal/Vertical Lines (Grid-like but minimal) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-lg w-full space-y-12 py-16">
        <div className="space-y-8 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20 mb-8 -rotate-2 transition-all duration-500 hover:rotate-0 hover:scale-105 active:scale-95">
              <Calendar className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-sm">
              Escala <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Certa</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg sm:text-xl leading-relaxed max-w-[85%] mx-auto">
              Organize <span className="text-white">qualquer</span> escala de trabalho com clareza total.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 animate-slide-up opacity-0 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
          <HomeCard
            href="/dashboard"
            icon={<LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8" />}
            label="Dashboard"
            color="bg-blue-500/20 text-blue-400"
          />
          <HomeCard
            href="/calendario"
            icon={<Calendar className="w-7 h-7 sm:w-8 sm:h-8" />}
            label="Calendário"
            color="bg-amber-500/20 text-amber-400"
          />
          <HomeCard
            href="/relatorio"
            icon={<FileBarChart className="w-7 h-7 sm:w-8 sm:h-8" />}
            label="Relatórios"
            color="bg-emerald-500/20 text-emerald-400"
          />
          <HomeCard
            href="/configuracoes"
            icon={<Settings className="w-7 h-7 sm:w-8 sm:h-8" />}
            label="Ajustes"
            color="bg-slate-500/20 text-slate-400"
          />
        </div>

        <div className="pt-8 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '800ms' }}>
          <div className="inline-flex items-center justify-center gap-3 text-slate-500 bg-white/5 backdrop-blur-xl py-3 px-8 rounded-full border border-white/10 shadow-inner transition-all hover:bg-white/10 hover:text-slate-300 group">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Experiência Premium Offline</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function HomeCard({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center justify-center p-6 sm:p-10 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-700 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-2 hover:shadow-primary/10 active:scale-95 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Subtle shine effect */}
      <div className="absolute -inset-full top-0 block h-full w-1/2 z-5 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine" />

      <div className={cn("relative p-5 rounded-3xl mb-5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-xl", color)}>
        {icon}
      </div>
      <span className="relative font-extrabold text-sm sm:text-lg tracking-tight text-slate-300 group-hover:text-white transition-colors duration-500">
        {label}
      </span>
    </Link>
  );
}
