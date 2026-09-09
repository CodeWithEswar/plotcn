"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts"

import { cn } from "@/lib/utils"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"

/* -------------------------------------------------------------------------- */
/*  Types & Contracts                                                         */
/* -------------------------------------------------------------------------- */

export type NumericKeyOf<T> = {
  [K in keyof T]: T[K] extends number | null | undefined ? K : never
}[keyof T] &
  string

export interface GroupCompareBarSeries<TData = Record<string, unknown>> {
  /** Property key on data record representing numeric measure */
  readonly key: NumericKeyOf<TData>
  /** Human-readable label for legend, tooltips, and accessibility */
  readonly label: string
  /** Explicit CSS color (e.g. "var(--chart-1)", "#3b82f6"). Overrides theme cycling */
  readonly color?: string
  /** Series-specific value formatter */
  readonly valueFormatter?: (value: number) => string
}

export interface ActiveGroupCompareDatum<TData = Record<string, unknown>> {
  readonly index: number
  readonly category: string | number
  readonly raw: TData
  readonly values: Record<string, number | null>
  readonly activeSeriesKey: string | null
}

export interface GroupCompareBarsProps<TData = Record<string, unknown>> {
  /** Readonly array of categorical records. Caller order is strictly preserved */
  readonly data: readonly TData[]
  /** Field name identifying the discrete category domain */
  readonly categoryKey: keyof TData & string
  /** Configured peer numeric series sharing the same quantitative unit and scale */
  readonly series: readonly GroupCompareBarSeries<TData>[]

  /** Overall container height in pixels or CSS string. Defaults to 340 */
  readonly height?: number | string
  /** Layout orientation: "vertical" (categories on X) or "horizontal" (categories on Y) */
  readonly layout?: "vertical" | "horizontal"
  /** Explicit quantitative scale domain override [min, max] */
  readonly domain?: [number, number]

  /** Pixel gap between category groups (barCategoryGap). Defaults to 20 */
  readonly groupGap?: number
  /** Pixel gap between peer bars within one group (barGap). Defaults to 4 */
  readonly barGap?: number
  /** Maximum bar thickness in pixels. Defaults to 36 */
  readonly maxBarSize?: number

  /** Whether to render subtle background grid lines. Defaults to true */
  readonly showGrid?: boolean
  /** Whether to render categorical axis. Defaults to true */
  readonly showXAxis?: boolean
  /** Whether to render quantitative axis. Defaults to true */
  readonly showYAxis?: boolean
  /** Whether to show the series legend. Defaults to true */
  readonly showLegend?: boolean
  /** Enable interactive legend series toggling. Defaults to true */
  readonly interactiveLegend?: boolean
  /** Value label mode: "none", "auto" (fit-aware), or "always". Defaults to "none" */
  readonly valueLabel?: "none" | "auto" | "always"

  /** Restrained entrance animation. Defaults to true */
  readonly motion?: boolean | { duration?: number }

  /** Formatter for categorical axis tick labels */
  readonly categoryFormatter?: (category: string | number) => string
  /** Global formatter for quantitative values */
  readonly valueFormatter?: (value: number) => string
  /** Callback fired when active category or series changes */
  readonly onActiveChange?: (datum: ActiveGroupCompareDatum<TData> | null) => void

  /** Optional CSS class name */
  readonly className?: string
}

/* -------------------------------------------------------------------------- */
/*  Internal Helpers & Normalization                                          */
/* -------------------------------------------------------------------------- */

const DEFAULT_SERIES_TOKENS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #a855f7)",
  "var(--chart-5, #ec4899)",
  "var(--chart-6, #06b6d4)",
]

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

export interface NormalizedGroupCompareRecord<TData = Record<string, unknown>> {
  __index: number
  __category: string | number
  __raw: TData
  [seriesKey: string]: unknown
}

/**
 * Normalizes input records into safe internal data structures.
 * - Caller category order is strictly preserved.
 * - Configured series order is strictly preserved.
 * - Non-finite values (null, undefined, NaN, Infinity) are sanitized to null so Recharts reserves slot without drawing fake bars.
 * - Zero is preserved as 0.
 * - Finite negative values are preserved.
 */
