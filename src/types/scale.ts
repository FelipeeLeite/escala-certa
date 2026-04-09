export type ShiftType = "diurno" | "noturno";
export type DayStatus = "trabalho" | "folga";
export type ShiftMode = "alternating" | "fixed" | "custom_cycle";
export type FinancialMode = "per_shift" | "per_hour";

export interface FinancialConfig {
  mode: FinancialMode;
  value: number;
  currency: string;
}

export interface CycleStep {
  id: string;
  type: DayStatus;
  label: string; // Ex: "Manhã", "Tarde", "Noite", "Plantão A"
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color?: string; // Cor opcional para exibição no calendário
  observation?: string;
  crossesMidnight?: boolean; // Se o turno termina no dia seguinte
}

export interface ScaleConfig {
  startDate: string; // ISO string - Data base de início do ciclo
  startStatus: DayStatus; // Legado (para preset 12x36)
  shiftMode: ShiftMode; // alternating | fixed | custom_cycle
  initialShift: ShiftType; // Legado (para preset 12x36)
  fixedShift: ShiftType; // Legado (para preset 12x36)
  dayShiftHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  nightShiftHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  customCycle: CycleStep[]; // Novo: Lista ordenada de passos do ciclo
  displayPlantonsCount: number;
  financial?: FinancialConfig;
}

export type EventType = "ferias" | "atestado" | "troca" | "folga_extra" | "plantao_extra" | "treinamento" | "ausencia" | "compromisso" | "lembrete";

export interface UserEvent {
  id: string;
  date: string; // ISO string
  title: string;
  type: EventType;
  description?: string;
  isOverride: boolean;
  overrideStatus?: DayStatus;
}

export interface DayInfo {
  date: Date;
  plannedStatus: DayStatus;
  actualStatus: DayStatus;
  shift: string; // Agora string livre (ex: "diurno", "noturno", "Manhã")
  hours: string;
  isToday: boolean;
  events: UserEvent[];
  isOverridden: boolean;
  cycleStep?: CycleStep; // Passo do ciclo correspondente a este dia
}

export interface MonthMetrics {
  plannedWorkDays: number;
  actualWorkDays: number;
  plannedOffDays: number;
  actualOffDays: number;
  extraShifts: number;
  extraLeaves: number;
  vacationSickDays: number;
  absenceDays: number;
  plannedHours: number;
  actualHours: number;
  hourBank: number;
  estimatedPayment: number;
  days: DayInfo[];
}

export interface Summary {
  today: DayInfo;
  currentShift: {
    type: string;
    secondsLeft: number;
    end: Date;
    info: DayInfo;
  } | null;
  timeUntilNextPlantao: {
    secondsLeft: number;
    targetDate: Date;
    info: DayInfo;
  } | null;
  weeklySummary: {
    days: DayInfo[];
    actualWorkDays: number;
    actualOffDays: number;
    totalHours: number;
    shiftMode: string;
  };
  monthMetrics: MonthMetrics;
}
