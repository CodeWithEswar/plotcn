/**
 * Identifies keys of T whose values extend TValue.
 * Used to enforce compile-time type safety on series and axes.
 */
export type KeysMatching<T, TValue> = {
  [K in keyof T]-?: T[K] extends TValue ? K : never
}[keyof T]

/**
 * Extracts strictly numeric property keys from a data item.
 * Compile-time guard preventing non-numeric fields from being passed to numeric series.
 */
export type NumericKey<TData> = Extract<KeysMatching<TData, number>, string>

/**
 * Valid domain values for Cartesian X axes (strings for categories, numbers, or dates).
 */
export type CartesianDomainValue = string | number | Date

/**
 * Extracts valid domain keys from a data item.
 */
export type DomainKey<TData> = Extract<KeysMatching<TData, CartesianDomainValue>, string>

/**
 * Typed value formatter mapping a raw value and parent datum to a localized string.
 */
export type ValueFormatter<TValue, TData = unknown> = (value: TValue, datum: TData) => string

/**
 * Pure accessor function mapping datum and index to a typed value.
 */
export type Accessor<TDatum, TValue> = (datum: TDatum, index: number) => TValue

/**
 * Flexible accessor input accepting either a key name or a transformation function.
 */
export type AccessorInput<TDatum, TValue> =
  | Extract<keyof TDatum, string>
  | Accessor<TDatum, TValue>

/**
 * Normalizes an AccessorInput (key string or function) into a single Accessor function.
 */
export function resolveAccessor<TDatum, TValue>(
  accessor: AccessorInput<TDatum, TValue>
): Accessor<TDatum, TValue> {
  if (typeof accessor === "function") {
    return accessor
  }
  return (datum: TDatum) => datum[accessor as keyof TDatum] as unknown as TValue
}

/**
 * Canonical LineSeries definition for easy-level chart APIs.
 */
export interface LineSeries<TData> {
  key: NumericKey<TData>
  label?: string
  hidden?: boolean
  formatter?: ValueFormatter<number, TData>
}

/**
 * Curvature presets for D3 and high-level lines.
 */
export type LineCurve = "linear" | "monotone" | "step" | "basis"

/**
 * Extensible configuration wrapper allowing a feature to be specified as a boolean or full config object.
 */
export type FeatureConfig<TConfig> = boolean | TConfig

/**
 * Universal state properties for Plotcn charts.
 */
export interface ChartStateProps {
  loading?: boolean
  error?: Error | string | null
  emptyContent?: unknown
}

/**
 * Deterministic resolved chart states.
 */
export type ChartResolvedState = "error" | "loading" | "empty" | "ready"

/**
 * Applies Plotcn's deterministic state precedence: error -> loading -> empty -> ready.
 */
export function resolveChartState(options: {
  loading?: boolean
  error?: Error | string | null
  dataLength: number
}): ChartResolvedState {
  if (options.error) return "error"
  if (options.loading) return "loading"
  if (options.dataLength === 0) return "empty"
  return "ready"
}

/**
 * Accessibility properties wired to chart headers, live regions, and summary disclosures.
 */
export interface ChartAccessibilityProps {
  title?: string
  description?: string
  summary?: string
}

/**
 * Sizing properties with container aspect ratio and height controls.
 */
export interface ChartSizingProps {
  height?: number
  aspectRatio?: number
  className?: string
}

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
 * Curated categorical series palettes.
 * Section 9.11.
 */
export type ChartPalette =
  | "default"
  | "monochrome"
  | "ocean"
  | "aurora"
  | "sunset"
  | "pastel"
  | "corporate"

/**
 * Dedicated accessibility visual modes.
 * Section 9.19.
 */
export type ChartAccessibilityPalette =
  | "standard"
  | "high-contrast"
  | "colorblind-safe"

/**
 * Resolved theme snapshot used for Canvas rendering, Google ChartOptions,
 * and vector/raster image exports.
 * Section 9.62.
 */
export interface ChartThemeSnapshot {
  background: string
  foreground: string
  mutedForeground: string
  border: string
  grid: string
  gridEmphasis: string
  axis: string
  axisEmphasis: string
  zeroLine: string
  crosshair: string
  cursor: string
  selection: string
  focus: string
  series: readonly string[]
  positive: string
  negative: string
  warning: string
  neutral: string
  tooltipBackground: string
  tooltipForeground: string
  tooltipMuted: string
  tooltipBorder: string
  disabled: string
  hidden: string
}

/**
 * Declarative theme preset definition.
 * Section 9.50.
 */
export interface ChartThemePreset {
  name: ChartPalette
  label: string
  description: string
  series: readonly string[]
  positive?: string
  negative?: string
  warning?: string
  neutral?: string
}

/**
 * Supported semantic motion presets.
 * Section 10.6, 10.90.
 */
export type MotionPreset =
  | "none"
  | "fade"
  | "grow"
  | "draw"
  | "reveal"
  | "sweep"
  | "morph"

/**
 * Public chart motion configuration model.
 * Section 10.5, 10.6.
 */
export interface ChartMotionConfig {
  enter?: MotionPreset
  update?: MotionPreset
  exit?: MotionPreset
  duration?: number
}

/**
 * Distinct lifecycle and interaction motion phases.
 * Section 10.9.
 */
export type MotionPhase = "enter" | "update" | "exit" | "interaction" | "layout"

/**
 * Curated timing tokens (in seconds) for visualization transitions.
 * Section 10.13, 10.93.
 */
export const chartMotionDuration = {
  micro: 0.14,    // 140ms - micro interactions, selection feedback
  tooltip: 0.16,  // 160ms - tooltip appearance & subtle highlight
  fast: 0.18,     // 180ms - fast UI transitions, small transforms
  normal: 0.3,    // 300ms - standard chart geometry update
  slow: 0.45,     // 450ms - complex multi-series geometry transition
  complex: 0.5,   // 500ms - maximum cap for coordinated transitions
} as const

export type MotionTimingScale = typeof chartMotionDuration

/**
 * Restrained easing tokens avoiding bouncy overshoot on quantitative metrics.
 * Section 10.15, 10.94.
 */
export const chartMotionEasing = {
  enter: [0.16, 1, 0.3, 1] as const,      // ease-out curve
  update: [0.4, 0, 0.2, 1] as const,     // ease-in-out curve
  exit: [0.4, 0, 1, 1] as const,         // ease-in curve
  linear: [0, 0, 1, 1] as const,         // linear scrub
} as const

export type MotionEasingTokens = typeof chartMotionEasing

/**
 * Semantic preset definition containing timing, easing, and reduced-motion fallback.
 * Section 10.91.
 */
export interface MotionPresetDefinition {
  name: MotionPreset
  duration: number
  easing: readonly number[]
  reducedMotionFallback: "none" | "fade"
  description: string
}

/**
 * Fully resolved motion policy governing execution across engines.
 * Section 10.1, 10.52.
 */
export interface ResolvedMotionPolicy {
  enabled: boolean
  reducedMotion: boolean
  enter: MotionPreset
  update: MotionPreset
  exit: MotionPreset
  duration: number
  easing: readonly number[]
}



