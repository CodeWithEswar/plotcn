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
  ReferenceLine as RechartsReferenceLine,
} from "recharts"
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

export type StepMode = "after" | "before" | "center"

export interface StepSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key?: keyof TData & string
  label?: string
  valueFormatter?: (value: number) => string
  color?: string
}

export interface StepReferenceLine {
  value: number
  label?: string
  color?: string
  strokeDasharray?: string
}

export interface StepSignalProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The array of structured observation records to visualize.
   * Accepts a readonly array and will not mutate caller data.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. date, month, or ordered category).
   */
  xKey: keyof TData & string

  /**
   * Direct key for the active numeric series level to plot.
   * Fallback to series.key if not provided.
   */
  seriesKey?: keyof TData & string

  /**
   * Optional semantic series descriptor combining key, label, formatter, and color.
   */
  series?: StepSeriesConfig<TData>

  /**
   * Human-readable label for the stepped signal (used in tooltips, legends, and screen readers).
   * Default: "Level" or series.label
   */
  label?: string

  /**
   * Primary stroke color for the stepped signal line. Accepts CSS variables or color values.
   * Default: "var(--chart-1, #10b981)"
   */
  color?: string

  /**
   * Semantic step transition mode determining when a new value takes effect:
   * - "after": New value takes effect at observation X and remains active onward (default, Recharts stepAfter).
   * - "before": Value jumps immediately prior to observation X (Recharts stepBefore).
   * - "center": Transition midpoint occurs between observations (Recharts step).
   * Default: "after"
   */
  stepMode?: StepMode

  /**
   * Container height in pixels or standard CSS dimension strings.
   * Default: 340
   */
  height?: number | string

  /**
   * Explicit Y-axis numeric domain, or "auto" calculation.
   * Default: "auto"
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Handling of null or undefined values in the series:
   * - "gap": Truthful break in the signal where state is unknown (default).
   * - "carry": Persists the last known valid level across unrecorded intervals.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "carry"

  /**
   * Formatter function for Y-axis ticks and tooltip values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Formatter function for X-axis tick labels.
   */
  xFormatter?: (value: string | number) => string

  /**
   * Whether to display subtle horizontal background reference gridlines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display the chart legend.
   * Default: false (single-series step signal focuses on clear title/series hierarchy)
   */
  showLegend?: boolean

  /**
   * Whether to display the horizontal category axis.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to display the vertical value axis.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to calculate and display transition delta (change from previous valid state) in the tooltip.
   * Default: false
   */
  showTransitionDelta?: boolean

  /**
   * Optional reference thresholds (e.g. quota limits, contractual ceilings).
   */
  referenceLines?: readonly StepReferenceLine[]

  /**
   * Enable or disable entry and update transitions.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title announced by screen readers.
   * Default: "Step Signal Chart"
   */
  title?: string

  /**
   * Optional long-form description for assistive technologies.
   */
  description?: string

  /**
   * Loading state indicator.
   */
  loading?: boolean

  /**
   * Error state indicator or Error instance.
   */
  error?: Error | string | null

  /**
   * Unavailable state indicator.
   */
  unavailable?: boolean | string

  /**
   * Callback invoked when the user clicks retry in the error state.
   */
  onRetry?: () => void

  /**
   * Custom content overrides for state placeholders.
   */
  emptyContent?: React.ReactNode
  errorContent?: React.ReactNode
  loadingContent?: React.ReactNode

  /**
   * Additional CSS classes applied to the root figure element.
   */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Data Safety & Domain Algorithms                                      */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

export interface NormalizedStepDatum {
  __x: string | number
  __value: number | null
  __previousValue: number | null
  __delta: number | null
  __isTransition: boolean
  __isCarried: boolean
  __raw: Record<string, unknown>
}

/**
 * Normalizes user observation records with strict step semantics:
 * 1. Missing values are handled according to policy:
 *    - "gap": null remains null (creates a clean break in the stepped signal).
 *    - "carry": persists the last known finite level forward.
 * 2. Detects exact change boundaries where current != previous valid state.
 * 3. Never mutates caller records or arrays.
 * 4. Filters or normalizes non-finite values (NaN, Infinity) safely to null.
 */
