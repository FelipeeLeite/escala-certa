import { cn } from "@/lib/utils";

interface MetricMiniCardProps {
  label: string;
  value: string;
  color: string;
}

export function MetricMiniCard({ label, value, color }: MetricMiniCardProps) {
  return (
    <div className="bg-card border rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <span className={cn("text-xl font-black", color)}>{value}</span>
    </div>
  );
}
