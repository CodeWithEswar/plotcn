import type { ChartMetadata, ChartEngine } from "../schema/metadata"

const ENGINE_ORDER: Record<ChartEngine, number> = {
  recharts: 0,
  d3: 1,
  google: 2,
}

/**
 * Deterministically sorts chart metadata items to guarantee reproducible builds across all environments.
 * Order: Engine priority (recharts -> d3 -> google) -> Category (A-Z) -> Registry Name (A-Z).
 */
export function sortChartMetadata<T extends Pick<ChartMetadata, "engine" | "category" | "registryName">>(
  items: readonly T[]
): T[] {
  return [...items].sort((a, b) => {
    const engineA = ENGINE_ORDER[a.engine] ?? 99
    const engineB = ENGINE_ORDER[b.engine] ?? 99

    if (engineA !== engineB) {
      return engineA - engineB
    }

    const catCompare = a.category.localeCompare(b.category)
    if (catCompare !== 0) {
      return catCompare
    }

    return a.registryName.localeCompare(b.registryName)
  })
}
