"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  LabelList,
} from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartEmptyState,
  ChartErrorState,
  ChartLoadingState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Type Definitions & Contracts                                              */
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

export type DivergingBarLayout = "horizontal" | "vertical"
export type DivergingValueLabel = "none" | "value" | "deviation" | "auto"
export type DivergingPosition = "above" | "below" | "equal" | "unavailable"

export interface DivergingBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on data records representing the primary quantitative measure */
  key: NumericKeyOf<TData>
  /** Human-readable display label for tooltips, legend, and accessibility */
  label: string
  /** Optional custom numeric formatter for tooltip, axis ticks, and labels */
  valueFormatter?: (value: number) => string
}

export interface PreparedDivergingDatum<TData = Record<string, unknown>> {
  __category: string | number
  __index: number
  __raw: TData
  __rawValue: number | null
  __deviation: number | null
  __position: DivergingPosition
  [key: string]: unknown
}

export interface DivergingBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Readonly array of categorical observations. Order is strictly caller-preserved. */
  data: readonly TData[]

  /** Property key defining the discrete category domain */
  categoryKey: keyof TData & string

  /** Semantic quantitative series definition */
  series: DivergingBarSeries<TData>

  /**
   * Orientation layout:
   * - "horizontal": Categories on vertical Y-axis, bars extend left/right from central vertical baseline (default).
   * - "vertical": Categories on horizontal X-axis, bars extend above/below from central horizontal baseline.
   */
  layout?: DivergingBarLayout

  /** Chart container height in pixels or CSS dimension string (default: 340) */
  height?: number | string

  /**
   * Explicit neutral numeric reference baseline (default: 0).
   * Deviation is computed as `value - baseline`. Finite numbers only.
   */
  baseline?: number

  /** Optional semantic label for the baseline (e.g. "Target", "Plan", "Budget", "SLA") */
  baselineLabel?: string

  /**
   * Quantitative scale domain policy:
   * - "symmetric": Extends equally on both sides of zero deviation `[-maxAbs, +maxAbs]` (default).
   * - `[min, max]`: Explicit custom deviation domain bounds.
   */
  domain?: [number, number] | "symmetric"

  /** Fill color for bars deviating above the reference (default: "var(--chart-1)") */
  aboveColor?: string

  /** Fill color for bars deviating below the reference (default: "var(--chart-2)") */
  belowColor?: string

  /** Stroke color for the reference baseline line (default: "var(--chart-axis)") */
  baselineColor?: string

  /** Accent outline color for the active/selected bar (default: "var(--chart-selection)") */
  selectionColor?: string

  /** Maximum width/thickness for individual bars in pixels (default: 36) */
  maxBarSize?: number

  /** Whether to render subtle background grid lines (default: true) */
  showGrid?: boolean

  /** Whether to render the directional legend (default: false) */
  showLegend?: boolean

  /** Inline numeric label policy (default: "none") */
  valueLabel?: DivergingValueLabel

  /** Optional motion configuration or toggle. Honors prefers-reduced-motion. (default: true) */
  motion?: boolean | { duration?: number }

  /** Accessible chart title for assistive technologies */
  title?: string

  /** Accessible description of the chart semantics */
  description?: string

  /** Explicit loading state */
  loading?: boolean

  /** Explicit error state or message */
  error?: Error | string | null

  /** Explicit unavailable state notice */
  unavailable?: boolean | string | null

  /** Additional CSS class for the root figure wrapper */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Mathematical & Classification Helpers                                */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && !Number.isNaN(val)
}

/**
 * Derives deviation from explicit baseline: `deviation = value - baseline`.
 * Preserves raw input values canonical while producing comparison space.
 */
export function computeDeviation(value: number, baseline: number): number {
  return value - baseline
}

/**
 * Classifies an observed value strictly relative to the baseline.
 * Never conflates raw positive/negative sign with above/below baseline position.
 */
export function classifyAgainstBaseline(
  value: number,
  baseline: number
): "above" | "below" | "equal" {
  const diff = value - baseline
  if (Math.abs(diff) < 1e-9) return "equal"
  return diff > 0 ? "above" : "below"
}

/**
 * Resolves a safe numeric domain in deviation space.
 * Default "symmetric" mode scales symmetrically `[-maxAbs, +maxAbs]` around zero deviation.
 */
