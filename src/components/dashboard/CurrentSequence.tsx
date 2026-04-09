import { CheckCircle2, Coffee, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayInfo } from "@/types/scale";

interface CurrentSequenceProps {
  sequence: {
    workDaysInNext7Days: number;
    yesterday: DayInfo;
    today: DayInfo;
    tomorrow: DayInfo;
  };
}

export function CurrentSequence({ sequence }: CurrentSequenceProps) {
  const renderDay = (label: string, info: DayInfo) => {
    const isWork = info.actualStatus === "trabalho";
    return (
      <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all">
        <span className="text-[10px] font-black uppercase text-muted-foreground">{label}</span>
        <div className={cn(
          "p-2 rounded-xl",
          isWork ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
        )}>
          {isWork ? <CheckCircle2 className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
        </div>
        <span className="text-xs font-bold">{isWork ? "Trabalhou" : "Folga"}</span>
      </div>
    );
  };

  return (
    <section className="bg-card border rounded-[2rem] p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg tracking-tight">Sequência Atual</h3>
        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
          Próximos 7 dias
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {renderDay("Ontem", sequence.yesterday)}
        {renderDay("Hoje", sequence.today)}
        {renderDay("Amanhã", sequence.tomorrow)}
      </div>

      <div className="pt-4 border-t flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-sm font-medium text-muted-foreground">
            Você terá <span className="text-foreground font-bold">{sequence.workDaysInNext7Days} plantões</span> nos próximos 7 dias.
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </section>
  );
}
