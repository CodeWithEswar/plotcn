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

export type NumericKeyOf<T> = [keyof T] extends [never]
  ? string
  : {
      [K in keyof T]: T[K] extends number | null | undefined ? K : never
    }[keyof T] &
      string

export interface RankBarSeries<TData = Record<string, unknown>> {
  /** Property key on data record representing the numeric measure to rank by */
  readonly key: NumericKeyOf<TData>
  /** Human-readable label for tooltip, value labels, and accessibility */
  readonly label: string
  /** Explicit CSS color override for this measure */
  readonly color?: string
  /** Custom formatter function for numeric values */
  readonly valueFormatter?: (value: number) => string
}

export type RankDirection = "desc" | "asc"

export interface ActiveRankDatum<TData = Record<string, unknown>> {
  readonly datum: TData
  readonly category: string
  readonly rank: number
  readonly value: number
  readonly originalIndex: number
  readonly displayRank: string
}

export interface RankBarsProps<TData = Record<string, unknown>> {
  /** Source dataset (never mutated by RankBars) */
  readonly data: readonly TData[]
  /** Property key on data record identifying the categorical dimension */
  readonly categoryKey: keyof TData & string
  /** Single quantitative measure configuration driving the ranking */
  readonly series: RankBarSeries<TData>

  /**
   * Sort direction:
   * - "desc" (default): highest numeric values first (top of chart)
   * - "asc": lowest numeric values first (top of chart)
   */
  readonly rankDirection?: RankDirection
  /** Optional top-N filter applied strictly AFTER ranking */
  readonly topN?: number

  /** Chart container height in pixels or CSS dimension. Defaults to auto based on visible row count. */
  readonly height?: number | "auto"
  /** Height in pixels reserved per ranked horizontal row. Defaults to 44. */
  readonly rowHeight?: number
  /** Explicit quantitative domain override [min, max]. Always zero-inclusive by default. */
  readonly domain?: [number, number]

  /** Primary series bar fill color. Defaults to var(--chart-1). */
  readonly color?: string
  /** Accent color for row highlight border and active state. Defaults to var(--chart-selection). */
  readonly selectionColor?: string

  /** Whether to render 1-indexed rank position numerals before category labels. Defaults to true. */
  readonly showRank?: boolean
  /** Value label rendering mode: "none", "auto" (fit-aware), or "always". Defaults to "auto". */
  readonly valueLabel?: "none" | "auto" | "always"
  /** Whether to render subtle vertical reference grid lines. Defaults to true. */
  readonly showGrid?: boolean

  /** Animation configuration. Automatically disabled under prefers-reduced-motion. */
  readonly motion?: boolean | { duration?: number }

  /** Custom formatter function for category labels */
  readonly categoryFormatter?: (category: string | number) => string
  /** Global formatter function for quantitative values */
  readonly valueFormatter?: (value: number) => string

  /** Callback fired when actively inspected ranked row changes */
  readonly onActiveChange?: (active: ActiveRankDatum<TData> | null) => void

  readonly className?: string
  readonly style?: React.CSSProperties
}

/* -------------------------------------------------------------------------- */
/*  Pure Algorithmic Helpers                                                  */
/* -------------------------------------------------------------------------- */

/** Verifies that a value is a finite renderable number */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export interface ProcessedRankRow<TData> {
  readonly id: string
  readonly originalIndex: number
  readonly datum: TData
  readonly category: string
  readonly value: number
  readonly rankNumber: number
}

export interface RankedDataResult<TData> {
  readonly visibleRows: readonly ProcessedRankRow<TData>[]
  readonly totalCount: number
  readonly rankableCount: number
  readonly unavailableCount: number
  readonly omittedCount: number
  readonly minVal: number
  readonly maxVal: number
}

/**
 * Pure ranking pipeline:
 * 1. Validates finite values, separating rankable from unavailable
 * 2. Applies deterministic stable sort (tie-breaker: caller input order)
 * 3. Applies top-N slice AFTER ranking
 * 4. Generates 1-indexed ordinal visual rank numerals
 */
