import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DayInfo } from "@/types/scale";
import { formatWeekdayBR } from "@/utils/date-format";
import { Calendar, Coffee, Briefcase, Timer } from "lucide-react";

interface NextPlantonsProps {
  plantons: DayInfo[];
  offDays: DayInfo[];
}

export function NextPlantons({ plantons, offDays }: NextPlantonsProps) {
  const formatCountdown = (date: Date, hours: string) => {
    const now = new Date();
    const [h, m] = hours.split(" - ")[0].split(":").map(Number);
    const target = new Date(date);
    target.setHours(h, m, 0, 0);
    
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return "Agora";
    
    const days = Math.floor(diff / (24 * 3600 * 1000));
    const remainingHours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
    
    if (days > 0) return `Faltam ${days}d e ${remainingHours}h`;
    return `Faltam ${remainingHours}h`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
      {/* Próximos Plantões */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Próximos Plantões</h2>
        </div>
        
        <div className="grid gap-3">
          {plantons.map((plantao, index) => (
            <div 
              key={index} 
              className={cn(
                "group bg-card border rounded-2xl p-4 hover:shadow-md transition-all flex items-center justify-between relative overflow-hidden",
                index === 0 && "border-primary/30 bg-primary/[0.02]"
              )}
            >
              {index === 0 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              )}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-bold shadow-inner transition-transform group-hover:scale-105",
                  (plantao.shift.toLowerCase().includes("noite") || plantao.shift.toLowerCase() === "noturno")
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                )}>
                  <span className="text-base sm:text-lg leading-none">{format(plantao.date, "dd")}</span>
                  <span className="uppercase text-[8px] sm:text-[10px] opacity-70">{format(plantao.date, "MMM", { locale: ptBR })}</span>
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="font-bold text-sm sm:text-md capitalize leading-none">
                      {formatWeekdayBR(plantao.date)}
                    </p>
                    {index === 0 && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-full uppercase w-fit">
                        <Timer className="w-2 h-2" />
                        <span>{formatCountdown(plantao.date, plantao.hours)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{plantao.hours}</span>
                    <span className={cn(
                      "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest",
                      (plantao.shift.toLowerCase().includes("noite") || plantao.shift.toLowerCase() === "noturno")
                        ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    )}>
                      {plantao.shift} {(plantao.shift.toLowerCase().includes("noite") || plantao.shift.toLowerCase() === "noturno") ? "🌙" : "☀️"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-secondary px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ml-2">
                {format(plantao.date, "dd/MM/yyyy")}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Próximas Folgas */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Coffee className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Próximas Folgas</h2>
        </div>
        
        <div className="grid gap-3">
          {offDays.map((folga, index) => (
            <div 
              key={index} 
              className="group bg-card border rounded-2xl p-4 hover:shadow-md transition-all flex items-center justify-between opacity-80 hover:opacity-100"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex flex-col items-center justify-center text-xs sm:text-sm font-bold shadow-inner transition-transform group-hover:scale-105">
                  <span className="text-base sm:text-lg leading-none">{format(folga.date, "dd")}</span>
                  <span className="uppercase text-[8px] sm:text-[10px] opacity-70">{format(folga.date, "MMM", { locale: ptBR })}</span>
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-md capitalize leading-none mb-1">
                    {formatWeekdayBR(folga.date)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Dia de descanso ☕</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-secondary px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ml-2">
                {format(folga.date, "dd/MM/yyyy")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
