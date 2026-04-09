"use client";

import { useScale } from "@/hooks/use-scale";
import { Plus, Trash2, Calendar as CalendarIcon, Tag, FileText, X, Repeat } from "lucide-react";
import { format, isAfter, startOfDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { EventType } from "@/types/scale";
import { cn } from "@/lib/utils";
import { formatWeekdayBR } from "@/utils/date-format";

const eventTypes: { value: EventType; label: string; color: string; defaultOverride?: boolean; defaultStatus?: "trabalho" | "folga" }[] = [
  { value: "ferias", label: "Férias", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", defaultOverride: true, defaultStatus: "folga" },
  { value: "atestado", label: "Atestado", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", defaultOverride: true, defaultStatus: "folga" },
  { value: "troca", label: "Troca de Plantão", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", defaultOverride: true },
  { value: "folga_extra", label: "Folga Extra", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20", defaultOverride: true, defaultStatus: "folga" },
  { value: "plantao_extra", label: "Plantão Extra", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20", defaultOverride: true, defaultStatus: "trabalho" },
  { value: "treinamento", label: "Treinamento", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", defaultOverride: false },
  { value: "ausencia", label: "Ausência", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", defaultOverride: true, defaultStatus: "folga" },
  { value: "compromisso", label: "Compromisso", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", defaultOverride: false },
  { value: "lembrete", label: "Lembrete", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20", defaultOverride: false },
];

export default function EventsPage() {
  const { events, addEvent, removeEvent } = useScale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    type: "lembrete" as EventType,
    description: "",
    isOverride: false,
    overrideStatus: "folga" as "trabalho" | "folga",
  });

  const handleTypeChange = (type: EventType) => {
    const typeInfo = eventTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type,
      isOverride: typeInfo?.defaultOverride ?? false,
      overrideStatus: typeInfo?.defaultStatus ?? "folga",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    addEvent({
      title: formData.title,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      description: formData.description,
      isOverride: formData.isOverride,
      overrideStatus: formData.isOverride ? formData.overrideStatus : undefined,
    });

    setFormData({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      type: "lembrete",
      description: "",
      isOverride: false,
      overrideStatus: "folga",
    });
    setIsModalOpen(false);
    
    // Feedback visual discreto
    const toast = document.createElement("div");
    toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-[200] font-bold animate-in slide-in-from-bottom-4 duration-300";
    toast.innerText = "Evento salvo com sucesso!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("animate-out", "fade-out", "duration-500");
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingEvents = sortedEvents.filter(e =>
    isAfter(startOfDay(new Date(e.date)), startOfDay(addDays(new Date(), -1)))
  );

  return (
    <div className="p-4 md:p-8 space-y-6 sm:space-y-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <header className="flex items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Eventos e Notas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Gerencie seus compromissos e trocas.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Evento</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Próximos Eventos</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-4">
            {upcomingEvents.map((event) => {
              const typeInfo = eventTypes.find(t => t.value === event.type);
              return (
                <div key={event.id} className="bg-card border rounded-xl p-4 flex items-start justify-between gap-4 hover:border-primary/50 transition-colors group">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex flex-col items-center justify-center text-xs font-bold shrink-0">
                      <span>{format(new Date(event.date), "dd")}</span>
                      <span className="uppercase text-[10px]">{format(new Date(event.date), "MMM", { locale: ptBR })}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{event.title}</h3>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", typeInfo?.color)}>
                          {typeInfo?.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {formatWeekdayBR(new Date(event.date))}
                      </p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeEvent(event.id);
                      // Feedback visual
                      const toast = document.createElement("div");
                      toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-[200] font-bold animate-in slide-in-from-bottom-4 duration-300";
                      toast.innerText = "Evento removido!";
                      document.body.appendChild(toast);
                      setTimeout(() => {
                        toast.classList.add("animate-out", "fade-out", "duration-500");
                        setTimeout(() => document.body.removeChild(toast), 500);
                      }, 3000);
                    }}
                    className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-dashed rounded-xl space-y-4 px-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-lg">Nenhum evento futuro</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Você pode adicionar exceções como:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-secondary rounded-md text-[10px] font-bold uppercase">Folga Extra</span>
                  <span className="px-2 py-1 bg-secondary rounded-md text-[10px] font-bold uppercase">Plantão Extra</span>
                  <span className="px-2 py-1 bg-secondary rounded-md text-[10px] font-bold uppercase">Férias</span>
                  <span className="px-2 py-1 bg-secondary rounded-md text-[10px] font-bold uppercase">Atestado</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Overlay Simplificado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <header className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Novo Evento</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Título
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Troca com João"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Data
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => handleTypeChange(e.target.value as any)}
                    className="w-full p-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    {eventTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-secondary/30 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <Repeat className="w-4 h-4" /> Altera a Escala?
                    </label>
                    <p className="text-[10px] text-muted-foreground">Este evento sobrescreve o status do dia (trabalho/folga).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isOverride: !formData.isOverride })}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      formData.isOverride ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        formData.isOverride ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {formData.isOverride && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-200">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Status Final do Dia</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, overrideStatus: "trabalho" })}
                        className={cn(
                          "py-2 rounded-lg text-xs font-bold border transition-all",
                          formData.overrideStatus === "trabalho" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground"
                        )}
                      >
                        Trabalho
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, overrideStatus: "folga" })}
                        className={cn(
                          "py-2 rounded-lg text-xs font-bold border transition-all",
                          formData.overrideStatus === "folga" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground"
                        )}
                      >
                        Folga
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Descrição (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
