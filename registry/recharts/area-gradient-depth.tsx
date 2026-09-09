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

export type GradientDepthMode = "surface" | "none"

/**
 * Series definition for Gradient Depth Area (single quantitative magnitude series).
 */
export interface GradientDepthAreaSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key for quantitative magnitude values */
  key: NumericKeyOf<TData>

  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string

  /** Optional custom numeric formatter for metric values */
  valueFormatter?: (value: number) => string
}

export interface GradientDepthAreaActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  value: number | null
  isLocked: boolean
}

export interface GradientDepthAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for horizontal domain coordinate (e.g. date, month, hour). */
  xKey: keyof TData & string

  /** Semantic series descriptor defining metric key and label. */
  series: GradientDepthAreaSeries<TData>

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation. */
  domain?: [number, number] | "auto"

  /**
   * Baseline reference toward which the area fills.
   * - "zero": Fills toward 0 (conventional for non-negative magnitude). Automatic domain includes 0. (default)
   * - "domain-min": Fills toward the minimum value of the visible domain.
   * - number: Fills toward a specific numeric reference (e.g. 100). Automatic domain includes the baseline.
   */
  baseline?: number | "zero" | "domain-min"

  /** Primary series color applied to stroke, active marker, and gradient stops. (default: "var(--chart-1)") */
  color?: string

  /** Active selection / crosshair highlight color. (default: "var(--chart-selection)") */
  selectionColor?: string

  /**
   * Gradient depth mode:
   * - "surface": Controlled semantic fade from series identity toward chart surface (default)
   * - "none": Flat semantic area fill
   */
  gradientMode?: GradientDepthMode

  /**
   * Maximum/leading fill opacity at the signal boundary. (default: 0.32)
   * Subordinate gradient stops derive proportionally.
   */
  fillOpacity?: number

  /** Whether to render subtle horizontal grid reference lines. (default: true) */
  showGrid?: boolean

  /** Whether to render horizontal domain tick labels. (default: true) */
  showXAxis?: boolean

  /** Whether to render vertical metric scale ticks. (default: true) */
  showYAxis?: boolean

  /** Whether to render series identity legend. (default: false) */
  showLegend?: boolean

  /** Enables persistent tooltip pinning on click, tap, or Enter/Space. (default: true) */
  lockableTooltip?: boolean

  /** Missing value policy: "gap" (default) or "connect". */
  missingValuePolicy?: "gap" | "connect"

  /** Motion configuration: true for default animation, false to disable, or object with duration. (default: true) */
  motion?: boolean | { duration?: number }

  /** Optional custom value formatter for tooltips and Y-axis */
  valueFormatter?: (value: number) => string

  /** Optional custom domain/x formatter for tooltips and X-axis */
  xFormatter?: (value: string | number) => string

  /** Accessible title for screen readers and container. */
  title?: string

  /** Accessible description for screen readers and container. */
  description?: string

  /** Loading state indicator. */
  loading?: boolean

  /** Error state or error message. */
  error?: Error | string | null

  /** Metric unavailable notice. */
  unavailable?: boolean | string

  /** Callback fired when retry button is pressed in error state. */
  onRetry?: () => void

  /** Additional CSS class names. */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Math, Domain & Data Sanitization                                     */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Calculates a truthful Y domain considering series observations and baseline reference.
 */
