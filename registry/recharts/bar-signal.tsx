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

export type SignalBarOrientation = "vertical" | "horizontal"

/**
 * Peer numeric series definition for SignalBars.
 * All peer series must share the same quantitative unit, domain, and Y/X scale.
 */
export interface SignalBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on observation records containing finite numeric values */
  key: NumericKeyOf<TData>
  /** Human-readable display label for tooltips, legend, and screen readers */
  label: string
  /** Per-series color override (defaults to Plotcn theme tokens: var(--chart-1), var(--chart-2), etc.) */
  color?: string
  /** Optional custom numeric formatter for tooltip and value labels */
  valueFormatter?: (value: number) => string
}

/**
 * Represents an inspected category with its resolved peer series measurements.
 */
export interface ActiveCategoryDatum<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** 0-based index of the category within caller-preserved order */
  index: number
  /** Discrete category label or value */
  category: string | number
  /** Original raw datum provided by caller */
  raw: TData
  /** Per-series measured values (null represents unavailable/missing) */
  values: Record<string, number | null>
}

export interface SignalBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Readonly array of categorical records. Category order is data and preserved strictly. */
  data: readonly TData[]

  /** Property key defining the discrete category domain */
  categoryKey: keyof TData & string

  /** Array of one or more peer numeric series sharing the same quantitative unit and scale */
  series: readonly SignalBarSeries<TData>[]

  /**
   * Bar orientation:
   * - "vertical": Categories on horizontal X-axis, quantitative bars rise/fall along vertical Y-axis (default).
   * - "horizontal": Categories on vertical Y-axis, quantitative bars extend along horizontal X-axis.
   */
  orientation?: SignalBarOrientation

  /** Chart container height in pixels or CSS string. (default: 320) */
  height?: number | string

  /** Maximum width/thickness for individual bars in pixels to prevent distortion on sparse data. (default: 48) */
  maxBarSize?: number

  /** Space between peer series bars within the same category group in pixels. (default: 4) */
  barGap?: number

  /** Space between category groups in pixels. (default: 16) */
  groupGap?: number

  /**
   * Value label rendering policy:
   * - "none": No inline numeric labels (default).
   * - "auto": Render values when space permits without collision.
   * - "always": Render formatted values near outer bar edge.
   */
  valueLabel?: "none" | "auto" | "always"

  /** Whether to render subtle reference grid lines. (default: true) */
  showGrid?: boolean

  /** Whether to render the category axis ticks and line. (default: true) */
  showXAxis?: boolean

  /** Whether to render the quantitative axis ticks and line. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series legend. Defaults to true when series.length > 1. */
  showLegend?: boolean

  /** Whether the legend allows clicking series to toggle visibility. (default: true) */
  interactiveLegend?: boolean

  /**
   * Pointer interaction hit-testing model:
   * - "category": Entire category band is the forgiving interaction target (default).
   * - "bar": Individual bar rectangle is the target.
   */
  cursorMode?: "category" | "bar"

  /**
   * Tooltip composition model:
   * - "category": Displays all visible peer series together in canonical order (default).
   * - "bar": Displays only the hovered measure.
   */
  tooltipMode?: "category" | "bar"

  /** Motion animation toggle or configuration. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Optional custom category label formatter for axes and tooltips */
  categoryFormatter?: (category: string | number) => string

  /** Optional global value formatter fallback */
  valueFormatter?: (value: number) => string

  /** Callback fired when the active inspected category changes */
  onActiveChange?: (active: ActiveCategoryDatum<TData> | null) => void

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
  "var(--chart-5, #ef4444)",
  "var(--chart-6, #6366f1)",
  "var(--chart-7, #14b8a6)",
  "var(--chart-8, #f97316)",
]

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Normalized internal category record with stable index identity and clean numeric series.
 */
export interface NormalizedSignalBarRecord<TData extends Record<string, unknown>> {
  __index: number
  __category: string | number
  __raw: TData
  [seriesKey: string]: unknown
}

/**
 * Normalizes input data into safe records for Recharts.
 * - Preserves caller category order.
 * - Leaves missing values as null (never converts to 0).
 * - Sanitizes NaN / Infinity to null so invalid SVG geometry is never emitted.
 * - Retains original raw reference for non-visual table and callbacks.
 */
