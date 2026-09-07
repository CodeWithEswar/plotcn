import type { ChartMetadata, ChartEngine, ChartFeature } from "../schema/metadata"
import { normalizeChartMetadata, type PartialChartMetadata } from "./normalize"
import { sortChartMetadata } from "./sort"

export interface FilterOptions {
  engine?: ChartEngine | "all"
  category?: string
  feature?: ChartFeature
  query?: string
  includeDrafts?: boolean
}

/**
 * Normalizes, filters, and deterministically sorts a collection of chart metadata.
 */
export function collectChartCatalog(
  items: readonly PartialChartMetadata[],
  options: FilterOptions = {}
): ChartMetadata[] {
  const normalized = items.map(normalizeChartMetadata)

  const filtered = normalized.filter((item) => {
    if (!options.includeDrafts && (item.status as string) === "draft") {
      return false
    }

    if (options.engine && options.engine !== "all" && item.engine !== options.engine) {
      return false
    }

    if (options.category && item.category !== options.category) {
      return false
    }

    if (options.feature && !item.features.includes(options.feature)) {
      return false
    }

    if (options.query) {
      const q = options.query.toLowerCase()
      const matchesTitle = item.title.toLowerCase().includes(q)
      const matchesDesc = item.description.toLowerCase().includes(q)
      const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q))
      const matchesName = item.registryName.toLowerCase().includes(q)
      if (!matchesTitle && !matchesDesc && !matchesTag && !matchesName) {
        return false
      }
    }

    return true
  })

  return sortChartMetadata(filtered)
}
