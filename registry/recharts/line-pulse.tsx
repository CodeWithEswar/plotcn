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
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartLegend } from "../shared/chart-legend"
import { ChartContainer } from "../shared/chart-container"
import { ChartTooltip } from "../shared/chart-tooltip"
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

export interface PulseSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof TData & string
  label?: string
  valueFormatter?: (value: number) => string
}

export interface PulseReferenceLine {
  y: number
  label?: string
  stroke?: string
  strokeDasharray?: string
}

export interface PulseLineProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The array of operational data observations to visualize.
   * Accepts a readonly array and will never mutate caller data.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. timestamp, second, or ordered category).
   */
  xKey: keyof TData & string

  /**
   * Key for the numeric metric value to plot.
   * Mutually exclusive or fallback to series.key.
   */
  seriesKey?: keyof TData & string

  /**
   * Optional semantic series descriptor containing key, label, and formatter.
   */
  series?: PulseSeriesConfig<TData>

  /**
   * Rolling window size. When specified, only the latest N observations are rendered.
   * Must be a positive finite integer. If omitted, all provided data is displayed.
   */
  windowSize?: number

  /**
   * Height of the chart container in pixels or standard CSS string.
   * Default: 280
   */
  height?: number | string

  /**
   * Curve interpolation for the operational signal line.
   * Default: "monotone"
   */
  curve?: "linear" | "monotone" | "step"

  /**
   * Explicit Y-axis numeric domain, or "auto" calculation with safe padding.
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Tick thinning policy for the horizontal X axis.
   * Default: "auto"
   */
  tickStrategy?: "auto" | "all" | "preserve-start" | "preserve-end" | "preserve-both"

  /**
   * Whether to display a dedicated terminal marker dot at the latest observation.
   * Default: true
   */
  showLatestPoint?: boolean

  /**
   * Whether to display a compact numeric pill showing the latest formatted value.
   * Default: false
   */
  showLatestValue?: boolean

  /**
   * Custom formatter specifically for the latest observation display.
   * Falls back to series.valueFormatter or standard locale string.
   */
  latestValueFormatter?: (value: number) => string

  /**
   * High-frequency update mode:
   * - "direct": Instant geometry updates without animation queue lag (ideal for streaming/rapid telemetry).
   * - "transition": Restrained 150ms interpolation for moderate update rates.
   * Default: "direct"
   */
  updateMode?: "direct" | "transition"

  /**
   * Primary series stroke color.
   * Default: "var(--chart-1)"
   */
  color?: string

  /**
   * Whether to display subtle horizontal background gridlines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display horizontal X axis tick labels.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to display vertical Y axis metric labels.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to display the series legend.
   * Default: false
   */
  showLegend?: boolean

  /**
   * Optional reference threshold rules (e.g. SLO, SLA, target capacity).
   */
  referenceLines?: readonly PulseReferenceLine[]

  /**
   * Truthful missing value policy:
   * - "gap": Breaks the stroke across null/undefined observations without fabricating zero.
   * - "connect": Line draws across the gap to bridge adjacent valid observations.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "connect"

  /**
   * Animation toggle or custom duration.
   * Automatically disabled under prefers-reduced-motion.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title for screen-reader regions and figures.
   * Default: "Pulse Line"
   */
  title?: string

  /**
   * Accessible description of the operational signal and frequency.
   */
  description?: string

  /**
   * Loading state flag. Renders neutral skeleton preserving layout footprint.
   */
  loading?: boolean

  /**
   * Error state or message. Renders actionable error state with retry.
   */
  error?: Error | string | null

  /**
   * Unavailable state notice (e.g. stream disconnected or retention limit reached).
   */
  unavailable?: boolean | string | null

  /**
   * Custom empty state component override.
   */
  emptyContent?: React.ReactNode

  /**
   * Custom loading state component override.
   */
  loadingContent?: React.ReactNode

  /**
   * Custom error state component override.
   */
  errorContent?: React.ReactNode

  /**
   * Callback invoked when user clicks the error retry trigger.
   */
  onRetry?: () => void

  /**
   * Additional CSS class names applied to the root figure wrapper.
   */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Helper Functions                                                          */