export function normalizeStepSignalData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesKey: string,
  missingValuePolicy: "gap" | "carry" = "gap"
): NormalizedStepDatum[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let lastKnownValid: number | null = null
  let previousValidState: number | null = null

  return data.map((d) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawV = d[seriesKey]
    const isDirectFinite = isFiniteNumber(rawV)

    let finalVal: number | null = null
    let isCarried = false

    if (isDirectFinite) {
      finalVal = rawV
      lastKnownValid = rawV
    } else if (missingValuePolicy === "carry" && lastKnownValid !== null) {
      finalVal = lastKnownValid
      isCarried = true
    } else {
      finalVal = null
      if (missingValuePolicy === "gap") {
        // In gap policy, an unknown value breaks continuity; previous state does not immediately precede next entry
        lastKnownValid = null
      }
    }

    let isTransition = false
    let delta: number | null = null
    const prev = previousValidState

    if (finalVal !== null) {
      if (prev !== null && prev !== finalVal && !isCarried) {
        isTransition = true
        delta = finalVal - prev
      }
      previousValidState = finalVal
    } else {
      previousValidState = null
    }

    return {
      __x: xVal,
      __value: finalVal,
      __previousValue: prev,
      __delta: delta,
      __isTransition: isTransition,
      __isCarried: isCarried,
      __raw: d,
    }
  })
}

/**
 * Calculates factual transition summary metrics for accessibility and telemetry:
 * - transitionCount: Count of distinct state changes (consecutive valid observations with unequal values).
 * - initialValue: First valid observation value.
 * - finalValue: Last valid observation value.
 */
export function calculateStepTransitions(
  normalized: readonly NormalizedStepDatum[]
): {
  transitionCount: number
  initialValue: number | null
  finalValue: number | null
} {
  const valid = normalized.filter((d) => d.__value !== null)
  if (valid.length === 0) {
    return { transitionCount: 0, initialValue: null, finalValue: null }
  }

  let transitions = 0
  for (let i = 1; i < valid.length; i++) {
    // Only count genuine state changes (unequal values where second point was not merely carried)
    if (valid[i].__value !== valid[i - 1].__value && !valid[i].__isCarried) {
      transitions++
    }
  }

  return {
    transitionCount: transitions,
    initialValue: valid[0].__value,
    finalValue: valid[valid.length - 1].__value,
  }
}

/**
 * Calculates a safe Cartesian Y-domain covering all valid levels and reference thresholds.
 * Safely expands constant levels (e.g. all 100) and handles zero/negative numbers without collapsing.
 */
