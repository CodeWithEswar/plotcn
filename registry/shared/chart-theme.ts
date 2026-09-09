/**
 * Plotcn Shared Theme Adapter
 * Extracts semantic CSS variables (--chart-1 ... --chart-8, structural, interaction, and status tokens)
 * from DOM or fallback defaults.
 * Section 9.3, 9.8, 9.88.
 */

export interface ChartThemeTokens {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  chart6?: string
  chart7?: string
  chart8?: string

  // Surfaces & Text
  background: string
  foreground: string
  muted: string
  border: string

  // Structural
  grid?: string
  axis?: string
  zeroLine?: string

  // Interaction
  crosshair?: string

  // Semantic Status
  positive?: string
  negative?: string
  warning?: string
  neutral?: string

  // Tooltip
  tooltipBackground?: string
  tooltipForeground?: string
  tooltipBorder?: string
}

export const defaultChartTokens: ChartThemeTokens = {
  chart1: "#10b981",
  chart2: "#0ea5e9",
  chart3: "#8b5cf6",
  chart4: "#f59e0b",
  chart5: "#e11d48",
  chart6: "#4f46e5",
  chart7: "#14b8a6",
  chart8: "#f97316",

  background: "#09090b",
  foreground: "#fafafa",
  muted: "#27272a",
  border: "#27272a",

  grid: "#27272a",
  axis: "#a1a1aa",
  zeroLine: "#52525b",
  crosshair: "#d4d4d8",

  positive: "#10b981",
  negative: "#ef4444",
  warning: "#f59e0b",
  neutral: "#71717a",

  tooltipBackground: "#09090b",
  tooltipForeground: "#fafafa",
  tooltipBorder: "#27272a",
}

/**
 * Resolves active CSS variables in the browser, falling back to static tokens during SSR.
 */
export function getComputedChartTokens(element?: Element | null): ChartThemeTokens {
  if (typeof window === "undefined") {
    return defaultChartTokens
  }

  const style = getComputedStyle(element ?? document.documentElement)

  const read = (prop: string, fallback: string | undefined): string | undefined => {
    const val = style.getPropertyValue(prop).trim()
    return val || fallback
  }

  return {
    chart1: read("--chart-1", defaultChartTokens.chart1)!,
    chart2: read("--chart-2", defaultChartTokens.chart2)!,
    chart3: read("--chart-3", defaultChartTokens.chart3)!,
    chart4: read("--chart-4", defaultChartTokens.chart4)!,
    chart5: read("--chart-5", defaultChartTokens.chart5)!,
    chart6: read("--chart-6", defaultChartTokens.chart6),
    chart7: read("--chart-7", defaultChartTokens.chart7),
    chart8: read("--chart-8", defaultChartTokens.chart8),
    background: read("--chart-background", read("--background", defaultChartTokens.background))!,
    foreground: read("--chart-foreground", read("--foreground", defaultChartTokens.foreground))!,
    muted: read("--chart-muted-foreground", read("--muted-foreground", defaultChartTokens.muted))!,
    border: read("--chart-border", read("--border", defaultChartTokens.border))!,
    grid: read("--chart-grid", defaultChartTokens.grid),
    axis: read("--chart-axis", defaultChartTokens.axis),
    zeroLine: read("--chart-zero-line", defaultChartTokens.zeroLine),
    crosshair: read("--chart-crosshair", defaultChartTokens.crosshair),
    positive: read("--chart-positive", defaultChartTokens.positive),
    negative: read("--chart-negative", defaultChartTokens.negative),
    warning: read("--chart-warning", defaultChartTokens.warning),
    neutral: read("--chart-neutral", defaultChartTokens.neutral),
    tooltipBackground: read("--chart-tooltip-background", defaultChartTokens.tooltipBackground),
    tooltipForeground: read("--chart-tooltip-foreground", defaultChartTokens.tooltipForeground),
    tooltipBorder: read("--chart-tooltip-border", defaultChartTokens.tooltipBorder),
  }
}
