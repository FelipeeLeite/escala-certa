import { cn } from "@/lib/utils";

interface MiniMetricProps {
  label: string;
  value: string | number;
  color: string;
}

export function MiniMetric({ label, value, color }: MiniMetricProps) {
  return (
    <div className="bg-card border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 leading-tight">{label}</span>
      <span className={cn("text-lg sm:text-xl font-black", color)}>{value}</span>
    </div>
  );
}
