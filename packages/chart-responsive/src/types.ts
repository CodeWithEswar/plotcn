/**
 * @plotcn/chart-responsive Types
 * Definitive responsive, adaptive layout, breakpoint, and interaction contracts.
 */

/**
 * Semantic visualization breakpoints defined by container width.
 * Section 7.2 & 7.12.
 */
export type ChartBreakpoint = "xs" | "sm" | "md" | "lg" | "xl"

/**
 * Width thresholds (in pixels) for chart container breakpoints.
 * Section 7.12.
 */
export const chartBreakpoints = {
  xs: 360,
  sm: 480,
  md: 720,
  lg: 960,
  xl: 1280,
} as const

/**
 * Pure geometric and responsive mode descriptor for a measured container.
 * Section 7.2.
 */
export interface ChartDimensions {
  width: number
  height: number
  innerWidth: number
  innerHeight: number
  breakpoint: ChartBreakpoint
  isCompact: boolean
}

/**
 * Environmental capabilities (input types, display capabilities, user preferences).
 * Section 7.2 & 7.3.
 */
export interface ChartEnvironment {
  pixelRatio: number
  pointer: "fine" | "coarse"
  hover: boolean
  reducedMotion: boolean
}

/**
 * Candidate tick for collision evaluation in the Automatic Tick Manager.
 * Section 7.23.
 */
export interface TickCandidate<TValue> {
  value: TValue
  position: number
  label: string
  estimatedWidth: number
}

/**
 * Resolved, collision-free tick ready for rendering.
 * Section 7.23.
 */
export interface ResolvedTick<TValue> {
  value: TValue
  position: number
  label: string
}

/**
 * Tick distribution and preservation strategy.
 * Section 7.21.
 */
export type TickStrategy =
  | "auto"
  | "all"
  | "preserve-start"
  | "preserve-end"
  | "preserve-both"

/**
 * Comprehensive internal responsive layout policy derived from container dimensions.
 * Section 7.76.
 */
export interface ResponsiveChartPolicy {
  breakpoint: ChartBreakpoint
  compact: boolean
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  ticks: {
    xTargetCount: number
    yTargetCount: number
  }
  legend: {
    mode: "hidden" | "inline" | "bottom" | "side"
    collapsible: boolean
    scrollable: boolean
  }
  annotations: {
    density: "minimal" | "standard" | "full"
  }
}

/**
 * Derived policy governing pointer, touch, hit target, and scroll capture behavior.
 * Section 7.54.
 */
export interface ChartInteractionPolicy {
  hoverTooltip: boolean
  tapTooltip: boolean
  scrubTooltip: boolean
  minimumHitTarget: number
  touchAction: string
  allowsPageScroll: boolean
}

/**
 * State machine for responsive tooltip tracking.
 * Section 7.44.
 */
export type TooltipInteractionState = "idle" | "hover" | "scrubbing" | "locked"

/**
 * Stable identifier for an active or selected data point.
 * Section 7.52.
 */
export interface ActiveDatum {
  datumId: string
  seriesId?: string
  index: number
}

/**
 * Persistent and transient interaction state.
 * Section 7.52.
 */
export interface ChartInteractionState {
  active: ActiveDatum | null
  selected: ActiveDatum | null
  mode: "idle" | "pointer" | "keyboard" | "scrub"
}

/**
 * Options for container size observation.
 */
export interface UseChartSizeOptions {
  initialWidth?: number
  initialHeight?: number
  aspectRatio?: number
  threshold?: number
  margins?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  } | number
  debounceMs?: number
}

/**
 * Options for responsive margin calculation.
 */
export interface MarginOptions {
  breakpoint: ChartBreakpoint
  isCompact?: boolean
  hasXAxisTitle?: boolean
  hasYAxisTitle?: boolean
  hasLegend?: boolean
  legendPosition?: "top" | "bottom" | "left" | "right"
  margins?: Partial<{
    top: number
    right: number
    bottom: number
    left: number
  }>
}

/**
 * Options for adaptive tick resolution.
 */
export interface AdaptiveTicksOptions<TValue> {
  ticks: readonly TValue[]
  plotLength: number
  getPosition: (val: TValue) => number
  formatLabel: (val: TValue) => string
  minGap?: number
  strategy?: TickStrategy
  estimateWidth?: (label: string) => number
}
