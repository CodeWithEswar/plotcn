import { charts, getChartByEngineAndSlug, getChartById } from "@/config/charts"
import type { ChartMetadata, ChartEngine } from "./metadata"

export function getChart(engine: ChartEngine, slug: string): ChartMetadata | undefined {
  return getChartByEngineAndSlug(engine, slug)
}

export function getChartOrThrow(engine: ChartEngine, slug: string): ChartMetadata {
  const chart = getChart(engine, slug)
  if (!chart) {
    throw new Error(`Chart not found: ${engine}/${slug}`)
  }
  return chart
}

export { getChartById }
