"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"
import { ChartContainer } from "@/registry/shared/chart-container"
import { ChartEmptyState, ChartLoadingState } from "@/registry/shared/chart-state"

/* -------------------------------------------------------------------------- */
/*  Types & Contracts                                                         */
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

export type IntervalOrientation = "horizontal" | "vertical"
export type IntervalValueLabel = "none" | "span" | "bounds" | "auto"
export type IntervalStatus = "valid" | "zero-width" | "invalid-bounds" | "unavailable"

export interface IntervalBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property on data record representing the interval start boundary */
  startKey: NumericKeyOf<TData>
  /** Property on data record representing the interval end boundary */
  endKey: NumericKeyOf<TData>
  /** Semantic label for the series (e.g. "Maintenance window", "Operating range") */
  label: string
  /** Human-readable label for the start bound (default: "Start") */
  startLabel?: string
  /** Human-readable label for the end bound (default: "End") */
  endLabel?: string
  /** Human-readable label for the derived span/duration (default: "Span") */
  spanLabel?: string
  /** Custom formatter for the start and end boundary values */
  valueFormatter?: (value: number) => string
  /** Custom formatter for the derived interval span */
  spanFormatter?: (span: number) => string
}

export interface PreparedIntervalDatum<TData> {
  __source: TData
  __index: number
  __category: string | number
  __start: number | null
  __end: number | null
  __span: number | null
  __status: IntervalStatus
  __plotcnInterval: [number, number] | null
  [key: string]: unknown
}

export interface IntervalBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Array of categorical data records. Order is strictly caller-preserved. */
  data: readonly TData[]
  /** Key on data records representing the discrete category label */
  categoryKey: keyof TData & string
  /** Series definition specifying startKey, endKey, label, and formatters */
  series: IntervalBarSeries<TData>
  /**
   * Bar orientation:
   * - "horizontal": Intervals extend horizontally along X-axis, categories stacked on Y-axis (default).
   * - "vertical": Intervals extend vertically along Y-axis, categories along X-axis.
   */
  orientation?: IntervalOrientation
  /** Container height in pixels or CSS string (default: 340) */
  height?: number | string
  /** Quantitative domain policy or explicit bounds */
  domain?: [number, number] | "auto"
  /** Fill color for interval bars (default: var(--chart-1)) */
  color?: string
  /** Emphasis outline color for the active/inspected category (default: var(--chart-selection)) */
  selectionColor?: string
  /** Whether to render subtle background grid lines (default: true) */
  showGrid?: boolean
  /** Whether to display a series legend (default: false) */
  showLegend?: boolean
  /** Value label display policy (default: "none") */
  valueLabel?: IntervalValueLabel
  /** Tooltip depth mode (default: "bounds-and-span") */
  tooltipMode?: "bounds" | "bounds-and-span"
  /** Maximum bar thickness in pixels (default: 32) */
  maxBarSize?: number
  /** Motion configuration (honors prefers-reduced-motion) */
  motion?: boolean | { duration?: number }
  /** Additional CSS class names */
  className?: string
  /** Semantic chart title for accessibility */
  title?: string
  /** Analytical description for screen readers */
  description?: string
  /** Whether the chart is currently loading data */
  loading?: boolean
}

/* -------------------------------------------------------------------------- */
/*  Mathematical & Domain Helpers                                             */
/* -------------------------------------------------------------------------- */

/**
 * Validates whether a value is a finite number.
 */
export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Computes interval span = end - start.
 * Returns null if either value is non-finite or if start > end (invalid reversed bounds).
 */
export function computeIntervalSpan(
  start: number | null | undefined,
  end: number | null | undefined
): number | null {
  if (!isFiniteNumber(start) || !isFiniteNumber(end)) {
    return null
  }
  if (start > end) {
    return null
  }
  return end - start
}

export interface IntervalValidationResult {
  valid: boolean
  isZeroWidth: boolean
  reason?: "missing" | "inverted"
}

/**
 * Strictly validates interval start and end bounds without silent swapping.
 */
export function validateIntervalBounds(
  start: unknown,
  end: unknown
): IntervalValidationResult {
  if (!isFiniteNumber(start) || !isFiniteNumber(end)) {
    return { valid: false, isZeroWidth: false, reason: "missing" }
  }
  if (start > end) {
    return { valid: false, isZeroWidth: false, reason: "inverted" }
  }
  return { valid: true, isZeroWidth: start === end }
}

/**
 * Formats a temporal date or numeric epoch into a clean local time string.
 */
export function formatIntervalTime(val: number | string | Date): string {
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  } catch {
    return String(val)
  }
}

/**
 * Classifies the semantic status of an interval observation.
 */
