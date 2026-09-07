export type ChartEngine = "recharts" | "d3" | "google"

export type ChartRenderer = "svg" | "canvas" | "google-runtime"

export type ChartDifficulty = "beginner" | "intermediate" | "advanced"

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

export type ChartStatus = "stable" | "beta" | "experimental"

export type RegistryFileRole = "source" | "demo" | "support"

export interface RegistryDependencyMetadata {
  npm: readonly string[]
  registry: readonly string[]
  externalRuntime?: readonly string[]
}

export interface ChartMetadataFile {
  path: string
  target?: string
  type?: string
  role?: RegistryFileRole
}

export interface ChartMetadata {
  id: string
  registryName: string
  title: string
  description: string
  engine: ChartEngine
  category: string
  renderer: ChartRenderer
  features: readonly ChartFeature[]
  difficulty: ChartDifficulty
  dependencies: readonly string[]
  registryDependencies?: readonly string[]
  externalRuntime?: readonly string[]
  tags: readonly string[]
  status: ChartStatus
  files?: readonly ChartMetadataFile[]
}
