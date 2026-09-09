"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

export type NumericKeyOf<TData> = [keyof TData] extends [never]
  ? string
  : {
      [K in keyof TData]: TData[K] extends number | null | undefined ? K : never
    }[keyof TData] extends never
  ? string
  : {
      [K in keyof TData]: TData[K] extends number | null | undefined ? K : never
    }[keyof TData] & string

/**
 * Single quantitative series descriptor for Interactive Area.
 */
export interface InteractiveAreaSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on observation records containing quantitative numeric values */
  key: NumericKeyOf<TData>
  /** Human-readable display label for tooltips, legend, and screen readers */
  label: string
  /** Optional custom numeric formatter for tooltip and scale values */
  valueFormatter?: (value: number) => string
}

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

export interface InteractiveAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for the horizontal axis domain (e.g. date, month, time, timestamp). */
  xKey: keyof TData & string

  /** Single quantitative series specification. */
  series: InteractiveAreaSeries<TData>

  /** Primary stroke and fill color for the area. (default: "var(--chart-1, #3b82f6)") */
  color?: string

  /** Accent color for locked selection marker, persistent ring, and lock badge. (default: "var(--chart-selection, #f59e0b)") */
  selectionColor?: string

  /** Fill opacity for the occupied area polygon. (default: 0.22) */
  fillOpacity?: number

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation. (default: "auto") */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /** Baseline reference: quantitative number, "zero", or "domain-min". (default: "zero") */
  baseline?: number | "zero" | "domain-min"

  /** Whether clicking or pressing Enter/Space pins the currently inspected datum. (default: true) */
  lockable?: boolean

  /** Alias for lockable. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Initial inspection position upon keyboard focus entry: "none" | "first" | "last". (default: "none") */
  initialFocus?: "none" | "first" | "last"

  /** Handling of null or undefined values: "gap" (truthful break) | "carry" (last known) | "connect". (default: "gap") */
  missingValuePolicy?: "gap" | "carry" | "connect"

  /** Animation mode: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Animation configuration or boolean toggle. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

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

  /** Callback fired whenever the active inspected observation changes. */
  onActiveChange?: (active: ActiveDatum<TData, XVal> | null, index: number | null) => void

  /** Callback fired whenever the persistent locked observation changes. */
  onLockChange?: (locked: ActiveDatum<TData, XVal> | null, index: number | null) => void

  /** Optional heading announced to assistive technologies. */
  title?: string

  /** Optional descriptive explanation announced to assistive technologies. */
  description?: string

  /** Optional CSS class name passed to the root figure element. */
  className?: string

  /** Display neutral skeleton loading state. */
  loading?: boolean

  /** Display truthful empty state. */
  empty?: boolean

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

