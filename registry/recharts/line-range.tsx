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
  Legend,
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

export type CurveType = "monotone" | "linear" | "step" | "natural"

export interface RangeLineSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  valueKey?: keyof TData & string
  lowerKey?: keyof TData & string
  upperKey?: keyof TData & string
  label?: string
  rangeLabel?: string
  color?: string
  rangeColor?: string
  rangeOpacity?: number
}

export interface RangeLineProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The array of structured observations to visualize.
   * Accepts a readonly array and will not mutate caller data.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. date, month, or ordered category).
   */
  xKey: keyof TData & string

  /**
   * Key for the central observation value (e.g. forecast, actual, or mean).
   */
  valueKey?: keyof TData & string

  /**
   * Key for the lower boundary of the interval band.
   */
  lowerKey?: keyof TData & string

  /**
   * Key for the upper boundary of the interval band.
   */
  upperKey?: keyof TData & string

  /**
   * Optional range-aware series descriptor combining keys and labels.
   */
  series?: RangeLineSeriesConfig<TData>

  /**
   * Display label for the central series (used in tooltips, legends, and accessibility).
   * Default: "Central" or series.label
   */
  label?: string

  /**
   * Display label for the range envelope (used in tooltips, legends, and accessibility).
   * Default: "Range" or series.rangeLabel
   */
  rangeLabel?: string

  /**
   * Primary stroke color for the central line. Accepts CSS variables or color values.
   * Default: "var(--chart-1)"
   */
  color?: string

  /**
   * Fill color for the range envelope band. Accepts CSS variables or color values.
   * Defaults to the primary color.
   */
  rangeColor?: string

  /**
   * Opacity applied to the range envelope band (0 to 1).
   * Default: 0.18
   */
  rangeOpacity?: number

  /**
   * Whether to render subtle boundary strokes along the upper and lower limits of the band.
   * Default: false
   */
  showRangeBoundary?: boolean

  /**
   * Dash array for the boundary strokes if showRangeBoundary is true.
   * Default: "3 3"
   */
  rangeBoundaryDash?: string

  /**
   * Interpolation curve for both the central line and range envelope.
   * Default: "monotone"
   */
  curve?: CurveType

  /**
   * Container height in pixels or standard CSS dimension strings.
   * Default: 340
   */
  height?: number | string

  /**
   * Explicit Y-axis numeric domain spanning central and range values, or "auto".
   * Default: "auto"
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Handling of null or undefined values in the central line.
   * "gap" preserves visual break; "connect" bridges adjacent points.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "connect"

  /**
   * Formatter function for Y-axis and tooltip values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Formatter function for X-axis tick labels.
   */
  xFormatter?: (value: string | number) => string

  /**
   * Whether to display horizontal reference gridlines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display the chart legend.
   * Default: false
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
   * Whether to calculate and display the derived range width (upper - lower) in the tooltip.
   * Default: false
   */
  showRangeWidthInTooltip?: boolean

  /**
   * Enable or disable entry and update transitions.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title announced by screen readers.
   * Default: "Range Line Chart"
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

export interface NormalizedRangeDatum {
  __x: string | number
  __value: number | null
  __lower: number | null
  __upper: number | null
  __range: [number, number] | null
  __raw: Record<string, unknown>
}

/**
 * Normalizes user data with strict interval safety:
 * 1. Checks that lower <= upper. If lower > upper, interval is treated as missing/invalid (no inverted polygon).
 * 2. Unclamped central values (observations may truthfully sit outside the range).
 * 3. Partially missing bounds create a gap in the band without fabricating data.
 * 4. Missing central value with valid bounds preserves the band with a gap in the line.
 * 5. Caller objects and arrays are NEVER mutated.
 */
export function normalizeRangeLineData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  valueKey: string,
  lowerKey: string,
  upperKey: string
): NormalizedRangeDatum[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let hasWarnedInverted = false

  return data.map((d) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawV = d[valueKey]
    const rawL = d[lowerKey]
    const rawU = d[upperKey]

    const val = isFiniteNumber(rawV) ? rawV : null
    const low = isFiniteNumber(rawL) ? rawL : null
    const up = isFiniteNumber(rawU) ? rawU : null

    let safeLow = low
    let safeUp = up
    let rangeTuple: [number, number] | null = null

    if (low !== null && up !== null) {
      if (low <= up) {
        rangeTuple = [low, up]
      } else {
        safeLow = null
        safeUp = null
        if (!hasWarnedInverted && process.env.NODE_ENV !== "production") {
          console.warn(
            `[plotcn] RangeLine: Invalid interval detected where lower (${low}) > upper (${up}). Treating range as missing for this observation.`
          )
          hasWarnedInverted = true
        }
      }
    }

    return {
      __x: xVal,
      __value: val,
      __lower: safeLow,
      __upper: safeUp,
      __range: rangeTuple,
      __raw: d,
    }
  })
}

