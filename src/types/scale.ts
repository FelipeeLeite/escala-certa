export type ShiftType = "diurno" | "noturno";

export type DayStatus = "trabalho" | "folga";

export type ShiftMode = "alternating" | "fixed";

export type FinancialMode = "per_shift" | "per_hour";

export interface FinancialConfig {
  mode: FinancialMode;
  value: number;
  currency: string;
}

export interface ScaleConfig {
  startDate: string; // ISO string
  startStatus: DayStatus;
  shiftMode: ShiftMode;
  initialShift: ShiftType; // Usado para "alternating" e como padrão inicial
  fixedShift: ShiftType; // Usado quando shiftMode === "fixed"
  dayShiftHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  nightShiftHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
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
  isOverride: boolean; // Se este evento altera o status do dia (trabalho/folga)
  overrideStatus?: DayStatus; // Status que será aplicado se isOverride for true
}

export interface DayInfo {
  date: Date;
  plannedStatus: DayStatus; // O que a escala 12x36 previu
  actualStatus: DayStatus;  // O status final após considerar as exceções
  shift: ShiftType;
  hours: string;
  isToday: boolean;
  events: UserEvent[];
  isOverridden: boolean; // Se o dia foi alterado por uma exceção
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
