import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import { exportToCSV } from "@/utils/export";
import { ScaleConfig, UserEvent } from "@/types/scale";
import { formatMonthYearBR } from "@/utils/date-format";

interface ReportHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  config: ScaleConfig;
  events: UserEvent[];
}

export function ReportHeader({ currentMonth, onPrevMonth, onNextMonth, config, events }: ReportHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 border-b pb-6 sm:pb-8">
      <div className="space-y-3 sm:space-y-2 text-center sm:text-left w-full sm:w-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Fechamento Mensal
        </h1>
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4">
          <button 
            onClick={onPrevMonth} 
            className="p-2 sm:p-1 hover:bg-secondary rounded-full transition-colors active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <p className="text-lg sm:text-xl font-black capitalize w-40 sm:w-48 text-center tracking-tight">
            {formatMonthYearBR(currentMonth)}
          </p>
          <button 
            onClick={onNextMonth} 
            className="p-2 sm:p-1 hover:bg-secondary rounded-full transition-colors active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <button 
          onClick={() => exportToCSV(config, events)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 bg-background text-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-secondary transition-all border shadow-sm active:scale-95 min-h-[44px]"
          aria-label="Exportar relatório para CSV"
        >
          <Download className="w-4 h-4" />
          <span>CSV</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 min-h-[44px]"
          aria-label="Imprimir relatório"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir</span>
        </button>
      </div>
    </header>
  );
}