/**
 * Calculates a single honest shared Y-domain spanning central observations,
 * lower limits, and upper limits to ensure the interval band never clips.
 */
export function calculateRangeDomain(
  normalized: readonly NormalizedRangeDatum[],
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

  const validValues: number[] = []
  for (const item of normalized) {
    if (item.__value !== null) validValues.push(item.__value)
    if (item.__lower !== null) validValues.push(item.__lower)
    if (item.__upper !== null) validValues.push(item.__upper)
  }

  if (validValues.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)

  if (min === max) {
    return min === 0 ? [-10, 10] : [min - Math.abs(min) * 0.1, max + Math.abs(max) * 0.1]
  }

  const span = max - min
  const pad = span * 0.06
  return [Math.floor(min - pad), Math.ceil(max + pad)]
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Range Tooltip                                                */
/* -------------------------------------------------------------------------- */

interface RangeTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  label?: React.ReactNode
  centralLabel?: string
  rangeLabel?: string
  primaryColor: string
  rangeColor: string
  valueFormatter?: (value: number) => string
  showRangeWidth?: boolean
}

function RangeTooltipContent({
  active,
  payload,
  label,
  primaryColor,
  rangeColor,
  valueFormatter,
  showRangeWidth = false,
  centralLabel = "Central",
  rangeLabel = "Range",
}: RangeTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  const datum = payload[0]?.payload as NormalizedRangeDatum | undefined
  if (!datum) return null

  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())

  const centralVal = datum.__value
  const lowerVal = datum.__lower
  const upperVal = datum.__upper
  const rangeTuple = datum.__range

  const hasCentral = centralVal !== null
  const hasValidRange = rangeTuple !== null

  let rangeWidth: number | null = null
  if (hasValidRange && lowerVal !== null && upperVal !== null) {
    rangeWidth = Math.abs(upperVal - lowerVal)
  }

  return (
    <div className="z-50 min-w-[200px] rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-2.5 text-xs shadow-md backdrop-blur-md">
      <div className="mb-2 font-mono text-[11px] font-medium text-[var(--chart-tooltip-muted)]">
        {datum.__x}
      </div>

      <div className="space-y-1.5">
        {/* Central Observation Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)]">
              {centralLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)]">
            {hasCentral ? fmt(centralVal) : "—"}
          </span>
        </div>

        {/* Range Band Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-3 rounded-sm opacity-80"
              style={{ backgroundColor: rangeColor }}
            />
            <span className="text-[var(--chart-tooltip-muted)]">
              {rangeLabel}
            </span>
          </div>
          <span className="font-mono text-[var(--chart-tooltip-muted)]">
            {hasValidRange ? `${fmt(lowerVal!)} – ${fmt(upperVal!)}` : "Unavailable"}
          </span>
        </div>

        {/* Optional Range Width */}
        {showRangeWidth && rangeWidth !== null && (
          <div className="mt-1.5 flex items-center justify-between border-t border-[var(--chart-tooltip-border)] pt-1.5 text-[11px]">
            <span className="text-[var(--chart-tooltip-muted)]">Span</span>
            <span className="font-mono text-[var(--chart-tooltip-foreground)]">
              {fmt(rangeWidth)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Custom Range Legend                                                       */
/* -------------------------------------------------------------------------- */

interface RangeLegendContentProps {
  label: string
  rangeLabel: string
  primaryColor: string
  rangeColor: string
}

function RangeLegendContent({
  label,
  rangeLabel,
  primaryColor,
  rangeColor,
}: RangeLegendContentProps) {
  return (
    <div className="flex items-center justify-center gap-6 pt-3 text-xs">
      <div className="flex items-center gap-2">
        <span
          className="h-0.5 w-4 rounded-full"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="text-[var(--chart-foreground)] font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-4 rounded-sm opacity-60"
          style={{ backgroundColor: rangeColor }}
        />
        <span className="text-[var(--chart-muted)]">{rangeLabel}</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component Implementation                                                  */
/* -------------------------------------------------------------------------- */

export function RangeLine<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  xKey,
  valueKey: propValueKey,
  lowerKey: propLowerKey,
  upperKey: propUpperKey,
  series,
  label: propLabel,
  rangeLabel: propRangeLabel,
  color: propColor,
  rangeColor: propRangeColor,
  rangeOpacity = 0.18,
  showRangeBoundary = false,
  rangeBoundaryDash = "3 3",
  curve = "monotone",
  height = 340,
  domain,
  missingValuePolicy = "gap",
  valueFormatter,
  xFormatter,
  showGrid = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showRangeWidthInTooltip = false,
  motion = true,
  title = "Range Line Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry: _onRetry,
  emptyContent,
  errorContent,
  loadingContent,
  className,
}: RangeLineProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const containerId = React.useId().replace(/[:]/g, "")
  const titleId = `range-title-${containerId}`
  const descId = `range-desc-${containerId}`
  const summaryId = `range-summary-${containerId}`

  const [, setActiveIndex] = React.useState<number | null>(null)

  // Resolve keys and semantic descriptors (series object takes precedence if provided)
  const valueKey = series?.valueKey ?? propValueKey ?? ("value" as keyof TData & string)
  const lowerKey = series?.lowerKey ?? propLowerKey ?? ("lower" as keyof TData & string)
  const upperKey = series?.upperKey ?? propUpperKey ?? ("upper" as keyof TData & string)
  const centralLabel = series?.label ?? propLabel ?? "Central"
  const rangeLabel = series?.rangeLabel ?? propRangeLabel ?? "Range"
  const primaryColor = series?.color ?? propColor ?? "var(--chart-1, #10b981)"
  const rangeColor = series?.rangeColor ?? propRangeColor ?? primaryColor
  const activeOpacity = series?.rangeOpacity ?? rangeOpacity

  // Normalized safe data and safe shared domain
  const normalizedData = React.useMemo(
    () => normalizeRangeLineData(data, xKey, valueKey, lowerKey, upperKey),
    [data, xKey, valueKey, lowerKey, upperKey]
  )

  const safeDomain = React.useMemo(
    () => calculateRangeDomain(normalizedData, domain),
    [normalizedData, domain]
  )

  // Motion config
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Screen reader factual summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No range data observations recorded."

    const centralValues = normalizedData
      .map((d) => d.__value)
      .filter((v): v is number => v !== null)

    const validIntervalCount = normalizedData.filter((d) => d.__range !== null).length

    const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
    const cMin = centralValues.length > 0 ? fmt(Math.min(...centralValues)) : "none"
    const cMax = centralValues.length > 0 ? fmt(Math.max(...centralValues)) : "none"

    return `Time-series with range envelope visualizing ${normalizedData.length} observations. ${centralLabel} spans from ${cMin} to ${cMax}. Interval bounds are available for ${validIntervalCount} of ${normalizedData.length} observations.`
  }, [normalizedData, centralLabel, valueFormatter])

  if (error) {
    if (errorContent) return <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>{errorContent}</div>
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartErrorState
          title="Unable to load range data"
          description={typeof error === "string" ? error : error?.message || "An unexpected error occurred while loading interval metrics."}
        />
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartUnavailableState
          title="Range metrics unavailable"
          description={typeof unavailable === "string" ? unavailable : "Interval envelopes are unavailable for this view."}
        />
      </div>
    )
  }

  if (loading) {
    if (loadingContent) return <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>{loadingContent}</div>
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartLoadingState
          title="Loading range visualization…"
          description="Synchronizing trend and interval envelopes"
        />
      </div>
    )
  }

  if (data.length === 0 || normalizedData.length === 0) {
    if (emptyContent) return <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>{emptyContent}</div>
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartEmptyState
          title="No range observations"
          description="Observations will appear when central values and bounds are recorded."
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
          <ComposedChart
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
                <RangeTooltipContent
                  primaryColor={primaryColor}
                  rangeColor={rangeColor}
                  label={centralLabel}
                  rangeLabel={rangeLabel}
                  valueFormatter={valueFormatter}
                  showRangeWidth={showRangeWidthInTooltip}
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
                  <RangeLegendContent
                    label={centralLabel}
                    rangeLabel={rangeLabel}
                    primaryColor={primaryColor}
                    rangeColor={rangeColor}
                  />
                }
              />
            )}

            {/* Range Envelope: Rendered first (behind central line) */}
            <Area
              type={curve}
              dataKey="__range"
              name={rangeLabel}
              fill={rangeColor}
              fillOpacity={activeOpacity}
              stroke={showRangeBoundary ? rangeColor : "none"}
              strokeOpacity={showRangeBoundary ? 0.6 : 0}
              strokeDasharray={showRangeBoundary ? rangeBoundaryDash : undefined}
              strokeWidth={showRangeBoundary ? 1.2 : 0}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              activeDot={false}
              dot={false}
              connectNulls={false}
            />

            {/* Central Signal Line: Rendered over the range envelope */}
            <Line
              type={curve}
              dataKey="__value"
              name={centralLabel}
              stroke={primaryColor}
              strokeWidth={2}
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
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </figure>
  )
}
