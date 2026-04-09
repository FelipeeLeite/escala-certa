"use client";

import { useScale } from "@/hooks/use-scale";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Briefcase,
  Coffee,
  Info,
  AlertTriangle,
  Plus,
  Maximize2,
  Minimize2,
  Star,
  Zap,
  Palmtree,
  Stethoscope,
  X,
  Moon,
  Sun
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useMemo } from "react";
import { getDayInfo } from "@/utils/scale-logic";
import { cn } from "@/lib/utils";
import { DayInfo, EventType } from "@/types/scale";
import { formatMonthYearBR, formatWeekdayBR, formatDayLongBR } from "@/utils/date-format";

const eventTypes: { value: EventType; label: string; icon: any; color: string; defaultOverride?: boolean; defaultStatus?: "trabalho" | "folga" }[] = [
  { value: "ferias", label: "Férias", icon: Palmtree, color: "bg-emerald-100 text-emerald-700", defaultOverride: true, defaultStatus: "folga" },
  { value: "atestado", label: "Atestado", icon: Stethoscope, color: "bg-rose-100 text-rose-700", defaultOverride: true, defaultStatus: "folga" },
  { value: "folga_extra", label: "Folga Extra", icon: Coffee, color: "bg-purple-100 text-purple-700", defaultOverride: true, defaultStatus: "folga" },
  { value: "plantao_extra", label: "Plantão Extra", icon: Zap, color: "bg-orange-100 text-orange-700", defaultOverride: true, defaultStatus: "trabalho" },
  { value: "compromisso", label: "Compromisso", icon: Star, color: "bg-amber-100 text-amber-700", defaultOverride: false },
  { value: "lembrete", label: "Lembrete", icon: Info, color: "bg-slate-100 text-slate-700", defaultOverride: false },
];

