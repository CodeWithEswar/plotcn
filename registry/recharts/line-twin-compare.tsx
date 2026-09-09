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
  type TooltipProps,
} from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartLegend } from "../shared/chart-legend"
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

export type CurveType = "monotone" | "linear" | "step" | "natural"
export type DeltaType = "absolute" | "percentage" | "both"

export interface TwinlineSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof TData & string
  label?: string
  color?: string
}

export interface TwinlineCompareProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The array of data observations to visualize.
   * Accepts a readonly array and will not mutate caller data.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. date, month, or ordered category).
   */
  xKey: keyof TData & string

  /**
   * Key for the primary (dominant / current period) series.
   */
  primaryKey: keyof TData & string

  /**
   * Key for the reference (benchmark / previous period) series.
   */
  referenceKey: keyof TData & string

  /**
   * Human-readable label for the primary series.
   * Default: "Primary"
   */
  primaryLabel?: string

  /**
   * Human-readable label for the reference series.
   * Default: "Reference"
   */
  referenceLabel?: string

  /**
   * CSS color or token for the primary series.
   * Default: "var(--chart-1)"
   */
  primaryColor?: string

  /**
   * CSS color or token for the reference series.
   * Default: "var(--chart-2)"
   */
  referenceColor?: string

  /**
   * Curve interpolation algorithm.
   * Default: "monotone"
   */
  curve?: CurveType

  /**
   * Height of the chart container in pixels or standard CSS string.
   * Default: 340
   */
  height?: number | string

  /**
   * How delta is computed and displayed in the synchronized tooltip.
   * "absolute" | "percentage" | "both"
   * Default: "both"
   */
  deltaType?: DeltaType

  /**
   * Whether to invert delta semantics (e.g. for latency/errors where higher is worse).
   * When inverted, negative delta is green/positive and positive delta is red/negative.
   * Default: false
   */
  invertDelta?: boolean

  /**
   * Custom formatter for metric values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Custom formatter for horizontal axis labels.
   */
  xFormatter?: (value: any) => string

  /**
   * Explicit numeric domain for the shared Y-axis [min, max].
   * If omitted, safe domain spanning both series is calculated automatically.
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Handling of missing / null / undefined values.
   * "gap" leaves a visual gap; "connect" bridges adjacent points.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "connect"

  /**
   * Whether to display Cartesian background grid lines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to render the series legend.
   * Default: true
   */
  showLegend?: boolean

  /**
   * Whether to show horizontal category axis.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to show vertical value axis.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to render delta context in the synchronized hover tooltip.
   * Default: true
   */
  showDeltaInTooltip?: boolean

  /**
   * Enable or disable entry and update transitions.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title announced by screen readers.
   * Default: "Twinline Comparison Chart"
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

function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Calculates a single honest shared Y-domain spanning BOTH series.
 * Prevents zero-height scales and enforces identical units and scaling.
 */
function calculateSharedDomain(
  data: readonly Record<string, unknown>[],
  primaryKey: string,
  referenceKey: string,
  explicitDomain?: [number, number] | ["auto", "auto"]
): [number, number] | ["auto", "auto"] {
  if (explicitDomain) {
    return explicitDomain
  }

  const validValues: number[] = []
  for (const item of data) {
    const p = item[primaryKey]
    const r = item[referenceKey]
    if (isFiniteNumber(p)) validValues.push(p)
    if (isFiniteNumber(r)) validValues.push(r)
  }

  if (validValues.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)

  if (min === max) {
    if (min === 0) return [-1, 1]
    if (min > 0) return [Math.floor(min * 0.9), Math.ceil(min * 1.1)]
    return [Math.floor(min * 1.1), Math.ceil(min * 0.9)]
  }

  const span = max - min
  const pad = span * 0.06
  const safeMin = min >= 0 ? Math.max(0, Math.floor(min - pad)) : Math.floor(min - pad)
  const safeMax = Math.ceil(max + pad)

  return [safeMin, safeMax]
}

/**
 * Normalizes dataset without mutating caller data:
 * - Drops invalid non-finite numbers
 * - Converts missing points to null for truthful gap rendering
 */
