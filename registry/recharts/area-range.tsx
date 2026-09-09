"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockKeyIcon } from "@hugeicons/core-free-icons"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { ChartContainer } from "../shared/chart-container"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Type Definitions                                                          */
/* -------------------------------------------------------------------------- */

export type NumericKeyOf<TData> = [keyof TData] extends [never]
  ? string
  : {
      [K in keyof TData]: TData[K] extends number | null | undefined ? K : never
    }[keyof TData] extends never
  ? string
  : {
      [K in keyof TData]: TData[K] extends number | null | undefined ? K : never
    }[keyof TData] & string

export type RangeAreaCurve = "linear" | "monotone" | "step"

export interface RangeAreaSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Key for lower bound of the interval */
  lowerKey: NumericKeyOf<TData>
  /** Key for upper bound of the interval */
  upperKey: NumericKeyOf<TData>
  /** Optional key for central or expected value */
  valueKey?: NumericKeyOf<TData>
  /** Human-readable display label for the envelope (e.g. "Latency Range", "Capacity Band") */
  label: string
  /** Optional label for the lower bound (e.g. "Min Latency", "Floor") */
  lowerLabel?: string
  /** Optional label for the upper bound (e.g. "Max Latency", "Ceiling") */
  upperLabel?: string
  /** Optional label for the centerline (e.g. "Median Latency", "Expected") */
  valueLabel?: string
  /** Optional custom formatter for metric values */
  valueFormatter?: (value: number) => string
}

export type RangeIntervalState = "valid" | "missing" | "invalid" | "zero-width"
export type CenterValueState = "valid" | "missing"

export interface NormalizedRangeAreaDatum<TData = any> {
  __x: string | number
  __index: number
  __lower: number | null
  __upper: number | null
  __value: number | null
  __range: [number, number] | null
  __rangeState: RangeIntervalState
  __valueState: CenterValueState
  __raw: TData
}

export interface RangeAreaActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  lower: number | null
  upper: number | null
  value: number | null
  rangeState: RangeIntervalState
  valueState: CenterValueState
  isLocked: boolean
}

export interface RangeAreaProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Readonly array of observation records. Caller data is never mutated or sorted in place.
   */
  data: readonly TData[]

  /**
   * Property name on data records for horizontal domain coordinates.
   */
  xKey: keyof TData & string

  /**
   * Semantic series configuration defining lower, upper, and optional centerline keys.
   */
  series: RangeAreaSeries<TData>

  /**
   * Container height in pixels or standard CSS dimension string.
   * Default: 320
   */
  height?: number | string

  /**
   * Shared curve interpolation algorithm applied identically to the envelope and centerline.
   * Default: "linear" (guarantees truthful boundary ordering and prevents overshoot).
   */
  curve?: RangeAreaCurve

  /**
   * Explicit vertical domain override. Defaults to auto-computed domain enclosing all valid bounds and centerline.
   */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /**
   * Primary color for the range envelope fill and boundary strokes.
   * Default: "var(--chart-1)"
   */
  color?: string

  /**
   * Secondary color for the optional central signal line.
   * Default: "var(--chart-2)"
   */
  valueColor?: string

  /**
   * Opacity of the range envelope fill (0.05 to 1.0).
   * Default: 0.25
   */
  fillOpacity?: number

  /**
   * Accent color for active inspection crosshair and locked selection pin.
   * Default: "var(--chart-selection)"
   */
  selectionColor?: string

  /**
   * Whether to render subtle horizontal Cartesian grid reference lines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to render the horizontal domain axis.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to render the vertical value axis.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to render the series identity legend.
   * Default: false
   */
  showLegend?: boolean

  /**
   * Whether clicking or pressing Enter/Space locks active inspection at the selected X coordinate.
   * Default: true
   */
  lockableTooltip?: boolean

  /**
   * Controls entry and update animations.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Reveal animation mode ("draw", "fade", "none").
   * Default: "draw"
   */
  animation?: "draw" | "fade" | "none"

  /**
   * Formatter for horizontal domain tick labels.
   */
  xFormatter?: (val: string | number) => string

  /**
   * Default value formatter for range bounds and centerline values in tooltips.
   */
  valueFormatter?: (val: number) => string

  /**
   * Accessible heading announced to screen readers.
   * Default: "Range Area Chart"
   */
  title?: string

  /**
   * Accessible descriptive summary announced to screen readers.
   */
  description?: string

  /**
   * Loading state indicator.
   */
  loading?: boolean

  /**
   * Unavailable state indicator.
   */
  unavailable?: boolean | string

  /**
   * Error state indicator or Error object.
   */
  error?: Error | string | null

  /**
   * Callback invoked whenever active inspection coordinate changes.
   */
  onActiveDatumChange?: (datum: RangeAreaActiveDatum<TData> | null) => void

  /**
   * Additional CSS classes applied to root figure element.
   */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Validation & Domain Algorithms                                       */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Normalizes input observations with strict interval validation:
 * 1. Validates that lower <= upper. If lower > upper, interval is treated as invalid (omitted, no silent swapping).
 * 2. Missing bounds (null / undefined): Band gaps truthfully without fabricating zero or domain min.
 * 3. Equal bounds (lower === upper): Valid zero-width interval (rendered as line/point).
 * 4. Centerline independence: Valid centerline still renders even when range is missing or invalid.
 * 5. Centerline is NEVER clamped into the range band.
 * 6. Supports negative and cross-zero intervals naturally.
 * 7. Never mutates caller array or objects.
 */
