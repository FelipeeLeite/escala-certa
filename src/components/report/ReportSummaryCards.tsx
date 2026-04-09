import { TrendingUp, TrendingDown, Calendar, DollarSign, Coffee, Clock, Briefcase } from "lucide-react";
import { ReportCard } from "@/components/shared/ReportCard";
import { MonthMetrics, ScaleConfig } from "@/types/scale";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/lib/utils";

interface ReportSummaryCardsProps {
  metrics: MonthMetrics;
  config: ScaleConfig;
  financialSummary: string;
}

export function ReportSummaryCards({ metrics, config, financialSummary }: ReportSummaryCardsProps) {
  const diffPlantons = metrics.actualWorkDays - metrics.plannedWorkDays;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Plantões: Previsto vs Real (Tarefa 8) */}
      <ReportCard
        title="Plantões no Mês"
        value={metrics.actualWorkDays}
        subValue={
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
              <span>Previsto: {metrics.plannedWorkDays}</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full",
                diffPlantons > 0 ? "bg-blue-100 text-blue-700" : diffPlantons < 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
              )}>
                {diffPlantons > 0 ? `+${diffPlantons}` : diffPlantons} diff
              </span>
            </div>
            <p className="text-[10px] opacity-60 font-medium">Plantões realizados efetivamente</p>
          </div>
        }
        icon={Briefcase}
        variant="primary"
      />

      {/* Total de Folgas (Tarefa 6) */}
      <ReportCard
        title="Folgas no Mês"
        value={`${metrics.actualOffDays} dias`}
        subValue={
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Descanso Total</span>
            <p className="text-[10px] opacity-60 font-medium">Incluindo folgas extras e recessos</p>
          </div>
        }
        icon={Coffee}
        variant="success"
      />

      {/* Banco de Horas */}
      <ReportCard
        title="Banco de Horas"
        value={`${metrics.hourBank > 0 ? "+" : ""}${metrics.hourBank}h`}
        subValue={
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-70">
              <span>Previsto: {metrics.plannedHours}h</span>
              <span>Real: {metrics.actualHours}h</span>
            </div>
            <p className="text-[10px] opacity-60 font-medium">Saldo acumulado no período</p>
          </div>
        }
        icon={metrics.hourBank >= 0 ? TrendingUp : TrendingDown}
        variant={metrics.hourBank >= 0 ? "success" : "danger"}
      />

      {/* Estimativa de Ganho (Tarefa 5) */}
      <ReportCard
        title="Ganho Estimado"
        value={formatCurrency(metrics.estimatedPayment)}
        subValue={
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter bg-amber-500/10 p-2 rounded-lg text-amber-700 dark:text-amber-400">
              <DollarSign className="w-3 h-3" />
              <span>{financialSummary}</span>
            </div>
            <p className="text-[10px] opacity-60 font-medium text-center">Valor bruto calculado</p>
          </div>
        }
        icon={DollarSign}
        variant="amber"
      />
    </div>
  );
}
