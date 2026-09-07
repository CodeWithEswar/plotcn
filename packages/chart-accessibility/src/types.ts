import type {
  FactualSummaryStats,
  AccessibleColumnDefinition,
  ChartAccessibilityConfig,
  ChartAccessibilityProps,
} from "../../types/src"

export type {
  FactualSummaryStats,
  AccessibleColumnDefinition,
  ChartAccessibilityConfig,
  ChartAccessibilityProps,
}

/**
 * Configuration options for factual statistical summary generation.
 * Section 11.8 - 11.11.
 */
export interface FactualSummaryOptions<TData = unknown> {
  data: readonly TData[]
  valueKey?: string | ((datum: TData) => number)
  labelKey?: string | ((datum: TData) => string)
  seriesName?: string
  unit?: string
  currency?: string
  locale?: string
  customSummary?: string | ((stats: FactualSummaryStats, data: readonly TData[]) => string)
}

/**
 * Result returned by the factual summary generator.
 * Section 11.8 - 11.10.
 */
export interface FactualSummaryResult {
  stats: FactualSummaryStats
  prose: string
}

/**
 * Props for the accessible structured data table.
 * Section 11.13 - 11.16, 11.82.
 */
export interface ScreenReaderTableProps<TData = unknown> {
  caption: string
  data: readonly TData[]
  columns?: readonly AccessibleColumnDefinition<TData>[]
  visibleDisclosure?: boolean
  maxRows?: number
  className?: string
  onToggle?: (expanded: boolean) => void
}

/**
 * Configuration for Cartesian keyboard navigation.
 * Section 11.17 - 11.19, 11.76.
 */
export interface KeyboardNavigationConfig {
  totalCount: number
  totalSeriesCount?: number
  wrap?: boolean
}

/**
 * Active keyboard navigation coordinates.
 * Section 11.20, 11.74.
 */
export interface KeyboardNavigationState {
  datumIndex: number
  seriesIndex: number
  isLocked: boolean
}

/**
 * Resolved action produced by a keyboard event.
 * Section 11.17, 11.75.
 */
export type KeyboardNavigationAction =
  | "PREV_DATUM"
  | "NEXT_DATUM"
  | "PREV_SERIES"
  | "NEXT_SERIES"
  | "FIRST_DATUM"
  | "LAST_DATUM"
  | "ACTIVATE"
  | "CLEAR"
  | "NONE"

/**
 * Stable, hydration-safe ARIA identifiers for chart region relationships.
 * Section 11.7.
 */
export interface ChartAriaIds {
  rootId: string
  titleId: string
  descId: string
  summaryId: string
  tableId: string
  instructionsId: string
}
