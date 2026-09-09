"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
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

export type VarianceOrientation = "vertical" | "horizontal"
export type VarianceValueLabel = "none" | "variance" | "auto"
export type VariancePosition = "above" | "below" | "equal" | "unavailable"

export interface VarianceBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property on data record representing the observed actual measure */
  actualKey: NumericKeyOf<TData>
  /** Property on data record representing the reference plan/target */
  planKey: NumericKeyOf<TData>
  /** Semantic label for the series (e.g. "Revenue variance", "Operating budget") */
  label: string
  /** Human-readable label for the actual value (default: "Actual") */
  actualLabel?: string
  /** Human-readable label for the plan value (default: "Plan") */
  planLabel?: string
  /** Human-readable label for the derived delta (default: "Variance") */
  varianceLabel?: string
  /** Custom formatter for the source actual and plan values */
  valueFormatter?: (value: number) => string
  /** Custom formatter for the derived signed variance */
  varianceFormatter?: (value: number) => string
}

export interface PreparedVarianceDatum<TData> {
  __source: TData
  __index: number
  __category: string | number
  __actual: number | null
  __plan: number | null
  __variance: number | null
  __direction: "positive" | "negative" | "zero" | "unavailable"
  __position: VariancePosition
  __plotcnVariance: number | null
  [key: string]: unknown
}

export interface VarianceBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Array of categorical data records. Order is strictly caller-preserved. */
  data: readonly TData[]
  /** Key on data records representing the discrete category label */
  categoryKey: keyof TData & string
  /** Strong series definition for actual and plan measures */
  series: VarianceBarSeries<TData>
  /**
   * Bar orientation:
   * - "vertical": Categories on horizontal X-axis, bars extend vertically from baseline (default).
   * - "horizontal": Categories on vertical Y-axis, bars extend horizontally from baseline.
   */
  orientation?: VarianceOrientation
  /** Container height in pixels or CSS string (default: 340) */
  height?: number | string
  /** Quantitative domain policy or explicit bounds (must include zero) */
  domain?: [number, number] | "auto"
  /** Fill color for positive variance bars (actual > plan, default: var(--chart-1)) */
  positiveColor?: string
  /** Fill color for negative variance bars (actual < plan, default: var(--chart-2)) */
  negativeColor?: string
  /** Stroke color for the zero baseline reference line (default: var(--chart-axis)) */
  zeroColor?: string
  /** Emphasis color for the active/inspected category (default: var(--chart-selection)) */
  selectionColor?: string
  /** Whether to render subtle quantitative grid lines (default: true) */
  showGrid?: boolean
  /** Whether to render the prominent zero reference baseline (default: true) */
  showZeroLine?: boolean
  /** Whether to display a directional legend (default: false) */
  showLegend?: boolean
  /** Permanent value label display policy (default: "none") */
  valueLabel?: VarianceValueLabel
  /** Tooltip depth: "full" shows actual, plan, and variance; "variance" shows delta only (default: "full") */
  tooltipMode?: "variance" | "full"
  /** Maximum bar thickness in pixels (default: 36) */
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

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && !Number.isNaN(val)
}

/**
 * Computes arithmetic variance as `actual - plan`.
 * Returns null if either value is non-finite or missing.
 */
export function computeVariance(
  actual: number | null | undefined,
  plan: number | null | undefined
): number | null {
  if (!isFiniteNumber(actual) || !isFiniteNumber(plan)) {
    return null
  }
  return actual - plan
}

/**
 * Classifies variance direction into neutral factual terms.
 */
export function classifyVarianceDirection(
  variance: number | null
): "positive" | "negative" | "zero" | "unavailable" {
  if (variance === null || !Number.isFinite(variance)) {
    return "unavailable"
  }
  if (variance > 0) return "positive"
  if (variance < 0) return "negative"
  return "zero"
}

export function classifyVariancePosition(
  variance: number | null
): VariancePosition {
  if (variance === null || !Number.isFinite(variance)) {
    return "unavailable"
  }
  if (variance > 0) return "above"
  if (variance < 0) return "below"
  return "equal"
}

