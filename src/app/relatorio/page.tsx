"use client";

import { useScale } from "@/hooks/use-scale";
import { addMonths, subMonths } from "date-fns";
import { useState, useMemo } from "react";
import { getMonthMetrics } from "@/utils/scale-logic";
import { formatCurrency } from "@/utils/format-currency";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportSummaryCards } from "@/components/report/ReportSummaryCards";
import { MiniMetric } from "@/components/shared/MiniMetric";
import { ReportTable } from "@/components/report/ReportTable";

export default function ReportPage() {
  const { config, events } = useScale();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const metrics = useMemo(() => 
    getMonthMetrics(currentMonth, config, events),
    [currentMonth, config, events]
  );

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const hasFinancialConfig = config.financial && config.financial.value > 0;

  const financialSummary = useMemo(() => {
    if (!hasFinancialConfig || !config.financial) return "Configure o valor nos ajustes";
    
    const baseValue = formatCurrency(config.financial.value);
    if (config.financial.mode === "per_shift") {
      return `${baseValue} x ${metrics.actualWorkDays} plantões reais`;
    }
    return `${baseValue} x ${metrics.actualHours}h reais`;
  }, [config.financial, metrics.actualWorkDays, metrics.actualHours, hasFinancialConfig]);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <ReportHeader 
        currentMonth={currentMonth}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        config={config}
        events={events}
      />

      {/* Resumo Principal */}
      <div className="space-y-6">
        <ReportSummaryCards 
          metrics={metrics}
          config={config}
          financialSummary={financialSummary}
        />
        
        {!hasFinancialConfig && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 text-amber-800 animate-in slide-in-from-top-2">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xl">💰</span>
            </div>
            <div className="text-sm">
              <p className="font-bold">Estimativas financeiras desativadas</p>
              <p className="opacity-80">Configure seu valor por hora ou plantão nos ajustes para visualizar estimativas de ganhos.</p>
            </div>
          </div>
        )}
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <MiniMetric label="Plantões Extras" value={metrics.extraShifts} color="text-blue-600" />
        <MiniMetric label="Folgas Extras" value={metrics.extraLeaves} color="text-purple-600" />
        <MiniMetric label="Férias/Atest." value={metrics.vacationSickDays} color="text-emerald-600" />
        <MiniMetric label="Ausências" value={metrics.absenceDays} color="text-rose-600" />
        <MiniMetric label="Folgas Reais" value={metrics.actualOffDays} color="text-slate-600" />
        <MiniMetric label="Total Horas" value={`${metrics.actualHours}h`} color="text-indigo-600" />
      </div>

      {/* Tabela de Detalhes */}
      <ReportTable days={metrics.days} />
    </div>
  );
}
