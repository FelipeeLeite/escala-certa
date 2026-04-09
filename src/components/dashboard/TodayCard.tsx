import { Zap, AlertTriangle, Timer, Clock, Coffee, Briefcase, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Summary } from "@/types/scale";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TodayCardProps {
  summary: Summary;
}

export function TodayCard({ summary }: TodayCardProps) {
  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "Agora";
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      const dayLabel = days === 1 ? "dia" : "dias";
      const hourLabel = hours === 1 ? "hora" : "horas";
      return `${days} ${dayLabel} e ${hours} ${hourLabel}`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isWorking = summary.today.actualStatus === "trabalho";
  const isNight = summary.today.shift === "noturno";
  const isOverridden = summary.today.isOverridden;

  // Mensagens inteligentes (Tarefa 10)
  const getIntelligentMessage = () => {
    if (!isWorking) return "Aproveite para recuperar as energias.";
    if (isNight) return "Lembre de ajustar seu descanso.";
    return "Prepare-se para o turno.";
  };

  const getStatusLabel = () => {
    if (!isWorking) return "FOLGA ☕";
    return isNight ? "PLANTÃO NOTURNO 🌙" : "PLANTÃO DIURNO ☀️";
  };

  const formatHours = (hoursStr: string) => {
    const [start, end] = hoursStr.split(" - ");
    if (isNight) {
      return `Inicia hoje às ${start} e termina amanhã às ${end}`;
    }
    return `${start} → ${end}`;
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl transition-all duration-500",
      isWorking 
        ? "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white" 
        : "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white"
    )}>
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Hoje</span>
            <p className="text-sm font-bold capitalize">
              {format(new Date(), "eeee • dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 min-h-[44px]">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
                {getStatusLabel()}
              </span>
            </div>
            {isOverridden && (
              <div className="flex items-center gap-2 bg-amber-400 text-amber-900 px-4 py-2 rounded-full font-black text-[10px] uppercase shadow-lg animate-pulse min-h-[44px]">
                <AlertTriangle className="w-3 h-3" />
                Escala Alterada
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter leading-tight sm:leading-none">
            {isWorking ? "Hoje você trabalha." : "Hoje você folga."}
          </h2>
          <div className="space-y-2">
            <p className="text-base sm:text-lg md:text-2xl font-medium text-white/90 max-w-2xl leading-tight">
              {isWorking 
                ? formatHours(summary.today.hours)
                : "Hoje é dia de descansar ☕"}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-medium text-white/70">
              {getIntelligentMessage()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 sm:pt-4">
          {summary.currentShift ? (
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/10 group hover:bg-black/30 transition-colors">
              <div className="p-2 sm:p-3 bg-amber-400/20 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase opacity-60 tracking-wider">Fim do plantão em</p>
                <p className="text-xl sm:text-2xl font-black tracking-tight">{formatCountdown(summary.currentShift.secondsLeft)}</p>
              </div>
            </div>
          ) : summary.timeUntilNextPlantao && (
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/10 group hover:bg-white/30 transition-colors">
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase opacity-60 tracking-wider">Próximo plantão em</p>
                <p className="text-xl sm:text-2xl font-black tracking-tight">{formatCountdown(summary.timeUntilNextPlantao.secondsLeft)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
