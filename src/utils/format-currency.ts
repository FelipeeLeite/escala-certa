/**
 * Formata um valor numérico como moeda (padrão BRL).
 */
export function formatCurrency(value: number, currency = "BRL", locale = "pt-BR"): string {
  // Garante que o valor seja um número válido para evitar NaN na interface
  const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(safeValue);
}
