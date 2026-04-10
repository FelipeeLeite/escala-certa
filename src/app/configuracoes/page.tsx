"use client";

import { useScale } from "@/hooks/use-scale";
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Repeat, 
  Lock, 
  DollarSign, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  ChevronDown, 
  Settings2,
  CalendarDays,
  Moon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimeInput } from "@/components/shared/TimeInput";
import { CycleStep, ShiftMode } from "@/types/scale";
import { getBaseDateFromConfigStartDate } from "@/utils/scale-logic";

export default function SettingsPage() {
  const { config, updateConfig, resetConfig } = useScale();
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [formData, setFormData] = useState({
    startDate: format(getBaseDateFromConfigStartDate(config.startDate), "yyyy-MM-dd"),
    startStatus: config.startStatus,
    shiftMode: (config.shiftMode || "alternating") as ShiftMode,
    initialShift: config.initialShift,
    fixedShift: config.fixedShift || "diurno",
    dayShiftStart: config.dayShiftHours.start,
    dayShiftEnd: config.dayShiftHours.end,
    nightShiftStart: config.nightShiftHours.start,
    nightShiftEnd: config.nightShiftHours.end,
    financialMode: config.financial?.mode || "per_shift",
    financialValue: config.financial?.value || 0,
    customCycle: config.customCycle || []
  });

  const handleSave = () => {
    const [year, month, day] = formData.startDate.split("-").map(Number);
    const startDateLocal = new Date(year, month - 1, day);
    updateConfig({
      startDate: startDateLocal.toISOString(),
      startStatus: formData.startStatus as any,
      shiftMode: formData.shiftMode,
      initialShift: formData.initialShift as any,
      fixedShift: formData.fixedShift as any,
      dayShiftHours: { start: formData.dayShiftStart, end: formData.dayShiftEnd },
      nightShiftHours: { start: formData.nightShiftStart, end: formData.nightShiftEnd },
      customCycle: formData.customCycle,
      financial: {
        mode: formData.financialMode as any,
        value: Number(formData.financialValue),
        currency: "BRL"
      }
    });
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const addCycleStep = () => {
    const newStep: CycleStep = {
      id: Math.random().toString(36).substring(2, 9),
      type: "trabalho",
      label: "Plantão",
      startTime: "07:00",
      endTime: "19:00",
      crossesMidnight: false
    };
    setFormData(prev => ({ ...prev, customCycle: [...prev.customCycle, newStep] }));
  };

  const removeCycleStep = (id: string) => {
    setFormData(prev => ({ ...prev, customCycle: prev.customCycle.filter(s => s.id !== id) }));
  };

  const duplicateCycleStep = (index: number) => {
    const step = formData.customCycle[index];
    const newStep = { ...step, id: Math.random().toString(36).substring(2, 9) };
    const newCycle = [...formData.customCycle];
    newCycle.splice(index + 1, 0, newStep);
    setFormData(prev => ({ ...prev, customCycle: newCycle }));
  };

  const moveCycleStep = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === formData.customCycle.length - 1)) return;
    const newCycle = [...formData.customCycle];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newCycle[index], newCycle[targetIndex]] = [newCycle[targetIndex], newCycle[index]];
    setFormData(prev => ({ ...prev, customCycle: newCycle }));
  };

  const updateCycleStep = (index: number, updates: Partial<CycleStep>) => {
    const newCycle = [...formData.customCycle];
    newCycle[index] = { ...newCycle[index], ...updates };
    setFormData(prev => ({ ...prev, customCycle: newCycle }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 animate-in fade-in duration-700 relative">
      {showFeedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Save className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-sm sm:text-base">Configurações salvas com sucesso!</span>
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-3 hover:bg-secondary rounded-2xl transition-all active:scale-90 border shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ajustes
            </h1>
            <p className="text-muted-foreground font-medium text-sm sm:text-base">Personalize sua escala de trabalho.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (confirm("Deseja restaurar os valores padrão?")) {
                resetConfig();
                window.location.reload();
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 bg-background text-foreground rounded-xl font-semibold hover:bg-secondary transition-all border shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Resetar</span>
          </button>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Escolha do Modo */}
          <section className="bg-card border rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Settings2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Tipo de Escala</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ModeButton 
                active={formData.shiftMode === "alternating"} 
                onClick={() => setFormData(prev => ({ ...prev, shiftMode: "alternating" }))}
                icon={Repeat}
                title="12x36 Alternada"
                desc="Troca semanal"
              />
              <ModeButton 
                active={formData.shiftMode === "fixed" && formData.fixedShift === "diurno"} 
                onClick={() => setFormData(prev => ({ ...prev, shiftMode: "fixed", fixedShift: "diurno" }))}
                icon={Lock}
                title="12x36 Fixa Diurna"
                desc="Sempre diurno"
              />
              <ModeButton 
                active={formData.shiftMode === "fixed" && formData.fixedShift === "noturno"} 
                onClick={() => setFormData(prev => ({ ...prev, shiftMode: "fixed", fixedShift: "noturno" }))}
                icon={Moon}
                title="12x36 Fixa Noturna"
                desc="Sempre noturno"
              />
              <ModeButton 
                active={formData.shiftMode === "custom_cycle"} 
                onClick={() => setFormData(prev => ({ ...prev, shiftMode: "custom_cycle" }))}
                icon={CalendarDays}
                title="Ciclo Personalizado"
                desc="Qualquer escala"
              />
            </div>

            {formData.shiftMode === "alternating" && (
              <div className="bg-secondary/20 border rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Semana inicial</p>
                    <p className="text-xs text-muted-foreground">Define o turno da primeira semana a partir da data base.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, initialShift: "diurno" }))}
                    className={cn(
                      "py-3 rounded-2xl text-sm font-bold border transition-all",
                      formData.initialShift === "diurno"
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-secondary/50 border-transparent"
                    )}
                  >
                    Diurno
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, initialShift: "noturno" }))}
                    className={cn(
                      "py-3 rounded-2xl text-sm font-bold border transition-all",
                      formData.initialShift === "noturno"
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-secondary/50 border-transparent"
                    )}
                  >
                    Noturno
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Gerenciamento de Ciclo (Apenas para custom_cycle) */}
          {formData.shiftMode === "custom_cycle" && (
            <section className="bg-card border rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <CalendarDays className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Passos do Ciclo</h2>
                </div>
                <button 
                  onClick={addCycleStep}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Novo Passo
                </button>
              </div>

              <div className="space-y-4">
                {formData.customCycle.length === 0 ? (
                  <div className="text-center py-12 bg-secondary/20 rounded-3xl border border-dashed">
                    <p className="text-muted-foreground font-medium">Nenhum passo no ciclo ainda.</p>
                    <button onClick={addCycleStep} className="mt-4 text-primary font-bold text-sm">Adicionar primeiro passo</button>
                  </div>
                ) : (
                  formData.customCycle.map((step, idx) => (
                    <div key={step.id} className="bg-secondary/20 border rounded-3xl p-5 sm:p-6 space-y-6 group relative">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-background rounded-full flex items-center justify-center font-black text-xs border shadow-sm">
                            {idx + 1}
                          </span>
                          <input 
                            value={step.label}
                            onChange={e => updateCycleStep(idx, { label: e.target.value })}
                            className="bg-transparent font-bold outline-none focus:text-primary text-lg"
                            placeholder="Ex: Manhã"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveCycleStep(idx, "up")} className="p-2 hover:bg-background rounded-lg transition-colors"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => moveCycleStep(idx, "down")} className="p-2 hover:bg-background rounded-lg transition-colors"><ChevronDown className="w-4 h-4" /></button>
                          <button onClick={() => duplicateCycleStep(idx)} className="p-2 hover:bg-background rounded-lg transition-colors text-blue-600"><Copy className="w-4 h-4" /></button>
                          <button onClick={() => removeCycleStep(step.id)} className="p-2 hover:bg-background rounded-lg transition-colors text-rose-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Tipo</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => updateCycleStep(idx, { type: "trabalho" })}
                              className={cn(
                                "py-2 rounded-xl text-xs font-bold border transition-all", 
                                step.type === "trabalho" 
                                  ? "bg-primary/20 text-primary border-primary/40 shadow-sm" 
                                  : "bg-background text-muted-foreground hover:bg-secondary/50 border-transparent"
                              )}
                            >Trabalho</button>
                            <button 
                              onClick={() => updateCycleStep(idx, { type: "folga" })}
                              className={cn(
                                "py-2 rounded-xl text-xs font-bold border transition-all", 
                                step.type === "folga" 
                                  ? "bg-emerald-600/20 text-emerald-600 border-emerald-600/40 shadow-sm" 
                                  : "bg-background text-muted-foreground hover:bg-secondary/50 border-transparent"
                              )}
                            >Folga</button>
                          </div>
                        </div>

                        {step.type === "trabalho" && (
                          <>
                            <TimeInput 
                              label="Início" 
                              value={step.startTime} 
                              onChange={val => updateCycleStep(idx, { startTime: val })} 
                            />
                            <TimeInput 
                              label="Término" 
                              value={step.endTime} 
                              onChange={val => updateCycleStep(idx, { endTime: val })} 
                            />
                          </>
                        )}
                      </div>

                      {step.type === "trabalho" && (
                        <div className="flex items-center gap-3 pt-2 border-t border-dashed">
                          <label className="flex items-center gap-2 cursor-pointer group/check">
                            <input 
                              type="checkbox" 
                              checked={step.crossesMidnight} 
                              onChange={e => updateCycleStep(idx, { crossesMidnight: e.target.checked })}
                              className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary"
                            />
                            <span className="text-xs font-bold text-muted-foreground group-hover/check:text-foreground transition-colors">Atravessa meia-noite?</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Configuração Base (Para 12x36 e Custom) */}
          <section className="bg-card border rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Repeat className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Configuração Base</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Data de Início do Ciclo</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-4 bg-secondary/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                />
              </div>
              
              {formData.shiftMode !== "custom_cycle" && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Status Inicial</label>
                  <select
                    value={formData.startStatus}
                    onChange={(e) => setFormData({ ...formData, startStatus: e.target.value as any })}
                    className="w-full p-4 bg-secondary/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold appearance-none"
                  >
                    <option value="trabalho">Dia de Trabalho</option>
                    <option value="folga">Dia de Folga</option>
                  </select>
                </div>
              )}
            </div>
          </section>

          {/* Financeiro */}
          <section className="bg-card border rounded-[2.5rem] p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Financeiro (Opcional)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Modo de Cálculo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, financialMode: "per_shift" })}
                    className={cn(
                      "py-3 rounded-2xl text-sm font-bold border transition-all",
                      formData.financialMode === "per_shift" 
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm" 
                        : "bg-secondary/30 text-muted-foreground border-transparent"
                    )}
                  >
                    Por Plantão
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, financialMode: "per_hour" })}
                    className={cn(
                      "py-3 rounded-2xl text-sm font-bold border transition-all",
                      formData.financialMode === "per_hour" 
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm" 
                        : "bg-secondary/30 text-muted-foreground border-transparent"
                    )}
                  >
                    Por Hora
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                  Valor ({formData.financialMode === "per_shift" ? "por plantão" : "por hora"})
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black">R$</span>
                  <input
                    type="number"
                    value={formData.financialValue}
                    onChange={(e) => setFormData({ ...formData, financialValue: Number(e.target.value) })}
                    className="w-full p-4 pl-14 bg-secondary/30 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-black text-lg"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Horários Legados */}
        <aside className="lg:col-span-4 space-y-8">
          {formData.shiftMode !== "custom_cycle" && (
            <section className="bg-card border rounded-[2.5rem] p-8 space-y-8 shadow-sm sticky top-8">
              <h2 className="text-xl font-bold border-b pb-4">Horários da Escala</h2>
              
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-amber-600">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Turno Diurno</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <TimeInput label="Início" value={formData.dayShiftStart} onChange={v => setFormData(p => ({ ...p, dayShiftStart: v }))} />
                    <TimeInput label="Fim" value={formData.dayShiftEnd} onChange={v => setFormData(p => ({ ...p, dayShiftEnd: v }))} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Turno Noturno</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <TimeInput label="Início" value={formData.nightShiftStart} onChange={v => setFormData(p => ({ ...p, nightShiftStart: v }))} />
                    <TimeInput label="Fim" value={formData.nightShiftEnd} onChange={v => setFormData(p => ({ ...p, nightShiftEnd: v }))} />
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 space-y-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
              Todas as configurações são salvas no seu navegador. Você pode alternar entre modelos prontos ou criar seu próprio ciclo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, icon: Icon, title, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-6 rounded-3xl border-2 transition-all text-left gap-3 group active:scale-95",
        active 
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
          : "border-transparent bg-secondary/30 hover:bg-secondary/50"
      )}
    >
      <div className={cn(
        "p-2.5 rounded-xl transition-colors",
        active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-background text-muted-foreground group-hover:text-foreground"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{desc}</p>
      </div>
    </button>
  );
}
