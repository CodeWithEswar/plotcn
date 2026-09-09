"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockKeyIcon } from "@hugeicons/core-free-icons"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Type Definitions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Semantic representation of an actively inspected or locked observation.
 */
export interface ActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** 0-based index within the normalized observation dataset */
  index: number
  /** Domain coordinate along the horizontal axis */
  x: XVal
  /** Numeric quantitative metric value (null if missing/unrecorded) */
  value: number | null
  /** Original raw observation record from caller */
  raw: TData
  /** Alias for raw observation record */
  datum?: TData
  /** Whether this observation is actively pinned/locked */
  isLocked: boolean
  /** Whether this observation has a missing or unrecorded value */
  isMissing: boolean
}

export interface FocusSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key?: keyof TData & string
  label?: string
  valueFormatter?: (value: number) => string
  color?: string
}

export interface FocusLineProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for the horizontal axis domain (e.g. time, date, timestamp, sprint). */
  xKey: keyof TData & string

  /** Direct property name for the active quantitative numeric metric series. */
  seriesKey?: keyof TData & string

  /** Semantic series descriptor combining key, label, valueFormatter, and color. */
  series?: FocusSeriesConfig<TData>

  /** Human-readable label for the primary metric series. */
  label?: string

  /** Primary stroke color for the continuous signal line and active indicator. */
  color?: string

  /** Accent color for locked selection marker, concentric double-ring, and persistent tooltip. */
  selectionColor?: string

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation for the continuous signal line: "linear", "monotone", or "step". (default: "monotone") */
  curve?: "linear" | "monotone" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation. (default: "auto") */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /** Animation mode: "draw", "fade", or "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Handling of null or undefined values in the series: "gap" (truthful break) or "carry" (last known). */
  missingValuePolicy?: "gap" | "carry"

  /** Whether clicking or pressing Enter/Space pins the currently inspected datum. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Initial inspection position upon keyboard focus entry: "none", "first", or "last". (default: "none") */
  initialFocus?: "none" | "first" | "last"

  /** Horizontal inspection resolution algorithm: "nearest-x". (default: "nearest-x") */
  scrubMode?: "nearest-x"

  /** Tooltip inspection behavior: "nearest-x". (default: "nearest-x") */
  tooltipMode?: "nearest-x"

  /** Whether to render subtle horizontal background reference gridlines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical numeric scale. (default: true) */
  showYAxis?: boolean

  /** Whether to render the chart legend. (default: false) */
  showLegend?: boolean

  /** Custom formatter for Y-axis scale numbers and tooltip metric values. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Animation configuration or boolean toggle. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: ActiveDatum<TData, XVal> | null) => void

  /** Callback fired whenever the persistent locked observation changes. */
  onLockedDatumChange?: (datum: ActiveDatum<TData, XVal> | null) => void

  /** Optional heading announced to assistive technologies. */
  title?: string

  /** Optional descriptive explanation announced to assistive technologies. */
  description?: string

  /** Optional CSS class name passed to the root figure element. */
  className?: string

  /** Display neutral skeleton loading state. */
  loading?: boolean

  /** Display actionable error banner. */
  error?: Error | string | null

  /** Display metric unavailability notice. */
  unavailable?: boolean | string | null
}

/* -------------------------------------------------------------------------- */
/*  Pure Algorithmic Helpers                                                  */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

export interface NormalizedFocusDatum {
  __x: string | number
  __value: number | null
  __raw: Record<string, unknown>
  __index: number
}

/**
 * Safely normalizes input observation records:
 * 1. Missing values are preserved as null under "gap" policy (no null-to-zero coercion).
 * 2. Non-finite values (NaN, Infinity) are treated as missing.
 * 3. Never mutates caller array or objects.
 */
