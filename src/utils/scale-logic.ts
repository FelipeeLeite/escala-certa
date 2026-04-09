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
import { ScaleConfig, DayStatus, ShiftType, DayInfo, UserEvent, Summary, MonthMetrics } from "@/types/scale";

/**
 * UTILS DE CÁLCULO DE ESCALA CERTA (12x36)
 */

/**
 * Calcula se um determinado dia é de trabalho ou folga na escala prevista.
 * Baseado na alternância dia sim/dia não a partir de uma data base.
 */
export function getDayStatus(date: Date, config: ScaleConfig): DayStatus {
  const targetDate = startOfDay(date);
  const baseDate = startOfDay(new Date(config.startDate));
  
  const diffDays = differenceInCalendarDays(targetDate, baseDate);
  
  // Garantir que o resto seja sempre 0 ou 1, mesmo para datas anteriores à baseDate
  const normalizedDiff = ((diffDays % 2) + 2) % 2;
  
  if (config.startStatus === "trabalho") {
    return normalizedDiff === 0 ? "trabalho" : "folga";
  } else {
    return normalizedDiff === 0 ? "folga" : "trabalho";
  }
}

/**
 * Calcula qual o turno (diurno/noturno) para a semana de uma determinada data.
 * A alternância ocorre a cada semana completa no modo "alternated".
 */
export function getShiftForDate(date: Date, config: ScaleConfig): ShiftType {
  const targetDate = startOfDay(date);
  const baseDate = startOfDay(new Date(config.startDate));
  
  // Se o modo for fixo, retorna sempre o turno fixo configurado
  if (config.shiftMode === "fixed") {
    return config.fixedShift || config.initialShift || "diurno";
  }

  // Lógica para modo alternado (comportamento atual)
  // Semana inicia no DOMINGO (weekStartsOn: 0) para seguir o padrão de alternância semanal comum
  const targetWeekStart = startOfWeek(targetDate, { weekStartsOn: 0 });
  const baseWeekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
  
  const diffWeeks = Math.abs(differenceInWeeks(targetWeekStart, baseWeekStart));
  
  const normalizedDiff = ((diffWeeks % 2) + 2) % 2;
  
  if (config.initialShift === "diurno") {
    return normalizedDiff === 0 ? "diurno" : "noturno";
  } else {
    return normalizedDiff === 0 ? "noturno" : "diurno";
  }
}

/**
 * Retorna as informações completas de um dia, considerando a escala automática e exceções manuais (overrides).
 */
export function getDayInfo(date: Date, config: ScaleConfig, events: UserEvent[] = []): DayInfo {
  const plannedStatus = getDayStatus(date, config);
  const shift = getShiftForDate(date, config);
  const isToday = isSameDay(date, new Date());
  
  const dayEvents = events.filter(e => isSameDay(new Date(e.date), date));
  
  // Verifica se há algum evento que sobrescreve o status do dia
  const overrideEvent = dayEvents.find(e => e.isOverride && e.overrideStatus);
  const actualStatus = overrideEvent ? (overrideEvent.overrideStatus as DayStatus) : plannedStatus;
  const isOverridden = !!overrideEvent;
  
  const hours = shift === "diurno" 
    ? `${config.dayShiftHours.start} - ${config.dayShiftHours.end}`
    : `${config.nightShiftHours.start} - ${config.nightShiftHours.end}`;
    
  return {
    date,
    plannedStatus,
    actualStatus,
    shift,
    hours,
    isToday,
    events: dayEvents,
    isOverridden
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
  
  // Se for noturno e o fim for menor que o início, o fim é no dia seguinte
  if (info.shift === "noturno" && (endH < startH || (endH === startH && endM <= startM))) {
    // Se agora for antes do início do plantão de hoje, o plantão que estamos checando 
    // pode ter começado ontem à noite.
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

  // Se a data alvo já passou (ex: plantão de hoje já começou), pegamos o próximo real
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
  const [startH, startM] = info.hours.split(" - ")[0].split(":").map(Number);
  const [endH, endM] = info.hours.split(" - ")[1].split(":").map(Number);
  
  let start = startH + startM / 60;
  let end = endH + endM / 60;
  
  if (end <= start) {
    end += 24;
  }
  
  return end - start;
}

/**
 * Obtém o resumo da semana atual para o dashboard.
 */
export function getWeeklySummary(date: Date, config: ScaleConfig, events: UserEvent[] = []) {
  // Semana do dashboard começa na SEGUNDA-FEIRA (weekStartsOn: 1) para visualização
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start, end }).map(d => getDayInfo(d, config, events));
  
  const actualWorkDays = days.filter(d => d.actualStatus === "trabalho").length;
  const actualOffDays = days.filter(d => d.actualStatus === "folga").length;
  
  const totalHours = days
    .filter(d => d.actualStatus === "trabalho")
    .reduce((acc, d) => acc + getShiftDuration(d, config), 0);
  
  let shiftMode = "Alternado";
  if (config.shiftMode === "fixed") {
    shiftMode = `Fixo ${config.fixedShift}`;
  } else {
    // No modo alternado, identifica se a semana é predominantemente de um turno
    const dayShifts = days.filter(d => d.actualStatus === "trabalho").map(d => d.shift);
    const diurnos = dayShifts.filter(s => s === "diurno").length;
    const noturnos = dayShifts.filter(s => s === "noturno").length;
    shiftMode = diurnos >= noturnos ? "Semana Diurna" : "Semana Noturna";
  }

  return {
    days,
    actualWorkDays,
    actualOffDays,
    totalHours,
    shiftMode
  };
}

