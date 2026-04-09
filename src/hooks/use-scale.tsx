"use client";

import React, { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import { ScaleConfig, UserEvent, Summary } from "@/types/scale";
import { useLocalStorage } from "./use-local-storage";
import { getSummary as getSummaryLogic } from "@/utils/scale-logic";

interface ScaleContextType {
  config: ScaleConfig;
  events: UserEvent[];
  updateConfig: (newConfig: Partial<ScaleConfig>) => void;
  resetConfig: () => void;
  addEvent: (event: Omit<UserEvent, "id">) => void;
  updateEvent: (event: UserEvent) => void;
  removeEvent: (id: string) => void;
  getSummary: () => Summary;
}

const defaultConfig: ScaleConfig = {
  startDate: new Date().toISOString(),
  startStatus: "trabalho",
  shiftMode: "alternating",
  initialShift: "diurno",
  fixedShift: "diurno",
  dayShiftHours: { start: "07:00", end: "19:00" },
  nightShiftHours: { start: "19:00", end: "07:00" },
  displayPlantonsCount: 10,
  financial: {
    mode: "per_shift",
    value: 0,
    currency: "BRL"
  }
};

const ScaleContext = createContext<ScaleContextType | undefined>(undefined);

export function ScaleProvider({ children }: { children: ReactNode }) {
  const [storedConfig, setConfig] = useLocalStorage<Partial<ScaleConfig>>("escala-certa-config", defaultConfig);
  const [events, setEvents] = useLocalStorage<UserEvent[]>("escala-certa-events", []);

  // Mescla o config salvo com os valores padrão para garantir que novos campos existam
  const config = useMemo(() => ({
    ...defaultConfig,
    ...storedConfig,
    // Garante que o objeto financial exista mesmo se não estiver no localStorage
    financial: {
      ...defaultConfig.financial,
      ...(storedConfig?.financial || {})
    }
  } as ScaleConfig), [storedConfig]);

  const updateConfig = useCallback((newConfig: Partial<ScaleConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, [setConfig]);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, [setConfig]);

  const addEvent = useCallback((event: Omit<UserEvent, "id">) => {
    const newEvent = { 
      ...event, 
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11) 
    };
    setEvents((prev) => [...prev, newEvent]);
  }, [setEvents]);

  const updateEvent = useCallback((updatedEvent: UserEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  }, [setEvents]);

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, [setEvents]);

  const getSummary = useCallback(() => {
    return getSummaryLogic(config, events);
  }, [config, events]);

  const value = useMemo(() => ({
    config,
    events,
    updateConfig,
    resetConfig,
    addEvent,
    updateEvent,
    removeEvent,
    getSummary,
  }), [config, events, updateConfig, resetConfig, addEvent, updateEvent, removeEvent, getSummary]);

  return <ScaleContext.Provider value={value}>{children}</ScaleContext.Provider>;
}

export function useScale() {
  const context = useContext(ScaleContext);
  if (context === undefined) {
    throw new Error("useScale deve ser usado dentro de um ScaleProvider");
  }
  return context;
}