export function normalizeGroupCompareData<TData extends Record<string, unknown> = Record<string, unknown>>(
  data: readonly TData[],
  categoryKey: keyof TData & string,
  series: readonly GroupCompareBarSeries<TData>[],
  visibleSeriesKeys: readonly string[]
): {
  records: NormalizedGroupCompareRecord<TData>[]
  hasAnyValidMeasure: boolean
  hasDuplicates: boolean
  minObserved: number
  maxObserved: number
} {
  const seenCategories = new Set<string | number>()
  let hasDuplicates = false
  let hasAnyValidMeasure = false
  let minObserved = 0
  let maxObserved = 0

  const visibleKeySet = new Set(visibleSeriesKeys)
  const records: NormalizedGroupCompareRecord<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const raw = data[i]
    const cat = (raw[categoryKey] as string | number) ?? `Category ${i + 1}`

    if (seenCategories.has(cat)) {
      hasDuplicates = true
    } else {
      seenCategories.add(cat)
    }

    const rec: NormalizedGroupCompareRecord<TData> = {
      __index: i,
      __category: cat,
      __raw: raw,
    }

    for (let s = 0; s < series.length; s++) {
      const sKey = series[s].key as string
      const rawVal = raw[sKey]

      if (isFiniteNumber(rawVal)) {
        rec[sKey] = rawVal
        hasAnyValidMeasure = true

        if (visibleKeySet.has(sKey)) {
          if (rawVal < minObserved) minObserved = rawVal
          if (rawVal > maxObserved) maxObserved = rawVal
        }
      } else {
        // Missing, null, undefined, NaN, Infinity
        rec[sKey] = null
      }
    }

    records.push(rec)
  }

  return {
    records,
    hasAnyValidMeasure,
    hasDuplicates,
    minObserved,
    maxObserved,
  }
}

/**
 * Calculates a zero-inclusive shared quantitative domain.
 * - Always includes 0 (mandatory for conventional bars).
 * - Adapts to all-positive, all-negative, or mixed-sign data.
 * - Applies a safe 8% headroom padding to prevent bars from clipping the plot edge.
 */
export function calculateGroupCompareDomain(
  minVal: number,
  maxVal: number,
  explicitDomain?: [number, number]
): [number, number] {
  if (explicitDomain) {
    return explicitDomain
  }

  let domainMin = Math.min(0, minVal)
  let domainMax = Math.max(0, maxVal)

  if (domainMin === 0 && domainMax === 0) {
    return [0, 10]
  }

  const range = domainMax - domainMin
  const padding = range * 0.08

  if (domainMax > 0) {
    domainMax += padding
  }
  if (domainMin < 0) {
    domainMin -= padding
  }

  return [Math.floor(domainMin), Math.ceil(domainMax)]
}

/* -------------------------------------------------------------------------- */
/*  Component: GroupCompareBars                                               */
/* -------------------------------------------------------------------------- */

