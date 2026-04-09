"use client";

import { useScale } from "@/hooks/use-scale";
import { getNextPlantons, getNextOffDays, getSequenceInfo } from "@/utils/scale-logic";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodayCard } from "@/components/dashboard/TodayCard";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { NextPlantons } from "@/components/dashboard/NextPlantons";
import { CurrentSequence } from "@/components/dashboard/CurrentSequence";

export default function DashboardPage() {
  const { config, events, getSummary } = useScale();
  const [summary, setSummary] = useState(getSummary());
  
  // Atualiza o summary a cada minuto para manter os contadores precisos
  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(getSummary());
    }, 60000);
    return () => clearInterval(interval);
  }, [getSummary]);

  const nextPlantons = getNextPlantons(new Date(), config, 5, events);
  const nextOffDays = getNextOffDays(new Date(), config, 5, events);
  const sequence = getSequenceInfo(new Date(), config, events);

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <DashboardHeader config={config} events={events} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Destaque "Hoje" e Contadores */}
        <div className="lg:col-span-8 space-y-6">
          <TodayCard summary={summary} />
        </div>
        
        {/* Sequência Atual */}
        <div className="lg:col-span-4">
          <CurrentSequence sequence={sequence} />
        </div>
      </div>

      {/* Visão Semanal e Métricas */}
      <WeeklySummary summary={summary} />

      {/* Lista de Próximos Plantões e Folgas */}
      <NextPlantons plantons={nextPlantons} offDays={nextOffDays} />
    </div>
  );
}
