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

export type ChartRenderer = "svg" | "canvas" | "google-runtime"
export type ChartStatus = "stable" | "beta" | "experimental"
export type ChartFeature =
  | "responsive"
  | "animated"
  | "interactive"
  | "tooltip"
  | "legend"
  | "zoom"
  | "brush"
  | "selection"
  | "keyboard"
  | "accessible-data"

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
  exportName: string
  dependencies: readonly string[]
  registryDependencies: readonly string[]
  renderer: ChartRenderer
  status: ChartStatus
  difficulty: "beginner" | "intermediate" | "advanced"
  features: readonly ChartFeature[]
  dataShape?: string
  snippet?: string
}