/**
 * Calcula os próximos N plantões (status REAL de trabalho) a partir de uma data.
 */
export function getNextPlantons(startDate: Date, config: ScaleConfig, count: number, events: UserEvent[] = []): DayInfo[] {
  const plantons: DayInfo[] = [];
  let currentDate = startOfDay(startDate);
  
  // Limite de segurança para evitar loop infinito
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
  
  const days = eachDayOfInterval({ start, end });
  
  days.forEach(d => {
    const info = getDayInfo(d, config, events);
    metrics.days.push(info);
    
    const duration = getShiftDuration(info, config);
    
    if (info.plannedStatus === "trabalho") {
      metrics.plannedWorkDays++;
      metrics.plannedHours += duration;
    } else {
      metrics.plannedOffDays++;
    }
    
    if (info.actualStatus === "trabalho") {
      metrics.actualWorkDays++;
      metrics.actualHours += duration;
      if (info.plannedStatus === "folga") metrics.extraShifts++;
    } else {
      metrics.actualOffDays++;
      // Consideramos qualquer mudança de trabalho para folga como extraLeave (ex: folga extra, férias, atestado, ausência)
      if (info.plannedStatus === "trabalho") {
        metrics.extraLeaves++;
      }
    }
    
    const hasVacationSick = info.events.some(e => e.type === "ferias" || e.type === "atestado");
    if (hasVacationSick) metrics.vacationSickDays++;

    const hasAbsence = info.events.some(e => e.type === "ausencia");
    if (hasAbsence) {
      metrics.absenceDays++;
      // Se faltou no plantão, o banco de horas deve refletir a perda das horas que seriam trabalhadas
      if (info.plannedStatus === "trabalho") {
        // A ausência em dia de trabalho planejado não soma horas reais, 
        // então a diferença (hourBank) já refletirá negativamente.
      }
    }
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
 * Calcula os próximos N dias de folga (status REAL de folga) a partir de uma data.
 */
export function getNextOffDays(startDate: Date, config: ScaleConfig, count: number, events: UserEvent[] = []): DayInfo[] {
  const offDays: DayInfo[] = [];
  let currentDate = startOfDay(startDate);
  
  // Limite de segurança para evitar loop infinito
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
 * Retorna o objeto completo de resumo para o dashboard.
 */
export function getSummary(config: ScaleConfig, events: UserEvent[] = []): Summary {
  const now = new Date();
  return {
    today: getDayInfo(now, config, events),
    currentShift: getCurrentShiftStatus(config, events),
    timeUntilNextPlantao: getTimeUntilNextPlantao(config, events),
    weeklySummary: getWeeklySummary(now, config, events),
    monthMetrics: getMonthMetrics(now, config, events)
  };
}