/**
 * Resolves quantitative domain following Policy B:
 * - Mixed signs: Symmetric around zero [-extent, +extent]
 * - Positive only: [0, safeMax]
 * - Negative only: [safeMin, 0]
 * - All zero: [-1, 1]
 */
export function resolveVarianceDomain(
  validVariances: readonly number[],
  explicitDomain?: [number, number] | "auto"
): [number, number] {
  if (explicitDomain && explicitDomain !== "auto" && Array.isArray(explicitDomain)) {
    const [dMin, dMax] = explicitDomain
    if (isFiniteNumber(dMin) && isFiniteNumber(dMax)) {
      // Must include 0
      return [Math.min(0, dMin), Math.max(0, dMax)]
    }
  }

  if (validVariances.length === 0) {
    return [-10, 10]
  }

  let min = 0
  let max = 0
  for (const v of validVariances) {
    if (v < min) min = v
    if (v > max) max = v
  }

  // All zero
  if (min === 0 && max === 0) {
    return [-1, 1]
  }

  // Mixed signs -> Symmetric domain
  if (min < 0 && max > 0) {
    const extent = Math.max(Math.abs(min), Math.abs(max))
    const padded = Math.ceil(extent * 1.08)
    return [-padded, padded]
  }

  // Negative only
  if (max <= 0) {
    const paddedMin = Math.floor(min * 1.08)
    return [paddedMin, 0]
  }

  // Positive only
  const paddedMax = Math.ceil(max * 1.08)
  return [0, paddedMax]
}

/**
 * Formats a signed variance number with explicit +/- and unicode minus.
 */