export function classifyIntervalStatus(
  start: number | null | undefined,
  end: number | null | undefined
): IntervalStatus {
  if (!isFiniteNumber(start) || !isFiniteNumber(end)) {
    return "unavailable"
  }
  if (start > end) {
    return "invalid-bounds"
  }
  if (start === end) {
    return "zero-width"
  }
  return "valid"
}

/**
 * Resolves a bounds-driven quantitative domain covering all valid starts and ends.
 * Never forces zero into the domain unless an interval boundary actually reaches zero.
 */
export function resolveIntervalDomain(
  starts: readonly (number | null)[],
  ends: readonly (number | null)[],
  explicitDomain?: [number, number] | "auto"
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    explicitDomain.length === 2 &&
    isFiniteNumber(explicitDomain[0]) &&
    isFiniteNumber(explicitDomain[1]) &&
    explicitDomain[0] <= explicitDomain[1]
  ) {
    return [explicitDomain[0], explicitDomain[1]]
  }

  const validBounds: number[] = []
  for (const s of starts) {
    if (isFiniteNumber(s)) validBounds.push(s)
  }
  for (const e of ends) {
    if (isFiniteNumber(e)) validBounds.push(e)
  }

  if (validBounds.length === 0) {
    return [0, 1]
  }

  const rawMin = Math.min(...validBounds)
  const rawMax = Math.max(...validBounds)

  if (rawMin === rawMax) {
    // Constant bound safe expansion
    const pad = Math.abs(rawMin) > 0 ? Math.abs(rawMin) * 0.1 : 1
    return [rawMin - pad, rawMax + pad]
  }

  // 4% padding on outer bounds for breathing room without skewing position
  const span = rawMax - rawMin
  const padding = span * 0.04
  return [rawMin - padding, rawMax + padding]
}

/**
 * Default number formatter.
 */
export function defaultFormatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—"
  if (Number.isInteger(value)) return value.toString()
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

/**
 * Default span formatter.
 */
export function defaultFormatSpan(span: number): string {
  if (!Number.isFinite(span)) return "—"
  if (span === 0) return "0"
  if (Number.isInteger(span)) return span.toString()
  return span.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

/* -------------------------------------------------------------------------- */
/*  Custom Floating Bar & Zero-Width Marker Shape                             */
/* -------------------------------------------------------------------------- */

interface IntervalBarShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  payload?: PreparedIntervalDatum<Record<string, unknown>>
  orientation?: IntervalOrientation
  isFocused?: boolean
  selectionColor?: string
}

