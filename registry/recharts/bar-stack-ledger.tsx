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

export type StackLedgerLayout = "vertical" | "horizontal"
export type StackLedgerValueLabel = "none" | "total" | "auto"
export type StackLedgerMissingPolicy = "incomplete" | "zero"

/**
 * Additive contributor series definition for StackLedgerBars.
 * Every configured series must represent an additive, mutually exclusive component of the category total.
 */
export interface StackLedgerSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on data records representing the contributor's numeric magnitude */
  key: NumericKeyOf<TData>
  /** Human-readable display label for tooltips, legend, and screen readers */
  label: string
  /** Per-series color override (defaults to Plotcn theme tokens: var(--chart-1), var(--chart-2), etc.) */
  color?: string
  /** Optional custom numeric formatter for tooltip and value labels */
  valueFormatter?: (value: number) => string
}

/**
 * Inspected categorical record containing resolved contributor values and total state.
 */
export interface ActiveStackLedgerDatum<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** 0-based index of the category within caller-preserved order */
  index: number
  /** Discrete category label or value */
  category: string | number
  /** Original raw datum provided by caller */
  raw: TData
  /** Per-contributor numeric values (null represents unavailable/missing) */
  values: Record<string, number | null>
  /** Complete category total sum across all configured contributors (null if incomplete) */
  total: number | null
  /** Visible category total sum across currently visible contributors (null if incomplete) */
  visibleTotal: number | null
  /** Whether the category composition is complete and valid */
  isComplete: boolean
  /** Whether any configured contributor contains an unsupported negative value */
  hasNegative: boolean
}

export interface StackLedgerBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Readonly array of categorical records. Caller order is strictly preserved. */
  data: readonly TData[]

  /** Property key defining the discrete category domain */
  categoryKey: keyof TData & string

  /** Array of two or more additive contributor series composing the category whole */
  series: readonly StackLedgerSeries<TData>[]

  /**
   * Orientation layout:
   * - "vertical": Categories on horizontal X-axis, stacks grow vertically (default).
   * - "horizontal": Categories on vertical Y-axis, stacks grow horizontally.
   */
  layout?: StackLedgerLayout

  /** Chart container height in pixels or CSS dimension string. (default: 340) */
  height?: number | string

  /** Optional explicit quantitative domain bounds [min, max] or domain resolver function */
  domain?: [number, number] | ((calculated: [number, number]) => [number, number])

  /** Space between distinct category stacks along the categorical axis in pixels. (default: 20) */
  groupGap?: number

  /** Maximum width/thickness for individual stacked bars in pixels. (default: 48) */
  maxBarSize?: number

  /** Whether to render subtle reference grid lines. (default: true) */
  showGrid?: boolean

  /** Whether to render the category axis ticks and line. (default: true) */
  showXAxis?: boolean

  /** Whether to render the quantitative axis ticks and line. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series legend. (default: true) */
  showLegend?: boolean

  /** Whether the legend allows clicking contributors to toggle visibility. (default: true) */
  interactiveLegend?: boolean

  /** Whether to display the total magnitude in tooltips and accessible tables. (default: true) */
  showTotal?: boolean

  /**
   * Value label rendering policy:
   * - "none": No inline numeric labels (default).
   * - "total": Render the valid total at the outer stack edge.
   * - "auto": Render contributor values when space permits without collision, plus total.
   */
  valueLabel?: StackLedgerValueLabel

  /**
   * Handling of missing or non-finite contributor observations:
   * - "incomplete": (default) If any visible contributor is missing or invalid, omit stack geometry to prevent visual deception and mark total unavailable.
   * - "zero": Explicitly treat missing values as zero contribution ($0).
   */
  missingValuePolicy?: StackLedgerMissingPolicy

  /** Motion animation toggle or configuration. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Optional custom category label formatter for axes and tooltips */
  categoryFormatter?: (category: string | number) => string

  /** Optional global value formatter fallback */
  valueFormatter?: (value: number) => string

  /** Callback fired when the active inspected category changes */
  onActiveChange?: (active: ActiveStackLedgerDatum<TData> | null) => void

  /** Optional additional CSS class for root wrapper */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Algorithmic Helpers: Pure & Deterministic                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_SERIES_TOKENS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #8b5cf6)",
  "var(--chart-4, #f59e0b)",
  "var(--chart-5, #06b6d4)",
  "var(--chart-6, #ec4899)",
  "var(--chart-7, #14b8a6)",
  "var(--chart-8, #f97316)",
]

