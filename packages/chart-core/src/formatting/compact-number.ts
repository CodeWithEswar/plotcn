import { isFiniteNumber } from "../data/predicates"

/**
 * Formats large numbers compactly for tick marks and badges (e.g. 1.2K, 3.4M, 5.1B).
 */
export function formatCompactNumber(value: number, locale = "en-US"): string {
  if (!isFiniteNumber(value)) return "—"
  try {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    const abs = Math.abs(value)
    if (abs >= 1e9) return `${(value / 1e9).toFixed(1)}B`
    if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return String(value)
  }
}
