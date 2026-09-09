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
 * Series definition for Prism Area (single quantitative magnitude series).
 */
export interface PrismAreaSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key for quantitative magnitude values */
  key: NumericKeyOf<TData>

  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string

  /** Optional custom numeric formatter for metric values */
  valueFormatter?: (value: number) => string
}

export interface PrismAreaActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  value: number | null
  isLocked: boolean
}

export interface NormalizedPrismAreaDatum<TData extends Record<string, unknown> = Record<string, unknown>> {
  __x: string | number
  __index: number
  __raw: TData
  __value: number | null
}

export interface PrismAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for horizontal domain coordinate (e.g. date, month, hour). */
  xKey: keyof TData & string

  /** Semantic series descriptor defining metric key and label. */
  series: PrismAreaSeries<TData>

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation. */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /**
   * Baseline reference toward which the area fills.
   * - "zero": Fills toward 0 (conventional for non-negative magnitude). Automatic domain includes 0. (default)
   * - "domain-min": Fills toward the minimum value of the visible domain.
   * - number: Fills toward a specific numeric reference (e.g. 100). Automatic domain includes the baseline.
   */
  baseline?: number | "zero" | "domain-min"

  /** Primary stroke color / series identity. (default: "var(--chart-1)") */
  color?: string

  /**
   * Explicit fill color override. If omitted, derives automatically from `color`.
   * Follows explicit precedence: `fillColor` > auto-fill from `color`.
   */
  fillColor?: string

  /** Fill opacity between 0 and 1. (default: 0.2) */
  fillOpacity?: number

  /**
   * Gradient treatment for the area fill.
   * - "none": Solid translucent area fill using `fillOpacity`. (default)
   * - "fade": Subtle vertical linear gradient fading from stroke color toward baseline.
   */
  gradientMode?: "none" | "fade"

  /** Accent color for locked crosshair and selection markers. (default: "var(--chart-selection)") */
  selectionColor?: string

  /** Whether to render subtle horizontal Cartesian grid reference lines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical numeric scale. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series identity legend. (default: false for single series) */
  showLegend?: boolean

  /** Whether clicking or pressing Enter/Space pins the currently inspected X datum. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Visual policy for missing observations: 'gap' leaves breaks, 'carry' forward-fills. (default: "gap") */
  missingValuePolicy?: "gap" | "carry"

  /** Animation mode: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Motion toggle or configuration object. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Custom formatter for Y-axis scale numbers and default tooltip metric values. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: PrismAreaActiveDatum<TData, XVal> | null) => void

  /** Optional heading announced to assistive technologies. */
  title?: string

  /** Optional descriptive summary announced to assistive technologies. */
  description?: string

  /** Optional CSS class name passed to root figure element. */
  className?: string

  /** Display neutral skeleton loading state. */
  loading?: boolean

  /** Display actionable error banner. */
  error?: Error | string | null

  /** Display metric unavailability notice. */
  unavailable?: boolean | string | null
}

/* -------------------------------------------------------------------------- */
/*  Validation & Normalization Helpers                                        */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Safely normalizes input observations:
 * - Missing values remain null (honest gaps).
 * - Non-finite values (NaN, Infinity) are normalized to null.
 * - Supports forward carry policy when requested.
 * - Immutability: caller data is never mutated.
 */
export function normalizePrismAreaData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  series: PrismAreaSeries<TData>,
  policy: "gap" | "carry" = "gap"
): NormalizedPrismAreaDatum<TData>[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let lastKnown: number | null = null

  return data.map((d, idx) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawVal = d[series.key]
    let numVal = isFiniteNumber(rawVal) ? rawVal : null

    if (policy === "carry") {
      if (numVal !== null) {
        lastKnown = numVal
      } else if (lastKnown !== null) {
        numVal = lastKnown
      }
    }

    return {
      __x: xVal,
      __index: idx,
      __raw: d,
      __value: numVal,
    }
  })
}

/**
 * Calculates a Cartesian Y-domain covering valid values AND the configured baseline.
 * Critical principle: If baseline is zero, domain MUST include zero to prevent false exaggeration.
 */
