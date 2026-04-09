import { 
  differenceInCalendarDays, 
  startOfDay, 
  startOfWeek, 
  endOfWeek,
  differenceInWeeks, 
  isSameDay, 
  addDays,
  differenceInSeconds,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval
} from "date-fns";
import { ScaleConfig, DayStatus, ShiftType, DayInfo, UserEvent, Summary, MonthMetrics, CycleStep } from "@/types/scale";

/**
 * UTILS DE CÁLCULO DE ESCALA CERTA
 */

/**
 * Calcula as informações planejadas de um dia baseado no modo de escala.
 */
export function getPlannedDayInfo(date: Date, config: ScaleConfig): { status: DayStatus; shift: string; hours: string; label?: string; cycleStep?: CycleStep } {
  const targetDate = startOfDay(date);
  const baseDate = startOfDay(new Date(config.startDate));
  const diffDays = differenceInCalendarDays(targetDate, baseDate);

  // MODO: CICLO PERSONALIZADO
  if (config.shiftMode === "custom_cycle" && config.customCycle && config.customCycle.length > 0) {
    const cycleLength = config.customCycle.length;
    // Normaliza o índice para suportar datas anteriores à baseDate
    const index = ((diffDays % cycleLength) + cycleLength) % cycleLength;
    const step = config.customCycle[index];
    
    return {
      status: step.type,
      shift: step.label || (step.type === "trabalho" ? "Trabalho" : "Folga"),
      hours: step.type === "trabalho" ? `${step.startTime} - ${step.endTime}` : "00:00 - 00:00",
      label: step.label,
      cycleStep: step
    };
  }

  // MODO: PRESETS (12x36 - Legado/Alternado/Fixo)
  const normalizedDiff = ((diffDays % 2) + 2) % 2;
  let status: DayStatus = "folga";
  
  if (config.startStatus === "trabalho") {
    status = normalizedDiff === 0 ? "trabalho" : "folga";
  } else {
    status = normalizedDiff === 0 ? "folga" : "trabalho";
  }

  // Determina turno (shift) e horários (hours) para presets
  let shift: string = "diurno";
  if (config.shiftMode === "fixed") {
    shift = config.fixedShift || "diurno";
  } else {
    const targetWeekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
    const baseWeekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
    const diffWeeks = Math.abs(differenceInWeeks(targetWeekStart, baseWeekStart));
    const weekDiff = ((diffWeeks % 2) + 2) % 2;
    
    if (config.initialShift === "diurno") {
      shift = weekDiff === 0 ? "diurno" : "noturno";
    } else {
      shift = weekDiff === 0 ? "noturno" : "diurno";
    }
  }

  const hours = shift === "diurno" 
    ? `${config.dayShiftHours.start} - ${config.dayShiftHours.end}`
    : `${config.nightShiftHours.start} - ${config.nightShiftHours.end}`;

  return { status, shift, hours };
}

/**
 * Retorna as informações completas de um dia, considerando a escala automática e exceções manuais (overrides).
 */
export function getDayInfo(date: Date, config: ScaleConfig, events: UserEvent[] = []): DayInfo {
  const planned = getPlannedDayInfo(date, config);
  const isToday = isSameDay(date, new Date());
  const dayEvents = events.filter(e => isSameDay(new Date(e.date), date));
  
  const overrideEvent = dayEvents.find(e => e.isOverride && e.overrideStatus);
  const actualStatus = overrideEvent ? (overrideEvent.overrideStatus as DayStatus) : planned.status;
  const isOverridden = !!overrideEvent;
    
  return {
    date,
    plannedStatus: planned.status,
    actualStatus,
    shift: planned.shift,
    hours: planned.hours,
    isToday,
    events: dayEvents,
    isOverridden,
    cycleStep: planned.cycleStep
  };
}

/**
 * Calcula se o usuário está em plantão AGORA e quanto tempo falta para o fim.
 */