export const STACK_ID = "ledger"

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Internal normalized record preserving caller data with validated numeric contributors and composition totals.
 */
export interface NormalizedStackLedgerRecord<TData extends Record<string, unknown> = Record<string, unknown>> {
  __index: number
  __category: string | number
  __raw: TData
  __complete: boolean
  __hasNegative: boolean
  __totals: {
    all: number | null
    visible: number | null
  }
  __totalDisplay?: string
  // Safe geometry fields rendered by Recharts
  [seriesKey: string]: unknown
}

/**
 * Normalizes input records into safe internal data structures.
 * - Caller category order is strictly preserved.
 * - Enforces V1 non-negative sign model (flags negatives and logs development warnings).
 * - Under missingValuePolicy="incomplete", missing/non-finite values mark composition incomplete and omit stack geometry.
 * - Under missingValuePolicy="zero", missing values are explicitly coerced to 0.
 */
export function normalizeStackLedgerData<TData extends Record<string, unknown> = Record<string, unknown>>(
  data: readonly TData[],
  categoryKey: keyof TData & string,
  series: readonly StackLedgerSeries<TData>[],
  visibleSeriesKeys: readonly string[],
  missingValuePolicy: StackLedgerMissingPolicy = "incomplete"
): {
  records: NormalizedStackLedgerRecord<TData>[]
  hasAnyValidMeasure: boolean
  hasAnyNegative: boolean
  hasDuplicates: boolean
} {
  const seenCategories = new Set<string | number>()
  let hasDuplicates = false
  let hasAnyValidMeasure = false
  let hasAnyNegative = false

  const visibleKeySet = new Set(visibleSeriesKeys)
  const records: NormalizedStackLedgerRecord<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const raw = data[i]
    const cat = (raw[categoryKey] as string | number) ?? `Category ${i + 1}`

    if (seenCategories.has(cat)) {
      hasDuplicates = true
    } else {
      seenCategories.add(cat)
    }

    let isCompleteForVisible = true
    let isCompleteForAll = true
    let recordHasNegative = false
    let visibleSum = 0
    let allSum = 0

    const rec: NormalizedStackLedgerRecord<TData> = {
      __index: i,
      __category: cat,
      __raw: raw,
      __complete: true,
      __hasNegative: false,
      __totals: {
        all: null,
        visible: null,
      },
    }

    for (let s = 0; s < series.length; s++) {
      const sKey = series[s].key as string
      const rawVal = raw[sKey]
      const isVisible = visibleKeySet.has(sKey)

      if (isFiniteNumber(rawVal)) {
        if (rawVal < 0) {
          recordHasNegative = true
          hasAnyNegative = true
          if (isVisible) isCompleteForVisible = false
          isCompleteForAll = false
          rec[sKey] = null
        } else {
          rec[sKey] = rawVal
          hasAnyValidMeasure = true
          if (isVisible) visibleSum += rawVal
          allSum += rawVal
        }
      } else {
        // Missing, null, undefined, NaN, Infinity
        if (missingValuePolicy === "zero") {
          rec[sKey] = 0
          // Zero contribution does not invalidate completeness under explicit zero policy
        } else {
          rec[sKey] = null
          if (isVisible) isCompleteForVisible = false
          isCompleteForAll = false
        }
      }
    }

    rec.__complete = isCompleteForVisible && !recordHasNegative
    rec.__hasNegative = recordHasNegative

    if (rec.__complete) {
      rec.__totals.visible = visibleSum
      rec.__totals.all = isCompleteForAll && !recordHasNegative ? allSum : null
    } else {
      rec.__totals.visible = null
      rec.__totals.all = null

      // Under "incomplete" policy, omit geometry for all visible series so no partial misleading bar is drawn
      if (missingValuePolicy === "incomplete") {
        for (let s = 0; s < series.length; s++) {
          const sKey = series[s].key as string
          if (visibleKeySet.has(sKey)) {
            rec[sKey] = 0 // Renders zero height/width rectangle in Recharts
          }
        }
      }
    }

    records.push(rec)
  }

  return { records, hasAnyValidMeasure, hasAnyNegative, hasDuplicates }
}

