import type { ChartThemeSnapshot } from "./types"

/**
 * Resolves a categorical series color by index, cycling deterministically.
 * Section 9.25.
 */
export function getSeriesColor(
  seriesColors: readonly string[],
  index: number
): string {
  if (!seriesColors || seriesColors.length === 0) {
    return "#10b981"
  }
  const safeIndex = Math.abs(index) % seriesColors.length
  return seriesColors[safeIndex]
}

/**
 * Resolves a semantic status color from the active theme.
 * Section 9.28.
 */
export function getSemanticStatusColor(
  status: "positive" | "negative" | "warning" | "neutral",
  theme: ChartThemeSnapshot
): string {
  switch (status) {
    case "positive":
      return theme.positive
    case "negative":
      return theme.negative
    case "warning":
      return theme.warning
    case "neutral":
      return theme.neutral
  }
}
