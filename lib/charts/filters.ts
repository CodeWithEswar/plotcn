import type {
  ChartMetadata,
  ChartEngine,
  ChartCategory,
  ChartFeature,
  ChartRenderer,
  ChartStatus,
} from "./metadata"
export const engineLabels = {
  all: "All engines",
  recharts: "Recharts",
  d3: "D3.js",
  google: "Google Charts",
} as const
export interface ChartFilters {
  engine: ChartEngine | "all"
  category: ChartCategory | "all"
  feature: ChartFeature | "all"
  renderer: ChartRenderer | "all"
  status: ChartStatus | "all"
  q: string
}
export const defaultFilters: ChartFilters = {
  engine: "all",
  category: "all",
  feature: "all",
  renderer: "all",
  status: "all",
  q: "",
}
export function parseChartFilters(
  params: Pick<URLSearchParams, "get">,
  charts: readonly ChartMetadata[]
): ChartFilters {
  const choice = <K extends "engine" | "category" | "renderer" | "status">(
    key: K
  ): ChartFilters[K] => {
    const value = params.get(key)
    return charts.some((c) => c[key] === value)
      ? (value as ChartFilters[K])
      : "all"
  }
  const feature = params.get("feature")
  return {
    engine: choice("engine"),
    category: choice("category"),
    renderer: choice("renderer"),
    status: choice("status"),
    feature: charts.some((c) => c.features.some((f) => f === feature))
      ? (feature as ChartFeature)
      : "all",
    q: params.get("q")?.slice(0, 200) ?? "",
  }
}
export function serializeChartFilters(filters: ChartFilters) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters))
    if (value && value !== "all") params.set(key, value)
  return params.toString()
}
export function searchCharts(
  charts: readonly ChartMetadata[],
  query: string
): readonly ChartMetadata[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return charts.filter((c) => {
    const text = [
      c.title,
      c.description,
      c.category,
      engineLabels[c.engine],
      c.engine,
      c.renderer,
      ...c.tags,
      ...c.features,
    ]
      .join(" ")
      .toLowerCase()
    return words.every((word) => text.includes(word))
  })
}
export function filterCharts(
  charts: readonly ChartMetadata[],
  filters: ChartFilters
): readonly ChartMetadata[] {
  return searchCharts(charts, filters.q).filter(
    (c) =>
      (filters.engine === "all" || c.engine === filters.engine) &&
      (filters.category === "all" || c.category === filters.category) &&
      (filters.feature === "all" || c.features.includes(filters.feature)) &&
      (filters.renderer === "all" || c.renderer === filters.renderer) &&
      (filters.status === "all" || c.status === filters.status)
  )
}
export function filterChartsByEngine(
  charts: readonly ChartMetadata[],
  engine: ChartEngine | "all"
) {
  return charts.filter((c) => engine === "all" || c.engine === engine)
}
export function filterChartsByCategory(
  charts: readonly ChartMetadata[],
  category: ChartCategory | "all"
) {
  return charts.filter((c) => category === "all" || c.category === category)
}
export function chartHref(chart: Pick<ChartMetadata, "engine" | "slug">) {
  return `/charts/${chart.engine}/${chart.slug}`
}
