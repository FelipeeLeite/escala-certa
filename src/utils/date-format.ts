import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Utilitário para formatar strings em minúsculo, conforme padrão gramatical pt-BR
 * para meses e dias da semana.
 */
function toLowerBR(str: string): string {
  return str.toLowerCase();
}

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA).
 * Ex: 08/04/2026
 */
export function formatDateBR(date: Date | string | number): string {
  const d = new Date(date);
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Formata uma data e hora para o padrão brasileiro (DD/MM/AAAA HH:mm).
 * Ex: 08/04/2026 19:00
 */
export function formatDateTimeBR(date: Date | string | number): string {
  const d = new Date(date);
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

/**
 * Formata o mês e ano por extenso (mês de AAAA).
 * Ex: abril de 2026
 */
export function formatMonthYearBR(date: Date | string | number): string {
  const d = new Date(date);
  return toLowerBR(format(d, "MMMM 'de' yyyy", { locale: ptBR }));
}

/**
 * Formata o dia da semana por extenso.
 * Ex: segunda-feira
 */
export function formatWeekdayBR(date: Date | string | number): string {
  const d = new Date(date);
  return toLowerBR(format(d, "eeee", { locale: ptBR }));
}

/**
 * Formata o dia e o mês curto.
 * Ex: 08/04
 */
export function formatDayMonthBR(date: Date | string | number): string {
  const d = new Date(date);
  return format(d, "dd/MM", { locale: ptBR });
}

/**
 * Formata o dia e o mês por extenso.
 * Ex: 8 de abril
 */
export function formatDayLongBR(date: Date | string | number): string {
  const d = new Date(date);
  return toLowerBR(format(d, "d 'de' MMMM", { locale: ptBR }));
}

/**
 * Formata o dia da semana abreviado com a primeira letra maiúscula para tabelas/calendário.
 * Ex: Seg, Ter, Qua...
 */
export function formatWeekdayShortBR(date: Date | string | number): string {
  const d = new Date(date);
  const formatted = format(d, "eee", { locale: ptBR });
  // Capitaliza apenas a primeira letra: seg -> Seg
  return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}