export function resolveSymmetricDomain(
  deviations: (number | null)[],
  explicitDomain?: [number, number] | "symmetric"
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    explicitDomain.length === 2 &&
    isFiniteNumber(explicitDomain[0]) &&
    isFiniteNumber(explicitDomain[1]) &&
    explicitDomain[0] < explicitDomain[1]
  ) {
    return [explicitDomain[0], explicitDomain[1]]
  }

  const finiteDevs: number[] = []
  for (const d of deviations) {
    if (d !== null && isFiniteNumber(d)) {
      finiteDevs.push(d)
    }
  }

  if (finiteDevs.length === 0) {
    return [-10, 10]
  }

  const maxAbs = Math.max(...finiteDevs.map((d) => Math.abs(d)))
  if (maxAbs === 0) {
    return [-1, 1]
  }

  // Symmetrical margin padding (10% headroom, rounded nicely)
  const padded = maxAbs * 1.15
  const magnitude = Math.pow(10, Math.floor(Math.log10(padded)))
  const normalized = padded / magnitude
  let niceFactor = 10
  if (normalized <= 1) niceFactor = 1
  else if (normalized <= 2) niceFactor = 2
  else if (normalized <= 2.5) niceFactor = 2.5
  else if (normalized <= 5) niceFactor = 5
  const niceMax = Math.ceil(niceFactor * magnitude)

  return [-niceMax, niceMax]
}

/* -------------------------------------------------------------------------- */
/*  Direction-Aware Bar Shape with Outward Rounded Corners                    */
/* -------------------------------------------------------------------------- */

interface DivergingBarShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: PreparedDivergingDatum
  layout: DivergingBarLayout
  aboveColor: string
  belowColor: string
  selectionColor: string
  isActive?: boolean
}

