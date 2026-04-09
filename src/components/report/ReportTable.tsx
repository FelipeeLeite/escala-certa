import { History, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayInfo } from "@/types/scale";
import { formatDayMonthBR, formatWeekdayBR } from "@/utils/date-format";

interface ReportTableProps {
  days: DayInfo[];
}

export function ReportTable({ days }: ReportTableProps) {
  return (
    <section className="bg-card border rounded-[2rem] overflow-hidden shadow-sm">
      <div className="p-8 border-b bg-secondary/10 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Detalhamento Diário</h2>
        <History className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Status Previsto</th>
              <th className="px-6 py-4">Status Real</th>
              <th className="px-6 py-4">Turno</th>
              <th className="px-6 py-4">Horas</th>
              <th className="px-6 py-4">Eventos / Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {days.map((day, idx) => (
              <tr key={idx} className={cn(
                "group hover:bg-secondary/20 transition-colors",
                day.isOverridden && "bg-amber-50/30"
              )}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{formatDayMonthBR(day.date)}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{formatWeekdayBR(day.date)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-1 rounded-lg",
                    day.plannedStatus === "trabalho" ? "bg-blue-100 text-blue-700" : "bg-secondary text-muted-foreground"
                  )}>
                    {day.plannedStatus === "trabalho" ? "Plantão" : "Folga"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-1 rounded-lg shadow-sm",
                    day.actualStatus === "trabalho" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                  )}>
                    {day.actualStatus === "trabalho" ? "Plantão" : "Folga"}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize text-sm font-medium">
                  {day.actualStatus === "trabalho" ? (
                    <div className="flex items-center gap-1">
                      <span>{day.shift}</span>
                      {(day.shift.toLowerCase().includes("noite") || day.shift.toLowerCase() === "noturno") ? "🌙" : "☀️"}
                    </div>
                  ) : "-"}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-muted-foreground">
                  {day.actualStatus === "trabalho" ? day.hours : "0h"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {day.events.map(e => (
                      <span key={e.id} className="text-[9px] font-bold bg-background border px-2 py-0.5 rounded-full shadow-sm">
                        {e.title}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
