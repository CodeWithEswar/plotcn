import type { ReactNode } from "react"

/**
 * 2D pointer position coordinate.
 */
export interface PointerPosition {
  x: number
  y: number
}

/**
 * Normalized series marker descriptor preserving non-color visual distinction.
 * Section 8.25, 8.26, 8.44.
 */
export interface LegendMarker {
  shape: "dot" | "square" | "line"
  lineStyle?: "solid" | "dashed" | "dotted"
  themeRole?: string
  color?: string
}

/**
 * Normalized datum representing an active series or data point for tooltip/legend display.
 * Section 8.3.
 */
export interface TooltipDatum<TDatum = unknown> {
  id: string
  seriesId?: string
  label?: string
  value?: number | string | null
  datum: TDatum
  index: number
  color?: string
  marker?: LegendMarker
  formattedValue?: string
}

/**
 * Spatial anchor coordinate for tooltip placement.
 * Section 8.3.
 */
export interface TooltipAnchor {
  x: number
  y: number
}

/**
 * Selection strategy for hit-testing and active datum discovery.
 * Section 8.4.
 */
export type TooltipSelectionMode = "nearest" | "x" | "y" | "series" | "datum"

/**
 * Tooltip activation persistence mode (transient vs locked on mobile tap).
 * Section 8.4.7 & 8.18.
 */
export type TooltipActivation = "transient" | "locked"

/**
 * High-level configuration contract for chart tooltips.
 * Section 8.5.
 */
export interface TooltipConfig<TDatum = unknown, TValue = unknown> {
  mode?: TooltipSelectionMode
  shared?: boolean
  lockable?: boolean
  labelFormatter?: (label: unknown) => ReactNode
  valueFormatter?: (value: TValue, datum: TDatum) => ReactNode
}

/**
 * Strongly-typed render context supplied to custom tooltip render functions.
 * Section 8.23.
 */
export interface ChartTooltipContext<TDatum = unknown> {
  active: boolean
  label: unknown
  items: readonly TooltipDatum<TDatum>[]
  anchor: TooltipAnchor | null
  locked: boolean
}

/**
 * Crosshair line orientation modes.
 * Section 8.27.
 */
export type CrosshairMode = "x" | "y" | "both" | "point"

/**
 * Visual cursor styles for active chart regions.
 * Section 8.34 & 8.35.
 */
export type ChartCursor = "none" | "line" | "band" | "crosshair" | "point"

/**
 * Interaction modes indicating current input device/gesture.
 * Section 8.67.
 */
export type ChartInteractionMode = "idle" | "pointer" | "keyboard" | "scrub"

/**
 * Normalized interactive state across Recharts, D3, and Google Charts.
 * Section 8.3, 8.67.
 */
export interface ChartInteractionState<TDatum = unknown> {
  activeDatumId: string | null
  activeSeriesId: string | null
  selectedDatumId: string | null
  pointer: PointerPosition | null
  anchor: TooltipAnchor | null
  activeLabel: unknown
  items: readonly TooltipDatum<TDatum>[]
  locked: boolean
  isHovered: boolean
  isFocused: boolean
  mode: ChartInteractionMode
  hiddenSeriesIds: ReadonlySet<string>
}

/**
 * Interaction context value providing state and normalized actions.
 */
export interface InteractionContextValue<TDatum = unknown> extends ChartInteractionState<TDatum> {
  setActiveDatum: (id: string | null) => void
  setActiveSeries: (id: string | null) => void
  setSelectedDatum: (id: string | null) => void
  setPointer: (pos: PointerPosition | null) => void
  setAnchor: (anchor: TooltipAnchor | null) => void
  setActiveState: (options: {
    activeDatumId?: string | null
    activeSeriesId?: string | null
    anchor?: TooltipAnchor | null
    activeLabel?: unknown
    items?: readonly TooltipDatum<TDatum>[]
    mode?: ChartInteractionMode
  }) => void
  setLocked: (locked: boolean) => void
  setIsHovered: (hovered: boolean) => void
  setIsFocused: (focused: boolean) => void
  toggleSeries: (seriesId: string) => void
  isolateSeries: (seriesId: string) => void
  reset: () => void
}
