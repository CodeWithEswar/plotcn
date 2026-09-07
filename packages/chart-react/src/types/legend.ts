import type { ReactNode } from "react"
import type { LegendMarker } from "./interaction"

/**
 * Normalized legend item descriptor.
 * Section 8.43.
 */
export interface ChartLegendItem {
  id: string
  label: string
  color?: string
  value?: string | number
  hidden?: boolean
  disabled?: boolean
  marker?: LegendMarker
}

/**
 * Supported legend interaction policies.
 * Section 8.49 & 8.52.
 */
export type LegendInteraction = "none" | "toggle" | "isolate" | "toggle-and-isolate"

/**
 * Legend container orientation.
 * Section 8.45.
 */
export type LegendOrientation = "horizontal" | "vertical"

/**
 * Legend overflow strategy.
 * Section 8.45.
 */
export type LegendOverflow = "wrap" | "scroll" | "collapse"

/**
 * High-level configuration contract for chart legends.
 */
export interface ChartLegendConfig {
  items?: readonly ChartLegendItem[]
  orientation?: LegendOrientation
  overflow?: LegendOverflow
  interaction?: LegendInteraction
  align?: "start" | "center" | "end"
  className?: string
  children?: ReactNode
}