/**
 * Calculates a truthful quantitative domain enclosing 0 and the maximum visible category total.
 * - Always starts at 0 (non-negative additive contract).
 * - Safe headroom padding (8%) to accommodate value labels and clear visual bounds.
 */
export function calculateStackLedgerDomain<TData extends Record<string, unknown> = Record<string, unknown>>(
  records: readonly NormalizedStackLedgerRecord<TData>[],
  customDomain?: [number, number] | ((calculated: [number, number]) => [number, number])
): [number, number] {
  let maxTotal = 0
  let hasValidTotal = false

  for (let i = 0; i < records.length; i++) {
    const total = records[i].__totals.visible
    if (isFiniteNumber(total)) {
      hasValidTotal = true
      if (total > maxTotal) {
        maxTotal = total
      }
    }
  }

  const baseMax = !hasValidTotal || maxTotal === 0 ? 10 : Math.ceil(maxTotal * 1.08)
  const defaultDomain: [number, number] = [0, baseMax]

  if (!customDomain) {
    return defaultDomain
  }

  if (typeof customDomain === "function") {
    return customDomain(defaultDomain)
  }

  return customDomain
}

/* -------------------------------------------------------------------------- */
/*  Component: StackLedgerBars                                                */
/* -------------------------------------------------------------------------- */