export function rankCategoricalData<TData>(
  data: readonly TData[],
  categoryKey: keyof TData & string,
  seriesKey: NumericKeyOf<TData>,
  direction: RankDirection = "desc",
  topN?: number
): RankedDataResult<TData> {
  const totalCount = data.length
  let unavailableCount = 0

  interface ValidatedCandidate {
    datum: TData
    category: string
    value: number
    originalIndex: number
  }

  const validCandidates: ValidatedCandidate[] = []

  for (let i = 0; i < data.length; i++) {
    const datum = data[i]
    if (!datum || typeof datum !== "object") {
      unavailableCount++
      continue
    }

    const rawVal = (datum as Record<string, unknown>)[seriesKey as string]
    if (isFiniteNumber(rawVal)) {
      const rawCat = (datum as Record<string, unknown>)[categoryKey]
      const category = rawCat !== undefined && rawCat !== null ? String(rawCat) : `Item ${i + 1}`
      validCandidates.push({
        datum,
        category,
        value: rawVal,
        originalIndex: i,
      })
    } else {
      unavailableCount++
    }
  }

  const rankableCount = validCandidates.length

  // Stable sort: primary by numeric value, secondary by originalIndex (tie-breaker)
  validCandidates.sort((a, b) => {
    if (direction === "asc") {
      if (a.value !== b.value) return a.value - b.value
      return a.originalIndex - b.originalIndex
    } else {
      if (a.value !== b.value) return b.value - a.value
      return a.originalIndex - b.originalIndex
    }
  })

  // Apply Top-N strictly after ranking
  let limited = validCandidates
  if (topN !== undefined && Number.isInteger(topN) && topN > 0) {
    limited = validCandidates.slice(0, topN)
  }

  const omittedCount = Math.max(0, rankableCount - limited.length)

  let minVal = 0
  let maxVal = 0

  const visibleRows: ProcessedRankRow<TData>[] = limited.map((cand, idx) => {
    if (idx === 0) {
      minVal = cand.value
      maxVal = cand.value
    } else {
      if (cand.value < minVal) minVal = cand.value
      if (cand.value > maxVal) maxVal = cand.value
    }

    return {
      id: `rank-${cand.originalIndex}-${idx}`,
      originalIndex: cand.originalIndex,
      datum: cand.datum,
      category: cand.category,
      value: cand.value,
      rankNumber: idx + 1,
    }
  })

  return {
    visibleRows,
    totalCount,
    rankableCount,
    unavailableCount,
    omittedCount,
    minVal,
    maxVal,
  }
}

/**
 * Calculates zero-anchored horizontal quantitative scale domain:
 * - Ensures 0 is always included
 * - Adds 10% outer padding for bar value labels
 */
export function calculateRankBarsDomain(
  minVal: number,
  maxVal: number,
  explicitDomain?: [number, number]
): [number, number] {
  if (explicitDomain && explicitDomain.length === 2) {
    return explicitDomain
  }

  if (minVal === 0 && maxVal === 0) {
    return [0, 10]
  }

  let domainMin = 0
  let domainMax = 0

  if (minVal >= 0 && maxVal >= 0) {
    // All positive
    domainMin = 0
    const padding = maxVal * 0.12 || 1
    domainMax = Math.ceil(maxVal + padding)
  } else if (minVal <= 0 && maxVal <= 0) {
    // All negative
    const padding = Math.abs(minVal) * 0.12 || 1
    domainMin = Math.floor(minVal - padding)
    domainMax = 0
  } else {
    // Mixed sign
    const posPadding = maxVal * 0.12 || 1
    const negPadding = Math.abs(minVal) * 0.12 || 1
    domainMin = Math.floor(minVal - negPadding)
    domainMax = Math.ceil(maxVal + posPadding)
  }

  return [domainMin, domainMax]
}

/* -------------------------------------------------------------------------- */
/*  Custom SVG Shapes & Ticks                                                 */
/* -------------------------------------------------------------------------- */

interface CustomBarShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  payload?: ProcessedRankRow<unknown>
  isActive?: boolean
  selectionColor?: string
}

