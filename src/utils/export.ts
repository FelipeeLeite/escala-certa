import { ScaleConfig, UserEvent } from "@/types/scale";
import { getDayInfo } from "./scale-logic";
import { addDays, startOfMonth, endOfMonth } from "date-fns";
import { formatDateBR, formatWeekdayBR } from "./date-format";
import { format } from "date-fns";

export function exportToCSV(config: ScaleConfig, events: UserEvent[]) {
  const start = startOfMonth(new Date());
  const end = endOfMonth(addDays(start, 90)); // Exportar próximos 90 dias
  
  let csvContent = "\uFEFF"; // BOM para Excel reconhecer acentos
  csvContent += "Data,Dia da Semana,Status Previsto,Status Real,Turno,Horário,Alterado Manualmente,Eventos\n";
  
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const info = getDayInfo(d, config, events);
    const dateStr = formatDateBR(d);
    const weekDay = formatWeekdayBR(d);
    const eventsStr = info.events.map(e => `"${e.title}"`).join(" | ");
    
    const row = [
      dateStr,
      weekDay,
      info.plannedStatus === "trabalho" ? "Trabalho" : "Folga",
      info.actualStatus === "trabalho" ? "Trabalho" : "Folga",
      info.actualStatus === "trabalho" ? (info.shift === "diurno" ? "Diurno" : "Noturno") : "-",
      info.actualStatus === "trabalho" ? info.hours : "-",
      info.isOverridden ? "SIM" : "Não",
      eventsStr
    ].join(";"); // Ponto e vírgula é melhor para Excel no Brasil
    
    csvContent += row + "\n";
  }
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `escala_certa_${format(new Date(), "yyyy-MM-dd")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