function normalizeTwinlineData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: string,
  primaryKey: string,
  referenceKey: string
): Record<string, unknown>[] {
  const normalized: Record<string, unknown>[] = []

  for (let i = 0; i < data.length; i++) {
    const raw = data[i]
    const rawPrimary = raw[primaryKey]
    const rawReference = raw[referenceKey]
    const xVal = raw[xKey] ?? `Point ${i + 1}`

    const cleanPrimary = isFiniteNumber(rawPrimary) ? rawPrimary : null
    const cleanReference = isFiniteNumber(rawReference) ? rawReference : null

    normalized.push({
      ...raw,
      [xKey]: xVal,
      [primaryKey]: cleanPrimary,
      [referenceKey]: cleanReference,
    })
  }

  return normalized
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Comparison Tooltip Component                                 */
/* -------------------------------------------------------------------------- */

interface ComparisonTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; [key: string]: any }[]
  label?: React.ReactNode
  primaryKey: string
  referenceKey: string
  primaryLabel: string
  referenceLabel: string
  primaryColor: string
  referenceColor: string
  valueFormatter?: (value: number) => string
  deltaType: DeltaType
  invertDelta?: boolean
  showDelta?: boolean
  isCompact?: boolean
}

function ComparisonTooltipContent({
  active,
  payload,
  label,
  primaryKey,
  referenceKey,
  primaryLabel,
  referenceLabel,
  primaryColor,
  referenceColor,
  valueFormatter,
  deltaType,
  invertDelta = false,
  showDelta = true,
  isCompact = false,
}: ComparisonTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const primaryItem = payload.find((p) => p.dataKey === primaryKey)
  const referenceItem = payload.find((p) => p.dataKey === referenceKey)

  const primaryVal = primaryItem?.value
  const referenceVal = referenceItem?.value

  const hasPrimary = isFiniteNumber(primaryVal)
  const hasReference = isFiniteNumber(referenceVal)

  const fmt = valueFormatter ?? ((v: number) => v.toLocaleString())

  // Delta calculation
  let absoluteDelta: number | null = null
  let percentageDelta: number | null = null
  let deltaState: "positive" | "negative" | "neutral" | "unavailable" = "unavailable"

  if (hasPrimary && hasReference) {
    absoluteDelta = primaryVal - referenceVal
    if (referenceVal !== 0) {
      percentageDelta = ((primaryVal - referenceVal) / Math.abs(referenceVal)) * 100
    }

    if (absoluteDelta > 0) {
      deltaState = invertDelta ? "negative" : "positive"
    } else if (absoluteDelta < 0) {
      deltaState = invertDelta ? "positive" : "negative"
    } else {
      deltaState = "neutral"
    }
  }

  const formatDeltaString = () => {
    if (absoluteDelta === null) return "Unavailable"

    const sign = absoluteDelta > 0 ? "+" : absoluteDelta < 0 ? "−" : ""
    const absAbs = Math.abs(absoluteDelta)

    if (deltaType === "absolute") {
      return `${sign}${fmt(absAbs)}`
    }
    if (deltaType === "percentage") {
      if (percentageDelta === null) return `${sign}${fmt(absAbs)}`
      const pctSign = percentageDelta > 0 ? "+" : percentageDelta < 0 ? "−" : ""
      return `${pctSign}${Math.abs(percentageDelta).toFixed(1)}%`
    }
    // "both"
    if (percentageDelta !== null) {
      const pctSign = percentageDelta > 0 ? "+" : percentageDelta < 0 ? "−" : ""
      return `${sign}${fmt(absAbs)} (${pctSign}${Math.abs(percentageDelta).toFixed(1)}%)`
    }
    return `${sign}${fmt(absAbs)}`
  }

  return (
    <div
      className={cn(
        "plotcn-interactive-tooltip z-50 rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] shadow-md backdrop-blur-md select-none",
        isCompact
          ? "min-w-[120px] max-w-[180px] p-1.5 text-[10px]"
          : "min-w-[200px] max-w-[280px] p-2.5 text-xs"
      )}
    >
      <div
        className={cn(
          "tooltip-header font-mono font-medium text-[var(--chart-tooltip-muted)] truncate",
          isCompact ? "mb-1 text-[10px]" : "mb-2 text-[11px]"
        )}
      >
        {label}
      </div>

      <div className={isCompact ? "space-y-1" : "space-y-1.5"}>
        {/* Primary Row */}
        <div className={cn("tooltip-row flex items-center justify-between", isCompact ? "gap-1.5" : "gap-3")}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn("rounded-full shrink-0", isCompact ? "h-1.5 w-1.5" : "h-2 w-2")}
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)] truncate">
              {primaryLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)] shrink-0">
            {hasPrimary ? fmt(primaryVal) : "—"}
          </span>
        </div>

        {/* Reference Row */}
        <div className={cn("tooltip-row flex items-center justify-between", isCompact ? "gap-1.5" : "gap-3")}>
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn("rounded-full shrink-0", isCompact ? "h-1.5 w-1.5" : "h-2 w-2")}
              style={{ backgroundColor: referenceColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)] truncate">
              {referenceLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)] shrink-0">
            {hasReference ? fmt(referenceVal) : "—"}
          </span>
        </div>

        {/* Delta Row */}
        {showDelta && (
          <div className="mt-2 flex items-center justify-between border-t border-[var(--chart-tooltip-border)] pt-1.5 text-[11px]">
            <span className="text-[var(--chart-tooltip-muted)]">Delta</span>
            <span
              className={cn(
                "font-mono font-medium",
                deltaState === "positive" && "text-emerald-500 dark:text-emerald-400",
                deltaState === "negative" && "text-rose-500 dark:text-rose-400",
                deltaState === "neutral" && "text-[var(--chart-tooltip-muted)]",
                deltaState === "unavailable" && "text-[var(--chart-tooltip-muted)] italic"
              )}
            >
              {formatDeltaString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component Implementation                                                  */
/* -------------------------------------------------------------------------- */

export function TwinlineCompare<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  xKey,
  primaryKey,
  referenceKey,
  primaryLabel = "Primary",
  referenceLabel = "Reference",
  primaryColor = "var(--chart-1)",
  referenceColor = "var(--chart-2)",
  curve = "monotone",
  height = 340,
  deltaType = "both",
  invertDelta = false,
  valueFormatter,
  xFormatter,
  domain,
  missingValuePolicy = "gap",
  showGrid = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showDeltaInTooltip = true,
  motion = true,
  title = "Twinline Comparison Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry,
  emptyContent,
  errorContent,
  loadingContent,
  className,
}: TwinlineCompareProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const containerId = React.useId().replace(/[:]/g, "")
  const titleId = `twinline-title-${containerId}`
  const descId = `twinline-desc-${containerId}`
  const summaryId = `twinline-summary-${containerId}`

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  // Normalized safe data and shared honest domain
  const safeData = normalizeTwinlineData(data, xKey, primaryKey, referenceKey)
  const safeDomain = calculateSharedDomain(safeData, primaryKey, referenceKey, domain)

  // Motion config
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Factual quantitative screen-reader summary (Strictly truthful, no marketing adjectives)
  const factualSummary = React.useMemo(() => {
    if (safeData.length === 0) return "No comparison data observations recorded."

    const primaryValues = safeData
      .map((d) => d[primaryKey])
      .filter((v): v is number => isFiniteNumber(v))

    const referenceValues = safeData
      .map((d) => d[referenceKey])
      .filter((v): v is number => isFiniteNumber(v))

    if (primaryValues.length === 0 && referenceValues.length === 0) {
      return "No valid numeric observations recorded for comparison."
    }

    const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())

    const pMin = primaryValues.length > 0 ? fmt(Math.min(...primaryValues)) : "none"
    const pMax = primaryValues.length > 0 ? fmt(Math.max(...primaryValues)) : "none"
    const pEnd = primaryValues.length > 0 ? fmt(primaryValues[primaryValues.length - 1]) : "none"

    const rMin = referenceValues.length > 0 ? fmt(Math.min(...referenceValues)) : "none"
    const rMax = referenceValues.length > 0 ? fmt(Math.max(...referenceValues)) : "none"
    const rEnd = referenceValues.length > 0 ? fmt(referenceValues[referenceValues.length - 1]) : "none"

    return `Comparative time-series visualizing ${safeData.length} observations. ${primaryLabel} spans from ${pMin} to ${pMax} ending at ${pEnd}. ${referenceLabel} spans from ${rMin} to ${rMax} ending at ${rEnd}. Both series share a single uniform vertical scale.`
  }, [safeData, primaryKey, referenceKey, primaryLabel, referenceLabel, valueFormatter])

  if (error) {
    if (errorContent) return <div className={cn("w-full", className)} style={{ height }}>{errorContent}</div>
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ChartErrorState
          title="Unable to load comparative data"
          description={typeof error === "string" ? error : error.message}
          onRetry={onRetry}
        />
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ChartUnavailableState
          title="Comparison unavailable"
          description={typeof unavailable === "string" ? unavailable : "Metrics are unavailable for this selection."}
        />
      </div>
    )
  }

  if (loading) {
    if (loadingContent) return <div className={cn("w-full", className)} style={{ height }}>{loadingContent}</div>
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ChartLoadingState
          title="Loading comparative visualization…"
          description="Synchronizing primary and reference datasets"
        />
      </div>
    )
  }

  if (data.length === 0) {
    if (emptyContent) return <div className={cn("w-full", className)} style={{ height }}>{emptyContent}</div>
    return (
      <div className={cn("w-full", className)} style={{ height }}>
        <ChartEmptyState
          title="No comparative observations"
          description="Observations will appear when both series are recorded."
        />
      </div>
    )
  }

  // Keyboard navigation across observations
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (safeData.length === 0) return

    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? 0 : Math.min(safeData.length - 1, prev + 1)))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? safeData.length - 1 : Math.max(0, prev - 1)))
    } else if (e.key === "Home") {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setActiveIndex(safeData.length - 1)
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
            data={safeData}
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
              dataKey={xKey as any}
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
                <ComparisonTooltipContent
                  primaryKey={primaryKey}
                  referenceKey={referenceKey}
                  primaryLabel={primaryLabel}
                  referenceLabel={referenceLabel}
                  primaryColor={primaryColor}
                  referenceColor={referenceColor}
                  valueFormatter={valueFormatter}
                  deltaType={deltaType}
                  invertDelta={invertDelta}
                  showDelta={showDeltaInTooltip}
                  isCompact={typeof height === "number" ? height <= 260 : false}
                />
              }
              cursor={{
                stroke: "var(--chart-crosshair)",
                strokeDasharray: "3 3",
                strokeWidth: 1.2,
              }}
            />

            {showLegend && <Legend content={<ChartLegend />} />}

            {/* Reference Series: Rendered First (Behind Primary), Dashed, Muted */}
            <Line
              type={curve}
              dataKey={referenceKey}
              name={referenceLabel}
              stroke={referenceColor}
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={
                safeData.length === 1
                  ? { r: 4, fill: referenceColor, stroke: "var(--chart-background)", strokeWidth: 1.5 }
                  : false
              }
              activeDot={{
                r: 4.5,
                fill: referenceColor,
                stroke: "var(--chart-background)",
                strokeWidth: 2,
              }}
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />

            {/* Primary Series: Rendered on Top, Solid, Prominent Stroke */}
            <Line
              type={curve}
              dataKey={primaryKey}
              name={primaryLabel}
              stroke={primaryColor}
              strokeWidth={2.5}
              dot={
                safeData.length === 1
                  ? { r: 5, fill: primaryColor, stroke: "var(--chart-background)", strokeWidth: 2 }
                  : false
              }
              activeDot={{
                r: 5.5,
                fill: primaryColor,
                stroke: "var(--chart-background)",
                strokeWidth: 2.5,
              }}
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Visual Indicator for Screen-Reader Exploration */}
      <div className="sr-only" aria-live="polite">
        {activeIndex !== null && safeData[activeIndex] && (
          <span>
            Point {activeIndex + 1} of {safeData.length}: {String(safeData[activeIndex][xKey])}.{" "}
            {primaryLabel} is {String(safeData[activeIndex][primaryKey] ?? "missing")}.{" "}
            {referenceLabel} is {String(safeData[activeIndex][referenceKey] ?? "missing")}.
          </span>
        )}
      </div>
    </figure>
  )
}