export interface NormalizedInteractiveDatum {
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
export function normalizeInteractiveData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesKey: string,
  missingValuePolicy: "gap" | "carry" | "connect" = "gap"
): NormalizedInteractiveDatum[] {
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
 * Calculates a safe Cartesian Y-domain covering observation extrema and baseline.
 */
export function calculateInteractiveAreaDomain(
  normalized: readonly NormalizedInteractiveDatum[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto",
  baseline: number | "zero" | "domain-min" = "zero"
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

  if (typeof baseline === "number" && Number.isFinite(baseline)) {
    values.push(baseline)
  } else if (baseline === "zero") {
    values.push(0)
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

/**
 * Deterministic Nearest-X resolution along an ordered array of screen coordinates.
 * Invariant: At exact midpoint (equidistant), tie breaks deterministically to the earlier index.
 */
export function resolveNearestIndex(targetX: number, xPositions: readonly number[]): number {
  if (xPositions.length === 0) return -1
  if (xPositions.length === 1) return 0

  let low = 0
  let high = xPositions.length - 1

  if (targetX <= xPositions[low]) return low
  if (targetX >= xPositions[high]) return high

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const midVal = xPositions[mid]

    if (midVal === targetX) return mid

    if (midVal < targetX) {
      if (mid + 1 < xPositions.length && targetX < xPositions[mid + 1]) {
        const dLeft = targetX - midVal
        const dRight = xPositions[mid + 1] - targetX
        // Equidistant tie-break: pick earlier index
        return dLeft <= dRight ? mid : mid + 1
      }
      low = mid + 1
    } else {
      if (mid - 1 >= 0 && targetX > xPositions[mid - 1]) {
        const dLeft = targetX - xPositions[mid - 1]
        const dRight = midVal - targetX
        return dLeft <= dRight ? mid - 1 : mid
      }
      high = mid - 1
    }
  }

  return low
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Custom Tooltip Content                                       */
/* -------------------------------------------------------------------------- */

interface InteractiveAreaTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  activeDatum: ActiveDatum | null
  seriesLabel: string
  primaryColor: string
  selectionColor: string
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockable: boolean
  isLocked?: boolean
}

function InteractiveAreaTooltipContent({
  active,
  payload,
  activeDatum,
  seriesLabel,
  primaryColor,
  selectionColor,
  valueFormatter,
  xFormatter,
  lockable,
  isLocked = false,
}: InteractiveAreaTooltipContentProps) {
  const payloadItem = payload?.[0]?.payload as NormalizedInteractiveDatum | undefined
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
          <span
            className="size-2 rounded-full ring-1 ring-white/20 shadow-xs shrink-0"
            style={{ backgroundColor: primaryColor }}
          />
          <span className="text-xs font-medium text-zinc-300 font-sans truncate">
            {seriesLabel}
          </span>
        </div>

        <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
          {isMissing ? "—" : fmt(val)}
        </span>
      </div>

      {/* Interaction Hint Footer */}
      {lockable && (
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
/*  Main InteractiveArea Component                                            */
/* -------------------------------------------------------------------------- */

export function InteractiveArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data = [],
  xKey,
  series,
  color: propColor,
  selectionColor: propSelectionColor,
  fillOpacity = 0.22,
  height = 320,
  curve = "monotone",
  domain = "auto",
  baseline = "zero",
  lockable = true,
  lockableTooltip,
  defaultLockedIndex = null,
  initialFocus = "none",
  missingValuePolicy = "gap",
  animation = "draw",
  motion = true,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  valueFormatter,
  xFormatter,
  onActiveChange,
  onLockChange,
  title,
  description,
  className,
  loading = false,
  empty = false,
  error = null,
  unavailable = false,
}: InteractiveAreaProps<TData, XVal>) {
  const isLockable = lockableTooltip !== undefined ? lockableTooltip : lockable
  const reducedMotion = useChartReducedMotion()
  const uid = React.useId()
  const titleId = `plotcn-area-interactive-title-${uid}`
  const descId = `plotcn-area-interactive-desc-${uid}`

  // Resolved series metadata & colors
  const activeSeriesKey = series?.key ?? "value"
  const seriesLabel = series?.label ?? "Requests"
  const primaryColor = propColor ?? "var(--chart-1, #3b82f6)"
  const selectionColor = propSelectionColor ?? "var(--chart-selection, #f59e0b)"

  // Normalized observation dataset
  const normalizedData = React.useMemo(
    () => normalizeInteractiveData(data, xKey, activeSeriesKey, missingValuePolicy),
    [data, xKey, activeSeriesKey, missingValuePolicy]
  )

  // Safe Y-axis domain
  const safeDomain = React.useMemo(
    () => calculateInteractiveAreaDomain(normalizedData, domain, baseline),
    [normalizedData, domain, baseline]
  )

  // Resolved baseline value for Area baseValue
  const resolvedBaseValue = React.useMemo(() => {
    if (typeof baseline === "number" && Number.isFinite(baseline)) return baseline
    if (baseline === "domain-min") return safeDomain[0]
    return 0
  }, [baseline, safeDomain])

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
      if (onLockChange) onLockChange(null, null)
    }
  }, [normalizedData.length, lockedIndex, onLockChange])

  // Effective visible index: lockedIndex takes priority over transient activeIndex
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
    if (onActiveChange) {
      onActiveChange(activeDatum, effectiveIndex)
    }
  }, [activeDatum, effectiveIndex, onActiveChange])

  React.useEffect(() => {
    if (onLockChange) {
      if (lockedIndex !== null && activeDatum && activeDatum.isLocked) {
        onLockChange(activeDatum, lockedIndex)
      } else {
        onLockChange(null, null)
      }
    }
  }, [lockedIndex, activeDatum, onLockChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard Navigation Handlers                                              */
  /* -------------------------------------------------------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (normalizedData.length === 0) return

    const currentIndex = activeIndex !== null ? activeIndex : 0

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault()
        const nextIdx = Math.min(currentIndex + 1, normalizedData.length - 1)
        setActiveIndex(nextIdx)
        if (lockedIndex !== null) setLockedIndex(nextIdx)
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        const prevIdx = Math.max(currentIndex - 1, 0)
        setActiveIndex(prevIdx)
        if (lockedIndex !== null) setLockedIndex(prevIdx)
        break
      }
      case "Home": {
        e.preventDefault()
        setActiveIndex(0)
        if (lockedIndex !== null) setLockedIndex(0)
        break
      }
      case "End": {
        e.preventDefault()
        const lastIdx = normalizedData.length - 1
        setActiveIndex(lastIdx)
        if (lockedIndex !== null) setLockedIndex(lastIdx)
        break
      }
      case "Enter":
      case " ": {
        if (!isLockable) return
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

    // If locked, incidental pointer movement does not override locked datum
    if (lockedIndex === null) {
      if (activeIndex !== idx) {
        setActiveIndex(idx)
      }
    }
  }

  const handleChartMouseLeave = () => {
    // When unlocked, pointer leave clears transient active inspection
    if (lockedIndex === null) {
      setActiveIndex(null)
    }
  }

  const handleChartClick = (state: any) => {
    if (!isLockable || normalizedData.length === 0) return

    const clickedIdx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : activeIndex
    if (clickedIdx === null || clickedIdx < 0 || clickedIdx >= normalizedData.length) return

    if (lockedIndex === clickedIdx) {
      // Clicking locked datum again releases lock
      setLockedIndex(null)
    } else {
      // Move lock directly to clicked observation
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
      : " Use Left and Right Arrow keys to inspect observations along the domain."
    return `Interactive time-series area chart depicting ${count} observations for ${seriesLabel}.${activeInfo}`
  }, [normalizedData.length, activeDatum, seriesLabel])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Exception States                                             */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart error state`}
        className={cn("plotcn-area-interactive relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartErrorState
          title="Unable to load interactive area visualization"
          description={
            typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred while loading inspection data."
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
        className={cn("plotcn-area-interactive relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartLoadingState
          title="Loading interactive area…"
          description="Preparing domain observations for nearest-X inspection"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart unavailable state`}
        className={cn("plotcn-area-interactive relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartUnavailableState
          title="Inspection metrics unavailable"
          description={
            typeof unavailable === "string"
              ? unavailable
              : "Timeline observation metrics are unavailable for this view."
          }
        />
      </figure>
    )
  }

  if (empty || normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || `${seriesLabel} chart empty state`}
        className={cn("plotcn-area-interactive relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations to inspect metrics across the timeline."
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
        "plotcn-area-interactive relative w-full outline-none select-none transition-all duration-150 rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
        touchAction: "pan-y", // Strictly preserves vertical page scroll while allowing horizontal inspection
      }}
    >
      {/* Accessible Name & Screen Reader Description */}
      <div className="sr-only">
        <h3 id={titleId}>{title || `${seriesLabel} Interactive Area Chart`}</h3>
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
          <AreaChart
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

            {/* 4. Observation-Aligned Structural Crosshair (Snaps to selected datum X, never raw pointer) */}
            {activeXCoordinate !== null && (
              <ReferenceLine
                x={activeXCoordinate}
                stroke={isCurrentlyLocked ? selectionColor : "var(--chart-crosshair, rgba(255, 255, 255, 0.28))"}
                strokeDasharray="3 3"
                strokeWidth={isCurrentlyLocked ? 1.5 : 1}
              />
            )}

            {/* 5. Synchronized Tooltip */}
            <Tooltip
              active={isCurrentlyLocked || (isChartFocused && activeIndex !== null) ? true : undefined}
              defaultIndex={typeof defaultLockedIndex === "number" ? defaultLockedIndex : undefined}
              cursor={false} // Disabled so only observation-aligned ReferenceLine crosshair renders
              content={
                <InteractiveAreaTooltipContent
                  activeDatum={activeDatum}
                  seriesLabel={seriesLabel}
                  primaryColor={primaryColor}
                  selectionColor={selectionColor}
                  valueFormatter={valueFormatter}
                  xFormatter={xFormatter}
                  lockable={isLockable}
                  isLocked={isCurrentlyLocked}
                />
              }
            />

            {/* 6. Optional Legend */}
            {showLegend && (
              <Legend
                content={() => (
                  <div className="flex items-center justify-center gap-2 pt-2 text-xs font-mono text-zinc-400">
                    <span className="size-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
                    <span>{seriesLabel}</span>
                  </div>
                )}
              />
            )}

            {/* 7. Area Geometry with Active / Locked Point Marker */}
            <Area
              type={curve === "step" ? "stepAfter" : curve}
              dataKey="__value"
              name={seriesLabel}
              baseValue={resolvedBaseValue}
              stroke={primaryColor}
              strokeWidth={2}
              fill={primaryColor}
              fillOpacity={fillOpacity}
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              activeDot={false} // Managed deterministically through dot callback below
              dot={(dotProps: any) => {
                const { cx, cy, index, payload } = dotProps
                if (typeof cx !== "number" || typeof cy !== "number" || payload?.__value === null) {
                  return <React.Fragment key={`dot-frag-${index}`} />
                }

                // Exactly 0 or 1 marker is rendered: only at effectiveIndex
                if (index === effectiveIndex) {
                  if (index === lockedIndex) {
                    // Concentric Double-Ring Marker for Locked Selection (───◎───)
                    return (
                      <g key={`locked-marker-${index}`} className="pointer-events-none">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={8}
                          fill="none"
                          stroke={selectionColor}
                          strokeWidth={2.5}
                        />
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

                // No permanent dots across the plot
                return <React.Fragment key={`dot-empty-${index}`} />
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 8. Off-Screen Structured HTML Data Table for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || `${seriesLabel} Data Table`}</caption>
          <thead>
            <tr>
              <th scope="col">{xKey}</th>
              <th scope="col">{seriesLabel}</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((row, idx) => (
              <tr key={idx}>
                <td>{String(row.__x)}</td>
                <td>{row.__value !== null ? row.__value : "Unavailable"}</td>
                <td>
                  {idx === lockedIndex
                    ? "Locked"
                    : idx === activeIndex
                      ? "Inspecting"
                      : "Unselected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