export function getCurrentShiftStatus(config: ScaleConfig, events: UserEvent[] = []) {
  const now = new Date();
  const info = getDayInfo(now, config, events);
  
  if (info.actualStatus === "folga") return null;

  const [startH, startM] = info.hours.split(" - ")[0].split(":").map(Number);
  const [endH, endM] = info.hours.split(" - ")[1].split(":").map(Number);
  
  let shiftStart = new Date(now);
  shiftStart.setHours(startH, startM, 0, 0);
  
  let shiftEnd = new Date(now);
  shiftEnd.setHours(endH, endM, 0, 0);
  
  // Se cruza meia-noite
  const crossesMidnight = info.cycleStep?.crossesMidnight ?? (info.shift === "noturno" && (endH < startH || (endH === startH && endM <= startM)));

  if (crossesMidnight) {
    if (now < shiftStart) {
      shiftStart = addDays(shiftStart, -1);
    } else {
      shiftEnd = addDays(shiftEnd, 1);
    }
  }

  const isInShift = isWithinInterval(now, { start: shiftStart, end: shiftEnd });
  
  if (isInShift) {
    const secondsLeft = differenceInSeconds(shiftEnd, now);
    return {
      type: "working",
      secondsLeft,
      end: shiftEnd,
      info
    };
  }

  return null;
}

/**
 * Calcula o tempo até o próximo evento (início de plantão).
 */
export function getTimeUntilNextPlantao(config: ScaleConfig, events: UserEvent[] = []) {
  const now = new Date();
  const next = getNextPlantons(now, config, 1, events)[0];

  if (!next) return null;

  let targetDate = new Date(next.date);
  const [h, m] = next.hours.split(" - ")[0].split(":").map(Number);
  targetDate.setHours(h, m, 0, 0);

  if (targetDate <= now) {
    const nextNext = getNextPlantons(addDays(now, 1), config, 1, events)[0];
    if (!nextNext) return null;
    targetDate = new Date(nextNext.date);
    const [h2, m2] = nextNext.hours.split(" - ")[0].split(":").map(Number);
    targetDate.setHours(h2, m2, 0, 0);
  }

  return {
    secondsLeft: differenceInSeconds(targetDate, now),
    targetDate,
    info: next
  };
}

/**
 * Calcula a duração de um turno em horas.
 */
export function getShiftDuration(info: DayInfo, config: ScaleConfig): number {
  if (info.actualStatus === "folga") return 0;
  
  const [startH, startM] = info.hours.split(" - ")[0].split(":").map(Number);
  const [endH, endM] = info.hours.split(" - ")[1].split(":").map(Number);
  
  let start = startH + startM / 60;
  let end = endH + endM / 60;
  
  const crossesMidnight = info.cycleStep?.crossesMidnight ?? (info.shift === "noturno" && (endH < startH || (endH === startH && endM <= startM)));

  if (crossesMidnight && end <= start) {
    end += 24;
  }
  
  return end - start;
}

/**
 * Obtém o resumo da semana atual para o dashboard.
 */
export function getWeeklySummary(date: Date, config: ScaleConfig, events: UserEvent[] = []) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end }).map(d => getDayInfo(d, config, events));
  
  const actualWorkDays = days.filter(d => d.actualStatus === "trabalho").length;
  const actualOffDays = days.filter(d => d.actualStatus === "folga").length;
  const totalHours = days.reduce((acc, d) => acc + getShiftDuration(d, config), 0);
  
  let shiftModeStr = "Personalizada";
  if (config.shiftMode === "fixed") {
    shiftModeStr = `Fixo ${config.fixedShift}`;
  } else if (config.shiftMode === "alternating") {
    const diurnos = days.filter(d => d.actualStatus === "trabalho" && d.shift === "diurno").length;
    const noturnos = days.filter(d => d.actualStatus === "trabalho" && d.shift === "noturno").length;
    shiftModeStr = diurnos >= noturnos ? "Semana Diurna" : "Semana Noturna";
  }

  return {
    days,
    actualWorkDays,
    actualOffDays,
    totalHours,
    shiftMode: shiftModeStr
  };
}

/**
 * Calcula os próximos N plantões (status REAL de trabalho) a partir de uma data.
 */
export function getNextPlantons(startDate: Date, config: ScaleConfig, count: number, events: UserEvent[] = []): DayInfo[] {
  const plantons: DayInfo[] = [];
  let currentDate = startOfDay(startDate);
  let safetyCounter = 0;
  while (plantons.length < count && safetyCounter < 365) {
    const info = getDayInfo(currentDate, config, events);
    if (info.actualStatus === "trabalho") {
      plantons.push(info);
    }
    currentDate = addDays(currentDate, 1);
    safetyCounter++;
  }
  return plantons;
}