function DivergingBarShape(props: DivergingBarShapeProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    payload,
    layout,
    aboveColor,
    belowColor,
    selectionColor,
    isActive = false,
  } = props

  if (!payload || payload.__deviation === null) {
    return null
  }

  const dev = payload.__deviation
  const isZero = Math.abs(dev) < 1e-9
  const isAbove = dev > 0

  const fill = isAbove ? aboveColor : belowColor
  const radius = 4

  // For zero deviations, render a tiny neutral baseline tick mark without falsifying magnitude
  if (isZero) {
    if (layout === "horizontal") {
      const markHeight = Math.max(height * 0.6, 6)
      const markY = y + (height - markHeight) / 2
      return (
        <line
          x1={x}
          x2={x}
          y1={markY}
          y2={markY + markHeight}
          stroke="var(--chart-axis-emphasis, #a1a1aa)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    } else {
      const markWidth = Math.max(width * 0.6, 6)
      const markX = x + (width - markWidth) / 2
      return (
        <line
          x1={markX}
          x2={markX + markWidth}
          y1={y}
          y2={y}
          stroke="var(--chart-axis-emphasis, #a1a1aa)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      )
    }
  }

  // Draw direction-aware rectangle with outward rounded corners
  // Baseline-contact edge remains structurally flat
  let pathD = ""
  const w = Math.max(Math.abs(width), 0)
  const h = Math.max(Math.abs(height), 0)
  const actualX = width < 0 ? x + width : x
  const actualY = height < 0 ? y + height : y

  if (layout === "horizontal") {
    const r = Math.min(radius, w / 2, h / 2)
    if (isAbove) {
      // Bar extends to the right: top-right & bottom-right rounded
      pathD = `
        M ${actualX},${actualY}
        H ${actualX + w - r}
        Q ${actualX + w},${actualY} ${actualX + w},${actualY + r}
        V ${actualY + h - r}
        Q ${actualX + w},${actualY + h} ${actualX + w - r},${actualY + h}
        H ${actualX}
        Z
      `
    } else {
      // Bar extends to the left: top-left & bottom-left rounded
      pathD = `
        M ${actualX + r},${actualY}
        H ${actualX + w}
        V ${actualY + h}
        H ${actualX + r}
        Q ${actualX},${actualY + h} ${actualX},${actualY + h - r}
        V ${actualY + r}
        Q ${actualX},${actualY} ${actualX + r},${actualY}
        Z
      `
    }
  } else {
    const r = Math.min(radius, w / 2, h / 2)
    if (isAbove) {
      // Bar rises upward: top-left & top-right rounded
      pathD = `
        M ${actualX},${actualY + h}
        V ${actualY + r}
        Q ${actualX},${actualY} ${actualX + r},${actualY}
        H ${actualX + w - r}
        Q ${actualX + w},${actualY} ${actualX + w},${actualY + r}
        V ${actualY + h}
        Z
      `
    } else {
      // Bar extends downward: bottom-left & bottom-right rounded
      pathD = `
        M ${actualX},${actualY}
        H ${actualX + w}
        V ${actualY + h - r}
        Q ${actualX + w},${actualY + h} ${actualX + w - r},${actualY + h}
        H ${actualX + r}
        Q ${actualX},${actualY + h} ${actualX},${actualY + h - r}
        Z
      `
    }
  }

  return (
    <g>
      <path
        d={pathD.trim()}
        fill={fill}
        opacity={isActive ? 1 : 0.9}
        stroke={isActive ? selectionColor : "none"}
        strokeWidth={isActive ? 2 : 0}
        className="transition-all duration-150"
      />
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function DivergingBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  categoryKey,
  series,
  layout = "horizontal",
  height = 340,
  baseline = 0,
  baselineLabel,
  domain = "symmetric",
  aboveColor = "var(--chart-1)",
  belowColor = "var(--chart-2)",
  baselineColor = "var(--chart-axis)",
  selectionColor = "var(--chart-selection)",
  maxBarSize = 36,
  showGrid = true,
  showLegend = false,
  valueLabel = "none",
  motion = true,
  title = "Diverging Bars",
  description,
  loading = false,
  error = null,
  unavailable = null,
  className,
}: DivergingBarsProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const isAnimated = motion !== false && !reducedMotion
  const animDuration =
    typeof motion === "object" && typeof motion?.duration === "number"
      ? motion.duration * 1000
      : 300

  // Validate finite baseline
  const isBaselineValid = isFiniteNumber(baseline)
  const safeBaseline = isBaselineValid ? baseline : 0

  // Keyboard exploration active category index
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)

  // Normalize data immutably into deviation space
  const preparedData: PreparedDivergingDatum<TData>[] = React.useMemo(() => {
    if (!Array.isArray(data)) return []

    return data.map((item, index) => {
      const rawCat = item?.[categoryKey]
      const category =
        typeof rawCat === "string" || typeof rawCat === "number" ? rawCat : `Category ${index + 1}`

      const rawVal = item?.[series.key]
      const finiteVal = isFiniteNumber(rawVal) ? rawVal : null

      const deviation =
        finiteVal !== null && isBaselineValid ? computeDeviation(finiteVal, safeBaseline) : null

      const position: DivergingPosition =
        finiteVal === null || !isBaselineValid
          ? "unavailable"
          : classifyAgainstBaseline(finiteVal, safeBaseline)

      return {
        ...item,
        __category: category,
        __index: index,
        __raw: item,
        __rawValue: finiteVal,
        __deviation: deviation,
        __position: position,
      }
    })
  }, [data, categoryKey, series.key, isBaselineValid, safeBaseline])

  // Resolve symmetric quantitative axis domain
  const deviations = React.useMemo(
    () => preparedData.map((d) => d.__deviation),
    [preparedData]
  )
  const resolvedDomain = React.useMemo(
    () => resolveSymmetricDomain(deviations, domain),
    [deviations, domain]
  )

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (preparedData.length === 0) return

    const isHorizontal = layout === "horizontal"
    const prevKey = isHorizontal ? "ArrowUp" : "ArrowLeft"
    const nextKey = isHorizontal ? "ArrowDown" : "ArrowRight"

    if (e.key === prevKey) {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null || prev <= 0 ? preparedData.length - 1 : prev - 1))
    } else if (e.key === nextKey) {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null || prev >= preparedData.length - 1 ? 0 : prev + 1))
    } else if (e.key === "Home") {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setActiveIndex(preparedData.length - 1)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setActiveIndex(null)
    }
  }

  // Formatters
  const formatValue = React.useCallback(
    (v: number | null) => {
      if (v === null) return "—"
      if (series.valueFormatter) return series.valueFormatter(v)
      return v.toLocaleString()
    },
    [series]
  )

  const formatDeviation = React.useCallback(
    (d: number | null) => {
      if (d === null) return "—"
      const sign = d > 0 ? "+" : d < 0 ? "−" : ""
      const absVal = Math.abs(d)
      if (series.valueFormatter) {
        return `${sign}${series.valueFormatter(absVal)}`
      }
      return `${sign}${absVal.toLocaleString()}`
    },
    [series]
  )

  // Deterministic state precedence
  if (error || !isBaselineValid) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof height === "number" ? height : 340 }}
      >
        <ChartErrorState
          title="Invalid baseline reference"
          description={
            !isBaselineValid
              ? "The baseline parameter must be a finite numeric value (NaN, Infinity, and -Infinity are rejected)."
              : typeof error === "string"
              ? error
              : error?.message || "Failed to render diverging bars."
          }
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof height === "number" ? height : 340 }}
      >
        <ChartUnavailableState
          title="Diverging data unavailable"
          description={typeof unavailable === "string" ? unavailable : undefined}
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof height === "number" ? height : 340 }}
      >
        <ChartLoadingState title="Loading diverging bars..." />
      </figure>
    )
  }

  if (!preparedData.length) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof height === "number" ? height : 340 }}
      >
        <ChartEmptyState
          title="No observations provided"
          description="Provide categorical data to inspect signed deviations around the neutral reference."
        />
      </figure>
    )
  }

  // Factual screen-reader accessibility summary
  const aboveCount = preparedData.filter((d) => d.__position === "above").length
  const belowCount = preparedData.filter((d) => d.__position === "below").length
  const equalCount = preparedData.filter((d) => d.__position === "equal").length
  const missingCount = preparedData.filter((d) => d.__position === "unavailable").length

  const a11ySummary = `${title}. Signed categorical comparison of ${series.label} relative to neutral reference ${safeBaseline}${
    baselineLabel ? ` (${baselineLabel})` : ""
  } across ${preparedData.length} categories. ${aboveCount} above reference, ${belowCount} below reference, ${equalCount} on reference${
    missingCount > 0 ? `, and ${missingCount} unavailable` : ""
  }.`

  const isHorizontal = layout === "horizontal"

  return (
    <figure
      ref={rootRef}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#2563eb)] focus-visible:ring-offset-2 rounded-xl",
        className
      )}
      style={{ height, minHeight: typeof height === "number" ? height : 340 }}
    >
      {/* Screen Reader Offscreen Analytical Summary & Data Table */}
      <div className="sr-only">
        <h2>{title}</h2>
        <p>{description || a11ySummary}</p>
        <table>
          <caption>{title} — Structured Observations</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Raw Value</th>
              <th scope="col">Reference Baseline</th>
              <th scope="col">Deviation</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((d) => (
              <tr key={String(d.__category)}>
                <th scope="row">{String(d.__category)}</th>
                <td>{formatValue(d.__rawValue)}</td>
                <td>{safeBaseline}</td>
                <td>{formatDeviation(d.__deviation)}</td>
                <td>
                  {d.__position === "above"
                    ? "Above reference"
                    : d.__position === "below"
                    ? "Below reference"
                    : d.__position === "equal"
                    ? "On reference"
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structural Directional Legend (Neutral) */}
      {showLegend && (
        <div
          aria-hidden="true"
          className="flex flex-wrap items-center justify-end gap-5 px-3 py-1.5 text-xs text-muted-foreground font-medium"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: aboveColor }}
            />
            <span>Above reference</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: belowColor }}
            />
            <span>Below reference</span>
          </div>
          {baselineLabel && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 bg-[var(--chart-axis,#71717a)] shrink-0"
              />
              <span>
                {baselineLabel} · {safeBaseline}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Core Chart Canvas */}
      <div className="flex-1 w-full h-full min-w-0 min-h-0">
        <ChartContainer className="w-full h-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 320, height: typeof height === "number" ? height : 340 }}
          >
            <BarChart
              data={preparedData}
              layout={isHorizontal ? "vertical" : "horizontal"}
              margin={{
                top: 16,
                right: 24,
                left: isHorizontal ? 20 : -10,
                bottom: 12,
              }}
              onMouseMove={(state) => {
                if (state?.activeTooltipIndex !== undefined && state.activeTooltipIndex !== null) {
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
                  horizontal={isHorizontal ? false : true}
                  vertical={isHorizontal ? true : false}
                  stroke="var(--chart-grid, rgba(255,255,255,0.06))"
                />
              )}

              {/* Categorical & Quantitative Axes */}
              {isHorizontal ? (
                <>
                  <XAxis
                    type="number"
                    domain={resolvedDomain}
                    stroke="var(--chart-axis, #71717a)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => (v === 0 ? "0" : v > 0 ? `+${v}` : `−${Math.abs(v)}`)}
                  />
                  <YAxis
                    type="category"
                    dataKey="__category"
                    stroke="var(--chart-axis, #71717a)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={75}
                  />
                  {/* Structural Reference Line at zero deviation */}
                  <ReferenceLine
                    x={0}
                    stroke={baselineColor}
                    strokeWidth={1.5}
                    label={
                      baselineLabel
                        ? {
                            value: `${baselineLabel} (${safeBaseline})`,
                            position: "top",
                            fill: "var(--chart-axis-emphasis, #d4d4d8)",
                            fontSize: 10,
                            offset: 8,
                          }
                        : undefined
                    }
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="__category"
                    stroke="var(--chart-axis, #71717a)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="number"
                    domain={resolvedDomain}
                    stroke="var(--chart-axis, #71717a)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => (v === 0 ? "0" : v > 0 ? `+${v}` : `−${Math.abs(v)}`)}
                  />
                  {/* Structural Reference Line at zero deviation */}
                  <ReferenceLine
                    y={0}
                    stroke={baselineColor}
                    strokeWidth={1.5}
                    label={
                      baselineLabel
                        ? {
                            value: `${baselineLabel} (${safeBaseline})`,
                            position: "right",
                            fill: "var(--chart-axis-emphasis, #d4d4d8)",
                            fontSize: 10,
                            offset: 8,
                          }
                        : undefined
                    }
                  />
                </>
              )}

              {/* Synchronized Analytical Tooltip */}
              <Tooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{
                  fill: "var(--chart-grid, rgba(255, 255, 255, 0.04))",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const row = payload[0]?.payload as PreparedDivergingDatum<TData> | undefined
                  if (!row) return null

                  const isMissing = row.__position === "unavailable"
                  const isZero = row.__position === "equal"
                  const isAbove = row.__position === "above"

                  const markerColor = isMissing
                    ? "var(--muted, #71717a)"
                    : isZero
                    ? "var(--chart-axis-emphasis, #d4d4d8)"
                    : isAbove
                    ? aboveColor
                    : belowColor

                  return (
                    <div
                      role="tooltip"
                      className="plotcn-chart-tooltip rounded-xl border border-white/[0.12] bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[min(200px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs font-sans not-prose space-y-2.5"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 gap-2">
                        <span className="font-semibold text-zinc-100 text-sm tracking-tight truncate">
                          {String(row.__category)}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase",
                            isMissing
                              ? "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                              : isZero
                              ? "bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                              : isAbove
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}
                        >
                          {isMissing
                            ? "Unavailable"
                            : isZero
                            ? "On Reference"
                            : isAbove
                            ? "Above Reference"
                            : "Below Reference"}
                        </span>
                      </div>

                      {/* Values & Deviation Summary */}
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-400">Value</span>
                          <span className="font-semibold text-zinc-100 tabular-nums">
                            {formatValue(row.__rawValue)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-400">
                            {baselineLabel ? baselineLabel : "Reference"}
                          </span>
                          <span className="text-zinc-300 tabular-nums">
                            {series.valueFormatter ? series.valueFormatter(safeBaseline) : safeBaseline}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/[0.06]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="size-2 rounded-full shrink-0"
                              style={{ backgroundColor: markerColor }}
                            />
                            <span className="text-zinc-300">Deviation</span>
                          </div>
                          <span
                            className={cn(
                              "font-bold tabular-nums",
                              isZero
                                ? "text-zinc-300"
                                : isAbove
                                ? "text-blue-400"
                                : "text-amber-400"
                            )}
                          >
                            {formatDeviation(row.__deviation)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />

              {/* The Diverging Bar with Custom Direction-Aware Geometry */}
              <Bar
                dataKey="__deviation"
                maxBarSize={maxBarSize}
                isAnimationActive={isAnimated}
                animationDuration={animDuration}
                shape={(props: unknown) => (
                  <DivergingBarShape
                    {...(props as DivergingBarShapeProps)}
                    layout={layout}
                    aboveColor={aboveColor}
                    belowColor={belowColor}
                    selectionColor={selectionColor}
                    isActive={activeIndex === (props as DivergingBarShapeProps)?.payload?.__index}
                  />
                )}
              >
                {/* Optional Outward Value Labels */}
                {valueLabel !== "none" && (
                  <LabelList
                    dataKey="__deviation"
                    position={isHorizontal ? "right" : "top"}
                    formatter={(val: unknown) => {
                      if (typeof val !== "number") return ""
                      if (valueLabel === "value") {
                        // Locate matching raw value
                        const matching = preparedData.find((d) => d.__deviation === val)
                        return matching ? formatValue(matching.__rawValue) : ""
                      }
                      return formatDeviation(val)
                    }}
                    style={{
                      fill: "var(--chart-foreground, #fafafa)",
                      fontSize: 10,
                      fontFamily: "monospace",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </figure>
  )
}
