import {
  chartMotionDuration,
  chartMotionEasing,
  type MotionPreset,
  type ChartMotionConfig,
  type MotionPhase,
  type MotionTimingScale,
  type MotionPresetDefinition,
  type ResolvedMotionPolicy,
} from "../../types/src"

export { chartMotionDuration, chartMotionEasing }
export type {
  MotionPreset,
  ChartMotionConfig,
  MotionPhase,
  MotionTimingScale,
  MotionPresetDefinition,
  ResolvedMotionPolicy,
}

/**
 * Geometric definition for arc transitions in radial, pie, and donut charts.
 * Section 10.24, 10.25.
 */
export interface ArcGeometry {
  id: string
  startAngle: number
  endAngle: number
  innerRadius: number
  outerRadius: number
  padAngle?: number
}

/**
 * Interpolation function returning state at progress scalar t in [0, 1].
 * Section 10.51.
 */
export type Interpolator<T> = (t: number) => T

/**
 * Normalized cubic bezier control coordinates [x1, y1, x2, y2].
 * Section 10.94.
 */
export type BezierCurve = readonly [number, number, number, number]

/**
 * Safe fallback strategy when path topologies cannot be cleanly morphed.
 * Section 10.22, 10.23.
 */
export type PathMorphFallback = "fade" | "step"

/**
 * Result of a path interpolation calculation.
 * Section 10.21 - 10.23.
 */
export interface PathInterpolationResult {
  path: string
  isCompatible: boolean
  fallbackApplied: boolean
}

/**
 * Series lifecycle status for coordinated multi-series transitions.
 * Section 10.55.
 */
export interface SeriesTransitionItem<TData = unknown> {
  id: string
  status: "entering" | "updating" | "exiting"
  data: TData
  opacity: number
}