/**
 * Calcula os próximos N dias de folga (status REAL de folga) a partir de uma data.
 */
export function getNextOffDays(startDate: Date, config: ScaleConfig, count: number, events: UserEvent[] = []): DayInfo[] {
  const offDays: DayInfo[] = [];
  let currentDate = startOfDay(startDate);
  let safetyCounter = 0;
  while (offDays.length < count && safetyCounter < 365) {
    const info = getDayInfo(currentDate, config, events);
    if (info.actualStatus === "folga") {
      offDays.push(info);
    }
    currentDate = addDays(currentDate, 1);
    safetyCounter++;
  }
  return offDays;
}

/**
 * Calcula a sequência de plantões nos próximos 7 dias.
 */
export function getSequenceInfo(startDate: Date, config: ScaleConfig, events: UserEvent[] = []) {
  const days = eachDayOfInterval({
    start: startOfDay(startDate),
    end: addDays(startOfDay(startDate), 6)
  }).map(d => getDayInfo(d, config, events));

  const workDays = days.filter(d => d.actualStatus === "trabalho").length;
  const yesterday = getDayInfo(addDays(new Date(), -1), config, events);
  const today = getDayInfo(new Date(), config, events);
  const tomorrow = getDayInfo(addDays(new Date(), 1), config, events);

  return {
    workDaysInNext7Days: workDays,
    yesterday,
    today,
    tomorrow
  };
}

/**
 * Calcula métricas detalhadas para um determinado mês para o relatório.
 */
export function getMonthMetrics(month: Date, config: ScaleConfig, events: UserEvent[] = []): MonthMetrics {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  const metrics: MonthMetrics = {
    plannedWorkDays: 0,
    actualWorkDays: 0,
    plannedOffDays: 0,
    actualOffDays: 0,
    extraShifts: 0,
    extraLeaves: 0,
    vacationSickDays: 0,
    absenceDays: 0,
    plannedHours: 0,
    actualHours: 0,
    hourBank: 0,
    estimatedPayment: 0,
    days: []
  };
  
  eachDayOfInterval({ start, end }).forEach(d => {
    const info = getDayInfo(d, config, events);
    metrics.days.push(info);
    
    const plannedDuration = getShiftDuration({ ...info, actualStatus: info.plannedStatus }, config);
    const actualDuration = getShiftDuration(info, config);
    
    if (info.plannedStatus === "trabalho") {
      metrics.plannedWorkDays++;
      metrics.plannedHours += plannedDuration;
    } else {
      metrics.plannedOffDays++;
    }
    
    if (info.actualStatus === "trabalho") {
      metrics.actualWorkDays++;
      metrics.actualHours += actualDuration;
      if (info.plannedStatus === "folga") metrics.extraShifts++;
    } else {
      metrics.actualOffDays++;
      if (info.plannedStatus === "trabalho") metrics.extraLeaves++;
    }
    
    const hasVacationSick = info.events.some(e => e.type === "ferias" || e.type === "atestado");
    if (hasVacationSick) metrics.vacationSickDays++;
    const hasAbsence = info.events.some(e => e.type === "ausencia");
    if (hasAbsence) metrics.absenceDays++;
  });
  
  metrics.hourBank = metrics.actualHours - metrics.plannedHours;

  if (config.financial && config.financial.value > 0) {
    if (config.financial.mode === "per_shift") {
      metrics.estimatedPayment = metrics.actualWorkDays * config.financial.value;
    } else {
      metrics.estimatedPayment = metrics.actualHours * config.financial.value;
    }
  }
  
  return metrics;
}

/**
 * Retorna o objeto completo de resumo para o dashboard.
 */
export function getSummary(config: ScaleConfig, events: UserEvent[] = []): Summary {
  const today = getDayInfo(new Date(), config, events);
  const currentShift = getCurrentShiftStatus(config, events);
  const timeUntilNextPlantao = getTimeUntilNextPlantao(config, events);
  const weeklySummary = getWeeklySummary(new Date(), config, events);
  const monthMetrics = getMonthMetrics(new Date(), config, events);

  return {
    today,
    currentShift,
    timeUntilNextPlantao,
    weeklySummary,
    monthMetrics
  };
}
