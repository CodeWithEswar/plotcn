import { isFiniteNumber } from "../data/predicates"

/**
 * Formats a ratio (e.g. 0.25 -> "25%" or 25 -> "25%") into a percentage string.
 * @param isRatio If true, 0.5 becomes 50%. If false, 50 becomes 50%.
 */
export function formatPercentage(
  value: number,
  decimals = 1,
  isRatio = true,
  locale = "en-US"
): string {
  if (!isFiniteNumber(value)) return "—"
  try {
    const valToFormat = isRatio ? value : value / 100
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(valToFormat)
  } catch {
    const pct = isRatio ? value * 100 : value
    return `${pct.toFixed(decimals)}%`
  }
}