export function normalizeFocusData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesKey: string,
  missingValuePolicy: "gap" | "carry" = "gap"
): NormalizedFocusDatum[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let lastKnownValid: number | null = null

  return data.map((d, idx) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawV = d[seriesKey]
    const isDirectFinite = isFiniteNumber(rawV)

    let finalVal: number | null = null

    if (isDirectFinite) {
      finalVal = rawV
      lastKnownValid = rawV
    } else if (missingValuePolicy === "carry" && lastKnownValid !== null) {
      finalVal = lastKnownValid
    } else {
      finalVal = null
      if (missingValuePolicy === "gap") {
        lastKnownValid = null
      }
    }

    return {
      __x: xVal,
      __value: finalVal,
      __raw: d,
      __index: idx,
    }
  })
}

/**
 * Calculates a safe Cartesian Y-domain covering observation extrema.
 * Guarantees:
 * 1. If explicit numeric domain [min, max] is provided, respects it verbatim.
 * 2. Auto domain calculates series min/max with protective 8% padding.
 * 3. Handles empty, single-value, and constant data without collapsing.
 * 4. Handles negative, zero-span, and mixed-sign coordinates.
 */
export function calculateFocusDomain(
  normalized: readonly NormalizedFocusDatum[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto"
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    typeof explicitDomain[0] === "number" &&
    typeof explicitDomain[1] === "number" &&
    Number.isFinite(explicitDomain[0]) &&
    Number.isFinite(explicitDomain[1])
  ) {
    return explicitDomain
  }

  const values: number[] = []
  for (const item of normalized) {
    if (item.__value !== null && Number.isFinite(item.__value)) {
      values.push(item.__value)
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) {
    if (min === 0) return [-10, 10]
    const delta = Math.abs(min) * 0.15 || 10
    return [Math.floor(min - delta), Math.ceil(max + delta)]
  }

  const span = max - min
  const pad = span * 0.08
  return [Math.floor(min - pad), Math.ceil(max + pad)]
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Custom Tooltip                                               */
/* -------------------------------------------------------------------------- */

interface FocusTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  label?: React.ReactNode
  activeDatum: ActiveDatum | null
  seriesLabel: string
  primaryColor: string
  selectionColor: string
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockableTooltip: boolean
  isLocked?: boolean
}

function FocusTooltipContent({
  active,
  payload,
  label: _label,
  activeDatum,
  seriesLabel,
  primaryColor,
  selectionColor,
  valueFormatter,
  xFormatter,
  lockableTooltip,
  isLocked = false,
}: FocusTooltipContentProps) {
  // Extract observation from payload (Recharts hover) OR activeDatum (keyboard/locked state)
  const payloadItem = payload?.[0]?.payload as NormalizedFocusDatum | undefined
  const hasPayload = Boolean(payloadItem)

  if (!activeDatum && (!active || !hasPayload)) {
    return null
  }

  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
  const rawX = activeDatum ? activeDatum.x : (payloadItem?.__x ?? "")
  const xDisplay = xFormatter ? xFormatter(rawX) : String(rawX)
  const val = activeDatum ? activeDatum.value : (payloadItem?.__value ?? null)
  const isMissing = val === null
  const lockedState = activeDatum ? activeDatum.isLocked : isLocked

  const isCustomHex = typeof selectionColor === "string" && selectionColor.startsWith("#")

  return (
    <div
      className={cn(
        "rounded-xl border bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[180px] max-w-[260px] text-left transition-all duration-150 pointer-events-none select-none z-50",
        lockedState
          ? "border-amber-500/40 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_16px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/25"
          : "border-white/[0.12] ring-1 ring-white/[0.04]"
      )}
      style={
        lockedState && isCustomHex
          ? {
              borderColor: `${selectionColor}66`,
              boxShadow: `0 12px 32px -4px rgba(0,0,0,0.6), 0 0 16px ${selectionColor}26, 0 0 0 1px ${selectionColor}40`,
            }
          : undefined
      }
    >
      {/* Header: Coordinate + Lock Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2.5">
        <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wide truncate">
          {xDisplay}
        </span>
        {lockedState && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-tight border bg-amber-500/15 border-amber-500/40 text-amber-300 dark:bg-amber-400/15 dark:border-amber-400/40 dark:text-amber-200 shadow-2xs"
            style={
              isCustomHex
                ? {
                    backgroundColor: `${selectionColor}20`,
                    borderColor: `${selectionColor}55`,
                    color: selectionColor,
                  }
                : undefined
            }
          >
            <HugeiconsIcon icon={LockKeyIcon} size={11} strokeWidth={2.2} className="shrink-0" />
            Locked
          </span>
        )}
      </div>

      {/* Series Metric Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex size-2 shrink-0 items-center justify-center">
            {lockedState && (
              <span
                className="absolute size-3.5 rounded-full opacity-30 animate-pulse"
                style={{ backgroundColor: primaryColor }}
              />
            )}
            <span
              className="size-2 rounded-full ring-1 ring-white/20 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            />
          </span>
          <span className="text-xs font-medium text-zinc-300 font-sans truncate">
            {seriesLabel}
          </span>
        </div>

        <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
          {isMissing ? "—" : fmt(val)}
        </span>
      </div>

      {/* Interaction Hint Footer */}
      {lockableTooltip && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
          {lockedState ? (
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-800/90 border border-white/15 text-[9px] font-mono font-semibold text-zinc-200 shadow-2xs">
                Esc
              </kbd>
              <span className="text-zinc-400">or click to release</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-500">
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-800/60 border border-white/10 text-[9px] font-mono font-medium text-zinc-400">
                Click
              </kbd>
              <span>to lock</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main FocusLine Component                                                  */
/* -------------------------------------------------------------------------- */

export function FocusLine<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  seriesKey: propSeriesKey,
  series,
  label: propLabel,
  color: propColor,
  selectionColor: propSelectionColor,
  height = 320,
  curve = "monotone",
  domain = "auto",
  animation = "draw",
  missingValuePolicy = "gap",
  lockableTooltip = true,
  defaultLockedIndex = null,
  initialFocus = "none",
  scrubMode = "nearest-x",
  tooltipMode = "nearest-x",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  valueFormatter,
  xFormatter,
  motion = true,
  onActiveDatumChange,
  onLockedDatumChange,
  title,
  description,
  className,
  loading = false,
  error = null,
  unavailable = false,
}: FocusLineProps<TData, XVal>) {
  // Container & Motion hooks
  const reducedMotion = useChartReducedMotion()
  const uid = React.useId()
  const titleId = `plotcn-focus-title-${uid}`
  const descId = `plotcn-focus-desc-${uid}`

  // Resolved series metadata & colors
  const activeSeriesKey = series?.key ?? propSeriesKey ?? "value"
  const seriesLabel = series?.label ?? propLabel ?? "Metric"
  const primaryColor = series?.color ?? propColor ?? "var(--chart-1, #3b82f6)"
  const selectionColor = propSelectionColor ?? "var(--chart-selection, #f59e0b)"

  // Normalized observation dataset
  const normalizedData = React.useMemo(
    () => normalizeFocusData(data, xKey, activeSeriesKey, missingValuePolicy),
    [data, xKey, activeSeriesKey, missingValuePolicy]
  )

  // Safe Y-axis domain
  const safeDomain = React.useMemo(
    () => calculateFocusDomain(normalizedData, domain),
    [normalizedData, domain]
  )

  // Explicit interaction state model
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(() => {
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedData.length
    ) {
      return defaultLockedIndex
    }
    return null
  })

  const [activeIndex, setActiveIndex] = React.useState<number | null>(() => {
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedData.length
    ) {
      return defaultLockedIndex
    }
    if (normalizedData.length === 0) return null
    if (initialFocus === "first") return 0
    if (initialFocus === "last") return normalizedData.length - 1
    return null
  })
  const [isChartFocused, setIsChartFocused] = React.useState(false)

  // Ensure lockedIndex is safely cleared if underlying datum disappears after data update
  React.useEffect(() => {
    if (lockedIndex !== null && (lockedIndex >= normalizedData.length || normalizedData.length === 0)) {
      setLockedIndex(null)
      if (onLockedDatumChange) onLockedDatumChange(null)
    }
  }, [normalizedData.length, lockedIndex, onLockedDatumChange])

  // Effective currently visible inspected index: lockedIndex takes priority over transient activeIndex
  const effectiveIndex = lockedIndex !== null ? lockedIndex : activeIndex

  // Construct active datum object for callbacks and tooltip
  const activeDatum = React.useMemo<ActiveDatum<TData, XVal> | null>(() => {
    if (effectiveIndex === null || effectiveIndex < 0 || effectiveIndex >= normalizedData.length) {
      return null
    }
    const item = normalizedData[effectiveIndex]
    return {
      index: effectiveIndex,
      x: item.__x as XVal,
      value: item.__value,
      raw: item.__raw as TData,
      datum: item.__raw as TData,
      isLocked: lockedIndex !== null && lockedIndex === effectiveIndex,
      isMissing: item.__value === null,
    }
  }, [effectiveIndex, lockedIndex, normalizedData])

  // Notify consumer callbacks when state changes
  React.useEffect(() => {
    if (onActiveDatumChange) {
      onActiveDatumChange(activeDatum)
    }
  }, [activeDatum, onActiveDatumChange])

  React.useEffect(() => {
    if (onLockedDatumChange) {
      if (lockedIndex !== null && activeDatum && activeDatum.isLocked) {
        onLockedDatumChange(activeDatum)
      } else {
        onLockedDatumChange(null)
      }
    }
  }, [lockedIndex, activeDatum, onLockedDatumChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard Navigation Handlers (Single entry point on root <figure>)        */
  /* -------------------------------------------------------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (normalizedData.length === 0) return

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault()
        const nextIdx = activeIndex === null ? 0 : Math.min(activeIndex + 1, normalizedData.length - 1)
        setActiveIndex(nextIdx)
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        const prevIdx =
          activeIndex === null
            ? normalizedData.length - 1
            : Math.max(activeIndex - 1, 0)
        setActiveIndex(prevIdx)
        break
      }
      case "Home": {
        e.preventDefault()
        setActiveIndex(0)
        break
      }
      case "End": {
        e.preventDefault()
        setActiveIndex(normalizedData.length - 1)
        break
      }
      case "Enter":
      case " ": {
        if (!lockableTooltip) return
        e.preventDefault()
        const targetIndex = activeIndex !== null ? activeIndex : 0
        if (lockedIndex === targetIndex) {
          setLockedIndex(null)
        } else {
          setLockedIndex(targetIndex)
          setActiveIndex(targetIndex)
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        setLockedIndex(null)
        setActiveIndex(null)
        break
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*  Pointer / Mouse Scrubbing Handlers                                        */
  /* -------------------------------------------------------------------------- */

  const handleChartMouseMove = (state: any) => {
    if (!state || typeof state.activeTooltipIndex !== "number") return

    const idx = state.activeTooltipIndex
    if (idx < 0 || idx >= normalizedData.length) return

    // If a datum is locked, pointer movement does not override locked datum until unlocked
    if (lockedIndex === null) {
      if (activeIndex !== idx) {
        setActiveIndex(idx)
      }
    }
  }

  const handleChartMouseLeave = () => {
    // When unlocked, pointer leave clears active transient inspection
    if (lockedIndex === null) {
      setActiveIndex(null)
    }
  }

  const handleChartClick = (state: any) => {
    if (!lockableTooltip || normalizedData.length === 0) return

    const clickedIdx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : activeIndex
    if (clickedIdx === null || clickedIdx < 0 || clickedIdx >= normalizedData.length) return

    if (lockedIndex === clickedIdx) {
      // Clicking locked datum again unlocks it
      setLockedIndex(null)
    } else {
      // Lock newly clicked datum
      setLockedIndex(clickedIdx)
      setActiveIndex(clickedIdx)
    }
  }

  // Animation settings
  const isAnimated = animation !== "none" && motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Screen reader factual summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No observations recorded."
    const count = normalizedData.length
    const activeInfo = activeDatum
      ? ` Currently ${activeDatum.isLocked ? "locked on" : "inspecting"} observation ${activeDatum.index + 1} of ${count} at ${String(activeDatum.x)}${activeDatum.isMissing ? " (value unavailable)" : ` with value ${activeDatum.value}`}.`
      : " Use Left and Right Arrow keys to inspect observations along the timeline."
    return `Interactive time-series line chart depicting ${count} observations for ${seriesLabel}.${activeInfo}`
  }, [normalizedData.length, activeDatum, seriesLabel])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Exception States                                             */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart error state`}
        className={cn("plotcn-focus-line relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartErrorState
          title="Unable to load focus visualization"
          description={
            typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred while loading trend and inspection data."
          }
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart loading state`}
        className={cn("plotcn-focus-line relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartLoadingState
          title="Loading focus chart…"
          description="Preparing timeline observations for inspection"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart unavailable state`}
        className={cn("plotcn-focus-line relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartUnavailableState
          title="Inspection metrics unavailable"
          description={
            typeof unavailable === "string"
              ? unavailable
              : "Timeline inspection metrics are unavailable for this view."
          }
        />
      </figure>
    )
  }

  if (normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart empty state`}
        className={cn("plotcn-focus-line relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations to inspect latency and series metrics."
        />
      </figure>
    )
  }

  /* -------------------------------------------------------------------------- */
  /*  Active Coordinate Crosshair & Point Calculation                           */
  /* -------------------------------------------------------------------------- */

  const activeXCoordinate = effectiveIndex !== null ? normalizedData[effectiveIndex].__x : null
  const isCurrentlyLocked = lockedIndex !== null

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsChartFocused(true)}
      onBlur={() => setIsChartFocused(false)}
      className={cn(
        "plotcn-focus-line relative w-full outline-none select-none transition-all duration-150 rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
        touchAction: "pan-y", // Preserve vertical page scroll while allowing horizontal inspection
      }}
    >
      {/* Accessible Name & Screen Reader Description */}
      <div className="sr-only">
        <h3 id={titleId}>{title || `${seriesLabel} Interactive Focus Line Chart`}</h3>
        <p id={descId}>{description ? `${description} ${factualSummary}` : factualSummary}</p>
      </div>

      <ChartContainer className="w-full h-full min-w-0 max-w-full overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
        >
          <LineChart
            data={normalizedData as any}
            margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
            onClick={handleChartClick}
          >
            {/* 1. Subtle Reference Grid */}
            {showGrid && (
              <CartesianGrid
                stroke="var(--chart-grid, rgba(255, 255, 255, 0.08))"
                strokeDasharray="3 3"
                vertical={false}
              />
            )}

            {/* 2. Horizontal Category Scale */}
            <XAxis
              hide={!showXAxis}
              dataKey="__x"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
              tickFormatter={xFormatter as any}
              dy={6}
            />

            {/* 3. Vertical Numeric Scale */}
            <YAxis
              hide={!showYAxis}
              domain={safeDomain as any}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
              tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              dx={-4}
            />

            {/* 4. Persistent Inspection Crosshair when Locked */}
            {activeXCoordinate !== null && isCurrentlyLocked && (
              <ReferenceLine
                x={activeXCoordinate}
                stroke={selectionColor}
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
            )}

            {/* 5. Synchronized Tooltip */}
            <Tooltip
              active={isCurrentlyLocked || (isChartFocused && activeIndex !== null) ? true : undefined}
              defaultIndex={typeof defaultLockedIndex === "number" ? defaultLockedIndex : undefined}
              content={
                <FocusTooltipContent
                  activeDatum={activeDatum}
                  seriesLabel={seriesLabel}
                  primaryColor={primaryColor}
                  selectionColor={selectionColor}
                  valueFormatter={valueFormatter}
                  xFormatter={xFormatter}
                  lockableTooltip={lockableTooltip}
                  isLocked={isCurrentlyLocked}
                />
              }
              cursor={{
                stroke: isCurrentlyLocked ? selectionColor : "var(--chart-crosshair, rgba(255, 255, 255, 0.28))",
                strokeDasharray: "3 3",
                strokeWidth: isCurrentlyLocked ? 1.5 : 1.2,
              }}
            />

            {/* 6. Optional Legend */}
            {showLegend && (
              <Legend
                content={() => (
                  <div className="flex items-center justify-center gap-2 pt-2 text-xs font-mono text-zinc-400">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <span>{seriesLabel}</span>
                  </div>
                )}
              />
            )}

            {/* 7. Primary Continuous Signal Line with Custom Active / Locked Dot */}
            <Line
              type={curve === "step" ? "stepAfter" : curve}
              dataKey="__value"
              name={seriesLabel}
              stroke={primaryColor}
              strokeWidth={2.2}
              connectNulls={false}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              // Active / Locked Marker rendering
              dot={(dotProps: any) => {
                const { cx, cy, index, payload } = dotProps
                if (typeof cx !== "number" || typeof cy !== "number" || payload.__value === null) {
                  return <React.Fragment key={`dot-frag-${index}`} />
                }

                // Render special marker for active / locked observation
                if (index === effectiveIndex) {
                  if (index === lockedIndex) {
                    // Concentric Double-Ring Marker for Locked Datum (───◎───)
                    return (
                      <g key={`locked-marker-${index}`} className="pointer-events-none">
                        {/* Outer concentric selection ring */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={8}
                          fill="none"
                          stroke={selectionColor}
                          strokeWidth={2.5}
                        />
                        {/* Inner selection dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={4}
                          fill={selectionColor}
                          stroke="var(--chart-background, #09090b)"
                          strokeWidth={1.5}
                        />
                      </g>
                    )
                  }

                  // Active Dot for transient inspection (───●───)
                  return (
                    <circle
                      key={`active-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={5.5}
                      fill={primaryColor}
                      stroke="var(--chart-background, #09090b)"
                      strokeWidth={2}
                      className="pointer-events-none"
                    />
                  )
                }

                // If dataset has only 1 observation, render single static dot
                if (normalizedData.length === 1) {
                  return (
                    <circle
                      key={`single-dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={primaryColor}
                      stroke="var(--chart-background, #09090b)"
                      strokeWidth={1.5}
                      className="pointer-events-none"
                    />
                  )
                }

                // Subtle baseline observation dot so points are clearly discoverable
                if (normalizedData.length <= 40) {
                  return (
                    <circle
                      key={`dot-base-${index}`}
                      cx={cx}
                      cy={cy}
                      r={3}
                      fill={primaryColor}
                      fillOpacity={0.5}
                      stroke="var(--chart-background, #09090b)"
                      strokeWidth={1}
                      className="pointer-events-none transition-all duration-150"
                    />
                  )
                }

                return <React.Fragment key={`dot-empty-${index}`} />
              }}
              activeDot={(activeProps: any) => {
                const { cx, cy, index, payload } = activeProps
                if (typeof cx !== "number" || typeof cy !== "number" || payload?.__value === null) {
                  return <React.Fragment key={`active-dot-empty-${index}`} />
                }
                if (index === lockedIndex) {
                  return (
                    <g key={`locked-active-${index}`} className="pointer-events-none">
                      <circle cx={cx} cy={cy} r={8} fill="none" stroke={selectionColor} strokeWidth={2} />
                      <circle cx={cx} cy={cy} r={4} fill={selectionColor} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                    </g>
                  )
                }
                return (
                  <circle
                    key={`active-hover-dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={primaryColor}
                    stroke="var(--chart-background, #09090b)"
                    strokeWidth={2}
                    className="pointer-events-none"
                  />
                )
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </figure>
  )
}