/* -------------------------------------------------------------------------- */

function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && !Number.isNaN(val)
}

/**
 * Applies rolling-window slicing on ordered data without mutating caller data.
 */
function applyRollingWindow<TData>(
  data: readonly TData[],
  windowSize?: number
): readonly TData[] {
  if (typeof windowSize !== "number" || !Number.isFinite(windowSize) || windowSize <= 0) {
    return data
  }
  const size = Math.floor(windowSize)
  if (data.length <= size) {
    return data
  }
  return data.slice(-size)
}

/**
 * Normalizes dataset without mutating caller data:
 * - Drops invalid non-finite numbers (NaN, Infinity)
 * - Converts missing points to null for truthful gap rendering
 */
function normalizePulseData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: string,
  valueKey: string,
  missingPolicy: "gap" | "connect"
): Record<string, unknown>[] {
  const normalized: Record<string, unknown>[] = []

  for (let i = 0; i < data.length; i++) {
    const raw = data[i]
    const rawVal = raw[valueKey]
    const xVal = raw[xKey] ?? `Sample ${i + 1}`

    let cleanVal: number | null = null
    if (isFiniteNumber(rawVal)) {
      cleanVal = rawVal
    } else if (rawVal === null || rawVal === undefined) {
      cleanVal = null
    } else {
      cleanVal = null
    }

    normalized.push({
      ...raw,
      [xKey]: xVal,
      [valueKey]: cleanVal,
    })
  }

  return normalized
}

/**
 * Calculates a safe numeric Y-domain preventing zero-height division errors
 * and handling single-value or zero-only signals deterministically.
 */
