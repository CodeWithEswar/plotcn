/**
 * Plotcn Shared Theme Adapter
 * Extracts semantic CSS variables (--chart-1 ... --chart-5) from DOM or fallback defaults.
 */

export interface ChartThemeTokens {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  background: string
  foreground: string
  muted: string
  border: string
}

export const defaultChartTokens: ChartThemeTokens = {
  chart1: "hsl(142 71% 45%)", // emerald
  chart2: "hsl(199 89% 48%)", // sky
  chart3: "hsl(262 83% 58%)", // purple
  chart4: "hsl(31 97% 55%)",  // amber
  chart5: "hsl(346 87% 43%)", // rose
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  muted: "hsl(240 3.7% 15.9%)",
  border: "hsl(240 3.7% 15.9%)",
}

/**
 * Resolves active CSS variables in the browser, falling back to static tokens during SSR.
 */
export function getComputedChartTokens(): ChartThemeTokens {
  if (typeof window === "undefined") {
    return defaultChartTokens
  }

  const style = getComputedStyle(document.documentElement)

  return {
    chart1: style.getPropertyValue("--chart-1").trim() || defaultChartTokens.chart1,
    chart2: style.getPropertyValue("--chart-2").trim() || defaultChartTokens.chart2,
    chart3: style.getPropertyValue("--chart-3").trim() || defaultChartTokens.chart3,
    chart4: style.getPropertyValue("--chart-4").trim() || defaultChartTokens.chart4,
    chart5: style.getPropertyValue("--chart-5").trim() || defaultChartTokens.chart5,
    background: style.getPropertyValue("--background").trim() || defaultChartTokens.background,
    foreground: style.getPropertyValue("--foreground").trim() || defaultChartTokens.foreground,
    muted: style.getPropertyValue("--muted").trim() || defaultChartTokens.muted,
    border: style.getPropertyValue("--border").trim() || defaultChartTokens.border,
  }
}
