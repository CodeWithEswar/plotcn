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

// Re-export formatCurrency and CurrencyFormatOptions for backwards compatibility with imports from './number'
export { formatCurrency, type CurrencyFormatOptions } from "./currency"
