import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyStatItemProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export function WeeklyStatItem({ label, value, icon: Icon, color }: WeeklyStatItemProps) {
  return (
    <div className="flex items-center justify-between group/item">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-xl bg-secondary group-hover/item:scale-110 transition-transform")}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{label}</span>
      </div>
      <span className="text-lg font-black">{value}</span>
    </div>
  );
}