export function calculateGradientDepthDomain(
  data: readonly Record<string, unknown>[],
  seriesKey: string,
  baseline: number | "zero" | "domain-min" = "zero",
  explicitDomain?: [number, number] | "auto"
): [number, number] {
  if (explicitDomain && explicitDomain !== "auto") {
    return explicitDomain
  }

  const values: number[] = []
  for (const row of data) {
    const val = row[seriesKey]
    if (isFiniteNumber(val)) {
      values.push(val)
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  let min = Math.min(...values)
  let max = Math.max(...values)

  // Enforce baseline in domain
  if (baseline === "zero") {
    min = Math.min(min, 0)
    max = Math.max(max, 0)
  } else if (typeof baseline === "number" && Number.isFinite(baseline)) {
    min = Math.min(min, baseline)
    max = Math.max(max, baseline)
  }

  // Handle single-value scale safely
  if (min === max) {
    if (min === 0) return [-1, 1]
    if (min > 0) return [0, Math.ceil(min * 1.25)]
    return [Math.floor(min * 1.25), 0]
  }

  const span = max - min
  const pad = span * 0.08
  const safeMin = min >= 0 && baseline === "zero" ? 0 : Math.floor(min - pad)
  const safeMax = Math.ceil(max + pad)

  return [safeMin, safeMax]
}

/**
 * Calculates deterministic gradient stop opacities based on fillOpacity and gradientMode.
 */
export function calculateGradientStops(
  fillOpacity: number = 0.32,
  gradientMode: GradientDepthMode = "surface"
): { clampedOpacity: number; middleOpacity: number; bottomOpacity: number } {
  const rawOpacity = typeof fillOpacity === "number" && Number.isFinite(fillOpacity) ? fillOpacity : 0.32
  const clamped = Math.max(0, Math.min(1, rawOpacity))

  if (gradientMode === "none") {
    return {
      clampedOpacity: clamped,
      middleOpacity: clamped,
      bottomOpacity: clamped,
    }
  }

  return {
    clampedOpacity: clamped,
    middleOpacity: Number((clamped * 0.42).toFixed(3)),
    bottomOpacity: Math.min(0.02, Number((clamped * 0.05).toFixed(3))),
  }
}

/**
 * Normalizes dataset into sanitized records without mutating caller objects.
 * Missing/non-finite observations are converted to null for truthful gap rendering.
 */
export function normalizeGradientDepthData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: string,
  seriesKey: string
): Record<string, unknown>[] {
  return data.map((item, idx) => {
    const rawVal = item[seriesKey]
    const xVal = item[xKey] ?? `Point ${idx + 1}`

    return {
      ...item,
      [xKey]: xVal,
      [seriesKey]: isFiniteNumber(rawVal) ? rawVal : null,
    }
  })
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Tooltip Component                                            */
/* -------------------------------------------------------------------------- */

interface GradientDepthAreaTooltipContentProps {
  seriesKey: string
  seriesLabel: string
  color: string
  valueFormatter: (value: number) => string
  isCompact?: boolean
  isLocked?: boolean
  onUnlock?: () => void
  activeDatum?: {
    x: string | number
    value: number | null
  } | null
  payload?: any[]
  label?: string | number
}

function GradientDepthAreaTooltipContent({
  seriesKey,
  seriesLabel,
  color,
  valueFormatter,
  isCompact = false,
  isLocked = false,
  onUnlock,
  activeDatum,
  payload,
  label,
}: GradientDepthAreaTooltipContentProps) {
  const currentDatum = React.useMemo(() => {
    if (activeDatum) return activeDatum
    if (payload && payload.length > 0) {
      const p = payload[0]
      const row = p.payload || {}
      return {
        x: label ?? row.x ?? "",
        value: isFiniteNumber(row[seriesKey]) ? row[seriesKey] : null,
      }
    }
    return null
  }, [activeDatum, payload, label, seriesKey])

  if (!currentDatum) return null

  const hasValue = isFiniteNumber(currentDatum.value)

  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-zinc-950/95 p-2.5 shadow-xl backdrop-blur-md transition-all duration-100",
        isCompact ? "min-w-[130px] p-2 text-[10px]" : "min-w-[160px] text-xs"
      )}
      style={{
        boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header with Coordinate and Lock status */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2 font-mono">
        <span className="font-semibold text-zinc-300 truncate">
          {String(currentDatum.x)}
        </span>
        {isLocked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onUnlock?.()
            }}
            className="flex items-center gap-1 rounded bg-zinc-800/80 px-1 py-0.5 text-[9px] text-zinc-400 hover:text-white transition-colors"
            title="Press Escape or click to unlock inspection"
          >
            <HugeiconsIcon icon={LockKeyIcon} size={10} className="text-amber-400" />
            <span>PINNED</span>
          </button>
        )}
      </div>

      {/* Series Row */}
      <div className="flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2 truncate">
          <span
            className="size-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-zinc-400 truncate">{seriesLabel}</span>
        </div>
        <span className={cn("font-bold shrink-0", hasValue ? "text-white" : "text-zinc-500 italic")}>
          {hasValue ? valueFormatter(currentDatum.value!) : "Unavailable"}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: GradientDepthArea                                         */
/* -------------------------------------------------------------------------- */

