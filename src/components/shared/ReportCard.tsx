import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ReportCardProps {
  title: string;
  value: string | number;
  subValue: ReactNode;
  icon: LucideIcon;
  variant: "success" | "danger" | "primary" | "amber";
}

export function ReportCard({ title, value, subValue, icon: Icon, variant }: ReportCardProps) {
  const variants: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    danger: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
    primary: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20",
    amber: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
  };

  const iconColors: Record<string, string> = {
    success: "text-emerald-500",
    danger: "text-rose-500",
    primary: "text-blue-500",
    amber: "text-amber-500",
  };

  return (
    <div className="bg-card border rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest leading-tight">{title}</span>
        <div className={cn("p-2.5 sm:p-3 rounded-xl sm:rounded-2xl", variants[variant])}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      <div>
        <div className={cn("text-3xl sm:text-4xl font-black tracking-tighter", iconColors[variant])}>{value}</div>
        <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-2">{subValue}</div>
      </div>
    </div>
  );
}
