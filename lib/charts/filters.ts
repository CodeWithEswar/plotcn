import type { ChartMetadata, ChartEngine, ChartCategory } from "./metadata"

export function filterChartsByEngine(
  charts: readonly ChartMetadata[],
  engine: ChartEngine | "all"
): readonly ChartMetadata[] {
  if (engine === "all") return charts
  return charts.filter((c) => c.engine === engine)
}

export function filterChartsByCategory(
  charts: readonly ChartMetadata[],
  category: ChartCategory | "all"
): readonly ChartMetadata[] {
  if (category === "all") return charts
  return charts.filter((c) => c.category === category)
}

export function searchCharts(
  charts: readonly ChartMetadata[],
  query: string
): readonly ChartMetadata[] {
  const q = query.trim().toLowerCase()
  if (!q) return charts
  return charts.filter((c) => {
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.engine.toLowerCase().includes(q)
    )
  })
}