export function GroupCompareBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  layout = "vertical",
  height = 340,
  domain: explicitDomain,
  groupGap = 20,
  barGap = 4,
  maxBarSize = 36,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  valueLabel = "none",
  motion = true,
  categoryFormatter,
  valueFormatter: globalValueFormatter,
  onActiveChange,
  className,
}: GroupCompareBarsProps<TData>) {
  const reducedMotion = useChartReducedMotion()

  const safeSeries = React.useMemo(() => series ?? [], [series])
  const safeCategoryKey = categoryKey ?? ""
  const safeData = React.useMemo(() => data ?? [], [data])

  // Interactive peer series visibility state
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

  // Normalize and validate dataset
  const { records, hasAnyValidMeasure, hasDuplicates, minObserved, maxObserved } = React.useMemo(() => {
    if (!safeCategoryKey || safeSeries.length === 0) {
      return {
        records: [],
        hasAnyValidMeasure: false,
        hasDuplicates: false,
        minObserved: 0,
        maxObserved: 0,
      }
    }
    return normalizeGroupCompareData(safeData, safeCategoryKey, safeSeries, visibleSeriesKeys)
  }, [safeData, safeCategoryKey, safeSeries, visibleSeriesKeys])

  // Surface development warnings for data anomalies
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && safeCategoryKey && safeSeries.length > 0) {
      if (hasDuplicates) {
        console.warn(
          `[Plotcn GroupCompareBars] Duplicate category keys detected for "${safeCategoryKey}". ` +
            "Category order and records are preserved strictly, but unique labels are recommended."
        )
      }
    }
  }, [hasDuplicates, safeCategoryKey, safeSeries.length])

  // Domain calculation
  const quantitativeDomain = React.useMemo(() => {
    return calculateGroupCompareDomain(minObserved, maxObserved, explicitDomain)
  }, [minObserved, maxObserved, explicitDomain])

  // Active inspection state (category band + optional exact series)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [activeSeriesKey, setActiveSeriesKey] = React.useState<string | null>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  const activeDatum = React.useMemo<ActiveGroupCompareDatum<TData> | null>(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= records.length) {
      return null
    }
    const rec = records[activeIndex]
    const values: Record<string, number | null> = {}
    for (let s = 0; s < safeSeries.length; s++) {
      const sKey = safeSeries[s].key as string
      const rawVal = rec[sKey]
      values[sKey] = isFiniteNumber(rawVal) ? rawVal : null
    }

    return {
      index: activeIndex,
      category: rec.__category,
      raw: rec.__raw,
      values,
      activeSeriesKey,
    }
  }, [activeIndex, records, safeSeries, activeSeriesKey])

  React.useEffect(() => {
    onActiveChange?.(activeDatum)
  }, [activeDatum, onActiveChange])

  // Validate configuration guards
  if (!series || series.length === 0) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="No Peer Series Defined"
          description="GroupCompareBars requires at least one peer series in its series configuration."
        />
      </div>
    )
  }

  if (!categoryKey) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="Missing Category Key"
          description="A valid categoryKey is required to identify discrete categorical groups."
        />
      </div>
    )
  }

  // Keyboard navigation handlers
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

  // Motion configuration
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Empty / fallback guards
  if (!records.length) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartEmptyState
          title="No Categorical Data"
          description="The provided dataset contains no records to compare."
        />
      </div>
    )
  }

  if (!hasAnyValidMeasure) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartUnavailableState
          title="No Comparable Values"
          description="Categorical records are present, but all numeric measures are unrecorded or non-finite."
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

  // Formatting helpers
  const formatValue = (val: number | null | undefined, seriesItem?: GroupCompareBarSeries<TData>): string => {
    if (val === null || val === undefined || !Number.isFinite(val)) return "Unavailable"
    if (seriesItem?.valueFormatter) return seriesItem.valueFormatter(val)
    if (globalValueFormatter) return globalValueFormatter(val)
    return val.toLocaleString()
  }

  const formatCategory = (cat: string | number): string => {
    if (categoryFormatter) return categoryFormatter(cat)
    return String(cat)
  }

  // Accessible live announcement
  const liveAnnouncement = activeDatum
    ? `${formatCategory(activeDatum.category)}. Group ${activeDatum.index + 1} of ${records.length}. ` +
      visibleSeries
        .map((s) => `${s.label}: ${formatValue(activeDatum.values[s.key as string], s)}`)
        .join(", ") +
      "."
    : ""

  return (
    <figure
      role="region"
      aria-label={`Group Compare Bars side-by-side comparison for ${series.map((s) => s.label).join(", ")}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        setIsFocused(true)
        if (activeIndex === null && records.length > 0) {
          setActiveIndex(0)
        }
      }}
      onBlur={() => {
        setIsFocused(false)
      }}
      className={cn(
        "plotcn-bar-group-compare relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        isFocused && "ring-2 ring-[var(--chart-focus,#38bdf8)] ring-offset-2 ring-offset-background",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? height : 340,
        touchAction: "pan-y",
      }}
    >
      {/* Screen Reader Live Region Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Screen Reader Accessible HTML Table Alternative */}
      <div className="sr-only">
        <table>
          <caption>
            {`Grouped comparison table with ${records.length} categories and ${visibleSeries.length} visible peer series.`}
          </caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              {series.map((s) => (
                <th key={s.key as string} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <th scope="row">{formatCategory(r.__category)}</th>
                {series.map((s) => {
                  const sKey = s.key as string
                  const val = r[sKey]
                  return (
                    <td key={sKey}>
                      {isFiniteNumber(val) ? formatValue(val, s) : "Unavailable"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Primary SVG Rendering Canvas via Recharts */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 relative">
        {/* Recoverable All-Series-Hidden State Overlay */}
        {visibleSeries.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs z-20 text-center p-4">
            <p className="text-sm font-medium text-foreground">All peer series are hidden.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Toggle series in the legend below or restore all series to view side-by-side comparisons.
            </p>
            <button
              type="button"
              onClick={showAllSeries}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-xs font-mono font-medium text-foreground transition-colors cursor-pointer"
            >
              Show all series
            </button>
          </div>
        )}

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
            barGap={barGap}
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

            {/* Zero Reference Line Anchor */}
            <ReferenceLine
              x={!isVertical ? 0 : undefined}
              y={isVertical ? 0 : undefined}
              stroke="var(--border, rgba(255, 255, 255, 0.2))"
              strokeWidth={1}
            />

            {/* X-Axis */}
            {isVertical ? (
              <XAxis
                dataKey="__category"
                hide={!showXAxis}
                tickLine={false}
                axisLine={{ stroke: "var(--border, rgba(255, 255, 255, 0.15))" }}
                tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: 11 }}
                tickFormatter={formatCategory}
              />
            ) : (
              <XAxis
                type="number"
                domain={quantitativeDomain}
                hide={!showXAxis}
                tickLine={false}
                axisLine={{ stroke: "var(--border, rgba(255, 255, 255, 0.15))" }}
                tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: 11 }}
                tickFormatter={(val: number) => formatValue(val)}
              />
            )}

            {/* Y-Axis */}
            {isVertical ? (
              <YAxis
                domain={quantitativeDomain}
                hide={!showYAxis}
                tickLine={false}
                axisLine={{ stroke: "var(--border, rgba(255, 255, 255, 0.15))" }}
                tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: 11 }}
                tickFormatter={(val: number) => formatValue(val)}
                width={48}
              />
            ) : (
              <YAxis
                type="category"
                dataKey="__category"
                hide={!showYAxis}
                tickLine={false}
                axisLine={{ stroke: "var(--border, rgba(255, 255, 255, 0.15))" }}
                tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: 11 }}
                tickFormatter={formatCategory}
                width={80}
              />
            )}

            {/* Category-Centric Tooltip Card */}
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null
                const categoryTitle = label !== undefined ? formatCategory(label) : ""

                return (
                  <div
                    className="plotcn-chart-tooltip flex flex-col gap-2 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md backdrop-blur-md min-w-[min(180px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto"
                    role="tooltip"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="font-semibold text-xs text-foreground tracking-tight">
                        {categoryTitle}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        Group Comparison
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-0.5">
                      {series.map((s) => {
                        const sKey = s.key as string
                        const isHidden = hiddenSeriesKeys.has(sKey)
                        if (isHidden) return null

                        const color = seriesColorMap.get(sKey) || "var(--chart-1)"
                        const isHoveredSeries = activeSeriesKey === sKey
                        const currentRecord = records.find((r) => r.__category === label)
                        const rawVal = currentRecord ? currentRecord[sKey] : null
                        const hasVal = isFiniteNumber(rawVal)

                        return (
                          <div
                            key={sKey}
                            className={cn(
                              "flex items-center justify-between gap-3 text-xs py-0.5 px-1 rounded transition-colors",
                              isHoveredSeries && "bg-accent/40 font-medium"
                            )}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className="h-2 w-2 rounded-sm shrink-0"
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                              />
                              <span className="truncate text-muted-foreground">{s.label}</span>
                            </div>
                            <span
                              className={cn(
                                "font-mono tabular-nums text-foreground",
                                !hasVal && "text-muted-foreground/70 italic text-[11px]"
                              )}
                            >
                              {hasVal ? formatValue(rawVal, s) : "Unavailable"}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }}
            />

            {/* Grouped Bars: Side-by-Side WITHOUT stackId */}
            {visibleSeries.map((s) => {
              const sKey = s.key as string
              const color = seriesColorMap.get(sKey) || "var(--chart-1)"

              // Subtle rounding on outer value end; grounded baseline corners remain flat
              const radius: [number, number, number, number] = isVertical
                ? [4, 4, 0, 0]
                : [0, 4, 4, 0]

              return (
                <Bar
                  key={sKey}
                  dataKey={sKey}
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
                  {valueLabel === "always" && (
                    <LabelList
                      dataKey={sKey}
                      position={isVertical ? "top" : "right"}
                      fill="var(--chart-axis, #a1a1aa)"
                      fontSize={10}
                      offset={4}
                      formatter={(val: unknown) => {
                        if (!isFiniteNumber(val)) return ""
                        return formatValue(val, s)
                      }}
                    />
                  )}

                  {valueLabel === "auto" && (
                    <LabelList
                      dataKey={sKey}
                      position="center"
                      fill="#ffffff"
                      fontSize={9}
                      formatter={(val: unknown) => {
                        if (!isFiniteNumber(val) || Math.abs(val) <= 0) return ""
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

      {/* Accessible & Interactive Peer Series Legend */}
      {showLegend && (
        <div
          className="mt-3 shrink-0 flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-border/50 text-xs text-muted-foreground"
          role="toolbar"
          aria-label="Series visibility controls"
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
                role="checkbox"
                aria-checked={!isHidden}
                disabled={!interactiveLegend}
                onClick={() => toggleSeries(sKey)}
                onMouseEnter={() => setActiveSeriesKey(sKey)}
                onMouseLeave={() => setActiveSeriesKey(null)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-2 py-1 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  interactiveLegend ? "cursor-pointer hover:bg-accent/40" : "cursor-default",
                  isHidden && "opacity-40 line-through grayscale",
                  isHovered && "ring-1 ring-ring/30 bg-accent/30 text-foreground font-medium"
                )}
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm shrink-0 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="text-foreground text-[11px] select-none">{s.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </figure>
  )
}
