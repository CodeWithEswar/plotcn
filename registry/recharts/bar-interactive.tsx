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
  LabelList,
  Customized,
} from "recharts"
import { cn } from "@/lib/utils"
import { ChartContainer } from "@/registry/shared/chart-container"
import { ChartEmptyState, ChartLoadingState, ChartUnavailableState } from "@/registry/shared/chart-state"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockIcon, LockOpenIcon } from "@hugeicons/core-free-icons"

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

export interface InteractiveBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property on data record representing the numeric measure */
  readonly key: NumericKeyOf<TData>
  /** Human-readable label for the series */
  readonly label: string
  /** Explicit series color override (defaults to --chart-N) */
  readonly color?: string
  /** Value formatter for tooltip and labels */
  readonly valueFormatter?: (value: number) => string
}

export type InteractiveBarLayout = "vertical" | "horizontal"
export type InteractiveBarValueLabel = "none" | "auto"
export type InteractiveBarCursorMode = "band" | "band-and-bar"
export type InteractiveInputMode = "pointer" | "touch" | "keyboard" | null

export interface PreparedInteractiveDatum<TData> {
  __source: TData
  __index: number
  __category: string | number
  [key: string]: unknown
}

export interface InteractiveBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Array of categorical records. Caller order is strictly preserved. */
  readonly data: readonly TData[]
  /** Key on data records representing the discrete category label */
  readonly categoryKey: keyof TData & string
  /** One or more peer numeric series sharing the same category and scale */
  readonly series: readonly InteractiveBarSeries<TData>[]

  /** Layout orientation: "vertical" (categories on X) or "horizontal" (categories on Y). Default: "vertical" */
  readonly layout?: InteractiveBarLayout
  /** Container height in pixels or CSS dimension string (default: 340) */
  readonly height?: number | string
  /** Quantitative scale domain policy or explicit [min, max] override */
  readonly domain?: [number, number] | "auto"

  /** Whether to render subtle background Cartesian gridlines (default: true) */
  readonly showGrid?: boolean
  /** Whether to display the series legend (default: false) */
  readonly showLegend?: boolean
  /** Whether legend series items can be toggled to show/hide (default: false) */
  readonly interactiveLegend?: boolean
  /** Display mode for permanent value labels (default: "none") */
  readonly valueLabel?: InteractiveBarValueLabel
  /** Cursor interaction mode: category band only or band + active bar emphasis (default: "band-and-bar") */
  readonly cursorMode?: InteractiveBarCursorMode

  /** Whether touch taps establish a persistent inspection lock (default: true) */
  readonly lockOnTouch?: boolean
  /** Whether mouse clicks establish a persistent inspection lock (default: true) */
  readonly lockOnClick?: boolean

  /** Motion configuration (honors prefers-reduced-motion) */
  readonly motion?: boolean | { duration?: number }
  /** Additional CSS class names */
  readonly className?: string
  /** Semantic chart title for accessibility */
  readonly title?: string
  /** Analytical description for screen readers */
  readonly description?: string
  /** Whether the chart is currently loading data */
  readonly loading?: boolean
}

/* -------------------------------------------------------------------------- */
/*  Mathematical & Domain Helpers                                             */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val) && !Number.isNaN(val)
}

/**
 * Derives the quantitative domain covering all visible series values.
 * Truthfully includes zero for magnitude bar charts.
 */
export function resolveInteractiveBarDomain<TData extends Record<string, unknown>>(
  data: readonly TData[],
  seriesKeys: readonly string[],
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

  const values: number[] = [0] // Include zero baseline for magnitude bars
  for (const row of data) {
    for (const key of seriesKeys) {
      const val = row[key]
      if (isFiniteNumber(val)) {
        values.push(val)
      }
    }
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max && min === 0) {
    return [0, 10]
  }

  // 6% head room padding on positive extreme
  const pad = (max - min) * 0.06 || 1
  return [min < 0 ? min - pad : 0, max > 0 ? max + pad : 0]
}

