export type ChartEngine = "recharts" | "d3" | "google"

export type ChartCategory =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "geo"
  | "network"
  | "hierarchy"
  | "specialized"

export interface ChartMetadata {
  id: string
  slug: string
  registryName: string
  title: string
  description: string
  engine: ChartEngine
  category: ChartCategory
  tags: readonly string[]
  componentPath: string
  dependencies: readonly string[]
  registryDependencies: readonly string[]
  features: readonly string[]
  dataShape?: string
  snippet?: string
}