export default function CalendarPage() {
  const { config, events, addEvent } = useScale();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  // No mobile, a semana pode começar no domingo (0) ou segunda (1). Mantemos domingo para padrão de calendário.
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = useMemo(() => eachDayOfInterval({
    start: startDate,
    end: endDate,
  }), [startDate, endDate]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDay(getDayInfo(today, config, events));
  };

  const handleDayClick = (date: Date) => {
    const info = getDayInfo(date, config, events);
    setSelectedDay(info);
  };

  const handleQuickAdd = (date: Date) => {
    setQuickAddDate(date);
    setIsQuickAddOpen(true);
  };

  const submitQuickAdd = (type: EventType) => {
    if (!quickAddDate) return;
    const typeInfo = eventTypes.find(t => t.value === type);
    
    addEvent({
      title: typeInfo?.label || "Evento",
      date: quickAddDate.toISOString(),
      type,
      isOverride: typeInfo?.defaultOverride ?? false,
      overrideStatus: typeInfo?.defaultStatus,
    });
    
    setIsQuickAddOpen(false);
    setSelectedDay(getDayInfo(quickAddDate, config, events));
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 sm:space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 border-b pb-6 sm:pb-8">
        <div className="space-y-1 sm:space-y-2 text-center md:text-left w-full md:w-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Seu Calendário
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium capitalize">
            {formatMonthYearBR(currentMonth)}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsCompact(!isCompact)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-secondary/50 text-sm font-bold rounded-xl sm:rounded-2xl hover:bg-secondary transition-all border shadow-sm min-h-[44px]"
          >
            {isCompact ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            <span className="whitespace-nowrap">{isCompact ? "Modo Completo" : "Modo Compacto"}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 bg-secondary/50 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-2 sm:p-2.5 hover:bg-background hover:shadow-sm rounded-xl transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={goToToday}
              className="px-4 sm:px-6 py-2 text-sm font-bold hover:bg-background hover:shadow-sm rounded-xl transition-all active:scale-95 min-h-[44px]"
            >
              Hoje
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 sm:p-2.5 hover:bg-background hover:shadow-sm rounded-xl transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Próximo Mês"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 bg-secondary/30 border-b">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const info = getDayInfo(day, config, events);
                const isSelected = selectedDay && isSameDay(day, selectedDay.date);
                const dayInMonth = isSameMonth(day, monthStart);
                const hasImportant = info.events.some(e => e.type === "compromisso");
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "group relative border-b border-r transition-all",
                      !dayInMonth && "opacity-30 grayscale",
                      isSelected && "bg-primary/5 ring-2 ring-primary ring-inset z-10",
                      idx % 7 === 6 && "border-r-0",
                      isCompact ? "min-h-[70px] md:min-h-[90px]" : "min-h-[110px] md:min-h-[130px]"
                    )}
                  >
                    <button
                      onClick={() => handleDayClick(day)}
                      className="w-full h-full p-3 text-left flex flex-col gap-2 hover:bg-secondary/20 transition-all"
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className={cn(
                          "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                          isToday(day) ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-foreground/70"
                        )}>
                          {format(day, "d")}
                        </span>
                        
                        <div className="flex flex-col gap-1 items-end">
                          {hasImportant && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          {info.isOverridden && (
                            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-sm" title="Escala alterada manualmente" />
                          )}
                          {info.actualStatus === "trabalho" && (
                            <div className={cn(
                              "w-3 h-3 rounded-full border-2 border-background shadow-sm",
                              (info.shift.toLowerCase().includes("noite") || info.shift.toLowerCase() === "noturno") ? "bg-indigo-500" : "bg-amber-400"
                            )} />
                          )}
                        </div>
                      </div>

                      {!isCompact && info.actualStatus === "trabalho" && (
                        <div className={cn(
                          "text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter truncate mt-auto flex items-center gap-1",
                          (info.shift.toLowerCase().includes("noite") || info.shift.toLowerCase() === "noturno") ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {(info.shift.toLowerCase().includes("noite") || info.shift.toLowerCase() === "noturno") ? <Moon className="w-2 h-2" /> : <Sun className="w-2 h-2" />}
                          {info.shift}
                        </div>
                      )}

                      {isCompact && info.actualStatus === "trabalho" && (
                        <div className="mt-auto flex justify-center">
                          {(info.shift.toLowerCase().includes("noite") || info.shift.toLowerCase() === "noturno") ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                        </div>
                      )}

                      {!isCompact && info.events.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {info.events.slice(0, 3).map((event) => {
                            const typeInfo = eventTypes.find(t => t.value === event.type);
                            return (
                              <div 
                                key={event.id}
                                className={cn("w-1.5 h-1.5 rounded-full", typeInfo ? typeInfo.color.split(" ")[1].replace("text-", "bg-") : "bg-primary")}
                                title={event.title}
                              />
                            );
                          })}
                        </div>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(day);
                      }}
                      className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg active:scale-90 min-h-[32px] min-w-[32px] flex items-center justify-center z-20"
                      title="Adicionar Exceção Rápida"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-secondary/20 rounded-[2rem] border border-dashed space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Legenda da Escala</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <LegendItem icon={<Sun className="w-3.5 h-3.5 text-amber-500" />} label="Diurno" />
              <LegendItem icon={<Moon className="w-3.5 h-3.5 text-indigo-500" />} label="Noturno" />
              <LegendItem icon={<Coffee className="w-3.5 h-3.5 text-emerald-500" />} label="Folga" />
              <LegendItem icon={<Zap className="w-3.5 h-3.5 text-orange-500" />} label="Extra" />
              <LegendItem icon={<Palmtree className="w-3.5 h-3.5 text-emerald-600" />} label="Férias" />
              <LegendItem icon={<Stethoscope className="w-3.5 h-3.5 text-rose-500" />} label="Atestado" />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-[2.5rem] p-8 space-y-8 sticky top-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-bold text-xl tracking-tight">Detalhes do Dia</h2>
            </div>

            {selectedDay ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">
                    {formatWeekdayBR(selectedDay.date)}
                  </p>
                  <p className="text-2xl font-black text-foreground">
                    {formatDayLongBR(selectedDay.date)}
                  </p>
                </div>

                <div className="grid gap-4">
                  <DetailCard 
                    icon={selectedDay.actualStatus === "trabalho" ? Briefcase : Coffee}
                    label="Status Real"
                    value={selectedDay.actualStatus === "trabalho" ? "Dia de Plantão" : "Dia de Folga"}
                    highlight={selectedDay.actualStatus === "trabalho"}
                    isOverridden={selectedDay.isOverridden}
                  />

                  {selectedDay.isOverridden && (
                    <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-700 font-bold animate-in zoom-in-95">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>ESCALA ALTERADA: Estava previsto {selectedDay.plannedStatus === "trabalho" ? "TRABALHO" : "FOLGA"}.</span>
                    </div>
                  )}
                  
                  {selectedDay.actualStatus === "trabalho" && (
                    <>
                      <DetailCard 
                        icon={(selectedDay.shift.toLowerCase().includes("noite") || selectedDay.shift.toLowerCase() === "noturno") ? Moon : Sun}
                        label="Turno"
                        value={selectedDay.shift}
                        color={(selectedDay.shift.toLowerCase().includes("noite") || selectedDay.shift.toLowerCase() === "noturno") ? "text-indigo-600" : "text-amber-600"}
                      />
                      <DetailCard 
                        icon={Info}
                        label="Carga Horária"
                        value={selectedDay.hours}
                      />
                    </>
                  )}
                </div>

                {selectedDay.events.length > 0 && (
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Eventos e Notas</h3>
                    <div className="space-y-3">
                      {selectedDay.events.map((event) => {
                        const typeInfo = eventTypes.find(t => t.value === event.type);
                        const Icon = typeInfo?.icon || Info;
                        return (
                          <div key={event.id} className="p-4 bg-secondary/50 rounded-2xl border border-primary/10 hover:border-primary/30 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-primary/20" />
                            <div className="flex items-start gap-3">
                              <Icon className={cn("w-4 h-4 mt-0.5", typeInfo ? typeInfo.color.split(" ")[1] : "text-primary")} />
                              <div>
                                <p className="font-bold text-sm group-hover:text-primary transition-colors">{event.title}</p>
                                {event.description && (
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 space-y-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto text-muted-foreground/50">
                    <CalendarIcon className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground border-4 border-card">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-[200px] mx-auto leading-relaxed">
                  Selecione um dia no calendário para ver sua programação detalhada.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {isQuickAddOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="p-8 border-b flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight">Adicionar Exceção</h2>
                <p className="text-xs text-muted-foreground font-medium">
                  {quickAddDate && formatDayLongBR(quickAddDate)}
                </p>
              </div>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-2.5 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-8 grid grid-cols-2 gap-4 sm:gap-3">
              {eventTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => submitQuickAdd(type.value)}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 sm:p-4 rounded-3xl border transition-all gap-2 group min-h-[100px]",
                      "hover:border-primary hover:bg-primary/5 active:scale-95"
                    )}
                  >
                    <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", type.color)}>
                      <Icon className="w-6 h-6 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-background px-3 py-2 rounded-xl border shadow-sm">
      <div className="shrink-0">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{label}</span>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value, color, highlight, isOverridden }: any) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border transition-all relative overflow-hidden",
      highlight ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-secondary/30 border-transparent"
    )}>
      {isOverridden && (
        <div className="absolute top-0 right-0 p-1">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        </div>
      )}
      <div className="p-2.5 bg-background rounded-xl shadow-sm">
        <Icon className={cn("w-5 h-5", color || "text-muted-foreground")} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">{label}</p>
        <p className={cn("font-bold", color)}>{value}</p>
      </div>
    </div>
  );
}
