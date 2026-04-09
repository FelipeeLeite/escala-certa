import { Layout, Briefcase, Coffee, History, Sun, Moon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Summary } from "@/types/scale";
import { WeeklyStatItem } from "@/components/shared/WeeklyStatItem";
import { MetricMiniCard } from "@/components/shared/MetricMiniCard";
import { formatCurrency } from "@/utils/format-currency";
import { formatWeekdayShortBR } from "@/utils/date-format";
import { format } from "date-fns";

interface WeeklySummaryProps {
  summary: Summary;
}

export function WeeklySummary({ summary }: WeeklySummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Visão Semanal Detalhada */}
      <section className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Visão Semanal</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {summary.weeklySummary.days.map((day, idx) => (
            <div 
              key={idx}
              className={cn(
                "relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all flex flex-col items-center gap-1 sm:gap-2 text-center group min-h-[100px] sm:min-h-0",
                day.isToday ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 z-10" : "bg-card hover:bg-secondary/50",
                day.actualStatus === "trabalho" && !day.isToday ? "border-blue-200" : ""
              )}
            >
              <span className={cn(
                "text-[9px] sm:text-[10px] font-black uppercase tracking-widest",
                day.isToday ? "text-white/80" : "text-muted-foreground"
              )}>
                {formatWeekdayShortBR(day.date)}
              </span>
              <span className="text-lg sm:text-xl font-black">{format(day.date, "dd")}</span>
              
              <div className={cn(
                "p-1.5 sm:p-2 rounded-lg sm:rounded-xl mt-1 transition-transform group-hover:rotate-12",
                day.isToday ? "bg-white/20" : (day.actualStatus === "trabalho" ? "bg-blue-50" : "bg-emerald-50")
              )}>
                {day.actualStatus === "trabalho" ? (
                  (day.shift.toLowerCase().includes("noite") || day.shift.toLowerCase() === "noturno") ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Coffee className={cn("w-4 h-4", day.isToday ? "text-white" : "text-emerald-500")} />
                )}
              </div>

              {day.isOverridden && (
                <div className="absolute top-1 right-1">
                  <AlertTriangle className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5", day.isToday ? "text-white" : "text-amber-500")} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Métricas Mensais e Resumo da Semana */}
      <section className="lg:col-span-4 space-y-8">
        {/* Resumo Rápido da Semana */}
        <div className="bg-card border rounded-[2rem] p-8 space-y-6 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl tracking-tight">Esta Semana</h3>
            <div className="p-3 bg-secondary rounded-2xl group-hover:scale-110 transition-transform">
              <Layout className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <WeeklyStatItem 
              label="Plantões Reais" 
              value={summary.weeklySummary.actualWorkDays} 
              icon={Briefcase}
              color="text-blue-500"
            />
            <WeeklyStatItem 
              label="Folgas Reais" 
              value={summary.weeklySummary.actualOffDays} 
              icon={Coffee}
              color="text-emerald-500"
            />
            <WeeklyStatItem 
              label="Carga Horária" 
              value={`${summary.weeklySummary.totalHours}h`} 
              icon={History}
              color="text-indigo-500"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Configuração</span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                {summary.weeklySummary.shiftMode}
              </span>
            </div>
          </div>
        </div>

        {/* Métricas do Mês Mini */}
        <div className="bg-card border rounded-3xl p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-xl">Métricas do Mês</h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricMiniCard 
              label="Estimativa" 
              value={formatCurrency(summary.monthMetrics.estimatedPayment)} 
              color="text-amber-600" 
            />
            <MetricMiniCard 
              label="Total Horas" 
              value={`${summary.monthMetrics.actualHours}h`} 
              color="text-emerald-600" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