function RankedHorizontalBarShape(props: CustomBarShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, fill, isActive, selectionColor } = props

  if (width === 0 || height === 0) return null

  // Value end receives a subtle rounded outer edge; zero baseline end stays flat
  const radius = Math.min(4, height / 2)
  const isPositive = width >= 0

  const rx = isPositive ? x : x + width
  const rw = Math.abs(width)
  const ry = y
  const rh = height

  // SVG path with outer corners rounded and zero-baseline corners flat
  let path = ""
  if (isPositive) {
    // Left side flat (zero line), right side rounded
    path = `
      M ${rx},${ry}
      h ${Math.max(0, rw - radius)}
      a ${radius},${radius} 0 0 1 ${radius},${radius}
      v ${Math.max(0, rh - radius * 2)}
      a ${radius},${radius} 0 0 1 -${radius},${radius}
      h -${Math.max(0, rw - radius)}
      Z
    `
  } else {
    // Right side flat (zero line), left side rounded
    path = `
      M ${rx + radius},${ry}
      h ${Math.max(0, rw - radius)}
      v ${rh}
      h -${Math.max(0, rw - radius)}
      a ${radius},${radius} 0 0 1 -${radius},-${radius}
      v -${Math.max(0, rh - radius * 2)}
      a ${radius},${radius} 0 0 1 ${radius},-${radius}
      Z
    `
  }

  return (
    <path
      d={path}
      fill={fill}
      stroke={isActive ? selectionColor || "var(--chart-selection)" : "none"}
      strokeWidth={isActive ? 1.5 : 0}
      className={cn(
        "transition-opacity duration-150",
        isActive ? "opacity-100" : "opacity-90 hover:opacity-100"
      )}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function RankBars<TData = Record<string, unknown>>({
  data = [],
  categoryKey,
  series,
  rankDirection = "desc",
  topN,
  height = "auto",
  rowHeight = 44,
  domain: explicitDomain,
  color,
  selectionColor,
  showRank = true,
  valueLabel = "auto",
  showGrid = true,
  motion = true,
  categoryFormatter,
  valueFormatter,
  onActiveChange,
  className,
  style,
}: RankBarsProps<TData>) {
  const reducedMotion = useChartReducedMotion()
  const isAnimated = motion !== false && !reducedMotion

  const [activeRankIndex, setActiveRankIndex] = React.useState<number | null>(null)
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const rootRef = React.useRef<HTMLElement>(null)

  // Pure deterministic ranking computation
  const rankedResult = React.useMemo(() => {
    if (!categoryKey || !series || !series.key) {
      return {
        visibleRows: [],
        totalCount: 0,
        rankableCount: 0,
        unavailableCount: 0,
        omittedCount: 0,
        minVal: 0,
        maxVal: 0,
      }
    }
    return rankCategoricalData(data, categoryKey, series.key, rankDirection, topN)
  }, [data, categoryKey, series, rankDirection, topN])

  const {
    visibleRows,
    totalCount,
    rankableCount,
    unavailableCount,
    omittedCount,
    minVal,
    maxVal,
  } = rankedResult

  // Quantitative zero-anchored domain
  const computedDomain = React.useMemo(() => {
    return calculateRankBarsDomain(minVal, maxVal, explicitDomain)
  }, [minVal, maxVal, explicitDomain])

  // Effective height: dynamically derived from row count if height is "auto" or omitted
  const calculatedHeight = React.useMemo(() => {
    if (typeof height === "number") return height
    const topBottomMargins = 48
    return Math.max(160, visibleRows.length * rowHeight + topBottomMargins)
  }, [height, visibleRows.length, rowHeight])

  // Color resolution: series?.color > color prop > default theme token
  const barColor = series?.color || color || "var(--chart-1)"
  const activeSelectionColor = selectionColor || "var(--chart-selection)"

  // Value formatting helper
  const formatValue = React.useCallback(
    (v: number): string => {
      if (series?.valueFormatter) return series.valueFormatter(v)
      if (valueFormatter) return valueFormatter(v)
      return v.toLocaleString()
    },
    [series, valueFormatter]
  )

  // Format category helper
  const formatCategory = React.useCallback(
    (cat: string | number): string => {
      if (categoryFormatter) return categoryFormatter(cat)
      return String(cat)
    },
    [categoryFormatter]
  )

  // Synchronize active datum callback
  const handleRowActivation = React.useCallback(
    (index: number | null) => {
      setActiveRankIndex(index)
      if (index !== null && visibleRows[index]) {
        const row = visibleRows[index]
        setActiveCategory(row.category)
        if (onActiveChange) {
          onActiveChange({
            datum: row.datum,
            category: row.category,
            rank: row.rankNumber,
            value: row.value,
            originalIndex: row.originalIndex,
            displayRank: `#${row.rankNumber}`,
          })
        }
      } else {
        setActiveCategory(null)
        if (onActiveChange) onActiveChange(null)
      }
    },
    [visibleRows, onActiveChange]
  )

  // Keyboard navigation across ranked rows (Up: previous/higher rank, Down: next/lower rank)
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (visibleRows.length === 0) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        const nextIndex =
          activeRankIndex === null ? 0 : Math.min(visibleRows.length - 1, activeRankIndex + 1)
        handleRowActivation(nextIndex)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        const prevIndex =
          activeRankIndex === null ? visibleRows.length - 1 : Math.max(0, activeRankIndex - 1)
        handleRowActivation(prevIndex)
      } else if (e.key === "Home") {
        e.preventDefault()
        handleRowActivation(0)
      } else if (e.key === "End") {
        e.preventDefault()
        handleRowActivation(visibleRows.length - 1)
      } else if (e.key === "Escape") {
        handleRowActivation(null)
      }
    },
    [visibleRows.length, activeRankIndex, handleRowActivation]
  )

  // Data mapped for Recharts BarChart (layout="vertical" is Recharts terminology for horizontal bars)
  const rechartsData = React.useMemo(() => {
    return visibleRows.map((row) => ({
      ...row.datum,
      __id: row.id,
      __category: row.category,
      __value: row.value,
      __rankNumber: row.rankNumber,
      __rawRow: row,
    }))
  }, [visibleRows])

  // Contextual summary for screen readers
  const accessibleSummary = React.useMemo(() => {
    const sLabel = series?.label || "Value"
    const dirText = rankDirection === "desc" ? "highest to lowest" : "lowest to highest"
    let txt = `Horizontal ranked bar chart showing ${sLabel} sorted ${dirText}. `
    if (topN && topN < rankableCount) {
      txt += `Displaying top ${visibleRows.length} of ${rankableCount} rankable categories. `
    } else {
      txt += `Displaying all ${visibleRows.length} ranked categories. `
    }
    if (unavailableCount > 0) {
      txt += `${unavailableCount} category ${unavailableCount === 1 ? "record has" : "records have"} unavailable values and ${unavailableCount === 1 ? "is" : "are"} omitted from ranking. `
    }
    txt += "Use Up and Down Arrow keys to inspect individual ranked categories."
    return txt
  }, [series?.label, rankDirection, topN, rankableCount, visibleRows.length, unavailableCount])

  // Configuration error guards
  if (!categoryKey || !series || !series.key) {
    return (
      <ChartErrorState
        title="Invalid Rank Configuration"
        description="RankBars requires a valid 'categoryKey' and a declared 'series' measure to rank by."
        className={className}
      />
    )
  }

  // Empty state check
  if (totalCount === 0) {
    return (
      <ChartEmptyState
        title="No Categorical Records"
        description="Provide a dataset with categorical observations to view ranking analysis."
        className={className}
      />
    )
  }

  // Unavailable state check: records exist, but none contain finite numeric measures
  if (rankableCount === 0) {
    return (
      <ChartUnavailableState
        title="No Rankable Values"
        description="Dataset records exist, but none contain finite numeric values for the ranking measure."
        className={className}
      />
    )
  }

  return (
    <figure
      ref={rootRef}
      role="region"
      aria-label={`${series.label} Ranking`}
      aria-describedby="rank-bars-summary-desc"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/rank-bars relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl transition-colors",
        className
      )}
      style={style}
    >
      <span id="rank-bars-summary-desc" className="sr-only">
        {accessibleSummary}
      </span>

      {/* Context metadata badge: Top N of M / Unavailable counts */}
      <div className="flex items-center justify-between gap-2 px-1 pb-2 text-[11px] font-mono text-muted-foreground border-b border-border/40 mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {rankDirection === "desc" ? "Ranked (Highest first)" : "Ranked (Lowest first)"}
          </span>
          {topN && topN < rankableCount && (
            <span className="px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
              Top {visibleRows.length} of {rankableCount}
            </span>
          )}
          {omittedCount > 0 && (
            <span className="text-muted-foreground/60 text-[10px]">
              ({omittedCount} omitted)
            </span>
          )}
        </div>
        {unavailableCount > 0 && (
          <span className="text-muted-foreground/80 italic">
            {unavailableCount} unavailable
          </span>
        )}
      </div>

      {/* Main Chart Graphic */}
      <ChartContainer style={{ height: calculatedHeight }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rechartsData}
            layout="vertical"
            barCategoryGap={8}
            margin={{ top: 8, right: 48, left: 16, bottom: 8 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                const idx = Number(state.activeTooltipIndex)
                if (!Number.isNaN(idx) && idx >= 0 && idx < visibleRows.length) {
                  handleRowActivation(idx)
                }
              }
            }}
            onMouseLeave={() => handleRowActivation(null)}
          >
            {showGrid && (
              <CartesianGrid
                horizontal={false}
                vertical={true}
                strokeDasharray="3 3"
                className="stroke-muted/40"
              />
            )}

            {/* Zero Baseline Reference Line */}
            <ReferenceLine
              x={0}
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-border"
            />

            {/* Quantitative X-Axis */}
            <XAxis
              type="number"
              domain={computedDomain}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatValue(Number(v))}
              className="text-[11px] font-mono fill-muted-foreground"
            />

            {/* Categorical Y-Axis with Custom Rank + Label Tick */}
            <YAxis
              type="category"
              dataKey="__id"
              tickLine={false}
              axisLine={false}
              interval={0}
              width={160}
              tick={(tickProps) => {
                const { x, y, payload } = tickProps
                const item = rechartsData.find((d) => d.__id === payload.value)
                if (!item) return null

                const isCurrentActive = activeCategory === item.__category
                const catLabel = formatCategory(item.__category)

                return (
                  <g transform={`translate(${x},${y})`}>
                    {/* Rank Numeral Gutter */}
                    {showRank && (
                      <text
                        x={-148}
                        y={4}
                        textAnchor="start"
                        className={cn(
                          "text-[11px] font-mono font-semibold transition-colors duration-150",
                          isCurrentActive ? "fill-foreground" : "fill-muted-foreground/70"
                        )}
                      >
                        #{item.__rankNumber}
                      </text>
                    )}
                    {/* Category Label */}
                    <text
                      x={showRank ? -118 : -148}
                      y={4}
                      textAnchor="start"
                      className={cn(
                        "text-[12px] font-sans font-medium transition-colors duration-150",
                        isCurrentActive ? "fill-foreground font-semibold" : "fill-foreground/80"
                      )}
                    >
                      {catLabel.length > 22 ? `${catLabel.slice(0, 20)}…` : catLabel}
                    </text>
                  </g>
                )
              }}
            />

            {/* Shared Tooltip */}
            <Tooltip
              isAnimationActive={false}
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const item = payload[0]?.payload as (typeof rechartsData)[0]
                if (!item) return null

                return (
                  <div
                    role="tooltip"
                    className="plotcn-chart-tooltip rounded-lg border border-border/80 bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-md min-w-[min(180px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto pointer-events-none"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        {showRank && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-foreground">
                            #{item.__rankNumber}
                          </span>
                        )}
                        <span className="font-semibold text-xs text-foreground tracking-tight truncate max-w-[150px]">
                          {formatCategory(item.__category)}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.__rankNumber} of {visibleRows.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: barColor }}
                        />
                        <span>{series.label}</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        {formatValue(item.__value)}
                      </span>
                    </div>
                  </div>
                )
              }}
            />

            {/* The Ranked Horizontal Bar */}
            <Bar
              dataKey="__value"
              isAnimationActive={isAnimated}
              animationDuration={typeof motion === "object" ? motion.duration ?? 350 : 350}
              shape={(shapeProps: unknown) => {
                const sProps = shapeProps as CustomBarShapeProps
                const rowId = sProps.payload?.id
                const isCurrentActive =
                  activeRankIndex !== null && visibleRows[activeRankIndex]?.id === rowId
                return (
                  <RankedHorizontalBarShape
                    {...sProps}
                    fill={barColor}
                    isActive={isCurrentActive}
                    selectionColor={activeSelectionColor}
                  />
                )
              }}
            >
              {/* Optional Value Labels at Bar Outer Edge */}
              {valueLabel !== "none" && (
                <LabelList
                  dataKey="__value"
                  position="right"
                  formatter={(val: unknown) => formatValue(Number(val))}
                  className="fill-muted-foreground text-[11px] font-mono font-medium"
                />
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Screen Reader Offscreen Accessible Table */}
      <div className="sr-only">
        <table>
          <caption>
            {series.label} Ranking. Showing {visibleRows.length} of {rankableCount} categories
            sorted {rankDirection === "desc" ? "highest first" : "lowest first"}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Category</th>
              <th scope="col">{series.label}</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td>{row.rankNumber}</td>
                <td>{row.category}</td>
                <td>{formatValue(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Live region announcing active row navigation */}
      <div aria-live="polite" className="sr-only">
        {activeRankIndex !== null && visibleRows[activeRankIndex] && (
          <span>
            {visibleRows[activeRankIndex].category}, rank {visibleRows[activeRankIndex].rankNumber}{" "}
            of {visibleRows.length} displayed categories. {series.label}:{" "}
            {formatValue(visibleRows[activeRankIndex].value)}.
          </span>
        )}
      </div>
    </figure>
  )
}
