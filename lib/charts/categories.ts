import type { ChartCategory } from "./metadata"

export interface CategoryInfo {
  id: ChartCategory
  label: string
  description: string
}

export const chartCategories: readonly CategoryInfo[] = [
  { id: "line", label: "Line", description: "Trend analysis, continuous metrics, and time series" },
  { id: "area", label: "Area", description: "Volume trends, stacked comparisons, and cumulative distributions" },
  { id: "bar", label: "Bar & Column", description: "Discrete category comparisons and rank orderings" },
  { id: "pie", label: "Pie & Donut", description: "Proportions, part-to-whole breakdowns, and composition" },
  { id: "geo", label: "Geographic", description: "Vector maps, country choropleths, and regional density" },
  { id: "network", label: "Network", description: "Force-directed graphs, node linkages, and topology" },
  { id: "hierarchy", label: "Hierarchy", description: "Treemaps, sunbursts, and nested relational data" },
  { id: "specialized", label: "Specialized", description: "Timelines, gauges, and composite visualizations" },
] as const

export function getCategoryLabel(category: ChartCategory): string {
  const found = chartCategories.find((c) => c.id === category)
  return found ? found.label : category
}
