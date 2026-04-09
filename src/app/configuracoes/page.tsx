"use client";

import { useScale } from "@/hooks/use-scale";
import { ArrowLeft, Save, RotateCcw, Clock, Repeat, Lock, DollarSign, Wallet } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { config, updateConfig, resetConfig } = useScale();
  const [showFeedback, setShowFeedback] = useState(false);
  const [formData, setFormData] = useState({
    startDate: format(new Date(config.startDate), "yyyy-MM-dd"),
    startStatus: config.startStatus,
    shiftMode: config.shiftMode || "alternating",
    initialShift: config.initialShift,
    fixedShift: config.fixedShift || "diurno",
    dayShiftStart: config.dayShiftHours.start,
    dayShiftEnd: config.dayShiftHours.end,
    nightShiftStart: config.nightShiftHours.start,
    nightShiftEnd: config.nightShiftHours.end,
    financialMode: config.financial?.mode || "per_shift",
    financialValue: config.financial?.value || 0,
  });

  const handleSave = () => {
    updateConfig({
      startDate: new Date(formData.startDate).toISOString(),
      startStatus: formData.startStatus as any,
      shiftMode: formData.shiftMode as any,
      initialShift: formData.initialShift as any,
      fixedShift: formData.fixedShift as any,
      dayShiftHours: { start: formData.dayShiftStart, end: formData.dayShiftEnd },
      nightShiftHours: { start: formData.nightShiftStart, end: formData.nightShiftEnd },
      financial: {
        mode: formData.financialMode as any,
        value: Number(formData.financialValue),
        currency: "BRL"
      }
    });
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 animate-in fade-in duration-700 relative">
      {showFeedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Save className="w-3 h-3" />
          </div>
          <span className="font-bold">Configurações salvas com sucesso!</span>
        </div>
      )}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b pb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-3 hover:bg-secondary rounded-2xl transition-all active:scale-90 border shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ajustes
            </h1>
            <p className="text-muted-foreground font-medium">Configure sua escala e preferências.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (confirm("Tem certeza que deseja restaurar os valores padrão?")) {
                resetConfig();
                window.location.reload();
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-background text-foreground rounded-xl font-semibold hover:bg-secondary transition-all border shadow-sm active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Modo de Turno */}
          <section className="bg-card border rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Modo de Turno</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setFormData({ ...formData, shiftMode: "alternating" })}
                className={cn(
                  "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left gap-3 group",
                  formData.shiftMode === "alternating" 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-transparent bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  formData.shiftMode === "alternating" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground group-hover:text-foreground"
                )}>
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Alternado</p>
                  <p className="text-xs text-muted-foreground mt-1">Troca semanalmente entre diurno e noturno.</p>
                </div>
              </button>

              <button
                onClick={() => setFormData({ ...formData, shiftMode: "fixed" })}
                className={cn(
                  "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left gap-3 group",
                  formData.shiftMode === "fixed" 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-transparent bg-secondary/30 hover:bg-secondary/50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  formData.shiftMode === "fixed" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground group-hover:text-foreground"
                )}>
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Fixo</p>
                  <p className="text-xs text-muted-foreground mt-1">Mantém sempre o mesmo turno de trabalho.</p>
                </div>
              </button>
            </div>

            {formData.shiftMode === "fixed" && (
              <div className="pt-4 animate-in slide-in-from-top-4 duration-300">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Escolha o Turno Fixo</label>
                <div className="grid grid-cols-2 gap-3">
                  {["diurno", "noturno"].map((shift) => (
                    <button
                      key={shift}
                      onClick={() => setFormData({ ...formData, fixedShift: shift as any })}
                      className={cn(
                        "py-3 rounded-xl font-bold border transition-all capitalize",
                        formData.fixedShift === shift 
                          ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                          : "bg-background text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Configuração da Escala */}
          <section className="bg-card border rounded-3xl p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Repeat className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Configuração Base</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Data de Início</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3.5 bg-secondary/30 border border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Status Inicial</label>
                <select
                  value={formData.startStatus}
                  onChange={(e) => setFormData({ ...formData, startStatus: e.target.value as any })}
                  className="w-full p-3.5 bg-secondary/30 border border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium appearance-none"
                >
                  <option value="trabalho">Dia de Trabalho</option>
                  <option value="folga">Dia de Folga</option>
                </select>
              </div>

              {formData.shiftMode === "alternating" && (
                <div className="space-y-3 sm:col-span-2 animate-in fade-in duration-500">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Turno da Primeira Semana</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["diurno", "noturno"].map((shift) => (
                      <button
                        key={shift}
                        onClick={() => setFormData({ ...formData, initialShift: shift as any })}
                        className={cn(
                          "py-3 rounded-xl font-bold border transition-all capitalize",
                          formData.initialShift === shift 
                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                            : "bg-background text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {shift}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Configuração Financeira */}
          <section className="bg-card border rounded-3xl p-8 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Financeiro (Opcional)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Modo de Cálculo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, financialMode: "per_shift" })}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-bold border transition-all",
                      formData.financialMode === "per_shift" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-secondary/30 text-muted-foreground"
                    )}
                  >
                    Por Plantão
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, financialMode: "per_hour" })}
                    className={cn(
                      "py-2 px-3 rounded-xl text-xs font-bold border transition-all",
                      formData.financialMode === "per_hour" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-secondary/30 text-muted-foreground"
                    )}
                  >
                    Por Hora
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Valor ({formData.financialMode === "per_shift" ? "por plantão" : "por hora"})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                  <input
                    type="number"
                    value={formData.financialValue}
                    onChange={(e) => setFormData({ ...formData, financialValue: Number(e.target.value) })}
                    className="w-full p-3.5 pl-12 bg-secondary/30 border border-transparent rounded-2xl focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Horários dos Turnos */}
        <aside className="space-y-8">
          <section className="bg-card border rounded-3xl p-8 space-y-8 shadow-sm">
            <h2 className="text-xl font-bold border-b pb-4">Horários</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Turno Diurno</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Início</span>
                    <input
                      type="time"
                      value={formData.dayShiftStart}
                      onChange={(e) => setFormData({ ...formData, dayShiftStart: e.target.value })}
                      className="w-full p-3 bg-secondary/30 rounded-xl focus:bg-background border-2 border-transparent focus:border-amber-500/30 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Fim</span>
                    <input
                      type="time"
                      value={formData.dayShiftEnd}
                      onChange={(e) => setFormData({ ...formData, dayShiftEnd: e.target.value })}
                      className="w-full p-3 bg-secondary/30 rounded-xl focus:bg-background border-2 border-transparent focus:border-amber-500/30 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <h3 className="text-sm font-black uppercase tracking-widest">Turno Noturno</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Início</span>
                    <input
                      type="time"
                      value={formData.nightShiftStart}
                      onChange={(e) => setFormData({ ...formData, nightShiftStart: e.target.value })}
                      className="w-full p-3 bg-secondary/30 rounded-xl focus:bg-background border-2 border-transparent focus:border-indigo-500/30 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Fim</span>
                    <input
                      type="time"
                      value={formData.nightShiftEnd}
                      onChange={(e) => setFormData({ ...formData, nightShiftEnd: e.target.value })}
                      className="w-full p-3 bg-secondary/30 rounded-xl focus:bg-background border-2 border-transparent focus:border-indigo-500/30 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Dica: Todas as alterações são salvas localmente e não saem do seu navegador. Sua privacidade é garantida.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
