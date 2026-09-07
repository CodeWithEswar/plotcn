export type ChartEngine = "recharts" | "d3" | "google"

export interface ChartMetadata {
  id: string
  title: string
  description: string
  engine: ChartEngine
  category: string
  tags: readonly string[]
}

export type ChartSize = {
  width: number
  height: number
}

export type ChartDensity = "compact" | "default" | "comfortable"