export function defaultFormatVariance(v: number): string {
  if (v === 0) return "0"
  if (v > 0) return `+${v.toLocaleString()}`
  return `\u2212${Math.abs(v).toLocaleString()}`
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function VarianceBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  orientation = "vertical",
  height = 340,
  domain = "auto",
  positiveColor = "var(--chart-1, #3b82f6)",
  negativeColor = "var(--chart-2, #f97316)",
  zeroColor = "var(--chart-axis, #71717a)",
  selectionColor = "var(--chart-selection, #eab308)",
  showGrid = true,
  showZeroLine = true,
  showLegend = false,
  valueLabel = "none",
  tooltipMode = "full",
  maxBarSize = 36,
  motion = true,
  className,
  title = "Variance Analysis",
  description = "Categorical variance chart displaying actual-versus-plan deviations around an explicit zero baseline.",
  loading = false,
}: VarianceBarsProps<TData>) {
  const isHorizontal = orientation === "horizontal"

  // 1. Prepare data immutably
  const preparedData = React.useMemo<PreparedVarianceDatum<TData>[]>(() => {
    if (!Array.isArray(data)) return []

    return data.map((item, idx) => {
      const rawActual = item[series.actualKey]
      const rawPlan = item[series.planKey]

      const actual = isFiniteNumber(rawActual) ? rawActual : null
      const plan = isFiniteNumber(rawPlan) ? rawPlan : null
      const variance = computeVariance(actual, plan)
      const direction = classifyVarianceDirection(variance)
      const position = classifyVariancePosition(variance)

      const categoryVal = item[categoryKey]
      const category = categoryVal != null ? String(categoryVal) : `Item ${idx + 1}`

      return {
        ...item,
        __source: item,
        __index: idx,
        __category: category,
        __actual: actual,
        __plan: plan,
        __variance: variance,
        __direction: direction,
        __position: position,
        __plotcnVariance: variance,
      }
    })
  }, [data, categoryKey, series.actualKey, series.planKey])

  // 2. Extract valid finite variances and compute domain
  const validVariances = React.useMemo(() => {
    return preparedData
      .map((d) => d.__variance)
      .filter((v): v is number => isFiniteNumber(v))
  }, [preparedData])

  const computedDomain = React.useMemo(() => {
    return resolveVarianceDomain(validVariances, domain)
  }, [validVariances, domain])

  // 3. Active inspection state
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (preparedData.length === 0) return

      if (isHorizontal) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setActiveIndex((prev) => (prev === null || prev >= preparedData.length - 1 ? 0 : prev + 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setActiveIndex((prev) => (prev === null || prev <= 0 ? preparedData.length - 1 : prev - 1))
        } else if (e.key === "Home") {
          e.preventDefault()
          setActiveIndex(0)
        } else if (e.key === "End") {
          e.preventDefault()
          setActiveIndex(preparedData.length - 1)
        }
      } else {
        if (e.key === "ArrowRight") {
          e.preventDefault()
          setActiveIndex((prev) => (prev === null || prev >= preparedData.length - 1 ? 0 : prev + 1))
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          setActiveIndex((prev) => (prev === null || prev <= 0 ? preparedData.length - 1 : prev - 1))
        } else if (e.key === "Home") {
          e.preventDefault()
          setActiveIndex(0)
        } else if (e.key === "End") {
          e.preventDefault()
          setActiveIndex(preparedData.length - 1)
        }
      }
    },
    [isHorizontal, preparedData.length]
  )

  // Color resolver per datum
  const getBarFill = React.useCallback(
    (datum: PreparedVarianceDatum<TData>, isFocused: boolean) => {
      if (isFocused && selectionColor) {
        return selectionColor
      }
      if (datum.__direction === "positive") return positiveColor
      if (datum.__direction === "negative") return negativeColor
      return zeroColor
    },
    [positiveColor, negativeColor, zeroColor, selectionColor]
  )

  // Formatters
  const valFmt = series.valueFormatter || ((v: number) => v.toLocaleString())
  const varFmt = series.varianceFormatter || defaultFormatVariance

  const actualLabelText = series.actualLabel || "Actual"
  const planLabelText = series.planLabel || "Plan"
  const varianceLabelText = series.varianceLabel || "Variance"

  // Summary counts for accessibility
  const summaryCounts = React.useMemo(() => {
    let above = 0
    let below = 0
    let onPlan = 0
    let unavail = 0
    for (const d of preparedData) {
      if (d.__position === "above") above++
      else if (d.__position === "below") below++
      else if (d.__position === "equal") onPlan++
      else unavail++
    }
    return { above, below, onPlan, unavail, total: preparedData.length }
  }, [preparedData])

  if (loading) {
    return <ChartLoadingState style={{ height }} className={className} />
  }

  if (preparedData.length === 0) {
    return <ChartEmptyState style={{ height }} title="No variance data available" className={className} />
  }

  const chartMargin = isHorizontal
    ? { top: 16, right: 32, bottom: 24, left: 16 }
    : { top: 24, right: 20, bottom: 32, left: 20 }

  return (
    <figure
      ref={containerRef}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "plotcn-chart plotcn-variance-chart relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none",
        className
      )}
      style={{
        ["--chart-1" as string]: positiveColor,
        ["--chart-2" as string]: negativeColor,
      }}
    >
      <div className="sr-only">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>
          Showing {summaryCounts.total} categories. {summaryCounts.above} above plan, {summaryCounts.below} below plan,{" "}
          {summaryCounts.onPlan} on plan
          {summaryCounts.unavail > 0 ? `, ${summaryCounts.unavail} unavailable` : ""}.
          Use arrow keys ({isHorizontal ? "Up and Down" : "Left and Right"}) to inspect categories.
        </p>
      </div>

      {/* Structural Directional Legend */}
      {showLegend && (
        <div
          role="region"
          aria-label="Directional Legend"
          className="flex flex-wrap items-center justify-end gap-5 px-3 py-2 text-xs text-muted-foreground border-b border-border/50 mb-2"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-xs shrink-0"
              style={{ backgroundColor: positiveColor }}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">
              Above {planLabelText} (+{varianceLabelText})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-xs shrink-0"
              style={{ backgroundColor: negativeColor }}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">
              Below {planLabelText} (&minus;{varianceLabelText})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-0.5 shrink-0"
              style={{ backgroundColor: zeroColor }}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">Equal (Zero variance)</span>
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
                  tickFormatter={varFmt}
                />
                <YAxis
                  type="category"
                  dataKey="__category"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                />
                {showZeroLine && (
                  <ReferenceLine
                    x={0}
                    stroke={zeroColor}
                    strokeWidth={2}
                    className="plotcn-variance-zero-baseline"
                  />
                )}
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
                  tickFormatter={varFmt}
                  width={55}
                />
                {showZeroLine && (
                  <ReferenceLine
                    y={0}
                    stroke={zeroColor}
                    strokeWidth={2}
                    className="plotcn-variance-zero-baseline"
                  />
                )}
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
                const datum = payload[0].payload as PreparedVarianceDatum<TData>
                if (!datum) return null

                const hasActual = datum.__actual !== null
                const hasPlan = datum.__plan !== null
                const hasVariance = datum.__variance !== null

                return (
                  <div
                    role="tooltip"
                    className="rounded-lg border border-border/70 bg-popover/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl text-xs space-y-2 pointer-events-none min-w-[190px] max-w-[calc(100cqw-16px)]"
                  >
                    <div className="font-semibold text-foreground text-sm border-b border-border/50 pb-1.5 truncate">
                      {datum.__category}
                    </div>

                    <div className="space-y-1.5">
                      {tooltipMode === "full" && (
                        <>
                          <div className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>{actualLabelText}</span>
                            <span className="font-medium text-foreground font-mono">
                              {hasActual ? valFmt(datum.__actual!) : "Unavailable"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4 text-muted-foreground">
                            <span>{planLabelText}</span>
                            <span className="font-medium text-foreground font-mono">
                              {hasPlan ? valFmt(datum.__plan!) : "Unavailable"}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/40 font-semibold">
                        <span className="text-foreground">{varianceLabelText}</span>
                        <span
                          className={cn(
                            "font-mono font-bold",
                            datum.__direction === "positive"
                              ? "text-blue-500 dark:text-blue-400"
                              : datum.__direction === "negative"
                              ? "text-orange-500 dark:text-orange-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {hasVariance ? varFmt(datum.__variance!) : "Unavailable"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-0.5 text-[11px] text-muted-foreground/80">
                        <span>Position</span>
                        <span className="capitalize text-foreground font-medium">
                          {datum.__position === "above" && `Above ${planLabelText.toLowerCase()}`}
                          {datum.__position === "below" && `Below ${planLabelText.toLowerCase()}`}
                          {datum.__position === "equal" && `On ${planLabelText.toLowerCase()}`}
                          {datum.__position === "unavailable" && "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }}
            />

            <Bar
              dataKey="__plotcnVariance"
              fill={positiveColor}
              maxBarSize={maxBarSize}
              isAnimationActive={Boolean(motion)}
              animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 600}
              radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            >
              {preparedData.map((entry, idx) => {
                const isFocused = activeIndex === idx
                return (
                  <Cell
                    key={`variance-cell-${entry.__category}-${idx}`}
                    fill={getBarFill(entry, isFocused)}
                    stroke={isFocused ? selectionColor : "none"}
                    strokeWidth={isFocused ? 2 : 0}
                    className="transition-colors duration-150"
                  />
                )
              })}

              {valueLabel !== "none" && (
                <LabelList
                  dataKey="__plotcnVariance"
                  position={isHorizontal ? "right" : "top"}
                  formatter={(val: unknown) => (isFiniteNumber(val) ? varFmt(val) : "")}
                  className="fill-foreground font-mono text-[11px]"
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Accessible Structured Data Alternative Table */}
      <div className="sr-only">
        <table>
          <caption>
            {title} — Structured actual versus plan variance data
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">{actualLabelText}</th>
              <th scope="col">{planLabelText}</th>
              <th scope="col">{varianceLabelText}</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((d, idx) => (
              <tr key={`a11y-row-${idx}`}>
                <th scope="row">{d.__category}</th>
                <td>{d.__actual !== null ? valFmt(d.__actual) : "Unavailable"}</td>
                <td>{d.__plan !== null ? valFmt(d.__plan) : "Unavailable"}</td>
                <td>{d.__variance !== null ? varFmt(d.__variance) : "Unavailable"}</td>
                <td>
                  {d.__position === "above" && `Above ${planLabelText.toLowerCase()}`}
                  {d.__position === "below" && `Below ${planLabelText.toLowerCase()}`}
                  {d.__position === "equal" && `On ${planLabelText.toLowerCase()}`}
                  {d.__position === "unavailable" && "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
