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
  chart1: "hsl(142 71% 45%)", // emerald
  chart2: "hsl(199 89% 48%)", // sky
  chart3: "hsl(262 83% 58%)", // purple
  chart4: "hsl(31 97% 55%)",  // amber
  chart5: "hsl(346 87% 43%)", // rose
  chart6: "hsl(245 90% 60%)", // indigo
  chart7: "hsl(175 65% 42%)", // teal
  chart8: "hsl(15 85% 58%)",  // orange

  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  muted: "hsl(240 3.7% 15.9%)",
  border: "hsl(240 3.7% 15.9%)",

  grid: "hsl(240 3.7% 15.9%)",
  axis: "hsl(240 5% 56%)",
  zeroLine: "hsl(240 5% 34%)",
  crosshair: "hsl(240 5% 72%)",

  positive: "hsl(142 71% 45%)",
  negative: "hsl(0 72% 55%)",
  warning: "hsl(38 92% 50%)",
  neutral: "hsl(240 5% 46%)",

  tooltipBackground: "hsl(240 10% 3.9%)",
  tooltipForeground: "hsl(0 0% 98%)",
  tooltipBorder: "hsl(240 3.7% 15.9%)",
}

/**
 * Resolves active CSS variables in the browser, falling back to static tokens during SSR.
 */
export function getComputedChartTokens(): ChartThemeTokens {
  if (typeof window === "undefined") {
    return defaultChartTokens
  }

  const style = getComputedStyle(document.documentElement)

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
