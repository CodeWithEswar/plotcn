import { charts } from "@/config/charts"
import type { ChartMetadata, ChartEngine, ChartCategory } from "./metadata"

export interface ChartQueryOptions {
  engine?: ChartEngine | "all"
  category?: ChartCategory | "all"
  search?: string
}

export function getCharts(options: ChartQueryOptions = {}): readonly ChartMetadata[] {
  const { engine = "all", category = "all", search = "" } = options

  return charts.filter((chart) => {
    if (engine !== "all" && chart.engine !== engine) {
      return false
    }
    if (category !== "all" && chart.category !== category) {
      return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchTitle = chart.title.toLowerCase().includes(q)
      const matchDesc = chart.description.toLowerCase().includes(q)
      const matchTags = chart.tags.some((t) => t.toLowerCase().includes(q))
      const matchEngine = chart.engine.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchTags && !matchEngine) {
        return false
      }
    }
    return true
  })
}

export function getRelatedCharts(chart: ChartMetadata, limit = 3): readonly ChartMetadata[] {
  return charts
    .filter((c) => c.id !== chart.id && (c.engine === chart.engine || c.category === chart.category))
    .slice(0, limit)
}