export function defaultFormatValue(value: number): string {
  if (!Number.isFinite(value)) return "—"
  if (Number.isInteger(value)) return value.toLocaleString()
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

/* -------------------------------------------------------------------------- */
/*  Interactive State Machine Reducer                                         */
/* -------------------------------------------------------------------------- */

export interface InteractiveBarState {
  activeCategoryIndex: number | null
  activeSeriesKey: string | null
  lockedCategoryIndex: number | null
  lockedSeriesKey: string | null
  inputMode: InteractiveInputMode
}

export type InteractiveAction =
  | { type: "POINTER_HOVER"; index: number; seriesKey?: string }
  | { type: "POINTER_LEAVE" }
  | { type: "TOGGLE_LOCK"; index: number; seriesKey?: string; inputMode: "touch" | "pointer" | "keyboard" }
  | { type: "UNLOCK" }
  | { type: "KEYBOARD_NAV"; index: number }
  | { type: "RESET" }

export const initialInteractiveState: InteractiveBarState = {
  activeCategoryIndex: null,
  activeSeriesKey: null,
  lockedCategoryIndex: null,
  lockedSeriesKey: null,
  inputMode: null,
}

export function interactiveReducer(
  state: InteractiveBarState,
  action: InteractiveAction
): InteractiveBarState {
  switch (action.type) {
    case "POINTER_HOVER": {
      // If locked, pointer hover does not steal category focus, but can highlight series
      if (state.lockedCategoryIndex !== null) {
        return {
          ...state,
          activeSeriesKey: action.seriesKey ?? null,
          inputMode: "pointer",
        }
      }
      return {
        ...state,
        activeCategoryIndex: action.index,
        activeSeriesKey: action.seriesKey ?? null,
        inputMode: "pointer",
      }
    }

    case "POINTER_LEAVE": {
      // If locked, leave does not clear locked category
      if (state.lockedCategoryIndex !== null) {
        return {
          ...state,
          activeSeriesKey: null,
        }
      }
      return {
        ...state,
        activeCategoryIndex: null,
        activeSeriesKey: null,
        inputMode: null,
      }
    }

    case "TOGGLE_LOCK": {
      // If already locked on this index, unlock
      if (state.lockedCategoryIndex === action.index) {
        return {
          ...state,
          lockedCategoryIndex: null,
          lockedSeriesKey: null,
          activeCategoryIndex: action.index,
          activeSeriesKey: action.seriesKey ?? null,
          inputMode: action.inputMode,
        }
      }
      // Otherwise lock this category
      return {
        ...state,
        lockedCategoryIndex: action.index,
        lockedSeriesKey: action.seriesKey ?? null,
        activeCategoryIndex: action.index,
        activeSeriesKey: action.seriesKey ?? null,
        inputMode: action.inputMode,
      }
    }

    case "UNLOCK": {
      return {
        ...state,
        lockedCategoryIndex: null,
        lockedSeriesKey: null,
      }
    }

    case "KEYBOARD_NAV": {
      const isLocked = state.lockedCategoryIndex !== null
      return {
        ...state,
        activeCategoryIndex: action.index,
        activeSeriesKey: null,
        lockedCategoryIndex: isLocked ? action.index : null,
        inputMode: "keyboard",
      }
    }

    case "RESET":
      return initialInteractiveState

    default:
      return state
  }
}

/* -------------------------------------------------------------------------- */
/*  Main Component: InteractiveBars                                            */
/* -------------------------------------------------------------------------- */

const DEFAULT_SERIES_COLORS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #f97316)",
  "var(--chart-3, #10b981)",
  "var(--chart-4, #a855f7)",
  "var(--chart-5, #ec4899)",
  "var(--chart-6, #eab308)",
]

