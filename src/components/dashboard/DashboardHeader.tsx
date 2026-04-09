import { Download, Printer } from "lucide-react";
import { exportToCSV } from "@/utils/export";
import { ScaleConfig, UserEvent } from "@/types/scale";

interface DashboardHeaderProps {
  config: ScaleConfig;
  events: UserEvent[];
}

export function DashboardHeader({ config, events }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b pb-6 sm:pb-8">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Seu Dia a Dia
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground font-medium">
          Acompanhe seu plantão e organize seu descanso.
        </p>
      </div>
      <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <button 
          onClick={() => exportToCSV(config, events)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 bg-background text-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-secondary transition-all border shadow-sm active:scale-95 min-h-[44px]"
          aria-label="Exportar dados para CSV"
        >
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 min-h-[44px]"
          aria-label="Imprimir dashboard"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir</span>
        </button>
      </div>
    </header>
  );
}
