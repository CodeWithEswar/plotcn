import type {
  MotionPreset,
  ChartMotionConfig,
  ResolvedMotionPolicy,
} from "../types"

export interface MotionPolicyOptions {
  /** Explicit reduced motion preference (defaults to system preference via media query) */
  reducedMotion?: boolean
  /** Whether continuous resize is actively occurring (forces duration = 0, no animation lag) */
  isContinuousResize?: boolean
  /** Whether the chart is currently offscreen or in a hidden tab */
  isOffscreen?: boolean
  /** Whether data streaming is active with high update frequency */
  isStreaming?: boolean
}

export type ChartFamily =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "scatter"
  | "network"
  | "heatmap"
  | "geo"