function calculateSafeDomain(
  data: readonly Record<string, unknown>[],
  valueKey: string,
  explicitDomain?: [number, number] | ["auto", "auto"]
): [number, number] | ["auto", "auto"] {
  if (explicitDomain) {
    return explicitDomain
  }

  const validValues: number[] = []
  for (const item of data) {
    const v = item[valueKey]
    if (isFiniteNumber(v)) {
      validValues.push(v)
    }
  }

  if (validValues.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)

  // Single-value domain expansion (Section 28, 29)
  if (min === max) {
    if (min === 0) {
      return [-1, 1]
    }
    if (min > 0) {
      return [Math.floor(min * 0.9), Math.ceil(min * 1.1)]
    }
    return [Math.floor(min * 1.1), Math.ceil(min * 0.9)]
  }

  // Padding extent by 5%
  const span = max - min
  const pad = span * 0.05
  return [min >= 0 ? Math.max(0, Math.floor(min - pad)) : Math.floor(min - pad), Math.ceil(max + pad)]
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function PulseLine<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  xKey,
  seriesKey,
  series,
  windowSize,
  height = 280,
  curve = "monotone",
  domain,
  tickStrategy = "auto",
  showLatestPoint = true,
  showLatestValue = false,
  latestValueFormatter,
  updateMode = "direct",
  color = "var(--chart-1)",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  referenceLines,
  missingValuePolicy = "gap",
  motion = true,
  title = "Pulse Line",
  description,
  loading = false,
  error = null,
  unavailable = null,
  emptyContent,
  loadingContent,
  errorContent,
  onRetry,
  className,
}: PulseLineProps<TData>) {
  const activeSeriesKey = (series?.key ?? seriesKey ?? "value") as string
  const activeSeriesLabel = series?.label ?? "Signal"
  const valueFormatter = series?.valueFormatter
  const reducedMotion = useChartReducedMotion()

  const instanceId = React.useId()
  const titleId = `pulse-title-${instanceId}`
  const summaryId = `pulse-summary-${instanceId}`

  // Keyboard navigation active index
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  // Sliced rolling window
  const windowedData = applyRollingWindow(data, windowSize)

  // Normalized safe data
  const safeData = normalizePulseData(windowedData, xKey, activeSeriesKey, missingValuePolicy)
  const safeDomain = calculateSafeDomain(safeData, activeSeriesKey, domain)

  // Find last valid observation index for latest terminal marker
  let lastValidIndex = -1
  let latestNumericValue: number | null = null
  for (let i = safeData.length - 1; i >= 0; i--) {
    const val = safeData[i][activeSeriesKey]
    if (isFiniteNumber(val)) {
      lastValidIndex = i
      latestNumericValue = val
      break
    }
  }

  // Format latest value
  const latestFormattedValue = React.useMemo(() => {
    if (latestNumericValue === null) return null
    if (latestValueFormatter) return latestValueFormatter(latestNumericValue)
    if (valueFormatter) return valueFormatter(latestNumericValue)
    return latestNumericValue.toLocaleString()
  }, [latestNumericValue, latestValueFormatter, valueFormatter])

  // Factual screen-reader summary (Section 55: factual statements only, no business conclusions)
  const validValues = safeData
    .map((d) => d[activeSeriesKey])
    .filter((v): v is number => isFiniteNumber(v))

  const factualSummary = React.useMemo(() => {
    if (validValues.length === 0) return "No valid numeric observations recorded."
    const count = validValues.length
    const min = Math.min(...validValues)
    const max = Math.max(...validValues)
    const current = validValues[validValues.length - 1]

    const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
    const curStr = fmt(current)
    const minStr = fmt(min)
    const maxStr = fmt(max)

    return `${count} observations. Current value ${curStr}. Minimum ${minStr}. Maximum ${maxStr}.`
  }, [validValues, valueFormatter])

  // Motion config: In direct updateMode, no animation queue lag
  const isAnimated = motion !== false && !reducedMotion && updateMode === "transition"
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 150

  // Tick interval calculation based on strategy
  const tickInterval = React.useMemo(() => {
    if (tickStrategy === "all") return 0
    if (tickStrategy === "preserve-start") return "preserveStart"
    if (tickStrategy === "preserve-end") return "preserveEnd"
    if (tickStrategy === "preserve-both") return "preserveStartEnd"
    // "auto": compact operational spacing
    if (safeData.length > 40) return Math.ceil(safeData.length / 6)
    if (safeData.length > 20) return Math.ceil(safeData.length / 4)
    return "preserveStartEnd"
  }, [tickStrategy, safeData.length])

  if (error) {
    const message = typeof error === "string" ? error : error.message || "Failed to load signal"
    if (errorContent) return <div className={cn("w-full", className)} style={{ height }}>{errorContent}</div>
    return <div className={cn("w-full", className)} style={{ height }}><ChartErrorState title="Unable to load signal" description={message} onRetry={onRetry} /></div>
  }
  if (unavailable) {
    const message = typeof unavailable === "string" ? unavailable : "This metric stream is currently unavailable."
    return <div className={cn("w-full", className)} style={{ height }}><ChartUnavailableState title="Signal stream unavailable" description={message} /></div>
  }
  if (loading) {
    if (loadingContent) return <div className={cn("w-full", className)} style={{ height }}>{loadingContent}</div>
    return <div className={cn("w-full", className)} style={{ height }}><ChartLoadingState title="Connecting to telemetry stream..." description="Preparing rolling window and scaling signal axes" /></div>
  }
  if (data.length === 0) {
    if (emptyContent) return <div className={cn("w-full", className)} style={{ height }}>{emptyContent}</div>
    return <div className={cn("w-full", className)} style={{ height }}><ChartEmptyState title="No telemetry yet" description="Signal values will appear when observations are recorded." /></div>
  }

  // Keyboard navigation across observations (Section 51, 52: End returns to latest signal)
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

  const defaultFormatter = (val: number | string) => {
    if (typeof val === "number" && isFiniteNumber(val)) {
      return valueFormatter ? valueFormatter(val) : val.toLocaleString()
    }
    return String(val ?? "—")
  }

  // Custom dot renderer: renders terminal marker for latest point only (Section 6, 7)
  const renderTerminalDot = (dotProps: any) => {
    const { cx, cy, index } = dotProps
    if (index === lastValidIndex && showLatestPoint && isFiniteNumber(cx) && isFiniteNumber(cy)) {
      return (
        <g key={`pulse-terminal-${index}`} className="pointer-events-none">
          {/* Subtle outer halo */}
          <circle
            cx={cx}
            cy={cy}
            r={7}
            fill="none"
            stroke={color}
            strokeOpacity={0.35}
            strokeWidth={1.5}
          />
          {/* Core terminal dot */}
          <circle
            cx={cx}
            cy={cy}
            r={3.5}
            fill={color}
            stroke="var(--chart-background)"
            strokeWidth={1.5}
          />
        </g>
      )
    }
    return <React.Fragment key={`dot-${index}`} />
  }

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus)] rounded-xl transition-all",
        className
      )}
      style={{ height, minHeight: typeof height === "number" ? height : 300 }}
    >
      {/* Optional Latest Value Header Rail */}
      {showLatestValue && latestFormattedValue && (
        <div className="flex items-center justify-between px-1 pb-2 text-xs font-mono select-none">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">
            {activeSeriesLabel} · LATEST
          </span>
          <span className="font-semibold text-foreground bg-muted border border-border px-2 py-0.5 rounded text-[11px]">
            {latestFormattedValue}
          </span>
        </div>
      )}

      {/* Screen Reader Accessible Descriptions */}
      <figcaption className="sr-only">
        <h3 id={titleId}>{title}</h3>
        {description && <p>{description}</p>}
        <p id={summaryId}>{factualSummary}</p>
      </figcaption>

      {/* Chart Canvas */}
      <ChartContainer
        config={{
          [activeSeriesKey]: {
            label: activeSeriesLabel,
            color,
          },
        }}
        className="w-full h-full flex-1"
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 300 }}
        >
          <LineChart
            data={safeData}
            margin={{ top: 8, right: 12, left: -16, bottom: 4 }}
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
              interval={tickInterval}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
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
                <ChartTooltip
                  indicator="line"
                  formatter={(val) => defaultFormatter(val)}
                  labelFormatter={(label) => label}
                  compact={typeof height === "number" ? height <= 260 : false}
                />
              }
              cursor={{
                stroke: "var(--chart-crosshair)",
                strokeDasharray: "3 3",
                strokeWidth: 1.2,
              }}
            />

            {/* Optional Reference Threshold Lines */}
            {referenceLines?.map((ref, idx) => (
              <ReferenceLine
                key={`ref-line-${idx}`}
                y={ref.y}
                label={
                  ref.label
                    ? {
                        value: ref.label,
                        position: "insideTopRight",
                        fill: "var(--chart-muted-foreground)",
                        fontSize: 10,
                      }
                    : undefined
                }
                stroke={ref.stroke ?? "var(--chart-muted-foreground)"}
                strokeDasharray={ref.strokeDasharray ?? "4 4"}
                strokeOpacity={0.6}
              />
            ))}

            {showLegend && (
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 8, fontSize: 12 }}
              />
            )}

            <Line
              type={curve}
              dataKey={activeSeriesKey as any}
              stroke={color}
              strokeWidth={1.75}
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
              dot={renderTerminalDot}
              activeDot={{
                r: 4.5,
                fill: color,
                stroke: "var(--chart-background)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Screen reader notification only on explicit keyboard navigation */}
      <div className="sr-only" aria-live="polite">
        {activeIndex !== null && safeData[activeIndex] && (
          <span>
            Selected observation {activeIndex + 1} of {safeData.length}: {String(safeData[activeIndex][xKey])},{" "}
            {defaultFormatter(safeData[activeIndex][activeSeriesKey] as number)}
          </span>
        )}
      </div>
    </figure>
  )
}