function IntervalBarShape(props: IntervalBarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fill,
    payload,
    orientation = "horizontal",
    isFocused = false,
    selectionColor = "var(--chart-selection)",
  } = props

  if (!payload) return null
  const status = payload.__status

  // Omit geometry for unavailable or invalid bounds
  if (status === "unavailable" || status === "invalid-bounds") {
    return null
  }

  const isHorizontal = orientation === "horizontal"
  const strokeColor = isFocused ? selectionColor : "none"
  const activeStrokeWidth = isFocused ? 2 : 0

  // Zero-width interval: render crisp marker tick centered at coordinate
  if (status === "zero-width") {
    if (isHorizontal) {
      const markerWidth = 3
      const markerX = x - markerWidth / 2
      return (
        <rect
          x={markerX}
          y={y}
          width={markerWidth}
          height={height}
          rx={1.5}
          ry={1.5}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={activeStrokeWidth}
          className="plotcn-interval-zero-marker"
        />
      )
    } else {
      const markerHeight = 3
      const markerY = y - markerHeight / 2
      return (
        <rect
          x={x}
          y={markerY}
          width={width}
          height={markerHeight}
          rx={1.5}
          ry={1.5}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={activeStrokeWidth}
          className="plotcn-interval-zero-marker"
        />
      )
    }
  }

  // Normal valid floating range bar with rounded corners on both outer ends
  const safeW = Math.max(1, width)
  const safeH = Math.max(1, height)
  const radius = Math.min(4, Math.min(safeW, safeH) / 2)

  return (
    <rect
      x={x}
      y={y}
      width={safeW}
      height={safeH}
      rx={radius}
      ry={radius}
      fill={fill}
      stroke={strokeColor}
      strokeWidth={activeStrokeWidth}
      className="plotcn-interval-bar"
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function IntervalBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  orientation = "horizontal",
  height = 340,
  domain = "auto",
  color = "var(--chart-1)",
  selectionColor = "var(--chart-selection)",
  showGrid = true,
  showLegend = false,
  valueLabel = "none",
  tooltipMode = "bounds-and-span",
  maxBarSize = 32,
  motion = true,
  className,
  title,
  description,
  loading = false,
}: IntervalBarsProps<TData>) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const chartContainerRef = React.useRef<HTMLDivElement>(null)

  const isHorizontal = orientation === "horizontal"
  const startKey = series.startKey as string
  const endKey = series.endKey as string
  const seriesLabel = series.label || "Interval"
  const startLabelText = series.startLabel || "Start"
  const endLabelText = series.endLabel || "End"
  const spanLabelText = series.spanLabel || "Span"

  const valFmt = series.valueFormatter || defaultFormatNumber
  const spanFmt = series.spanFormatter || defaultFormatSpan

  // 1. Prepare data immutably, validating each bound and deriving span
  const preparedData: PreparedIntervalDatum<TData>[] = React.useMemo(() => {
    if (!Array.isArray(data)) return []

    return data.map((item, index) => {
      const rawCat = item[categoryKey]
      const category =
        typeof rawCat === "string" || typeof rawCat === "number" ? rawCat : String(index + 1)

      const rawStart = item[startKey]
      const rawEnd = item[endKey]

      const start = isFiniteNumber(rawStart) ? rawStart : null
      const end = isFiniteNumber(rawEnd) ? rawEnd : null
      const span = computeIntervalSpan(start, end)
      const status = classifyIntervalStatus(start, end)

      const intervalTuple: [number, number] | null =
        status === "valid" || status === "zero-width" ? [start!, end!] : null

      return {
        ...item,
        __source: item,
        __index: index,
        __category: category,
        __start: start,
        __end: end,
        __span: span,
        __status: status,
        __plotcnInterval: intervalTuple,
      }
    })
  }, [data, categoryKey, startKey, endKey])

  // 2. Derive bounds-driven domain
  const computedDomain = React.useMemo(() => {
    const starts = preparedData.map((d) => d.__start)
    const ends = preparedData.map((d) => d.__end)
    return resolveIntervalDomain(starts, ends, domain)
  }, [preparedData, domain])

  // 3. Count valid intervals
  const validIntervalCount = React.useMemo(() => {
    return preparedData.filter((d) => d.__status === "valid" || d.__status === "zero-width").length
  }, [preparedData])

  // 4. Keyboard traversal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!preparedData.length) return
    const count = preparedData.length

    if (isHorizontal) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev >= count - 1 ? 0 : prev + 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev <= 0 ? count - 1 : prev - 1))
      } else if (e.key === "Home") {
        e.preventDefault()
        setActiveIndex(0)
      } else if (e.key === "End") {
        e.preventDefault()
        setActiveIndex(count - 1)
      }
    } else {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev >= count - 1 ? 0 : prev + 1))
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev <= 0 ? count - 1 : prev - 1))
      } else if (e.key === "Home") {
        e.preventDefault()
        setActiveIndex(0)
      } else if (e.key === "End") {
        e.preventDefault()
        setActiveIndex(count - 1)
      }
    }
  }

  // Loading state
  if (loading) {
    return <ChartLoadingState style={{ height: typeof height === "number" ? `${height}px` : height }} />
  }

  // Empty data state
  // Summary counts for accessibility
  const summaryCounts = React.useMemo(() => {
    let valid = 0
    let zeroWidth = 0
    let invalid = 0
    for (const d of preparedData) {
      if (d.__status === "valid") valid++
      else if (d.__status === "zero-width") zeroWidth++
      else invalid++
    }
    return { valid, zeroWidth, invalid, total: preparedData.length }
  }, [preparedData])

  if (!preparedData.length) {
    return (
      <ChartEmptyState
        title="No interval data available"
        description="No categorical records available to construct interval ranges."
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      />
    )
  }

  // All invalid or missing intervals state
  if (validIntervalCount === 0) {
    return (
      <ChartEmptyState
        title="No Valid Intervals"
        description="None of the records contain valid start and end bounds (start <= end required)."
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      />
    )
  }

  const chartMargin = isHorizontal
    ? { top: 12, right: 28, left: 12, bottom: 20 }
    : { top: 20, right: 20, left: 12, bottom: 24 }

  return (
    <figure
      ref={chartContainerRef}
      role="region"
      aria-label={title || `${seriesLabel} Interval Chart`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "plotcn-chart plotcn-interval-chart group relative flex flex-col w-full rounded-xl border border-border/50 bg-card p-4 text-card-foreground shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring select-none",
        className
      )}
    >
      <div className="sr-only">
        <h3>{title || `${seriesLabel} Interval Chart`}</h3>
        {description && <p>{description}</p>}
        <p>
          Showing {summaryCounts.total} intervals. {summaryCounts.valid + summaryCounts.zeroWidth} active intervals (including {summaryCounts.zeroWidth} zero-width markers), {summaryCounts.invalid} invalid or missing.
          Use arrow keys ({isHorizontal ? "Up and Down" : "Left and Right"}) to inspect intervals.
        </p>
      </div>

      {/* Header Info */}
      {(title || description) && (
        <div className="mb-3 space-y-1">
          {title && <h3 className="font-semibold tracking-tight text-foreground text-sm sm:text-base">{title}</h3>}
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
      )}

      {/* Structural Legend */}
      {showLegend && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3 px-1" aria-hidden="true">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-xs shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{seriesLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/80">
            <span className="inline-block w-0.5 h-3 bg-foreground/60 shrink-0" aria-hidden="true" />
            <span>Zero-width marker</span>
          </div>
        </div>
      )}

      {/* Main Visualization Canvas */}
      <ChartContainer
        className="w-full relative"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{
            width: 320,
            height: typeof height === "number" ? height : 340,
          }}
        >
          <BarChart
            data={preparedData}
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={chartMargin}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                const idx = Number(state.activeTooltipIndex)
                if (!Number.isNaN(idx)) {
                  setActiveIndex(idx)
                }
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/40"
                horizontal={!isHorizontal}
                vertical={isHorizontal}
              />
            )}

            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  domain={computedDomain}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={valFmt}
                />
                <YAxis
                  type="category"
                  dataKey="__category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                  tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="category"
                  dataKey="__category"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)", strokeWidth: 1 }}
                  tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  type="number"
                  domain={computedDomain}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={valFmt}
                  width={55}
                />
              </>
            )}

            <Tooltip
              isAnimationActive={false}
              cursor={{
                fill: "var(--accent)",
                opacity: 0.15,
              }}
              allowEscapeViewBox={{ x: false, y: false }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const datum = payload[0].payload as PreparedIntervalDatum<TData>
                if (!datum) return null

                const hasStart = datum.__start !== null
                const hasEnd = datum.__end !== null
                const status = datum.__status

                return (
                  <div
                    role="tooltip"
                    className="rounded-lg border border-border/70 bg-popover/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl text-xs space-y-2 pointer-events-none min-w-[190px] max-w-[calc(100cqw-16px)]"
                  >
                    <div className="font-semibold text-foreground text-sm border-b border-border/50 pb-1.5 truncate">
                      {datum.__category}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4 text-muted-foreground">
                        <span>{startLabelText}</span>
                        <span className="font-medium text-foreground font-mono">
                          {hasStart ? valFmt(datum.__start!) : "Unavailable"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 text-muted-foreground">
                        <span>{endLabelText}</span>
                        <span className="font-medium text-foreground font-mono">
                          {hasEnd ? valFmt(datum.__end!) : "Unavailable"}
                        </span>
                      </div>

                      {tooltipMode === "bounds-and-span" && (
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/40 font-semibold">
                          <span className="text-foreground">{spanLabelText}</span>
                          <span
                            className={cn(
                              "font-mono font-bold",
                              status === "valid" || status === "zero-width"
                                ? "text-foreground"
                                : "text-destructive font-normal"
                            )}
                          >
                            {status === "valid" && spanFmt(datum.__span!)}
                            {status === "zero-width" && spanFmt(0)}
                            {status === "invalid-bounds" && "Invalid bounds"}
                            {status === "unavailable" && "Unavailable"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
            />

            <Bar
              dataKey="__plotcnInterval"
              maxBarSize={maxBarSize}
              isAnimationActive={Boolean(motion)}
              animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 600}
              shape={(shapeProps: any) => {
                const idx = shapeProps.originalDataIndex ?? shapeProps.index
                const isFocused = activeIndex === idx
                return (
                  <IntervalBarShape
                    {...shapeProps}
                    fill={color}
                    orientation={orientation}
                    isFocused={isFocused}
                    selectionColor={selectionColor}
                  />
                )
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Accessible Structured Data Table for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>
            {title || seriesLabel} - Bounded interval table showing start, end, and duration.
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">{startLabelText}</th>
              <th scope="col">{endLabelText}</th>
              <th scope="col">{spanLabelText}</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((d, i) => (
              <tr key={`sr-row-${i}`}>
                <td>{d.__category}</td>
                <td>{d.__start !== null ? valFmt(d.__start) : "Unavailable"}</td>
                <td>{d.__end !== null ? valFmt(d.__end) : "Unavailable"}</td>
                <td>
                  {d.__status === "valid"
                    ? spanFmt(d.__span!)
                    : d.__status === "zero-width"
                    ? spanFmt(0)
                    : d.__status === "invalid-bounds"
                    ? "Invalid bounds"
                    : "Unavailable"}
                </td>
                <td>{d.__status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