export function calculatePrismAreaDomain(
  normalized: readonly NormalizedPrismAreaDatum<any>[],
  baseline: number | "zero" | "domain-min" = "zero",
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

  for (const row of normalized) {
    if (row.__value !== null) {
      values.push(row.__value)
    }
  }

  if (values.length === 0) {
    if (typeof baseline === "number") {
      return [Math.min(0, baseline), Math.max(100, baseline)]
    }
    return [0, 100]
  }

  // Include baseline in automatic domain calculation
  if (baseline === "zero") {
    values.push(0)
  } else if (typeof baseline === "number") {
    values.push(baseline)
  }
  // If baseline === "domain-min", we do not artificially inject 0

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
/*  Tooltip & Legend Content                                                  */
/* -------------------------------------------------------------------------- */

interface PrismAreaTooltipContentProps {
  active?: boolean
  payload?: readonly any[]
  label?: React.ReactNode
  activeX: string | number | null
  activeDatum: PrismAreaActiveDatum | null
  series: PrismAreaSeries<any>
  color: string
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockableTooltip?: boolean
  isLocked?: boolean
  selectionColor?: string
  isCompact?: boolean
}

function PrismAreaTooltipContent({
  active,
  payload,
  label: _label,
  activeX,
  activeDatum,
  series,
  color,
  valueFormatter,
  xFormatter,
  lockableTooltip,
  isLocked = false,
  selectionColor = "var(--chart-selection, #f59e0b)",
  isCompact = false,
}: PrismAreaTooltipContentProps) {
  const payloadRow = payload?.[0]?.payload as NormalizedPrismAreaDatum | undefined
  const hasPayload = Boolean(payloadRow)

  if (!activeDatum && (!active || !hasPayload)) {
    return null
  }

  const rawX = activeDatum ? activeDatum.x : (payloadRow?.__x ?? activeX ?? "")
  const xDisplay = xFormatter ? xFormatter(rawX) : String(rawX)
  const lockedState = activeDatum ? activeDatum.isLocked : isLocked
  const defaultValueFmt = valueFormatter ?? ((n: number) => n.toLocaleString())
  const val = activeDatum ? activeDatum.value : (payloadRow ? payloadRow.__value : null)
  const isMissing = val === null || val === undefined
  const fmt = series.valueFormatter || defaultValueFmt

  const isCustomHex = typeof selectionColor === "string" && selectionColor.startsWith("#")

  return (
    <div
      className={cn(
        "plotcn-interactive-tooltip rounded-xl border bg-zinc-950/95 shadow-2xl backdrop-blur-md text-left transition-all duration-150 pointer-events-none select-none z-50",
        isCompact
          ? "min-w-[120px] max-w-[190px] p-2 text-[10px]"
          : "min-w-[180px] max-w-[270px] p-3.5 text-xs",
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
      {/* Header: X-Domain Coordinate + Optional Lock Badge */}
      <div
        className={cn(
          "tooltip-header flex items-center justify-between gap-2 border-b border-white/[0.08]",
          isCompact ? "pb-1 mb-1.5" : "pb-2 mb-2.5"
        )}
      >
        <span
          className={cn(
            "font-mono font-semibold text-zinc-200 tracking-wide truncate",
            isCompact ? "text-[10px]" : "text-xs"
          )}
        >
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

      {/* Magnitude Series Row */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex size-2 shrink-0 items-center justify-center">
            {lockedState && (
              <span
                className="absolute size-3.5 rounded-full opacity-30 animate-pulse"
                style={{ backgroundColor: color }}
              />
            )}
            <span
              className="size-2 rounded-full ring-1 ring-white/20 shadow-xs"
              style={{ backgroundColor: color }}
            />
          </span>
          <span className="text-zinc-300 font-sans truncate text-xs font-medium">
            {series.label}
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
          {isMissing ? "—" : fmt(val)}
        </span>
      </div>

      {/* Lock Interaction Hint */}
      {lockableTooltip && !isCompact && (
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
/*  Main PrismArea Component                                                  */
/* -------------------------------------------------------------------------- */

export function PrismArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  series,
  height = 320,
  curve = "monotone",
  domain = "auto",
  baseline = "zero",
  color = "var(--chart-1, #3b82f6)",
  fillColor,
  fillOpacity = 0.2,
  gradientMode = "none",
  selectionColor = "var(--chart-selection, #f59e0b)",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  lockableTooltip = true,
  defaultLockedIndex = null,
  missingValuePolicy = "gap",
  animation = "draw",
  motion = true,
  valueFormatter,
  xFormatter,
  onActiveDatumChange,
  title,
  description,
  className,
  loading = false,
  error = null,
  unavailable = false,
}: PrismAreaProps<TData, XVal>) {
  const reducedMotion = useChartReducedMotion()
  const rawUid = React.useId()
  const uid = rawUid.replace(/:/g, "")
  const titleId = `plotcn-prism-title-${uid}`
  const descId = `plotcn-prism-desc-${uid}`
  const gradientId = `plotcn-prism-grad-${uid}`

  // 1. Normalize dataset
  const normalizedData = React.useMemo(
    () => normalizePrismAreaData(data, xKey, series, missingValuePolicy),
    [data, xKey, series, missingValuePolicy]
  )

  // 2. Safe Y domain enclosing the baseline
  const safeDomain = React.useMemo(
    () => calculatePrismAreaDomain(normalizedData, baseline, domain),
    [normalizedData, baseline, domain]
  )

  // 3. Resolve baseline for Recharts Area baseValue
  const rechartsBaseValue = React.useMemo<number | "dataMin">(() => {
    if (baseline === "domain-min") return "dataMin"
    if (typeof baseline === "number" && Number.isFinite(baseline)) return baseline
    return 0
  }, [baseline])

  // 4. Color & Fill Resolution
  // Explicit fillColor > auto-fill derived from color
  const resolvedFillColor = fillColor && fillColor.trim() !== "" ? fillColor : color
  const clampedOpacity = Math.max(0, Math.min(1, typeof fillOpacity === "number" && Number.isFinite(fillOpacity) ? fillOpacity : 0.2))

  // 5. Inspection State: active hover vs locked persistent datum
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
    return null
  })

  const [isChartFocused, setIsChartFocused] = React.useState(false)

  // Clear locked index if data shrinks
  React.useEffect(() => {
    if (lockedIndex !== null && (lockedIndex >= normalizedData.length || normalizedData.length === 0)) {
      setLockedIndex(null)
    }
  }, [normalizedData.length, lockedIndex])

  const effectiveIndex = lockedIndex !== null ? lockedIndex : activeIndex

  // Construct active datum for consumers and tooltips
  const activeDatum = React.useMemo<PrismAreaActiveDatum<TData, XVal> | null>(() => {
    if (effectiveIndex === null || effectiveIndex < 0 || effectiveIndex >= normalizedData.length) {
      return null
    }
    const row = normalizedData[effectiveIndex]
    return {
      index: effectiveIndex,
      x: row.__x as XVal,
      raw: row.__raw,
      value: row.__value,
      isLocked: lockedIndex !== null && lockedIndex === effectiveIndex,
    }
  }, [effectiveIndex, lockedIndex, normalizedData])

  // Notify consumer callback
  React.useEffect(() => {
    if (onActiveDatumChange) {
      onActiveDatumChange(activeDatum)
    }
  }, [activeDatum, onActiveDatumChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard & Pointer Scrubbing Handlers                                     */
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

  const handleChartMouseMove = (state: any) => {
    if (!state || typeof state.activeTooltipIndex !== "number") return
    const idx = state.activeTooltipIndex
    if (idx < 0 || idx >= normalizedData.length) return

    if (lockedIndex === null) {
      if (activeIndex !== idx) {
        setActiveIndex(idx)
      }
    }
  }

  const handleChartMouseLeave = () => {
    if (lockedIndex === null) {
      setActiveIndex(null)
    }
  }

  const handleChartClick = (state: any) => {
    if (!lockableTooltip || normalizedData.length === 0) return
    const clickedIdx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : activeIndex
    if (clickedIdx === null || clickedIdx < 0 || clickedIdx >= normalizedData.length) return

    if (lockedIndex === clickedIdx) {
      setLockedIndex(null)
    } else {
      setLockedIndex(clickedIdx)
      setActiveIndex(clickedIdx)
    }
  }

  // Animation settings
  const isAnimated = motion !== false && !reducedMotion && animation !== "none"
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Factual screen reader summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No observations recorded."
    const totalObs = normalizedData.length
    const validCount = normalizedData.filter((d) => d.__value !== null).length
    const baselineText =
      baseline === "zero"
        ? "relative to zero"
        : baseline === "domain-min"
        ? "relative to domain minimum"
        : `relative to baseline ${baseline}`
    const activeInfo = activeDatum
      ? ` Currently ${activeDatum.isLocked ? "locked on" : "inspecting"} observation ${activeDatum.index + 1} of ${totalObs} at ${String(activeDatum.x)}, value: ${activeDatum.value !== null ? activeDatum.value : "unavailable"}.`
      : " Use Left and Right Arrow keys to inspect observations across the domain."
    return `Single-series magnitude area chart for ${series.label} with ${validCount} valid observations across ${totalObs} total points ${baselineText}.${activeInfo}`
  }, [normalizedData, baseline, series.label, activeDatum])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Error / Loading States                                       */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || "Prism area chart error state"}
        className={cn("plotcn-prism relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Unable to render area magnitude"
          description={typeof error === "string" ? error : error?.message || "An unexpected error occurred while loading series data."}
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Prism area chart loading state"}
        className={cn("plotcn-prism relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState
          title="Loading area magnitude…"
          description="Preparing time-series observations and baseline geometry"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Prism area chart unavailable state"}
        className={cn("plotcn-prism relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Area metrics unavailable"
          description={typeof unavailable === "string" ? unavailable : "Quantitative series data is currently unavailable."}
        />
      </figure>
    )
  }

  if (normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Prism area chart empty state"}
        className={cn("plotcn-prism relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations and a numeric metric key to display area magnitude."
        />
      </figure>
    )
  }

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
        "plotcn-prism relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
        touchAction: "pan-y",
      }}
    >
      {/* Screen Reader Semantic Announcement */}
      <div className="sr-only">
        <h3 id={titleId}>{title || `${series.label} Magnitude Area Chart`}</h3>
        <p id={descId}>{description ? `${description} ${factualSummary}` : factualSummary}</p>
      </div>

      {/* Chart Canvas Area */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden relative">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
        >
          <AreaChart
            data={normalizedData}
            margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
            onClick={handleChartClick}
          >
            {/* Optional Collision-Safe Gradient Defs */}
            {gradientMode === "fade" && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={resolvedFillColor} stopOpacity={clampedOpacity} />
                  <stop offset="100%" stopColor={resolvedFillColor} stopOpacity={Math.max(0, clampedOpacity * 0.15)} />
                </linearGradient>
              </defs>
            )}

            {/* Reference Grid */}
            {showGrid && (
              <CartesianGrid
                stroke="var(--chart-grid, rgba(255, 255, 255, 0.08))"
                strokeDasharray="3 3"
                vertical={false}
              />
            )}

            {/* Horizontal Category Scale */}
            <XAxis
              hide={!showXAxis}
              dataKey="__x"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
              tickFormatter={xFormatter as any}
              dy={6}
            />

            {/* Vertical Numeric Scale */}
            <YAxis
              hide={!showYAxis}
              domain={safeDomain as any}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
              tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              dx={-4}
            />

            {/* Persistent Vertical Inspection Crosshair */}
            {activeXCoordinate !== null && isCurrentlyLocked && (
              <ReferenceLine
                x={activeXCoordinate}
                stroke={selectionColor}
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
            )}

            {/* Synchronized Nearest-X Tooltip */}
            <Tooltip
              active={isCurrentlyLocked || (isChartFocused && activeIndex !== null) ? true : undefined}
              defaultIndex={typeof defaultLockedIndex === "number" ? defaultLockedIndex : undefined}
              content={
                <PrismAreaTooltipContent
                  activeX={activeXCoordinate}
                  activeDatum={activeDatum}
                  series={series}
                  color={color}
                  valueFormatter={valueFormatter}
                  xFormatter={xFormatter}
                  lockableTooltip={lockableTooltip}
                  isLocked={isCurrentlyLocked}
                  selectionColor={selectionColor}
                  isCompact={typeof height === "number" ? height <= 260 : false}
                />
              }
              cursor={{
                stroke: isCurrentlyLocked ? selectionColor : "var(--chart-crosshair, rgba(255, 255, 255, 0.28))",
                strokeDasharray: "3 3",
                strokeWidth: isCurrentlyLocked ? 1.5 : 1.2,
              }}
            />

            {/* Single Quantitative Magnitude Area */}
            <Area
              type={curve === "step" ? "stepAfter" : curve}
              dataKey="__value"
              name={series.label}
              baseValue={rechartsBaseValue}
              stroke={color}
              strokeWidth={2}
              fill={gradientMode === "fade" ? `url(#${gradientId})` : resolvedFillColor}
              fillOpacity={gradientMode === "fade" ? 1 : clampedOpacity}
              connectNulls={false}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              dot={(dotProps: any) => {
                const { cx, cy, index, payload } = dotProps
                if (typeof cx !== "number" || typeof cy !== "number" || payload.__value === null) {
                  return <React.Fragment key={`dot-${index}`} />
                }

                // Active / Locked marker
                if (index === effectiveIndex) {
                  if (index === lockedIndex) {
                    return (
                      <g key={`locked-marker-${index}`} className="pointer-events-none">
                        <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={2} />
                        <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                      </g>
                    )
                  }
                  return (
                    <circle
                      key={`active-marker-${index}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill={color}
                      stroke="var(--chart-background, #09090b)"
                      strokeWidth={2}
                      className="pointer-events-none"
                    />
                  )
                }

                return <React.Fragment key={`dot-${index}`} />
              }}
              activeDot={(activeProps: any) => {
                const { cx, cy, index, payload } = activeProps
                if (typeof cx !== "number" || typeof cy !== "number" || payload?.__value === null) {
                  return <React.Fragment key={`act-dot-${index}`} />
                }
                if (index === lockedIndex) {
                  return (
                    <g key={`locked-act-${index}`} className="pointer-events-none">
                      <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={2} />
                      <circle cx={cx} cy={cy} r={3.5} fill={color} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                    </g>
                  )
                }
                return (
                  <circle
                    key={`hover-dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={color}
                    stroke="var(--chart-background, #09090b)"
                    strokeWidth={2}
                    className="pointer-events-none"
                  />
                )
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Optional Series Identity Legend */}
      {showLegend && (
        <div
          role="group"
          aria-label="Chart series identity"
          className="flex items-center justify-center gap-2 pt-3 px-2 text-xs font-mono select-none"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-zinc-300 font-medium">
            {/* Structural Area Stroke & Fill Swatch Sample */}
            <svg width={18} height={12} className="shrink-0 overflow-visible rounded-xs" aria-hidden="true">
              <rect
                x={0}
                y={0}
                width={18}
                height={12}
                fill={resolvedFillColor}
                fillOpacity={clampedOpacity}
                rx={2}
              />
              <line
                x1={0}
                y1={0}
                x2={18}
                y2={0}
                stroke={color}
                strokeWidth={2}
              />
            </svg>
            <span className="truncate">{series.label}</span>
          </div>
        </div>
      )}

      {/* Structured Data Alternative for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || `${series.label} observation data table`}</caption>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              <th scope="col">{series.label}</th>
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((d, i) => (
              <tr key={i}>
                <td>{String(d.__x)}</td>
                <td>{d.__value !== null ? (series.valueFormatter ? series.valueFormatter(d.__value) : d.__value) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
