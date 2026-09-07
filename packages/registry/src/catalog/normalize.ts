import type { ChartMetadata, ChartEngine, ChartRenderer } from "../schema/metadata"

export interface PartialChartMetadata extends Partial<ChartMetadata> {
  id: string
  title: string
}

/**
 * Normalizes chart metadata with canonical defaults, preventing missing arrays or undefined fields.
 */
export function normalizeChartMetadata(input: PartialChartMetadata): ChartMetadata {
  const engine: ChartEngine = input.engine || "recharts"

  let defaultRenderer: ChartRenderer = "svg"
  if (engine === "google") {
    defaultRenderer = "google-runtime"
  } else if (input.renderer) {
    defaultRenderer = input.renderer
  }

  return {
    id: input.id,
    registryName: input.registryName || input.id,
    title: input.title,
    description: input.description || "",
    engine,
    category: input.category || "general",
    renderer: defaultRenderer,
    features: input.features || ["responsive"],
    difficulty: input.difficulty || "beginner",
    dependencies: input.dependencies || [],
    registryDependencies: input.registryDependencies || [],
    externalRuntime: input.externalRuntime || (engine === "google" ? ["Google Charts"] : []),
    tags: input.tags || [engine, input.category || "chart"],
    status: input.status || "stable",
    files: input.files || [],
  }
}