export function normalizeSignalBarData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  categoryKey: keyof TData & string,
  series: readonly SignalBarSeries<TData>[]
): {
  records: NormalizedSignalBarRecord<TData>[]
  hasAnyValidMeasure: boolean
  hasDuplicates: boolean
} {
  const seenCategories = new Set<string | number>()
  let hasDuplicates = false
  let hasAnyValidMeasure = false

  const records: NormalizedSignalBarRecord<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const raw = data[i]
    const cat = (raw[categoryKey] as string | number) ?? `Category ${i + 1}`

    if (seenCategories.has(cat)) {
      hasDuplicates = true
    } else {
      seenCategories.add(cat)
    }

    const rec: NormalizedSignalBarRecord<TData> = {
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
      } else {
        rec[sKey] = null
      }
    }

    records.push(rec)
  }

  return { records, hasAnyValidMeasure, hasDuplicates }
}

/**
 * Calculates a truthful quantitative domain enclosing 0 and all visible finite values.
 * - Positive data: [0, max + padding]
 * - Negative data: [min - padding, 0]
 * - Mixed data: [min - padding, max + padding]
 * - All zero / empty: safe [0, 10]
 */
export function calculateSignalBarDomain<TData extends Record<string, unknown>>(
  records: readonly NormalizedSignalBarRecord<TData>[],
  visibleSeriesKeys: readonly string[]
): [number, number] {
  let min = 0
  let max = 0
  let hasFinite = false

  for (let i = 0; i < records.length; i++) {
    const rec = records[i]
    for (let s = 0; s < visibleSeriesKeys.length; s++) {
      const val = rec[visibleSeriesKeys[s]]
      if (isFiniteNumber(val)) {
        hasFinite = true
        if (val < min) min = val
        if (val > max) max = val
      }
    }
  }

  if (!hasFinite) {
    return [0, 10]
  }

  // All zero
  if (min === 0 && max === 0) {
    return [0, 10]
  }

  // All positive
  if (min >= 0) {
    const pad = max === 0 ? 1 : max * 0.08
    return [0, Math.ceil(max + pad)]
  }

  // All negative
  if (max <= 0) {
    const pad = Math.abs(min) * 0.08
    return [Math.floor(min - pad), 0]
  }

  // Mixed signed
  const padMin = Math.abs(min) * 0.06
  const padMax = max * 0.06
  return [Math.floor(min - padMin), Math.ceil(max + padMax)]
}

/* -------------------------------------------------------------------------- */
/*  Component: SignalBars                                                     */
/* -------------------------------------------------------------------------- */