export function normalizeRangeAreaData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  series: RangeAreaSeries<TData>
): {
  rows: NormalizedRangeAreaDatum<TData>[]
  hasInvalidIntervals: boolean
  invalidDetails?: string
} {
  if (!Array.isArray(data) || data.length === 0) {
    return { rows: [], hasInvalidIntervals: false }
  }

  const rows: NormalizedRangeAreaDatum<TData>[] = []
  let hasInvalidIntervals = false
  let firstInvalidDetail: string | undefined

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawL = d[series.lowerKey]
    const rawU = d[series.upperKey]
    const rawV = series.valueKey ? d[series.valueKey] : undefined

    const low = isFiniteNumber(rawL) ? rawL : null
    const up = isFiniteNumber(rawU) ? rawU : null
    const val = isFiniteNumber(rawV) ? rawV : null

    let rangeTuple: [number, number] | null = null
    let rangeState: RangeIntervalState = "missing"

    if (low !== null && up !== null) {
      if (low < up) {
        rangeTuple = [low, up]
        rangeState = "valid"
      } else if (low === up) {
        rangeTuple = [low, up]
        rangeState = "zero-width"
      } else {
        // low > up: invalid data! Never silently swap.
        rangeTuple = null
        rangeState = "invalid"
        hasInvalidIntervals = true
        if (!firstInvalidDetail) {
          firstInvalidDetail = `Invalid bound at "${xVal}": lower (${low}) exceeds upper (${up}).`
        }
      }
    } else {
      rangeTuple = null
      rangeState = "missing"
    }

    const valueState: CenterValueState = val !== null ? "valid" : "missing"

    rows.push({
      __x: xVal,
      __index: i,
      __lower: low,
      __upper: up,
      __value: val,
      __range: rangeTuple,
      __rangeState: rangeState,
      __valueState: valueState,
      __raw: d,
    })
  }

  return {
    rows,
    hasInvalidIntervals,
    invalidDetails: firstInvalidDetail,
  }
}

/**
 * Computes an honest Cartesian Y-domain enclosing all valid lower bounds,
 * upper bounds, and centerline values with protective safety padding.
 */
export function calculateRangeAreaDomain(
  rows: readonly NormalizedRangeAreaDatum[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto"
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    typeof explicitDomain[0] === "number" &&
    typeof explicitDomain[1] === "number" &&
    Number.isFinite(explicitDomain[0]) &&
    Number.isFinite(explicitDomain[1])
  ) {
    return [explicitDomain[0], explicitDomain[1]]
  }

  let min = Infinity
  let max = -Infinity

  for (const r of rows) {
    if (r.__lower !== null && r.__upper !== null && r.__lower <= r.__upper) {
      if (r.__lower < min) min = r.__lower
      if (r.__upper > max) max = r.__upper
    } else {
      if (r.__lower !== null) {
        if (r.__lower < min) min = r.__lower
        if (r.__lower > max) max = r.__lower
      }
      if (r.__upper !== null) {
        if (r.__upper < min) min = r.__upper
        if (r.__upper > max) max = r.__upper
      }
    }

    if (r.__value !== null) {
      if (r.__value < min) min = r.__value
      if (r.__value > max) max = r.__value
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 100]
  }

  if (min === max) {
    const delta = Math.abs(min) * 0.1 || 1
    return [min - delta, max + delta]
  }

  const span = max - min
  const padding = span * 0.08

  return [min - padding, max + padding]
}

