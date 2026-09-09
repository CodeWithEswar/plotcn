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
  LabelList,
} from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartEmptyState,
  ChartErrorState,
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

export type PercentStackLayout = "vertical" | "horizontal"
export type PercentStackValueLabel = "none" | "auto"
export type PercentStackMissingPolicy = "incomplete" | "zero"
export type ObservationCompositionState = "valid" | "incomplete" | "zero-total"

/**
 * Additive contributor series definition for PercentStackBars.
 * Represents a discrete additive component of the categorical whole.
 */
export interface PercentStackBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on data records representing contributor's raw numeric magnitude */
  key: NumericKeyOf<TData>
  /** Human-readable display label for tooltips, legend, and screen readers */
  label: string
  /** Explicit per-series color override (defaults to theme tokens: var(--chart-1), var(--chart-2), etc.) */
  color?: string
  /** Optional custom numeric formatter for raw measurement in tooltips */
  valueFormatter?: (value: number) => string
}

export interface ResolvedPercentStackSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  key: NumericKeyOf<TData>
  label: string
  color: string
  valueFormatter?: (value: number) => string
  originalIndex: number
}

/**
 * Inspected categorical record containing resolved raw measurements, derived shares, and total state.
 */
export interface ActivePercentStackDatum<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** 0-based index of the category within caller-preserved order */
  index: number
  /** Discrete category label or value */
  category: string | number
  /** Original raw datum provided by caller */
  raw: TData
  /** Per-contributor raw numeric measurements (null indicates unavailable/missing) */
  rawValues: Record<string, number | null>
  /** Derived normalized proportional shares (0–100%) for visible contributors */
  shares: Record<string, number | null>
  /** Visible category total sum across currently visible contributors (null if incomplete) */
  visibleRawTotal: number | null
  /** Composition validity state */
  state: ObservationCompositionState
}

export interface NormalizedPercentStackRow<TData = Record<string, unknown>> {
  __category: string | number
  __index: number
  __raw: TData
  __rawValues: Record<string, number | null>
  __shares: Record<string, number | null>
  __visibleRawTotal: number | null
  __state: ObservationCompositionState
  [key: string]: unknown
}

export interface PercentStackBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Readonly array of categorical records. Caller order is strictly preserved. */
  data: readonly TData[]

  /** Property key defining the discrete category domain */
  categoryKey: keyof TData & string

  /** Array of two or more additive contributor series composing the category whole */
  series: readonly PercentStackBarSeries<TData>[]

  /**
   * Orientation layout:
   * - "vertical": Categories on horizontal X-axis, bars grow vertically to 100% (default).
   * - "horizontal": Categories on vertical Y-axis, bars grow horizontally to 100%.
   */
  layout?: PercentStackLayout

  /** Chart container height in pixels or CSS dimension string. (default: 340) */
  height?: number | string

  /** Space between distinct category stacks along the categorical axis in pixels. (default: 20) */
  groupGap?: number

  /** Maximum width/thickness for individual stacked bars in pixels. (default: 48) */
  maxBarSize?: number

  /** Whether to render subtle reference grid lines at 0%, 25%, 50%, 75%, 100%. (default: true) */
  showGrid?: boolean

  /** Whether to render the categorical axis ticks and line. (default: true) */
  showXAxis?: boolean

  /** Whether to render the percentage axis ticks (0% - 100%) and line. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series legend. (default: true) */
  showLegend?: boolean

  /** Whether the legend allows clicking contributors to toggle visibility. (default: true) */
  interactiveLegend?: boolean

  /**
   * Value label rendering policy:
   * - "none": No inline numeric labels (default).
   * - "auto": Render percentage labels inside segments when space permits.
   */
  valueLabel?: PercentStackValueLabel

  /**
   * Handling of missing or non-finite contributor observations:
   * - "incomplete": (default) If any visible contributor is missing or invalid, omit stack geometry to prevent visual deception and mark composition unavailable.
   * - "zero": Explicitly treat missing values as zero contribution (0%).
   */
  missingValuePolicy?: PercentStackMissingPolicy

  /** Motion animation toggle or configuration. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Optional custom percentage formatter for tooltips and labels (default: `${val.toFixed(1)}%`) */
  percentageFormatter?: (value: number) => string

  /** Optional custom category label formatter for axes and tooltips */
  categoryFormatter?: (category: string | number) => string

  /** Optional global raw value formatter fallback */
  valueFormatter?: (value: number) => string

  /** Callback fired when the active inspected category changes */
  onActiveChange?: (active: ActivePercentStackDatum<TData> | null) => void

  /** Optional additional CSS class for root wrapper */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Algorithmic Helpers: Pure & Deterministic                                 */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Resolves canonical series definitions to concrete color tokens.
 * Crucial contract: Series index in original configured array determines color token.
 * Hiding one series will never shift another series' assigned color token.
 */
