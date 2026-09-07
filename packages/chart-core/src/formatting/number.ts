import { isFiniteNumber } from "../data/predicates"

/**
 * Formats a number using Intl.NumberFormat with an optional fallback for invalid inputs.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = "en-US"
): string {
  if (!isFiniteNumber(value)) return "—"
  try {
    return new Intl.NumberFormat(locale, options).format(value)
  } catch {
    return String(value)
  }
}

/**
 * Formats a currency value requiring an explicit ISO currency code (e.g. "USD", "EUR", "GBP").
 */
export function formatCurrency(
  value: number,
  currency: string,
  locale = "en-US"
): string {
  if (!isFiniteNumber(value)) return "—"
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}