export function InteractiveBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  categoryKey,
  series = [],
  layout = "vertical",
  height = 340,
  domain = "auto",
  showGrid = true,
  showLegend = false,
  interactiveLegend = false,
  valueLabel = "none",
  cursorMode = "band-and-bar",
  lockOnTouch = true,
  lockOnClick = true,
  motion = true,
  className,
  title = "Interactive Categorical Comparison",
  description = "Categorical bar chart with category band inspection, persistent touch lock, and keyboard traversal.",
  loading = false,
}: InteractiveBarsProps<TData>) {
  const isHorizontal = layout === "horizontal"
  const containerRef = React.useRef<HTMLElement>(null)
  const chartRef = React.useRef<HTMLDivElement>(null)

  // 1. Series visibility tracking (for optional interactive legend)
  const [hiddenSeries, setHiddenSeries] = React.useState<Record<string, boolean>>({})
  const visibleSeries = React.useMemo(() => {
    return series.filter((s) => !hiddenSeries[s.key])
  }, [series, hiddenSeries])

  // 2. Interaction State
  const [state, dispatch] = React.useReducer(interactiveReducer, initialInteractiveState)

  // Live accessibility announcement state
  const [liveAnnouncement, setLiveAnnouncement] = React.useState<string>("")

  // 3. Immutably prepare categorical rows
  const preparedData = React.useMemo<PreparedInteractiveDatum<TData>[]>(() => {
    if (!Array.isArray(data)) return []

    return data.map((item, idx) => {
      const categoryVal = item[categoryKey]
      const category = categoryVal != null ? String(categoryVal) : `Category ${idx + 1}`

      const row: PreparedInteractiveDatum<TData> = {
        ...item,
        __source: item,
        __index: idx,
        __category: category,
      }

      // Ensure numeric values are normalized
      for (const s of series) {
        const val = item[s.key]
        row[s.key] = isFiniteNumber(val) ? val : null
      }

      return row
    })
  }, [data, categoryKey, series])

  // 4. Quantitative domain resolution
  const computedDomain = React.useMemo(() => {
    const visibleKeys = visibleSeries.map((s) => s.key)
    return resolveInteractiveBarDomain(preparedData, visibleKeys, domain)
  }, [preparedData, visibleSeries, domain])

  // Check if any finite data exists
  const hasFiniteData = React.useMemo(() => {
    for (const row of preparedData) {
      for (const s of visibleSeries) {
        if (isFiniteNumber(row[s.key])) return true
      }
    }
    return false
  }, [preparedData, visibleSeries])

  // Effective inspected index (locked takes precedence over active)
  const inspectedIndex = state.lockedCategoryIndex !== null ? state.lockedCategoryIndex : state.activeCategoryIndex
  const isLocked = state.lockedCategoryIndex !== null
  const inspectedDatum = inspectedIndex !== null && inspectedIndex >= 0 && inspectedIndex < preparedData.length
    ? preparedData[inspectedIndex]
    : null

  // 5. Single Tab-Stop Keyboard Navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!preparedData.length) return
      const total = preparedData.length
      const current = inspectedIndex !== null ? inspectedIndex : 0

      if (isHorizontal) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          const next = Math.min(total - 1, current + 1)
          dispatch({ type: "KEYBOARD_NAV", index: next })
          announceCategory(next)
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          const prev = Math.max(0, current - 1)
          dispatch({ type: "KEYBOARD_NAV", index: prev })
          announceCategory(prev)
        }
      } else {
        if (e.key === "ArrowRight") {
          e.preventDefault()
          const next = Math.min(total - 1, current + 1)
          dispatch({ type: "KEYBOARD_NAV", index: next })
          announceCategory(next)
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          const prev = Math.max(0, current - 1)
          dispatch({ type: "KEYBOARD_NAV", index: prev })
          announceCategory(prev)
        }
      }

      if (e.key === "Home") {
        e.preventDefault()
        dispatch({ type: "KEYBOARD_NAV", index: 0 })
        announceCategory(0)
      } else if (e.key === "End") {
        e.preventDefault()
        dispatch({ type: "KEYBOARD_NAV", index: total - 1 })
        announceCategory(total - 1)
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        const target = inspectedIndex !== null ? inspectedIndex : 0
        dispatch({ type: "TOGGLE_LOCK", index: target, inputMode: "keyboard" })
        const willLock = state.lockedCategoryIndex !== target
        setLiveAnnouncement(`${preparedData[target].__category} ${willLock ? "locked" : "unlocked"}.`)
      } else if (e.key === "Escape") {
        e.preventDefault()
        dispatch({ type: "UNLOCK" })
        setLiveAnnouncement("Inspection unlocked.")
      }
    },
    [preparedData, isHorizontal, inspectedIndex, state.lockedCategoryIndex]
  )

  const announceCategory = React.useCallback(
    (idx: number) => {
      if (!preparedData[idx]) return
      const row = preparedData[idx]
      const valuesSummary = visibleSeries
        .map((s) => {
          const val = row[s.key]
          const fmt = s.valueFormatter || defaultFormatValue
          return `${s.label}: ${isFiniteNumber(val) ? fmt(val) : "Unavailable"}`
        })
        .join(". ")
      setLiveAnnouncement(`${row.__category}. Category ${idx + 1} of ${preparedData.length}. ${valuesSummary}`)
    },
    [preparedData, visibleSeries]
  )

  // Color resolver per series
  const getSeriesColor = React.useCallback(
    (s: InteractiveBarSeries<TData>, index: number) => {
      return s.color || DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length]
    },
    []
  )

  // Series toggle helper
  const toggleSeries = (key: string) => {
    if (!interactiveLegend) return
    setHiddenSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      // Don't allow hiding all series
      const remaining = series.filter((s) => !next[s.key])
      return remaining.length > 0 ? next : prev
    })
  }

  // Click & tap handlers for the category band
  const handleBandClick = (index: number) => {
    if (!lockOnClick && !lockOnTouch) return
    dispatch({ type: "TOGGLE_LOCK", index, inputMode: "pointer" })
  }

  if (loading) {
    return <ChartLoadingState style={{ height }} className={className} />
  }

  if (preparedData.length === 0) {
    return <ChartEmptyState style={{ height }} title="No Data Available" className={className} />
  }

  if (!hasFiniteData) {
    return (
      <ChartUnavailableState
        style={{ height }}
        title="No Numeric Observations"
        description="None of the category records contain finite numbers."
        className={className}
      />
    )
  }

  const chartMargin = isHorizontal
    ? { top: 16, right: 32, bottom: 24, left: 24 }
    : { top: 24, right: 24, bottom: 32, left: 24 }

  return (
    <figure
      ref={containerRef}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "plotcn-chart plotcn-interactive-bars relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none",
        className
      )}
    >
      {/* Hidden Live Region for sparse accessibility announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Screen reader summary & navigation guide */}
      <div className="sr-only">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>
          Showing {preparedData.length} categories across {visibleSeries.length} series.
          Use {isHorizontal ? "Up and Down" : "Left and Right"} Arrow keys to inspect categories.
          Press Enter or Space to toggle persistent inspection lock, and Escape to unlock.
        </p>
      </div>

      {/* Optional Interactive or Static Legend */}
      {showLegend && (
        <div
          role={interactiveLegend ? "group" : "region"}
          aria-label="Series Legend"
          className="flex flex-wrap items-center justify-end gap-4 px-3 py-2 text-xs text-muted-foreground border-b border-border/50 mb-2"
        >
          {series.map((s, idx) => {
            const isHidden = Boolean(hiddenSeries[s.key])
            const color = getSeriesColor(s, idx)
            return (
              <button
                key={`legend-${String(s.key)}`}
                type="button"
                disabled={!interactiveLegend}
                onClick={() => toggleSeries(String(s.key))}
                className={cn(
                  "flex items-center gap-1.5 transition-opacity duration-150",
                  interactiveLegend ? "cursor-pointer hover:opacity-100" : "cursor-default",
                  isHidden ? "opacity-35 line-through" : "opacity-90"
                )}
                aria-pressed={interactiveLegend ? !isHidden : undefined}
                aria-label={`Toggle ${s.label} series`}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-xs shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-medium text-foreground">{s.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Main SVG Visualization Canvas */}
      <div ref={chartRef} className="w-full relative" style={{ height: typeof height === "number" ? `${height}px` : height }}>
        <ChartContainer className="w-full h-full relative">
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
                    dispatch({ type: "POINTER_HOVER", index: idx })
                  }
                }
              }}
              onMouseLeave={() => {
                dispatch({ type: "POINTER_LEAVE" })
              }}
              onClick={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  const idx = Number(state.activeTooltipIndex)
                  if (!Number.isNaN(idx)) {
                    handleBandClick(idx)
                  }
                }
              }}
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
                    tickFormatter={defaultFormatValue}
                  />
                  <YAxis
                    type="category"
                    dataKey="__category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--foreground)", fontSize: 12, fontWeight: 500 }}
                    width={90}
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
                    tickFormatter={defaultFormatValue}
                    width={50}
                  />
                </>
              )}

              {/* Native Category Band Cursor */}
              <Tooltip
                isAnimationActive={false}
                cursor={{
                  fill: isLocked ? "var(--chart-selection, #3b82f6)" : "var(--accent, #71717a)",
                  opacity: isLocked ? 0.16 : 0.09,
                  stroke: isLocked ? "var(--chart-selection, #3b82f6)" : "none",
                  strokeWidth: isLocked ? 1.5 : 0,
                  strokeDasharray: isLocked ? "4 2" : undefined,
                  rx: 4,
                  ry: 4,
                }}
                allowEscapeViewBox={{ x: false, y: false }}
                content={({ active, payload }) => {
                  // If locked or hovered, resolve datum
                  const datum = inspectedDatum || (active && payload && payload.length ? (payload[0].payload as PreparedInteractiveDatum<TData>) : null)
                  if (!datum) return null

                  const isCurrentlyLocked = state.lockedCategoryIndex === datum.__index

                  return (
                    <div
                      role="tooltip"
                      className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md px-3.5 py-3 shadow-2xl text-xs space-y-2 pointer-events-none min-w-[210px] max-w-[calc(100cqw-16px)]"
                    >
                      {/* Header: Category + Locked Pill */}
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <span className="font-semibold text-foreground text-sm truncate">
                          {datum.__category}
                        </span>
                        {isCurrentlyLocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-medium shrink-0">
                            <HugeiconsIcon icon={LockIcon} size={10} />
                            <span>Locked</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">
                            Category {datum.__index + 1}
                          </span>
                        )}
                      </div>

                      {/* Series Breakdown */}
                      <div className="space-y-1.5 pt-0.5">
                        {visibleSeries.map((s, idx) => {
                          const val = datum[s.key]
                          const hasVal = isFiniteNumber(val)
                          const color = getSeriesColor(s, idx)
                          const isHighlighted = cursorMode === "band-and-bar" && state.activeSeriesKey === s.key
                          const fmt = s.valueFormatter || defaultFormatValue

                          return (
                            <div
                              key={`tooltip-${String(s.key)}`}
                              className={cn(
                                "flex items-center justify-between gap-3 px-1 py-0.5 rounded transition-colors",
                                isHighlighted ? "bg-white/10 font-semibold text-foreground" : "text-muted-foreground"
                              )}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className="w-2.5 h-2.5 rounded-xs shrink-0"
                                  style={{ backgroundColor: color }}
                                  aria-hidden="true"
                                />
                                <span className={cn("truncate", isHighlighted ? "text-foreground" : "text-foreground/90")}>
                                  {s.label}
                                </span>
                              </div>
                              <span className="font-mono text-foreground font-medium shrink-0">
                                {hasVal ? fmt(val as number) : "Unavailable"}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Interaction Footer Instruction */}
                      <div className="border-t border-border/40 pt-1.5 text-[10px] font-mono text-muted-foreground/70 flex items-center justify-between">
                        <span>{isCurrentlyLocked ? "Press Esc to unlock" : "Click / tap to lock"}</span>
                        <span>{isCurrentlyLocked ? <HugeiconsIcon icon={LockOpenIcon} size={10} /> : <HugeiconsIcon icon={LockIcon} size={10} />}</span>
                      </div>
                    </div>
                  )
                }}
              />

              {/* Grouped Bar Series */}
              {visibleSeries.map((s, idx) => {
                const color = getSeriesColor(s, idx)
                const isSeriesActive = state.activeSeriesKey === s.key

                return (
                  <Bar
                    key={`bar-series-${String(s.key)}`}
                    dataKey={s.key as string}
                    name={s.label}
                    fill={color}
                    fillOpacity={
                      cursorMode === "band-and-bar" && state.activeSeriesKey && !isSeriesActive
                        ? 0.5
                        : 1
                    }
                    stroke={isSeriesActive ? "var(--foreground)" : "none"}
                    strokeWidth={isSeriesActive ? 1.5 : 0}
                    radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                    isAnimationActive={Boolean(motion)}
                    animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 500}
                    onMouseEnter={() => {
                      dispatch({ type: "POINTER_HOVER", index: inspectedIndex ?? 0, seriesKey: String(s.key) })
                    }}
                    onMouseLeave={() => {
                      dispatch({ type: "POINTER_HOVER", index: inspectedIndex ?? 0 })
                    }}
                  >
                    {valueLabel === "auto" && (
                      <LabelList
                        dataKey={s.key as string}
                        position={isHorizontal ? "right" : "top"}
                        formatter={(val: unknown) => (isFiniteNumber(val) ? defaultFormatValue(val) : "")}
                        className="fill-foreground font-mono text-[10px]"
                      />
                    )}
                  </Bar>
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Accessible Structured Data Fallback Table */}
      <div className="sr-only">
        <table>
          <caption>{title} data table</caption>
          <thead>
            <tr>
              <th scope="col">{categoryKey}</th>
              {visibleSeries.map((s) => (
                <th key={`th-${String(s.key)}`} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preparedData.map((row) => (
              <tr key={`tr-${String(row.__category)}`}>
                <th scope="row">{row.__category}</th>
                {visibleSeries.map((s) => {
                  const val = row[s.key]
                  const fmt = s.valueFormatter || defaultFormatValue
                  return <td key={`td-${String(row.__category)}-${String(s.key)}`}>{isFiniteNumber(val) ? fmt(val) : "Unavailable"}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