export function resolvePercentStackSeries<TData extends Record<string, unknown>>(
  series: readonly PercentStackBarSeries<TData>[]
): ResolvedPercentStackSeries<TData>[] {
  return series.map((s, index) => {
    const paletteIndex = (index % 8) + 1
    const defaultColor = `var(--chart-${paletteIndex})`
    return {
      key: s.key,
      label: s.label || String(s.key),
      color: s.color && s.color.trim() !== "" ? s.color : defaultColor,
      valueFormatter: s.valueFormatter,
      originalIndex: index,
    }
  })
}

export interface PercentStackNormalizationResult<TData> {
  rows: NormalizedPercentStackRow<TData>[]
  hasNegativeValues: boolean
  negativeErrorDetails?: string
}

/**
 * Pure normalization pipeline for 100% categorical stacked bars:
 * 1. Checks for negative values (V1 strictly rejects negatives; additive composition only).
 * 2. Missing values: under "incomplete", any missing contributor marks category unavailable.
 *    Under "zero", missing values are coerced to 0.
 * 3. Zero total (sum = 0): shares are null / 0, avoiding divide-by-zero or NaN.
 * 4. Normalizes visible series so they sum to exactly 100% of visible total.
 * 5. Input immutability strictly preserved (never mutates caller objects).
 */
export function normalizePercentStackData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  categoryKey: keyof TData & string,
  resolvedSeries: readonly ResolvedPercentStackSeries<TData>[],
  visibleKeys: ReadonlySet<string>,
  missingValuePolicy: PercentStackMissingPolicy = "incomplete"
): PercentStackNormalizationResult<TData> {
  if (!Array.isArray(data) || data.length === 0) {
    return { rows: [], hasNegativeValues: false }
  }

  const rows: NormalizedPercentStackRow<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    if (!d || typeof d !== "object") {
      rows.push({
        __category: `Item ${i + 1}`,
        __index: i,
        __raw: d,
        __rawValues: {},
        __shares: {},
        __visibleRawTotal: null,
        __state: "incomplete",
      })
      continue
    }

    const rawCat = (d as Record<string, unknown>)[categoryKey]
    const category = rawCat !== undefined && rawCat !== null ? String(rawCat) : `Item ${i + 1}`

    const rawValues: Record<string, number | null> = {}
    const shares: Record<string, number | null> = {}
    let isComplete = true
    let visibleRawTotal = 0

    // First pass: extract and validate individual series measurements
    for (const s of resolvedSeries) {
      const rawVal = (d as Record<string, unknown>)[s.key as string]
      if (typeof rawVal === "number") {
        if (!Number.isFinite(rawVal)) {
          rawValues[s.key] = null
          if (visibleKeys.has(s.key)) isComplete = false
        } else if (rawVal < 0) {
          return {
            rows: [],
            hasNegativeValues: true,
            negativeErrorDetails: `Percent Stack Bars requires non-negative raw contributions. Found negative value (${rawVal}) for series "${s.label}" at category "${category}".`,
          }
        } else {
          rawValues[s.key] = rawVal
          if (visibleKeys.has(s.key)) {
            visibleRawTotal += rawVal
          }
        }
      } else if (rawVal === null || rawVal === undefined) {
        if (missingValuePolicy === "zero") {
          rawValues[s.key] = 0
        } else {
          rawValues[s.key] = null
          if (visibleKeys.has(s.key)) {
            isComplete = false
          }
        }
      } else {
        // Unknown type or invalid string
        rawValues[s.key] = null
        if (visibleKeys.has(s.key)) isComplete = false
      }
    }

    // Determine state
    let state: ObservationCompositionState = "valid"
    if (!isComplete) {
      state = "incomplete"
    } else if (visibleRawTotal === 0) {
      state = "zero-total"
    }

    // Second pass: compute normalized 0–100% shares safely
    for (const s of resolvedSeries) {
      const val = rawValues[s.key]
      if (!visibleKeys.has(s.key)) {
        shares[s.key] = null
      } else if (state === "valid" && visibleRawTotal > 0 && val !== null) {
        // Proportional share in 0–100 range
        shares[s.key] = (val / visibleRawTotal) * 100
      } else if (state === "zero-total") {
        shares[s.key] = 0
      } else {
        shares[s.key] = null
      }
    }

    const rowObj: NormalizedPercentStackRow<TData> = {
      __category: category,
      __index: i,
      __raw: d,
      __rawValues: rawValues,
      __shares: shares,
      __visibleRawTotal: state === "incomplete" ? null : visibleRawTotal,
      __state: state,
    }

    // Attach normalized keys for Recharts stacked Bar rendering
    for (const s of resolvedSeries) {
      if (visibleKeys.has(s.key) && state === "valid") {
        rowObj[s.key] = shares[s.key] ?? 0
      } else {
        rowObj[s.key] = 0
      }
    }

    rows.push(rowObj)
  }

  return { rows, hasNegativeValues: false }
}