export function SignalBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  orientation = "vertical",
  height = 320,
  maxBarSize = 48,
  barGap = 4,
  groupGap = 16,
  valueLabel = "none",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend,
  interactiveLegend = true,
  cursorMode = "category",
  tooltipMode = "category",
  motion = true,
  categoryFormatter,
  valueFormatter: globalValueFormatter,
  onActiveChange,
  className,
}: SignalBarsProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const instanceId = React.useId()

  // 1. Validate configuration
  if (!series || series.length === 0) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="No Series Defined"
          description="SignalBars requires at least one quantitative peer series in its series configuration."
        />
      </div>
    )
  }

  if (!categoryKey) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartErrorState
          title="Missing Category Key"
          description="A valid categoryKey is required to identify discrete categorical records."
        />
      </div>
    )
  }

  // 2. Normalize and validate data
  const { records, hasAnyValidMeasure, hasDuplicates } = React.useMemo(() => {
    return normalizeSignalBarData(data, categoryKey, series)
  }, [data, categoryKey, series])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" && hasDuplicates) {
      console.warn(
        `[Plotcn SignalBars] Duplicate category keys detected in dataset for key "${categoryKey}". ` +
          "Categorical order and distinct records are preserved without silent aggregation, but unique labels are recommended for clear inspection."
      )
    }
  }, [hasDuplicates, categoryKey])

  // 3. Interactive series visibility state
  const [hiddenSeriesKeys, setHiddenSeriesKeys] = React.useState<Set<string>>(() => new Set())

  const visibleSeries = React.useMemo(() => {
    return series.filter((s) => !hiddenSeriesKeys.has(s.key as string))
  }, [series, hiddenSeriesKeys])

  const visibleSeriesKeys = React.useMemo(() => {
    return visibleSeries.map((s) => s.key as string)
  }, [visibleSeries])

  // Stable series color mapping: hiding a series never reassigns remaining colors
  const seriesColorMap = React.useMemo(() => {
    const map = new Map<string, string>()
    series.forEach((s, idx) => {
      map.set(s.key as string, s.color || DEFAULT_SERIES_TOKENS[idx % DEFAULT_SERIES_TOKENS.length])
    })
    return map
  }, [series])

  // 4. Domain calculation
  const quantitativeDomain = React.useMemo(() => {
    return calculateSignalBarDomain(records, visibleSeriesKeys)
  }, [records, visibleSeriesKeys])

  // 5. Active inspection state
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [isFocused, setIsFocused] = React.useState(false)
  const [activeSeriesKey, setActiveSeriesKey] = React.useState<string | null>(null)

  const activeDatum = React.useMemo<ActiveCategoryDatum<TData> | null>(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= records.length) {
      return null
    }
    const rec = records[activeIndex]
    const values: Record<string, number | null> = {}
    for (let s = 0; s < series.length; s++) {
      const sKey = series[s].key as string
      values[sKey] = (rec[sKey] as number | null) ?? null
    }
    return {
      index: activeIndex,
      category: rec.__category,
      raw: rec.__raw,
      values,
    }
  }, [activeIndex, records, series])

  React.useEffect(() => {
    onActiveChange?.(activeDatum)
  }, [activeDatum, onActiveChange])

  // 6. Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (records.length === 0) return

    const isVertical = orientation === "vertical"
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
          description="The provided dataset does not contain any records to compare."
        />
      </div>
    )
  }

  if (!hasAnyValidMeasure) {
    return (
      <div style={{ height }} className={cn("w-full", className)}>
        <ChartUnavailableState
          title="No Measurable Data"
          description="Categorical records are present, but all numeric measures are unrecorded or non-finite."
        />
      </div>
    )
  }

  // Toggle series visibility
  const toggleSeries = (sKey: string) => {
    if (!interactiveLegend) return
    setHiddenSeriesKeys((prev) => {
      const next = new Set(prev)
      if (next.has(sKey)) {
        next.delete(sKey)
      } else {
        // Prevent hiding every single series without recovery
        if (next.size + 1 >= series.length) {
          return prev
        }
        next.add(sKey)
      }
      return next
    })
  }

  const showLegendResolved = showLegend ?? series.length > 1
  const isVertical = orientation === "vertical"
  const rechartsLayout = isVertical ? "horizontal" : "vertical"

  // Value formatting helper
  const formatValue = (val: number | null | undefined, seriesItem?: SignalBarSeries<TData>): string => {
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
    ? `${formatCategory(activeDatum.category)}. Category ${activeDatum.index + 1} of ${records.length}. ` +
      visibleSeries
        .map((s) => `${s.label}: ${formatValue(activeDatum.values[s.key as string], s)}`)
        .join(", ")
    : ""

  return (
    <figure
      role="region"
      aria-label={`Signal Bars categorical comparison for ${series.map((s) => s.label).join(", ")}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        setIsFocused(true)
      }}
      onBlur={(e) => {
        // Only clear focus if moving completely outside the chart figure
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsFocused(false)
          setActiveIndex(null)
        }
      }}
      className={cn(
        "plotcn-bar-signal relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        isFocused && "ring-2 ring-[var(--chart-focus,#38bdf8)] ring-offset-2 ring-offset-background",
        className
      )}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? height : 320,
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
            Categorical data table comparing {series.map((s) => s.label).join(", ")} across {records.length} categories.
          </caption>
          <thead>
            <tr>
              <th scope="col">{categoryKey}</th>
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
                  const val = r[s.key as string]
                  return (
                    <td key={s.key as string}>
                      {isFiniteNumber(val) ? formatValue(val, s) : "Unavailable"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Chart Container */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 relative">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
        >
          <BarChart
            data={records}
            layout={rechartsLayout}
            barGap={barGap}
            barCategoryGap={groupGap}
            margin={
              isVertical
                ? { top: 12, right: 16, left: 4, bottom: 4 }
                : { top: 12, right: 24, left: 16, bottom: 4 }
            }
            onMouseMove={(state: any) => {
              if (state && typeof state.activeTooltipIndex === "number") {
                if (state.activeTooltipIndex !== activeIndex) {
                  setActiveIndex(state.activeTooltipIndex)
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
                  width={56}
                  tick={{ fontSize: 11, fill: "var(--chart-axis, #a1a1aa)" }}
                  tickFormatter={formatCategory}
                />
              </>
            )}

            {/* Synchronized Category Tooltip */}
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

                // Extract hovered record directly from Recharts payload
                const payloadItem = payload[0]
                const currentRec = (payloadItem?.payload as Record<string, unknown> | undefined)
                if (!currentRec) return null

                // Determine category and index dynamically from payload
                const rawCategory = currentRec.__category ?? label
                const categoryName: string | number =
                  typeof rawCategory === "string" || typeof rawCategory === "number"
                    ? rawCategory
                    : String(rawCategory ?? "")
                const resolvedIndex = records.findIndex((r) => r === currentRec || r.__category === currentRec.__category)
                const displayIndex = resolvedIndex >= 0 ? resolvedIndex : (activeIndex ?? 0)

                const activeSeriesList =
                  tooltipMode === "bar" && activeSeriesKey
                    ? visibleSeries.filter((s) => s.key === activeSeriesKey)
                    : visibleSeries
                const seriesToRender = activeSeriesList.length ? activeSeriesList : visibleSeries

                return (
                  <div
                    role="tooltip"
                    className="plotcn-chart-tooltip rounded-lg border border-border/80 bg-zinc-950/95 p-2.5 shadow-xl backdrop-blur-md min-w-[min(170px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs font-sans"
                  >
                    <div className="font-medium text-zinc-100 border-b border-white/10 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span>{formatCategory(categoryName)}</span>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        #{displayIndex + 1}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {seriesToRender.map((s) => {
                        const sKey = s.key as string
                        const val = currentRec[sKey]
                        const isMissing = !isFiniteNumber(val)
                        const color = seriesColorMap.get(sKey) || "var(--chart-1)"
                        const isHovered = activeSeriesKey === sKey

                        return (
                          <div
                            key={sKey}
                            className={cn(
                              "flex items-center justify-between gap-3 py-0.5 px-1 rounded transition-colors",
                              isHovered && "bg-white/5"
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
                              {isMissing ? "Unavailable" : formatValue(val as number, s)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }}
            />

            {/* Individual Peer Series Bars */}
            {visibleSeries.map((s) => {
              const sKey = s.key as string
              const color = seriesColorMap.get(sKey) || "var(--chart-1)"

              // Subtle rounding on outer ends only; zero-facing edge remains sharp and grounded
              const radius: [number, number, number, number] = isVertical
                ? [4, 4, 0, 0]
                : [0, 4, 4, 0]

              return (
                <Bar
                  key={sKey}
                  dataKey={sKey}
                  name={s.label}
                  fill={color}
                  maxBarSize={maxBarSize}
                  radius={radius}
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  animationEasing="ease-out"
                  onMouseEnter={() => {
                    if (cursorMode === "bar") {
                      setActiveSeriesKey(sKey)
                    }
                  }}
                  onMouseLeave={() => {
                    if (cursorMode === "bar") {
                      setActiveSeriesKey(null)
                    }
                  }}
                >
                  {valueLabel !== "none" && (
                    <LabelList
                      dataKey={sKey}
                      position={isVertical ? "top" : "right"}
                      fill="var(--chart-axis, #a1a1aa)"
                      fontSize={10}
                      offset={4}
                      formatter={(val: any) => {
                        if (!isFiniteNumber(val)) return ""
                        return formatValue(val, s)
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
      {showLegendResolved && (
        <div
          role="toolbar"
          aria-label="Series visibility controls"
          className="shrink-0 pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono select-none"
        >
          {series.map((s) => {
            const sKey = s.key as string
            const isHidden = hiddenSeriesKeys.has(sKey)
            const color = seriesColorMap.get(sKey) || "var(--chart-1)"

            return (
              <button
                key={sKey}
                type="button"
                aria-pressed={!isHidden}
                disabled={!interactiveLegend}
                onClick={() => toggleSeries(sKey)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-all select-none",
                  interactiveLegend ? "cursor-pointer hover:border-zinc-500" : "cursor-default",
                  isHidden
                    ? "opacity-40 border-transparent bg-transparent line-through text-zinc-500"
                    : "border-border/60 bg-muted/20 text-zinc-200"
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