export function calculateStepDomain(
  normalized: readonly NormalizedStepDatum[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto",
  referenceLines?: readonly StepReferenceLine[]
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
    if (item.__value !== null) values.push(item.__value)
  }

  if (referenceLines && referenceLines.length > 0) {
    for (const ref of referenceLines) {
      if (isFiniteNumber(ref.value)) values.push(ref.value)
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  // Single value or constant level: expand gracefully so the stepped line is visibly centered
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
/*  Synchronized Step Tooltip                                                 */
/* -------------------------------------------------------------------------- */

interface StepTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  label?: React.ReactNode
  primaryColor: string
  seriesLabel: string
  valueFormatter?: (value: number) => string
  showTransitionDelta?: boolean
}

function StepTooltipContent({
  active,
  payload,
  label: _label,
  primaryColor,
  seriesLabel,
  valueFormatter,
  showTransitionDelta = false,
}: StepTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  const datum = payload[0]?.payload as NormalizedStepDatum | undefined
  if (!datum) return null

  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
  const val = datum.__value
  const hasValue = val !== null
  const isCarried = datum.__isCarried
  const isTransition = datum.__isTransition
  const delta = datum.__delta
  const prev = datum.__previousValue

  return (
    <div className="z-50 min-w-[190px] rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-2.5 text-xs shadow-md backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
        <span>{datum.__x}</span>
        {isTransition && (
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
            Transition
          </span>
        )}
        {isCarried && (
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-white/10">
            Carried
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {/* Active State Level */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)]">
              {seriesLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)]">
            {hasValue ? fmt(val) : "—"}
          </span>
        </div>

        {/* Optional Transition Delta Context */}
        {showTransitionDelta && isTransition && delta !== null && prev !== null && (
          <div className="mt-2 border-t border-[var(--chart-tooltip-border)] pt-1.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-[var(--chart-tooltip-muted)]">
              <span>Prior State</span>
              <span className="font-mono">{fmt(prev)}</span>
            </div>
            <div className="flex items-center justify-between font-mono font-medium text-[var(--chart-tooltip-foreground)]">
              <span>Change</span>
              <span className="text-zinc-200">
                {delta > 0 ? `+${fmt(delta)}` : fmt(delta)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Custom Step Legend                                                        */
/* -------------------------------------------------------------------------- */

interface StepLegendContentProps {
  label: string
  primaryColor: string
}

function StepLegendContent({ label, primaryColor }: StepLegendContentProps) {
  return (
    <div className="flex items-center justify-center gap-6 pt-3 text-xs">
      <div className="flex items-center gap-2">
        <span
          className="h-1 w-4 rounded-xs"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="text-[var(--chart-foreground)] font-medium">{label}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component Implementation                                                  */
/* -------------------------------------------------------------------------- */

export function StepSignal<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  xKey,
  seriesKey: propSeriesKey,
  series,
  label: propLabel,
  color: propColor,
  stepMode = "after",
  height = 340,
  domain,
  missingValuePolicy = "gap",
  valueFormatter,
  xFormatter,
  showGrid = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showTransitionDelta = false,
  referenceLines = [],
  motion = true,
  title = "Step Signal Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry: _onRetry,
  emptyContent,
  errorContent,
  loadingContent,
  className,
}: StepSignalProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const containerId = React.useId().replace(/[:]/g, "")
  const titleId = `step-title-${containerId}`
  const descId = `step-desc-${containerId}`
  const summaryId = `step-summary-${containerId}`

  const [, setActiveIndex] = React.useState<number | null>(null)

  // Resolve series identity, label, and theme color
  const seriesKey = series?.key ?? propSeriesKey ?? ("limit" as keyof TData & string)
  const seriesLabel = series?.label ?? propLabel ?? "Level"
  const primaryColor = series?.color ?? propColor ?? "var(--chart-1, #10b981)"

  // Normalized safe observation data
  const normalizedData = React.useMemo(
    () => normalizeStepSignalData(data, xKey, seriesKey, missingValuePolicy),
    [data, xKey, seriesKey, missingValuePolicy]
  )

  // Factual transition summary for screen readers
  const transitionSummary = React.useMemo(
    () => calculateStepTransitions(normalizedData),
    [normalizedData]
  )

  // Safe calculated domain covering levels and reference thresholds
  const safeDomain = React.useMemo(
    () => calculateStepDomain(normalizedData, domain, referenceLines),
    [normalizedData, domain, referenceLines]
  )

  // Map public stepMode to Recharts curve type
  const rechartsCurveType = React.useMemo(() => {
    switch (stepMode) {
      case "before":
        return "stepBefore"
      case "center":
        return "step"
      case "after":
      default:
        return "stepAfter"
    }
  }, [stepMode])

  // Animation config
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Screen reader factual accessibility summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No step signal observations recorded."

    const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
    const initStr = transitionSummary.initialValue !== null ? fmt(transitionSummary.initialValue) : "none"
    const finalStr = transitionSummary.finalValue !== null ? fmt(transitionSummary.finalValue) : "none"

    return `Discrete step visualization depicting ${normalizedData.length} observations. Values remain constant between transitions and change at discrete boundaries. Initial level is ${initStr}, ending at ${finalStr}. Recorded ${transitionSummary.transitionCount} distinct state transitions.`
  }, [normalizedData, transitionSummary, valueFormatter])

  if (error) {
    if (errorContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {errorContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartErrorState
          title="Unable to load step signal"
          description={
            typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred while loading state transitions."
          }
        />
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartUnavailableState
          title="Step metrics unavailable"
          description={
            typeof unavailable === "string"
              ? unavailable
              : "State transition metrics are unavailable for this view."
          }
        />
      </div>
    )
  }

  if (loading) {
    if (loadingContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {loadingContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartLoadingState
          title="Loading step visualization…"
          description="Synchronizing discrete state levels"
        />
      </div>
    )
  }

  if (data.length === 0 || normalizedData.length === 0) {
    if (emptyContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {emptyContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartEmptyState
          title="No step signal data"
          description="Provide ordered observations to visualize discrete changes."
        />
      </div>
    )
  }

  // Keyboard navigation across observations
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (normalizedData.length === 0) return

    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? 0 : Math.min(normalizedData.length - 1, prev + 1)))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? normalizedData.length - 1 : Math.max(0, prev - 1)))
    } else if (e.key === "Home") {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setActiveIndex(normalizedData.length - 1)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setActiveIndex(null)
    }
  }

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : summaryId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setActiveIndex(null)}
      className={cn(
        "group relative flex flex-col w-full min-w-0 max-w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus)] rounded-xl transition-all overflow-hidden",
        className
      )}
      style={{ height }}
    >
      <figcaption className="sr-only">
        <h3 id={titleId}>{title}</h3>
        {description && <p id={descId}>{description}</p>}
        <p id={summaryId}>{factualSummary}</p>
      </figcaption>

      <ChartContainer className="w-full h-full min-w-0 max-w-full overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 340 }}
        >
          <LineChart
            data={normalizedData}
            margin={{ top: 14, right: 16, left: showYAxis ? -16 : 10, bottom: showXAxis ? 6 : 6 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />
            )}

            <XAxis
              hide={!showXAxis}
              dataKey="__x"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={xFormatter}
              dy={6}
            />

            <YAxis
              hide={!showYAxis}
              domain={safeDomain as any}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              dx={-4}
            />

            <Tooltip
              content={
                <StepTooltipContent
                  primaryColor={primaryColor}
                  seriesLabel={seriesLabel}
                  valueFormatter={valueFormatter}
                  showTransitionDelta={showTransitionDelta}
                />
              }
              cursor={{
                stroke: "var(--chart-crosshair)",
                strokeDasharray: "3 3",
                strokeWidth: 1.2,
              }}
            />

            {showLegend && (
              <Legend
                content={
                  <StepLegendContent
                    label={seriesLabel}
                    primaryColor={primaryColor}
                  />
                }
              />
            )}

            {/* Optional Reference Lines (e.g. quotas, contract bounds) */}
            {referenceLines.map((ref, idx) => (
              <RechartsReferenceLine
                key={`ref-${idx}-${ref.value}`}
                y={ref.value}
                stroke={ref.color ?? "var(--chart-reference, rgba(255, 255, 255, 0.25))"}
                strokeDasharray={ref.strokeDasharray ?? "4 4"}
                strokeWidth={1.2}
                label={
                  ref.label
                    ? {
                        value: ref.label,
                        position: "insideTopRight",
                        fill: "var(--chart-muted)",
                        fontSize: 10,
                        fontFamily: "monospace",
                      }
                    : undefined
                }
              />
            ))}

            {/* Stepped Signal Line: Strictly stepped curve, minimal dots */}
            <Line
              type={rechartsCurveType}
              dataKey="__value"
              name={seriesLabel}
              stroke={primaryColor}
              strokeWidth={2}
              strokeLinecap="square"
              strokeLinejoin="miter"
              dot={
                normalizedData.length === 1
                  ? { r: 4, fill: primaryColor, stroke: "var(--chart-background)", strokeWidth: 1.5 }
                  : false
              }
              activeDot={{
                r: 4.5,
                fill: primaryColor,
                stroke: "var(--chart-background)",
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </figure>
  )
}