/* -------------------------------------------------------------------------- */
/*  Main Component: PercentStackBars                                          */
/* -------------------------------------------------------------------------- */

export function PercentStackBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  layout = "vertical",
  height = 340,
  groupGap = 20,
  maxBarSize = 48,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  valueLabel = "none",
  missingValuePolicy = "incomplete",
  motion = true,
  percentageFormatter,
  categoryFormatter,
  valueFormatter: globalValueFormatter,
  onActiveChange,
  className,
}: PercentStackBarsProps<TData>) {
  /* ------------------------------------------------------------------------ */
  /*  Hooks & State (strictly declared before early returns)                  */
  /* ------------------------------------------------------------------------ */

  const screenReaderId = React.useId()
  const isReducedMotion = useChartReducedMotion()
  const motionEnabled = !isReducedMotion && Boolean(motion)

  const defaultShareFormatter = React.useCallback(
    (val: number) => (percentageFormatter ? percentageFormatter(val) : `${val.toFixed(1)}%`),
    [percentageFormatter]
  )

  const resolvedSeries = React.useMemo(() => {
    return resolvePercentStackSeries(series || [])
  }, [series])

  // Interactive Legend: hidden series tracking (state only holds user-hidden keys)
  const [hiddenKeys, setHiddenKeys] = React.useState<ReadonlySet<string>>(new Set())

  // Derive visible series keys
  const visibleKeys = React.useMemo(() => {
    return new Set(
      resolvedSeries
        .filter((s) => !hiddenKeys.has(s.key))
        .map((s) => s.key)
    )
  }, [resolvedSeries, hiddenKeys])

  // Normalize data with pure deterministic helper
  const normalizationResult = React.useMemo(() => {
    return normalizePercentStackData(
      data || [],
      categoryKey,
      resolvedSeries,
      visibleKeys,
      missingValuePolicy
    )
  }, [data, categoryKey, resolvedSeries, visibleKeys, missingValuePolicy])

  const { rows, hasNegativeValues, negativeErrorDetails } = normalizationResult

  // Active category inspection state
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [activeSeriesKey, setActiveSeriesKey] = React.useState<string | null>(null)

  // Active datum resolution
  const activeDatum = React.useMemo<ActivePercentStackDatum<TData> | null>(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= rows.length) {
      return null
    }
    const row = rows[activeIndex]
    return {
      index: row.__index,
      category: row.__category,
      raw: row.__raw,
      rawValues: row.__rawValues,
      shares: row.__shares,
      visibleRawTotal: row.__visibleRawTotal,
      state: row.__state,
    }
  }, [activeIndex, rows])

  React.useEffect(() => {
    onActiveChange?.(activeDatum)
  }, [activeDatum, onActiveChange])

  // Legend visibility toggle handler
  const handleToggleSeries = React.useCallback(
    (key: string) => {
      if (!interactiveLegend) return
      setHiddenKeys((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        return next
      })
    },
    [interactiveLegend]
  )

  const handleShowAll = React.useCallback(() => {
    setHiddenKeys(new Set())
  }, [])

  // Keyboard navigation & layout orientation mapping
  const isVertical = layout === "vertical"
  const rechartsLayout = isVertical ? "horizontal" : "vertical"

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (rows.length === 0) return

      const prevKey = isVertical ? "ArrowLeft" : "ArrowUp"
      const nextKey = isVertical ? "ArrowRight" : "ArrowDown"

      if (e.key === prevKey) {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev <= 0 ? rows.length - 1 : prev - 1))
      } else if (e.key === nextKey) {
        e.preventDefault()
        setActiveIndex((prev) => (prev === null || prev >= rows.length - 1 ? 0 : prev + 1))
      } else if (e.key === "Home") {
        e.preventDefault()
        setActiveIndex(0)
      } else if (e.key === "End") {
        e.preventDefault()
        setActiveIndex(rows.length - 1)
      } else if (e.key === "Escape") {
        e.preventDefault()
        setActiveIndex(null)
        setActiveSeriesKey(null)
      }
    },
    [rows.length, isVertical]
  )

  // Visible series in canonical order
  const visibleSeriesList = React.useMemo(() => {
    return resolvedSeries.filter((s) => visibleKeys.has(s.key))
  }, [resolvedSeries, visibleKeys])

  const outermostSeriesKey = React.useMemo(() => {
    return visibleSeriesList.length > 0 ? visibleSeriesList[visibleSeriesList.length - 1].key : null
  }, [visibleSeriesList])

  /* ------------------------------------------------------------------------ */
  /*  Early Return States (only after all hooks are declared)                */
  /* ------------------------------------------------------------------------ */

  if (hasNegativeValues) {
    return (
      <ChartErrorState
        title="Negative Values Unsupported"
        description={
          negativeErrorDetails ||
          "Percent Stack Bars requires non-negative additive values. Found negative numeric values in dataset."
        }
        className={className}
      />
    )
  }

  if (!data || data.length === 0 || !resolvedSeries || resolvedSeries.length === 0) {
    return (
      <ChartEmptyState
        title="No Composition Data"
        description="Provide categorical data and at least two additive series to render 100% stacked bars."
        className={className}
      />
    )
  }

  // All contributors hidden by user
  const allHidden = visibleSeriesList.length === 0

  /* ------------------------------------------------------------------------ */
  /*  Axes & Scales Setup                                                     */
  /* ------------------------------------------------------------------------ */

  const percentTicks = [0, 25, 50, 75, 100]

  const formatCategory = (cat: string | number) => {
    return categoryFormatter ? categoryFormatter(cat) : String(cat)
  }

  const formatPercentageAxis = (val: number) => `${val}%`

  /* ------------------------------------------------------------------------ */
  /*  Accessibility Narration & Table Data                                    */
  /* ------------------------------------------------------------------------ */

  const activeAnnouncement = activeDatum
    ? activeDatum.state === "zero-total"
      ? `${formatCategory(activeDatum.category)}. Raw total 0. Percentage composition unavailable because the visible total is zero.`
      : activeDatum.state === "incomplete"
      ? `${formatCategory(activeDatum.category)}. Percentage composition unavailable because the category is incomplete.`
      : `${formatCategory(activeDatum.category)}. ${resolvedSeries
          .filter((s) => visibleKeys.has(s.key))
          .map((s) => {
            const share = activeDatum.shares[s.key]
            const rawVal = activeDatum.rawValues[s.key]
            const shareStr = share !== null && share !== undefined ? defaultShareFormatter(share) : "unavailable"
            const rawStr =
              rawVal !== null && rawVal !== undefined
                ? s.valueFormatter
                  ? s.valueFormatter(rawVal)
                  : globalValueFormatter
                  ? globalValueFormatter(rawVal)
                  : rawVal.toLocaleString()
                : "unavailable"
            return `${s.label} ${shareStr}, ${rawStr}`
          })
          .join(". ")}. Raw total, ${
          activeDatum.visibleRawTotal !== null ? activeDatum.visibleRawTotal.toLocaleString() : "unavailable"
        }.`
    : ""

  return (
    <figure
      role="region"
      aria-label="100% Normalized Percent Stack Bars"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        setActiveIndex(null)
        setActiveSeriesKey(null)
      }}
      className={cn(
        "group relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? height : 340,
        touchAction: "pan-y",
      }}
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeAnnouncement}
      </div>

      {/* Offscreen HTML Table Alternative */}
      <div id={screenReaderId} className="sr-only">
        <table>
          <caption>100% Normalized Categorical Composition Data</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              {resolvedSeries.map((s) => (
                <React.Fragment key={s.key}>
                  <th scope="col">{s.label} Raw</th>
                  <th scope="col">{s.label} Share</th>
                </React.Fragment>
              ))}
              <th scope="col">Visible Raw Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.__index}>
                <th scope="row">{formatCategory(r.__category)}</th>
                {resolvedSeries.map((s) => {
                  const rawVal = r.__rawValues[s.key]
                  const share = r.__shares[s.key]
                  const rawStr =
                    rawVal !== null && rawVal !== undefined
                      ? s.valueFormatter
                        ? s.valueFormatter(rawVal)
                        : globalValueFormatter
                        ? globalValueFormatter(rawVal)
                        : rawVal.toLocaleString()
                      : "Unavailable"
                  const shareStr =
                    share !== null && share !== undefined ? defaultShareFormatter(share) : "Unavailable"
                  return (
                    <React.Fragment key={s.key}>
                      <td>{rawStr}</td>
                      <td>{shareStr}</td>
                    </React.Fragment>
                  )
                })}
                <td>
                  {r.__visibleRawTotal !== null ? r.__visibleRawTotal.toLocaleString() : "Unavailable"}
                </td>
                <td>
                  {r.__state === "valid"
                    ? "Complete"
                    : r.__state === "zero-total"
                    ? "Zero Total"
                    : "Incomplete"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Chart Container */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 relative">
        {allHidden ? (
          <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-3">
            <span className="text-sm font-medium text-muted-foreground">
              All series are currently hidden.
            </span>
            <button
              type="button"
              onClick={handleShowAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            >
              Show all contributors
            </button>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 320, height: typeof height === "number" ? height : 340 }}
          >
            <BarChart
              data={rows}
              layout={rechartsLayout}
              barGap={0}
              barCategoryGap={groupGap}
              margin={
                isVertical
                  ? { top: 16, right: 16, left: 16, bottom: 8 }
                  : { top: 16, right: 24, left: 16, bottom: 8 }
              }
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  const idx = Number(state.activeTooltipIndex)
                  if (!Number.isNaN(idx) && idx >= 0 && idx < rows.length) {
                    setActiveIndex(idx)
                  }
                }
              }}
              onMouseLeave={() => {
                setActiveIndex(null)
                setActiveSeriesKey(null)
              }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={!isVertical}
                  horizontal={isVertical}
                  stroke="var(--border)"
                  opacity={0.4}
                />
              )}

              {isVertical ? (
                <>
                  <XAxis
                    dataKey="__category"
                    hide={!showXAxis}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                    tick={{ fill: "var(--foreground)", fontSize: 11 }}
                    tickFormatter={formatCategory}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={percentTicks}
                    hide={!showYAxis}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickFormatter={formatPercentageAxis}
                    width={44}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={percentTicks}
                    hide={!showXAxis}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickFormatter={formatPercentageAxis}
                  />
                  <YAxis
                    dataKey="__category"
                    type="category"
                    hide={!showYAxis}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)", opacity: 0.5 }}
                    tick={{ fill: "var(--foreground)", fontSize: 11 }}
                    tickFormatter={formatCategory}
                    width={80}
                  />
                </>
              )}

              {/* Stacked Bars in Canonical Order */}
              {visibleSeriesList.map((s) => {
                const isOutermost = s.key === outermostSeriesKey
                const radius: [number, number, number, number] = isOutermost
                  ? isVertical
                    ? [4, 4, 0, 0]
                    : [0, 4, 4, 0]
                  : [0, 0, 0, 0]

                return (
                  <Bar
                    key={s.key}
                    dataKey={s.key as string}
                    stackId="percent"
                    name={s.label}
                    fill={s.color}
                    stroke="var(--background, #09090b)"
                    strokeWidth={1}
                    maxBarSize={maxBarSize}
                    radius={radius}
                    isAnimationActive={motionEnabled}
                    animationDuration={motionEnabled ? 450 : 0}
                    animationEasing="ease-out"
                    onMouseEnter={() => setActiveSeriesKey(s.key)}
                    onMouseLeave={() => setActiveSeriesKey(null)}
                  >
                    {valueLabel === "auto" && (
                      <LabelList
                        dataKey={s.key as string}
                        position="center"
                        fill="#ffffff"
                        fontSize={9}
                        formatter={(val: unknown) => {
                          if (typeof val !== "number" || !Number.isFinite(val) || val < 8) return ""
                          return `${Math.round(val)}%`
                        }}
                      />
                    )}
                  </Bar>
                )
              })}

              {/* Canonical Synchronized Tooltip */}
              <Tooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{
                  fill: "var(--foreground)",
                  opacity: 0.05,
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null
                  const row = payload[0]?.payload as NormalizedPercentStackRow<TData> | undefined
                  if (!row) return null

                  const isZeroTotal = row.__state === "zero-total"
                  const isIncomplete = row.__state === "incomplete"

                  return (
                    <div
                      role="tooltip"
                      className="plotcn-chart-tooltip rounded-xl border border-white/[0.12] bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[min(200px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs font-sans not-prose space-y-2.5"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                        <span className="font-semibold text-zinc-100 text-sm tracking-tight">
                          {formatCategory(row.__category)}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold",
                            row.__state === "valid"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : row.__state === "zero-total"
                              ? "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}
                        >
                          {row.__state === "valid"
                            ? "100% Normalized"
                            : row.__state === "zero-total"
                            ? "Zero Total"
                            : "Incomplete"}
                        </span>
                      </div>

                      {/* Composition Status Notice if not valid */}
                      {isZeroTotal && (
                        <p className="text-[11px] text-zinc-400 italic">
                          Total measurement is zero. Proportional share is undefined.
                        </p>
                      )}
                      {isIncomplete && (
                        <p className="text-[11px] text-amber-400/90 italic">
                          One or more visible series is unavailable. Normalized composition omitted.
                        </p>
                      )}

                      {/* Series Rows in Canonical Order */}
                      <div className="space-y-1.5">
                        {resolvedSeries
                          .filter((s) => visibleKeys.has(s.key))
                          .map((s) => {
                            const rawVal = row.__rawValues[s.key]
                            const share = row.__shares[s.key]
                            const isInspected = activeSeriesKey === s.key

                            const shareDisplay =
                              share !== null && share !== undefined
                                ? defaultShareFormatter(share)
                                : "—"
                            const rawDisplay =
                              rawVal !== null && rawVal !== undefined
                                ? s.valueFormatter
                                  ? s.valueFormatter(rawVal)
                                  : globalValueFormatter
                                  ? globalValueFormatter(rawVal)
                                  : rawVal.toLocaleString()
                                : "unavailable"

                            return (
                              <div
                                key={s.key}
                                className={cn(
                                  "flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors",
                                  isInspected ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className="size-2 rounded-full shrink-0"
                                    style={{ backgroundColor: s.color }}
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium text-zinc-300 truncate">
                                    {s.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-right shrink-0">
                                  <span className="font-semibold text-zinc-100 font-mono">
                                    {shareDisplay}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-mono">
                                    ({rawDisplay})
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                      </div>

                      {/* Visible Raw Total Footer */}
                      <div className="border-t border-white/[0.08] pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-medium">Visible Raw Total</span>
                        <span className="font-mono font-semibold text-zinc-200">
                          {row.__visibleRawTotal !== null
                            ? globalValueFormatter
                              ? globalValueFormatter(row.__visibleRawTotal)
                              : row.__visibleRawTotal.toLocaleString()
                            : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Series Legend with Interactive Visibility Toggle */}
      {showLegend && (
        <div className="mt-3 shrink-0 flex flex-wrap items-center justify-center gap-3 text-xs">
          {resolvedSeries.map((s) => {
            const isVisible = visibleKeys.has(s.key)
            const isInspected = activeSeriesKey === s.key

            return (
              <button
                key={s.key}
                type="button"
                disabled={!interactiveLegend}
                onClick={() => handleToggleSeries(s.key)}
                onMouseEnter={() => setActiveSeriesKey(s.key)}
                onMouseLeave={() => setActiveSeriesKey(null)}
                className={cn(
                  "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border transition-all text-xs",
                  interactiveLegend
                    ? "cursor-pointer hover:bg-white/[0.06] active:scale-95"
                    : "cursor-default",
                  isVisible
                    ? isInspected
                      ? "border-primary/50 bg-primary/10 text-foreground font-medium"
                      : "border-border/60 bg-background/50 text-foreground"
                    : "border-border/20 bg-muted/20 text-muted-foreground/50 line-through opacity-60"
                )}
                aria-pressed={isVisible}
                aria-label={`Toggle series ${s.label}`}
              >
                <span
                  className={cn(
                    "size-2.5 rounded-full shrink-0 transition-opacity",
                    !isVisible && "opacity-30"
                  )}
                  style={{ backgroundColor: s.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{s.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </figure>
  )
}
