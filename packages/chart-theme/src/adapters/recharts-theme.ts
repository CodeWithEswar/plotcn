/**
 * Direct CSS variable references for Recharts and React SVG components.
 * By consuming CSS variables directly, Recharts and SVG charts automatically
 * adapt to light/dark switches and palette changes without rerendering or recalculation.
 * Section 9.56, 9.57.
 */
export const rechartsTheme = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  mutedForeground: "var(--chart-muted-foreground)",
  border: "var(--chart-border)",

  grid: "var(--chart-grid)",
  gridEmphasis: "var(--chart-grid-emphasis)",
  axis: "var(--chart-axis)",
  axisEmphasis: "var(--chart-axis-emphasis)",
  zeroLine: "var(--chart-zero-line)",

  crosshair: "var(--chart-crosshair)",
  cursor: "var(--chart-cursor)",
  selection: "var(--chart-selection)",
  focus: "var(--chart-focus)",

  positive: "var(--chart-positive)",
  negative: "var(--chart-negative)",
  warning: "var(--chart-warning)",
  neutral: "var(--chart-neutral)",

  tooltipBackground: "var(--chart-tooltip-background)",
  tooltipForeground: "var(--chart-tooltip-foreground)",
  tooltipMuted: "var(--chart-tooltip-muted)",
  tooltipBorder: "var(--chart-tooltip-border)",

  disabled: "var(--chart-disabled)",
  hidden: "var(--chart-hidden)",

  /**
   * Deterministically returns the CSS variable expression for series index (1-based or 0-based).
   * Modulo 8 cycling ensures colors remain within defined tokens.
   */
  series(index: number): string {
    const slot = (Math.abs(Math.floor(index)) % 8) + 1
    return `var(--chart-${slot})`
  },
} as const

/**
 * Helper to obtain the CSS variable string for a series index.
 */
export function getRechartsSeriesColor(index: number): string {
  return rechartsTheme.series(index)
}