/* -------------------------------------------------------------------------- */
/*  Custom Locked Inspection Tooltip Content                                  */
/* -------------------------------------------------------------------------- */

interface RangeAreaTooltipProps<TData extends Record<string, unknown>> {
  activeDatum: RangeAreaActiveDatum<TData> | null
  series: RangeAreaSeries<TData>
  color: string
  valueColor: string
  valueFormatter: (val: number) => string
  onUnlock?: () => void
  isCompact?: boolean
}

function RangeAreaTooltipContent<TData extends Record<string, unknown>>({
  activeDatum,
  series,
  color,
  valueColor,
  valueFormatter,
  onUnlock,
  isCompact = false,
}: RangeAreaTooltipProps<TData>) {
  if (!activeDatum) return null

  const { lower, upper, value, rangeState, valueState, isLocked, x } = activeDatum

  return (
    <div
      role="tooltip"
      aria-hidden="false"
      className={cn(
        "plotcn-interactive-tooltip relative rounded-lg border border-white/[0.14] bg-zinc-950/95 font-sans text-zinc-200 shadow-2xl backdrop-blur-md transition-all duration-150 select-none",
        isCompact
          ? "min-w-[120px] max-w-[190px] p-2 text-[10px]"
          : "min-w-[200px] max-w-[280px] p-3 text-xs"
      )}
    >
      {/* Tooltip Header */}
      <div
        className={cn(
          "tooltip-header flex items-center justify-between gap-2 border-b border-white/[0.08]",
          isCompact ? "pb-1 mb-1.5" : "pb-1.5 mb-2"
        )}
      >
        <span
          className={cn(
            "font-mono font-semibold text-zinc-300 truncate",
            isCompact ? "text-[10px]" : "text-[11px]"
          )}
        >
          {String(x)}
        </span>
        {isLocked && (
          <button
            type="button"
            onClick={onUnlock}
            title="Click to release locked selection"
            className={cn(
              "flex items-center gap-1 rounded font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors shrink-0",
              isCompact ? "px-1 py-0.2 text-[8px]" : "px-1.5 py-0.5 text-[10px]"
            )}
          >
            <HugeiconsIcon icon={LockKeyIcon} size={isCompact ? 8 : 10} />
            <span>Locked</span>
          </button>
        )}
      </div>

      {/* Range Envelope Readout */}
      <div className={isCompact ? "space-y-1" : "space-y-2"}>
        <div className="flex flex-col gap-0.5">
          <div
            className={cn(
              "tooltip-row flex items-center justify-between gap-2",
              isCompact ? "text-[10px]" : "text-[11px] text-zinc-400"
            )}
          >
            <span className="flex items-center gap-1 font-medium text-zinc-300 truncate">
              <span
                className={cn(
                  "rounded-xs border border-white/20 shrink-0",
                  isCompact ? "size-2" : "size-2.5"
                )}
                style={{ backgroundColor: color }}
              />
              <span className="truncate">{series.label}</span>
            </span>

            {rangeState === "valid" && lower !== null && upper !== null && (
              <span className="font-mono font-medium text-zinc-200 shrink-0">
                {valueFormatter(lower)} – {valueFormatter(upper)}
              </span>
            )}
            {rangeState === "zero-width" && lower !== null && (
              <span className="font-mono font-medium text-zinc-200 shrink-0">
                {valueFormatter(lower)}
              </span>
            )}
            {rangeState === "missing" && (
              <span
                className={cn(
                  "rounded bg-zinc-800/60 font-mono text-zinc-500 shrink-0",
                  isCompact ? "px-1 py-0 text-[8px]" : "px-1 py-0.5 text-[10px]"
                )}
              >
                Unavailable
              </span>
            )}
            {rangeState === "invalid" && (
              <span
                className={cn(
                  "rounded bg-rose-500/10 border border-rose-500/20 font-mono text-rose-400 shrink-0",
                  isCompact ? "px-1 py-0 text-[8px]" : "px-1 py-0.5 text-[10px]"
                )}
              >
                Invalid
              </span>
            )}
          </div>

          {/* Bound Sub-breakdown if present and NOT compact */}
          {!isCompact && (lower !== null || upper !== null) && rangeState === "valid" && (
            <div className="tooltip-detail-row flex items-center justify-between text-[10px] font-mono text-zinc-400 pl-4">
              <span>{series.lowerLabel || "Lower"}: {lower !== null ? valueFormatter(lower) : "—"}</span>
              <span>{series.upperLabel || "Upper"}: {upper !== null ? valueFormatter(upper) : "—"}</span>
            </div>
          )}
        </div>

        {/* Optional Centerline Readout */}
        {series.valueKey && (
          <div
            className={cn(
              "tooltip-row flex items-center justify-between border-t border-white/[0.06] gap-2",
              isCompact ? "pt-1 text-[10px]" : "pt-1.5 text-[11px]"
            )}
          >
            <span className="flex items-center gap-1 font-medium text-zinc-300 truncate">
              <span
                className={cn(
                  "rounded-full shrink-0",
                  isCompact ? "w-2 h-0.5" : "w-2.5 h-0.5"
                )}
                style={{ backgroundColor: valueColor }}
              />
              <span className="truncate">{series.valueLabel || "Center"}</span>
            </span>

            {valueState === "valid" && value !== null ? (
              <span className="font-mono font-semibold text-white shrink-0">
                {valueFormatter(value)}
              </span>
            ) : (
              <span
                className={cn(
                  "rounded bg-zinc-800/60 font-mono text-zinc-500 shrink-0",
                  isCompact ? "px-1 py-0 text-[8px]" : "px-1 py-0.5 text-[10px]"
                )}
              >
                Unavailable
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: RangeArea                                                 */
/* -------------------------------------------------------------------------- */

export function RangeArea<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 320,
  curve = "linear",
  domain,
  color = "var(--chart-1)",
  valueColor = "var(--chart-2)",
  fillOpacity = 0.25,
  selectionColor = "var(--chart-selection)",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  lockableTooltip = true,
  motion = true,
  animation = "draw",
  xFormatter,
  valueFormatter: customValueFormatter,
  title = "Range Area Chart",
  description,
  loading = false,
  unavailable = false,
  error = null,
  onActiveDatumChange,
  className,
}: RangeAreaProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const motionEnabled = motion !== false && !reducedMotion && animation !== "none"
  const animationDuration = typeof motion === "object" && motion?.duration ? motion.duration * 1000 : 450

  const valueFormatter = React.useCallback(
    (val: number) => {
      if (series.valueFormatter) return series.valueFormatter(val)
      if (customValueFormatter) return customValueFormatter(val)
      return val.toLocaleString()
    },
    [series.valueFormatter, customValueFormatter]
  )

  const isCompact = typeof height === "number" ? height <= 260 : false

  // 1. Normalize data with truthful interval validation
  const { rows } = React.useMemo(
    () => normalizeRangeAreaData(data, xKey, series),
    [data, xKey, series]
  )

  // 2. Derive safe Cartesian Y-domain
  const safeDomain = React.useMemo(
    () => calculateRangeAreaDomain(rows, domain),
    [rows, domain]
  )

  // 3. Inspection state: active hover index vs persistent locked index
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(null)

  const activeIndex = lockedIndex !== null ? lockedIndex : hoverIndex

  // Clear locked state if data shrinks
  React.useEffect(() => {
    if (lockedIndex !== null && (lockedIndex >= rows.length || rows.length === 0)) {
      setLockedIndex(null)
    }
  }, [rows.length, lockedIndex])

  // Construct active datum
  const activeDatum = React.useMemo<RangeAreaActiveDatum<TData> | null>(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= rows.length) {
      return null
    }
    const r = rows[activeIndex]
    return {
      index: activeIndex,
      x: r.__x,
      raw: r.__raw,
      lower: r.__lower,
      upper: r.__upper,
      value: r.__value,
      rangeState: r.__rangeState,
      valueState: r.__valueState,
      isLocked: lockedIndex !== null && lockedIndex === activeIndex,
    }
  }, [activeIndex, lockedIndex, rows])

  React.useEffect(() => {
    onActiveDatumChange?.(activeDatum)
  }, [activeDatum, onActiveDatumChange])

  // Keyboard navigation & lock management
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!rows.length) return
      const maxIdx = rows.length - 1
      const current = activeIndex ?? 0

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault()
          const next = Math.min(maxIdx, current + 1)
          if (lockedIndex !== null) setLockedIndex(next)
          else setHoverIndex(next)
          break
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault()
          const prev = Math.max(0, current - 1)
          if (lockedIndex !== null) setLockedIndex(prev)
          else setHoverIndex(prev)
          break
        }
        case "Home": {
          e.preventDefault()
          if (lockedIndex !== null) setLockedIndex(0)
          else setHoverIndex(0)
          break
        }
        case "End": {
          e.preventDefault()
          if (lockedIndex !== null) setLockedIndex(maxIdx)
          else setHoverIndex(maxIdx)
          break
        }
        case "Enter":
        case " ": {
          if (!lockableTooltip) return
          e.preventDefault()
          if (lockedIndex !== null) {
            setLockedIndex(null)
          } else {
            setLockedIndex(current)
          }
          break
        }
        case "Escape": {
          if (lockedIndex !== null) {
            e.preventDefault()
            setLockedIndex(null)
          }
          break
        }
      }
    },
    [rows.length, activeIndex, lockedIndex, lockableTooltip]
  )

  const handleChartClick = React.useCallback(
    (state: any) => {
      if (!lockableTooltip) return
      if (state && state.activeTooltipIndex !== undefined) {
        const clickedIndex = Number(state.activeTooltipIndex)
        if (lockedIndex === clickedIndex) {
          setLockedIndex(null)
        } else {
          setLockedIndex(clickedIndex)
        }
      } else if (lockedIndex !== null) {
        setLockedIndex(null)
      }
    },
    [lockableTooltip, lockedIndex]
  )

  /* ------------------------------------------------------------------------ */
  /*  Early Return States                                                     */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Range area loading state"}
        className={cn("plotcn-range-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState description="Loading range envelope..." />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Range area unavailable state"}
        className={cn("plotcn-range-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Envelope Unavailable"
          description={typeof unavailable === "string" ? unavailable : "Range envelope data is currently unavailable."}
        />
      </figure>
    )
  }

  if (error) {
    const errorDescription = error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred."
    return (
      <figure
        role="region"
        aria-label={title || "Range area error state"}
        className={cn("plotcn-range-area relative w-full overflow-hidden rounded-xl border border-rose-500/20 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Range Area Configuration Error"
          description={errorDescription}
        />
      </figure>
    )
  }

  if (!data || data.length === 0 || !series) {
    return (
      <figure
        role="region"
        aria-label={title || "Range area empty state"}
        className={cn("plotcn-range-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No Range Data"
          description="Supply an array of records and configure lower and upper keys."
        />
      </figure>
    )
  }

  const activeRow = activeIndex !== null ? rows[activeIndex] : null

  return (
    <figure
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-sans text-zinc-200 outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-sky-500/50",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
      }}
    >
      {/* Screen Reader Live Narration */}
      <div className="sr-only" aria-live="polite">
        {description ||
          `${title}. Bounded range envelope across ${rows.length} observations.${series.valueKey ? " Includes centerline." : ""}`}
        {activeDatum && (
          activeDatum.rangeState === "valid" && activeDatum.lower !== null && activeDatum.upper !== null
            ? ` Active coordinate ${String(activeDatum.x)}. ${series.label}: ${valueFormatter(activeDatum.lower)} to ${valueFormatter(activeDatum.upper)}.${
                activeDatum.value !== null ? ` ${series.valueLabel || "Center"}: ${valueFormatter(activeDatum.value)}.` : ""
              }`
            : activeDatum.rangeState === "invalid"
            ? ` Active coordinate ${String(activeDatum.x)}. Range invalid because lower bound exceeds upper bound.`
            : ` Active coordinate ${String(activeDatum.x)}. Range interval unavailable.`
        )}
      </div>

      {/* Optional Legend */}
      {showLegend && (
        <div
          role="group"
          aria-label="Series identity legend"
          className="flex flex-wrap items-center justify-center gap-3 pb-2 text-xs select-none shrink-0"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-2 rounded-xs border border-white/20"
              style={{ backgroundColor: color, opacity: fillOpacity }}
            />
            <span className="text-zinc-300 font-medium">{series.label}</span>
          </span>

          {series.valueKey && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: valueColor }} />
              <span className="text-zinc-300 font-medium">{series.valueLabel || "Center"}</span>
            </span>
          )}
        </div>
      )}

      {/* SVG Canvas Container */}
      <ChartContainer className="relative w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
        >
          <ComposedChart
            data={rows}
            onClick={handleChartClick}
            onMouseMove={(state: any) => {
              if (lockedIndex === null && state && state.activeTooltipIndex !== undefined) {
                setHoverIndex(Number(state.activeTooltipIndex))
              }
            }}
            onMouseLeave={() => {
              if (lockedIndex === null) {
                setHoverIndex(null)
              }
            }}
            margin={{ top: 12, right: 16, left: showYAxis ? -10 : 4, bottom: 4 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />
            )}

            {showXAxis && (
              <XAxis
                dataKey="__x"
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                tickFormatter={xFormatter}
                dy={6}
              />
            )}

            {showYAxis && (
              <YAxis
                domain={safeDomain as any}
                tickFormatter={valueFormatter}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                width={48}
              />
            )}

            {/* Neutral Crosshair Line */}
            {activeRow && (
              <ReferenceLine
                x={activeRow.__x}
                stroke={selectionColor}
                strokeWidth={1.5}
                strokeDasharray={lockedIndex !== null ? "none" : "3 3"}
              />
            )}

            {/* Tooltip */}
            <Tooltip
              isAnimationActive={false}
              cursor={false}
              content={
                <RangeAreaTooltipContent
                  activeDatum={activeDatum}
                  series={series}
                  color={color}
                  valueColor={valueColor}
                  valueFormatter={valueFormatter}
                  onUnlock={() => setLockedIndex(null)}
                  isCompact={isCompact}
                />
              }
            />

            {/* Bounded Range Envelope Area: fills between lower and upper bounds */}
            <Area
              type={curve}
              dataKey="__range"
              name={series.label}
              fill={color}
              fillOpacity={fillOpacity}
              stroke={color}
              strokeWidth={1.2}
              strokeOpacity={0.65}
              isAnimationActive={motionEnabled}
              animationDuration={animationDuration}
              animationEasing="ease-out"
              activeDot={false}
              dot={false}
              connectNulls={false}
            />

            {/* Optional Central Signal Line */}
            {series.valueKey && (
              <Line
                type={curve}
                dataKey="__value"
                name={series.valueLabel || "Center"}
                stroke={valueColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: valueColor,
                  stroke: "var(--chart-background, #09090b)",
                  strokeWidth: 2,
                }}
                isAnimationActive={motionEnabled}
                animationDuration={animationDuration}
                animationEasing="ease-out"
                connectNulls={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Structured Data Alternative for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || `${series.label} observation data table`}</caption>
          <thead>
            <tr>
              <th scope="col">Coordinate</th>
              <th scope="col">{series.lowerLabel || "Lower"}</th>
              <th scope="col">{series.upperLabel || "Upper"}</th>
              {series.valueKey && <th scope="col">{series.valueLabel || "Center"}</th>}
              <th scope="col">Interval State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{String(r.__x)}</td>
                <td>{r.__lower !== null ? valueFormatter(r.__lower) : "—"}</td>
                <td>{r.__upper !== null ? valueFormatter(r.__upper) : "—"}</td>
                {series.valueKey && <td>{r.__value !== null ? valueFormatter(r.__value) : "—"}</td>}
                <td>{r.__rangeState}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