export function GradientDepthArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data = [],
  xKey,
  series,
  height = 320,
  curve = "monotone",
  domain = "auto",
  baseline = "zero",
  color = "var(--chart-1, #3b82f6)",
  selectionColor = "var(--chart-selection, #38bdf8)",
  gradientMode = "surface",
  fillOpacity = 0.32,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  lockableTooltip = true,
  missingValuePolicy = "gap",
  motion = true,
  valueFormatter = (val: number) => val.toLocaleString(),
  xFormatter,
  title,
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry,
  className,
}: GradientDepthAreaProps<TData, XVal>) {
  const isReducedMotion = useChartReducedMotion()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // State: locked observation index
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  // Unique deterministic SVG gradient ID (SSR and hydration safe)
  const rawId = React.useId()
  const gradientId = React.useMemo(() => {
    return `plotcn-gradient-depth-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
  }, [rawId])

  // Normalized data & safe Y domain
  const normalizedData = React.useMemo(() => {
    if (!data || data.length === 0 || !series?.key) return []
    return normalizeGradientDepthData(data, xKey, series.key)
  }, [data, xKey, series?.key])

  const safeDomain = React.useMemo(() => {
    return calculateGradientDepthDomain(normalizedData, series?.key || "", baseline, domain)
  }, [normalizedData, series?.key, baseline, domain])

  // Compute Recharts baseValue
  const rechartsBaseValue = React.useMemo(() => {
    if (baseline === "domain-min") return "dataMin"
    if (typeof baseline === "number" && Number.isFinite(baseline)) return baseline
    return 0
  }, [baseline])

  // Resolve fill opacity stops
  const { clampedOpacity, middleOpacity, bottomOpacity } = React.useMemo(() => {
    return calculateGradientStops(fillOpacity, gradientMode)
  }, [fillOpacity, gradientMode])

  // Active observation data
  const activeRowIndex = lockedIndex ?? hoverIndex
  const activeRow = activeRowIndex !== null && normalizedData[activeRowIndex] ? normalizedData[activeRowIndex] : null

  const activeDatum = React.useMemo(() => {
    if (!activeRow) return null
    const x = activeRow[xKey] as XVal
    const val = activeRow[series.key]
    return {
      x,
      value: isFiniteNumber(val) ? val : null,
    }
  }, [activeRow, xKey, series?.key])

  // Container height measurements for compact mode
  const isCompact = typeof height === "number" && height <= 260

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!normalizedData || normalizedData.length === 0) return

      if (e.key === "Escape") {
        e.preventDefault()
        setLockedIndex(null)
        return
      }

      if (e.key === "Enter" || e.key === " ") {
        if (!lockableTooltip) return
        e.preventDefault()
        if (lockedIndex !== null) {
          setLockedIndex(null)
        } else if (hoverIndex !== null) {
          setLockedIndex(hoverIndex)
        } else {
          setLockedIndex(0)
        }
        return
      }

      const currentIndex = lockedIndex ?? hoverIndex ?? 0
      let nextIndex = currentIndex

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        nextIndex = Math.max(0, currentIndex - 1)
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        nextIndex = Math.min(normalizedData.length - 1, currentIndex + 1)
      } else if (e.key === "Home") {
        e.preventDefault()
        nextIndex = 0
      } else if (e.key === "End") {
        e.preventDefault()
        nextIndex = normalizedData.length - 1
      } else {
        return
      }

      if (lockedIndex !== null) {
        setLockedIndex(nextIndex)
      } else {
        setHoverIndex(nextIndex)
      }
    },
    [normalizedData, lockedIndex, hoverIndex, lockableTooltip]
  )

  // Chart mouse / touch handlers
  const handleMouseMove = React.useCallback((state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      setHoverIndex(state.activeTooltipIndex)
    }
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setHoverIndex(null)
  }, [])

  const handleChartClick = React.useCallback(
    (state: any) => {
      if (!lockableTooltip) return
      if (state && state.activeTooltipIndex !== undefined) {
        const idx = state.activeTooltipIndex
        setLockedIndex((prev) => (prev === idx ? null : idx))
      }
    },
    [lockableTooltip]
  )

  /* --- Truthful State Fallbacks --- */
  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Gradient depth area loading"}
        className={cn("plotcn-gradient-depth-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState description="Loading gradient depth visualization..." />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Gradient depth area unavailable"}
        className={cn("plotcn-gradient-depth-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState description={typeof unavailable === "string" ? unavailable : "Metric observations are currently unavailable."} />
      </figure>
    )
  }

  if (error) {
    const errorDescription = error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred."
    return (
      <figure
        role="region"
        aria-label={title || "Gradient depth area error"}
        className={cn("plotcn-gradient-depth-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Gradient Depth Area Configuration Error"
          description={errorDescription}
          onRetry={onRetry}
        />
      </figure>
    )
  }

  if (!normalizedData || normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Gradient depth area empty"}
        className={cn("plotcn-gradient-depth-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState description="No observations available for gradient depth rendering." />
      </figure>
    )
  }

  const chartMargins = isCompact
    ? { top: 8, right: 10, left: -22, bottom: 0 }
    : { top: 12, right: 16, left: -16, bottom: 0 }

  return (
    <figure
      ref={containerRef}
      role="region"
      aria-label={title || `${series.label} gradient depth area chart`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "plotcn-gradient-depth-area group relative flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)]",
        className
      )}
      style={{ height, minHeight: typeof height === "number" ? height : 320 }}
    >
      {/* Screen Reader Live Announcements */}
      <div className="sr-only" aria-live="polite">
        {activeDatum
          ? `Selected observation ${String(activeDatum.x)}, ${series.label}: ${
              isFiniteNumber(activeDatum.value) ? valueFormatter(activeDatum.value) : "Unavailable"
            }${lockedIndex !== null ? " (Pinned)" : ""}`
          : `${title || series.label}. Chart contains ${normalizedData.length} observations.`}
      </div>

      {/* Optional Header / Legend */}
      {showLegend && (
        <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-4 rounded-xs shrink-0"
              style={{
                backgroundColor: color,
                opacity: clampedOpacity,
                borderTop: `2px solid ${color}`,
              }}
            />
            <span className="text-zinc-200 font-semibold">{series.label}</span>
          </div>
          <span className="text-[10px] text-zinc-500">
            {gradientMode === "surface" ? "Semantic Surface Fade" : "Flat Fill"}
          </span>
        </div>
      )}

      {/* Main Chart Canvas */}
      <div className="relative flex-1 w-full min-h-0">
        <ChartContainer className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart
              data={normalizedData}
              margin={chartMargins}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleChartClick}
            >
              {/* SVG Semantic Linear Gradient Definition */}
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={clampedOpacity} />
                  <stop offset="55%" stopColor={color} stopOpacity={middleOpacity} />
                  <stop offset="100%" stopColor={color} stopOpacity={bottomOpacity} />
                </linearGradient>
              </defs>

              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--chart-grid, rgba(255,255,255,0.06))"
                  vertical={false}
                  strokeOpacity={0.7}
                />
              )}

              {showXAxis && (
                <XAxis
                  dataKey={xKey as any}
                  stroke="var(--chart-axis, rgba(255,255,255,0.12))"
                  tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: isCompact ? 10 : 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-axis-line, rgba(255,255,255,0.12))", strokeOpacity: 0.5 }}
                  tickFormatter={xFormatter}
                />
              )}

              {showYAxis && (
                <YAxis
                  domain={safeDomain as any}
                  stroke="var(--chart-axis, rgba(255,255,255,0.12))"
                  tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: isCompact ? 10 : 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={valueFormatter}
                  width={isCompact ? 40 : 50}
                />
              )}

              <Tooltip
                isAnimationActive={false}
                cursor={{
                  stroke: lockedIndex !== null ? selectionColor : "var(--chart-crosshair, rgba(255,255,255,0.28))",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
                content={
                  <GradientDepthAreaTooltipContent
                    seriesKey={series.key}
                    seriesLabel={series.label}
                    color={color}
                    valueFormatter={valueFormatter}
                    isCompact={isCompact}
                    isLocked={lockedIndex !== null}
                    onUnlock={() => setLockedIndex(null)}
                  />
                }
              />

              {/* Locked crosshair reference line */}
              {lockedIndex !== null && activeRow && (
                <ReferenceLine
                  x={activeRow[xKey] as any}
                  stroke={selectionColor}
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                />
              )}

              {/* Single Quantitative Magnitude Area with Semantic Gradient Fill */}
              <Area
                type={curve}
                dataKey={series.key as any}
                name={series.label}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                fillOpacity={1}
                baseValue={rechartsBaseValue}
                connectNulls={missingValuePolicy === "connect"}
                isAnimationActive={motion !== false && !isReducedMotion}
                animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 350}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: color,
                  stroke: "var(--background, #09090b)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Structured HTML Data Alternative for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || `${series.label} gradient depth area observation data`}</caption>
          <thead>
            <tr>
              <th scope="col">Coordinate ({xKey})</th>
              <th scope="col">{series.label}</th>
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((row, idx) => {
              const xVal = String(row[xKey] ?? idx)
              const numVal = row[series.key]
              return (
                <tr key={idx}>
                  <td>{xVal}</td>
                  <td>{isFiniteNumber(numVal) ? valueFormatter(numVal) : "Unavailable"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