export function StackLedgerBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  layout = "vertical",
  height = 340,
  domain: explicitDomain,
  groupGap = 20,
  maxBarSize = 48,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  showTotal = true,
  valueLabel = "none",
  missingValuePolicy = "incomplete",
  motion = true,
  categoryFormatter,
  valueFormatter: globalValueFormatter,
  onActiveChange,
  className,
}: StackLedgerBarsProps<TData>) {
  const reducedMotion = useChartReducedMotion()

  const safeSeries = React.useMemo(() => series ?? [], [series])
  const safeCategoryKey = categoryKey ?? ""
  const safeData = React.useMemo(() => data ?? [], [data])

  // Interactive contributor series visibility state
  const [hiddenSeriesKeys, setHiddenSeriesKeys] = React.useState<Set<string>>(() => new Set())

  const visibleSeries = React.useMemo(() => {
    return safeSeries.filter((s) => !hiddenSeriesKeys.has(s.key as string))
  }, [safeSeries, hiddenSeriesKeys])

  const visibleSeriesKeys = React.useMemo(() => {
    return visibleSeries.map((s) => s.key as string)
  }, [visibleSeries])

  // Stable series color mapping: Hiding a series NEVER reassigns colors of remaining series
  const seriesColorMap = React.useMemo(() => {
    const map = new Map<string, string>()
    safeSeries.forEach((s, idx) => {
      map.set(s.key as string, s.color || DEFAULT_SERIES_TOKENS[idx % DEFAULT_SERIES_TOKENS.length])
    })
    return map
  }, [safeSeries])

  // Normalize and validate data
  const { records, hasAnyValidMeasure, hasAnyNegative, hasDuplicates } = React.useMemo(() => {
    if (!safeCategoryKey || safeSeries.length === 0) {
      return { records: [], hasAnyValidMeasure: false, hasAnyNegative: false, hasDuplicates: false }
    }
    const res = normalizeStackLedgerData(safeData, safeCategoryKey, safeSeries, visibleSeriesKeys, missingValuePolicy)
    res.records.forEach((r) => {
      if (r.__complete && r.__totals.visible !== null) {
        r.__totalDisplay = globalValueFormatter ? globalValueFormatter(r.__totals.visible) : r.__totals.visible.toLocaleString()
      } else {
        r.__totalDisplay = ""
      }
    })
    return res
  }, [safeData, safeCategoryKey, safeSeries, visibleSeriesKeys, missingValuePolicy, globalValueFormatter])

  // Surface development warnings for data anomalies
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && safeCategoryKey && safeSeries.length > 0) {
      if (hasDuplicates) {
        console.warn(
          `[Plotcn StackLedgerBars] Duplicate category keys detected in dataset for "${safeCategoryKey}". ` +
            "Category order and records are preserved strictly without aggregation, but unique labels are recommended."
        )
      }
      if (hasAnyNegative) {
        console.warn(
          `[Plotcn StackLedgerBars] Negative contributor values detected in dataset. ` +
            "StackLedgerBars V1 supports non-negative additive contributions only. Categories with negative values are marked incomplete."
        )
      }
    }
  }, [hasDuplicates, hasAnyNegative, safeCategoryKey, safeSeries.length])

  // Domain calculation
  const quantitativeDomain = React.useMemo(() => {
    return calculateStackLedgerDomain(records, explicitDomain)
  }, [records, explicitDomain])

  // Active inspection state
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [activeSeriesKey, setActiveSeriesKey] = React.useState<string | null>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  const activeDatum = React.useMemo<ActiveStackLedgerDatum<TData> | null>(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= records.length) {
      return null
    }
    const rec = records[activeIndex]
    const values: Record<string, number | null> = {}
    for (let s = 0; s < safeSeries.length; s++) {
      const sKey = safeSeries[s].key as string
      const rawVal = rec.__raw[sKey]
      values[sKey] = isFiniteNumber(rawVal) && rawVal >= 0 ? rawVal : null
    }

    return {
      index: activeIndex,
      category: rec.__category,
      raw: rec.__raw,
      values,
      total: rec.__totals.all,
      visibleTotal: rec.__totals.visible,
      isComplete: rec.__complete,
      hasNegative: rec.__hasNegative,
    }
  }, [activeIndex, records, safeSeries])

  React.useEffect(() => {
    onActiveChange?.(activeDatum)
  }, [activeDatum, onActiveChange])

  // Validate required configuration guards
  if (!series || series.length === 0) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="No Additive Series Defined"
          description="StackLedgerBars requires at least one additive contributor series in its series configuration."
        />
      </div>
    )
  }

  if (!categoryKey) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="Missing Category Key"
          description="A valid categoryKey is required to identify discrete categorical stacks."
        />
      </div>
    )
  }

  // 6. Keyboard navigation handlers
  const isVertical = layout === "vertical"
  const rechartsLayout = isVertical ? "horizontal" : "vertical"

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (records.length === 0) return

    const prevKey = isVertical ? "ArrowLeft" : "ArrowUp"
    const nextKey = isVertical ? "ArrowRight" : "ArrowDown"

    if (e.key === prevKey) {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (prev === null || prev <= 0) return records.length - 1
        return prev - 1
      })
    } else if (e.key === nextKey) {
      e.preventDefault()
      setActiveIndex((prev) => {
        if (prev === null || prev >= records.length - 1) return 0
        return prev + 1
      })
    } else if (e.key === "Home") {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setActiveIndex(records.length - 1)
    } else if (e.key === "Escape") {
      setActiveIndex(null)
      setActiveSeriesKey(null)
    }
  }

  // 7. Motion configuration
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // 8. Empty / fallback guards
  if (!records.length) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartEmptyState
          title="No Categorical Data"
          description="The provided dataset does not contain any records to compose."
        />
      </div>
    )
  }

  if (!hasAnyValidMeasure && !hasAnyNegative) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartUnavailableState
          title="No Additive Data"
          description="Categorical records are present, but all numeric contributor measures are unrecorded or non-finite."
        />
      </div>
    )
  }

  // Legend toggle handler
  const toggleSeries = (sKey: string) => {
    if (!interactiveLegend) return
    setHiddenSeriesKeys((prev) => {
      const next = new Set(prev)
      if (next.has(sKey)) {
        next.delete(sKey)
      } else {
        next.add(sKey)
      }
      return next
    })
  }

  const showAllSeries = () => {
    setHiddenSeriesKeys(new Set())
  }

  // Value formatting helpers
  const formatValue = (val: number | null | undefined, seriesItem?: StackLedgerSeries<TData>): string => {
    if (val === null || val === undefined || !Number.isFinite(val)) return "Unavailable"
    if (seriesItem?.valueFormatter) return seriesItem.valueFormatter(val)
    if (globalValueFormatter) return globalValueFormatter(val)
    return val.toLocaleString()
  }

  const formatCategory = (cat: string | number): string => {
    if (categoryFormatter) return categoryFormatter(cat)
    return String(cat)
  }

  // Identify the outermost visible series for rounded outer edge
  const outermostVisibleKey = visibleSeries.length > 0 ? (visibleSeries[visibleSeries.length - 1].key as string) : null

  // Accessible live announcement
  const liveAnnouncement = activeDatum
    ? `${formatCategory(activeDatum.category)}. Stack ${activeDatum.index + 1} of ${records.length}. ` +
      visibleSeries
        .map((s) => `${s.label}: ${formatValue(activeDatum.values[s.key as string], s)}`)
        .join(", ") +
      (activeDatum.isComplete
        ? `. ${hiddenSeriesKeys.size > 0 ? "Visible total" : "Total"}: ${formatValue(activeDatum.visibleTotal)}.`
        : ". Composition incomplete; total unavailable.")
    : ""

  return (
    <figure
      role="region"
      aria-label={`Stack Ledger Bars additive composition for ${series.map((s) => s.label).join(", ")}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        setIsFocused(true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false)
          setActiveIndex(null)
          setActiveSeriesKey(null)
        }
      }}
      className={cn(
        "plotcn-bar-stack-ledger relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        isFocused && "ring-2 ring-[var(--chart-focus,#38bdf8)] ring-offset-2 ring-offset-background",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? height : 340,
        touchAction: "pan-y",
      }}
    >
      {/* Screen Reader Off-Screen Data Alternative */}
      <div className="sr-only">
        <div aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>
        <table>
          <caption>
            Additive stacked bar chart displaying {series.map((s) => s.label).join(", ")} across {records.length}{" "}
            categories.
          </caption>
          <thead>
            <tr>
              <th scope="col">{categoryKey}</th>
              {series.map((s) => (
                <th key={s.key as string} scope="col">
                  {s.label}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <th scope="row">{formatCategory(r.__category)}</th>
                {series.map((s) => {
                  const rawVal = r.__raw[s.key as string]
                  const val = isFiniteNumber(rawVal) && rawVal >= 0 ? rawVal : null
                  return (
                    <td key={s.key as string}>
                      {val !== null ? formatValue(val, s) : "Unavailable"}
                    </td>
                  )
                })}
                <td>
                  {r.__complete && r.__totals.visible !== null
                    ? formatValue(r.__totals.visible)
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Chart Container */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 relative">
        {/* All contributors hidden recoverable overlay */}
        {visibleSeries.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs z-20 text-center p-4">
            <p className="text-sm font-medium text-muted-foreground">All contributors are currently hidden</p>
            <button
              type="button"
              onClick={showAllSeries}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
            >
              Show all contributors
            </button>
          </div>
        ) : null}

        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 340 }}
        >
          <BarChart
            data={records}
            layout={rechartsLayout}
            barCategoryGap={groupGap}
            margin={
              isVertical
                ? { top: 16, right: 16, left: 4, bottom: 4 }
                : { top: 12, right: 32, left: 16, bottom: 4 }
            }
            onMouseMove={(state: unknown) => {
              const chartState = state as { activeTooltipIndex?: number } | null
              if (chartState && typeof chartState.activeTooltipIndex === "number") {
                if (chartState.activeTooltipIndex !== activeIndex) {
                  setActiveIndex(chartState.activeTooltipIndex)
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
                stroke="var(--chart-grid, rgba(255, 255, 255, 0.08))"
              />
            )}

            {/* Zero Baseline Reference Line */}
            <ReferenceLine
              x={!isVertical ? 0 : undefined}
              y={isVertical ? 0 : undefined}
              stroke="var(--chart-axis, rgba(255, 255, 255, 0.25))"
              strokeWidth={1.5}
            />

            {isVertical ? (
              <>
                <XAxis
                  dataKey="__category"
                  hide={!showXAxis}
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-axis, rgba(255, 255, 255, 0.15))" }}
                  tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
                  tickFormatter={formatCategory}
                />
                <YAxis
                  domain={quantitativeDomain}
                  hide={!showYAxis}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
                  tickFormatter={(v) => (globalValueFormatter ? globalValueFormatter(v) : v.toLocaleString())}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  domain={quantitativeDomain}
                  hide={!showXAxis}
                  tickLine={false}
                  axisLine={{ stroke: "var(--chart-axis, rgba(255, 255, 255, 0.15))" }}
                  tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
                  tickFormatter={(v) => {
                    if (globalValueFormatter) return globalValueFormatter(v)
                    if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(0)}k`
                    return v.toLocaleString()
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="__category"
                  hide={!showYAxis}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
                  tickFormatter={formatCategory}
                />
              </>
            )}

            {/* Category Band Tooltip */}
            <Tooltip
              cursor={{
                fill: "var(--chart-grid, rgba(255, 255, 255, 0.04))",
                radius: 4,
              }}
              isAnimationActive={false}
              allowEscapeViewBox={{ x: false, y: false }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) {
                  return null
                }

                const payloadItem = payload[0]
                const currentRec = payloadItem?.payload as NormalizedStackLedgerRecord<TData> | undefined
                if (!currentRec) return null

                const rawCategory = currentRec.__category ?? label
                const categoryName = typeof rawCategory === "string" || typeof rawCategory === "number" ? rawCategory : String(rawCategory ?? "")
                const resolvedIndex = records.findIndex((r) => r === currentRec || r.__category === currentRec.__category)
                const displayIndex = resolvedIndex >= 0 ? resolvedIndex : (activeIndex ?? 0)

                const isComplete = currentRec.__complete
                const isPartiallyHidden = hiddenSeriesKeys.size > 0
                const visibleTotalVal = currentRec.__totals.visible

                return (
                  <div
                    role="tooltip"
                    className="plotcn-chart-tooltip rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-xl backdrop-blur-md min-w-[min(180px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs font-sans"
                  >
                    <div className="font-medium text-zinc-100 border-b border-white/10 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span>{formatCategory(categoryName)}</span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        #{displayIndex + 1}
                      </span>
                    </div>

                    {/* Contributor Rows in Canonical Series Order */}
                    <div className="space-y-1">
                      {visibleSeries.map((s) => {
                        const sKey = s.key as string
                        const rawVal = currentRec.__raw[sKey]
                        const isMissing = !isFiniteNumber(rawVal) || rawVal < 0
                        const color = seriesColorMap.get(sKey) || "var(--chart-1)"
                        const isHovered = activeSeriesKey === sKey

                        return (
                          <div
                            key={sKey}
                            className={cn(
                              "flex items-center justify-between gap-3 py-0.5 px-1 rounded transition-colors",
                              isHovered && "bg-white/10"
                            )}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="size-2 rounded-[2px] shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-zinc-400 truncate">{s.label}</span>
                            </div>
                            <span
                              className={cn(
                                "font-mono font-medium tabular-nums shrink-0",
                                isMissing ? "text-zinc-500 italic text-[11px]" : "text-zinc-100"
                              )}
                            >
                              {isMissing ? "Unavailable" : formatValue(rawVal as number, s)}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Total / Visible Total Section */}
                    {showTotal && (
                      <div className="mt-2 pt-1.5 border-t border-white/10 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between text-zinc-200 font-medium">
                          <span className="text-[11px] font-mono uppercase tracking-wide text-zinc-400">
                            {isPartiallyHidden ? "Visible total" : "Total"}
                          </span>
                          <span className="font-mono font-semibold text-zinc-100 tabular-nums">
                            {isComplete && visibleTotalVal !== null ? formatValue(visibleTotalVal) : "Unavailable"}
                          </span>
                        </div>
                        {!isComplete && (
                          <span className="text-[10px] font-mono text-amber-400/90 italic">
                            Incomplete composition
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              }}
            />

            {/* Stacked Bars Sharing Deterministic stackId */}
            {visibleSeries.map((s) => {
              const sKey = s.key as string
              const color = seriesColorMap.get(sKey) || "var(--chart-1)"
              const isOuter = sKey === outermostVisibleKey

              // Outer visible segment receives subtle rounding; interior segments remain flat
              const radius: [number, number, number, number] = isOuter
                ? isVertical
                  ? [4, 4, 0, 0]
                  : [0, 4, 4, 0]
                : [0, 0, 0, 0]

              return (
                <Bar
                  key={sKey}
                  dataKey={sKey}
                  stackId={STACK_ID}
                  name={s.label}
                  fill={color}
                  stroke="var(--background, #09090b)"
                  strokeWidth={1}
                  maxBarSize={maxBarSize}
                  radius={radius}
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  animationEasing="ease-out"
                  onMouseEnter={() => {
                    setActiveSeriesKey(sKey)
                  }}
                  onMouseLeave={() => {
                    setActiveSeriesKey(null)
                  }}
                >
                  {/* Optional Value Labels */}
                  {valueLabel === "total" && isOuter && (
                    <LabelList
                      dataKey="__totalDisplay"
                      position={isVertical ? "top" : "right"}
                      fill="var(--chart-axis, #a1a1aa)"
                      fontSize={10}
                      offset={6}
                      formatter={(val: unknown) => (val ? String(val) : "")}
                    />
                  )}

                  {valueLabel === "auto" && (
                    <LabelList
                      dataKey={sKey}
                      position="center"
                      fill="#ffffff"
                      fontSize={9}
                      formatter={(val: unknown) => {
                        if (typeof val !== "number" || !Number.isFinite(val) || val <= 0) return ""
                        return val.toLocaleString()
                      }}
                    />
                  )}
                </Bar>
              )
            })}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Accessible & Interactive Series Legend */}
      {showLegend && (
        <div
          role="toolbar"
          aria-label="Series visibility controls"
          className="shrink-0 pt-2.5 flex flex-wrap items-center justify-center gap-3 text-xs font-mono select-none"
        >
          {series.map((s) => {
            const sKey = s.key as string
            const isHidden = hiddenSeriesKeys.has(sKey)
            const color = seriesColorMap.get(sKey) || "var(--chart-1)"
            const isHovered = activeSeriesKey === sKey

            return (
              <button
                key={sKey}
                type="button"
                aria-pressed={!isHidden}
                disabled={!interactiveLegend}
                onClick={() => toggleSeries(sKey)}
                onMouseEnter={() => setActiveSeriesKey(sKey)}
                onMouseLeave={() => setActiveSeriesKey(null)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all select-none",
                  interactiveLegend ? "cursor-pointer hover:border-zinc-500" : "cursor-default",
                  isHidden
                    ? "opacity-40 border-transparent bg-transparent line-through text-zinc-500"
                    : "border-border/60 bg-muted/20 text-zinc-200",
                  isHovered && !isHidden && "border-zinc-400 bg-muted/40 text-white"
                )}
              >
                <span
                  className="size-2 rounded-[2px] shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </figure>
  )
}
