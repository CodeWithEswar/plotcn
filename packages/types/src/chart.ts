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
