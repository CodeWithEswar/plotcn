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

export interface BulletBarSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property on data object representing the current/observed actual measure */
  valueKey: NumericKeyOf<TData>
  /** Property on data object representing the explicit reference target */
  targetKey: NumericKeyOf<TData>
  /** Semantic series label for the actual measure (e.g., "Availability", "Revenue") */
  label: string
  /** Optional custom label for the value in tooltips and legends */
  valueLabel?: string
  /** Optional custom label for the target in tooltips and legends */
  targetLabel?: string
  /** Custom formatter for the actual measure value */
  valueFormatter?: (value: number) => string
  /** Custom formatter for the target reference value */
  targetFormatter?: (value: number) => string
}

export interface BulletRange {
  /** Upper boundary for this qualitative range band */
  to: number
  /** Optional label for the range (e.g. "Satisfactory", "Target range") */
  label?: string
  /** Optional custom fill color token */
  color?: string
}

export interface BulletBarsProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Array of categorical data records. Order is strictly preserved. */
  data: readonly TData[]
  /** Key on data records representing the discrete category label */
  categoryKey: keyof TData & string
  /** Strong series definition for actual and target measures */
  series: BulletBarSeries<TData>
  /** Optional caller-defined qualitative background ranges (must be monotonically increasing) */
  ranges?: readonly BulletRange[]
  /** Total container height in pixels or CSS string */
  height?: number | string
  /** Target height for each scorecard row in pixels (default: 48) */
  rowHeight?: number
  /** Custom quantitative domain or "auto" */
  domain?: [number, number] | "auto"
  /** Fill color for the actual measure bar (defaults to var(--chart-1)) */
  valueColor?: string
  /** Stroke color for the per-category target marker rule (defaults to var(--chart-foreground)) */
  targetColor?: string
  /** Accent color for the active/focused row (defaults to var(--chart-selection)) */
  selectionColor?: string
  /** Whether to render subtle background Cartesian gridlines (default: true) */
  showGrid?: boolean
  /** Whether to render the structural legend (default: false) */
  showLegend?: boolean
  /** Outward numeric label policy (default: "none") */
  valueLabel?: "none" | "value" | "auto"
  /** Animation configuration (honors prefers-reduced-motion) */
  motion?: boolean | { duration?: number }
  /** Additional CSS class names */
  className?: string
  /** Semantic chart title for accessibility and header */
  title?: string
  /** Analytical description for screen readers */
  description?: string
  /** Whether the chart is currently loading data */
  loading?: boolean
}

export type BulletPosition = "above" | "below" | "equal" | "unavailable"

export interface PreparedBulletDatum<TData> {
  __source: TData
  __index: number
  __category: string | number
  __actual: number | null
  __target: number | null
  __delta: number | null
  __position: BulletPosition
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
 * Computes arithmetic delta = actual - target.
 * Returns null if either value is null/non-finite.
 */
export function computeTargetDelta(
  actual: number | null | undefined,
  target: number | null | undefined
): number | null {
  if (!isFiniteNumber(actual) || !isFiniteNumber(target)) {
    return null
  }
  return actual - target
}

/**
 * Classifies factual spatial position of actual relative to target without judgment.
 */
export function classifyTargetPosition(
  actual: number | null | undefined,
  target: number | null | undefined
): BulletPosition {
  if (!isFiniteNumber(actual) || !isFiniteNumber(target)) {
    return "unavailable"
  }
  if (actual > target) return "above"
  if (actual < target) return "below"
  return "equal"
}

/**
 * Resolves the shared quantitative domain spanning 0, all actuals, all targets, and ranges.
 */
export function resolveBulletDomain(
  actuals: readonly (number | null)[],
  targets: readonly (number | null)[],
  ranges?: readonly BulletRange[],
  explicitDomain?: [number, number] | "auto"
): [number, number] {
  if (Array.isArray(explicitDomain) && explicitDomain.length === 2) {
    if (isFiniteNumber(explicitDomain[0]) && isFiniteNumber(explicitDomain[1])) {
      return explicitDomain
    }
  }

  const finiteNumbers: number[] = [0] // baseline is always included

  for (const a of actuals) {
    if (isFiniteNumber(a)) finiteNumbers.push(a)
  }
  for (const t of targets) {
    if (isFiniteNumber(t)) finiteNumbers.push(t)
  }
  if (ranges && ranges.length > 0) {
    for (const r of ranges) {
      if (isFiniteNumber(r.to)) finiteNumbers.push(r.to)
    }
  }

  if (finiteNumbers.length === 1 && finiteNumbers[0] === 0) {
    return [0, 100]
  }

  let min = Math.min(...finiteNumbers)
  let max = Math.max(...finiteNumbers)

  if (min === max) {
    min = min < 0 ? min * 1.2 : min > 0 ? 0 : -10
    max = max > 0 ? max * 1.2 : max < 0 ? 0 : 10
  } else {
    // Add 6% headroom on the maximum so markers and labels near the edge remain comfortably unclipped
    const span = max - min
    max += span * 0.06
    if (min < 0) {
      min -= span * 0.04
    }
  }

  return [Math.floor(min), Math.ceil(max)]
}

/* -------------------------------------------------------------------------- */
/*  Custom Bar + Target Marker SVG Shape                                      */
/* -------------------------------------------------------------------------- */

interface CustomBulletShapeProps {
  x?: number
  y?: number
  width?: number
  height?: number
  background?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
  payload?: PreparedBulletDatum<unknown>
  domain: [number, number]
  valueColor: string
  targetColor: string
  selectionColor: string
  isActive: boolean
  ranges?: readonly BulletRange[]
  valueLabel?: "none" | "value" | "auto"
  valueFormatter?: (val: number) => string
}

function BulletBarShape(props: CustomBulletShapeProps) {
  const {
    background,
    payload,
    domain,
    valueColor,
    targetColor,
    selectionColor,
    isActive,
    ranges,
    valueLabel,
    valueFormatter,
  } = props

  if (!payload || !background || typeof background.x !== "number" || typeof background.width !== "number") {
    return null
  }

  const bgX = background.x
  const bgWidth = background.width
  const rowY = typeof props.y === "number" ? props.y : (background.y ?? 0)
  const rowHeight = typeof props.height === "number" ? props.height : (background.height ?? 40)

  const [minDomain, maxDomain] = domain
  const domainSpan = maxDomain - minDomain
  if (domainSpan <= 0) return null

  // Function to convert data value to horizontal pixel coordinate on the shared scale
  const toPixelX = (val: number) => {
    const ratio = (val - minDomain) / domainSpan
    return bgX + Math.max(0, Math.min(bgWidth, ratio * bgWidth))
  }

  const zeroX = toPixelX(0)
  const barThickness = Math.min(22, Math.max(14, rowHeight * 0.42))
  const barY = rowY + (rowHeight - barThickness) / 2

  const actual = payload.__actual
  const target = payload.__target

  // Derive pixel geometries
  let actualBarLeft = zeroX
  let actualBarWidth = 0
  let actualBarRight = zeroX

  if (isFiniteNumber(actual)) {
    const actualX = toPixelX(actual)
    actualBarLeft = Math.min(zeroX, actualX)
    actualBarWidth = Math.abs(actualX - zeroX)
    actualBarRight = Math.max(zeroX, actualX)
  }

  const hasTarget = isFiniteNumber(target)
  const targetX = hasTarget ? toPixelX(target!) : 0

  return (
    <g className="plotcn-bullet-row group/row">
      {/* 1. Full Row Hit & Selection Highlight Region */}
      <rect
        x={bgX - 8}
        y={rowY}
        width={bgWidth + 16}
        height={rowHeight}
        fill={isActive ? "rgba(255, 255, 255, 0.05)" : "transparent"}
        rx={6}
        className="transition-colors duration-150"
      />

      {/* 2. Optional Background Qualitative Ranges */}
      {ranges && ranges.length > 0 && (
        <g opacity={0.45} className="plotcn-bullet-ranges">
          {ranges.map((range, i) => {
            const prevBoundary = i === 0 ? Math.min(0, minDomain) : ranges[i - 1].to
            const rangeLeft = toPixelX(prevBoundary)
            const rangeRight = toPixelX(range.to)
            const rangeWidth = Math.max(0, rangeRight - rangeLeft)
            const defaultBandFills = [
              "var(--chart-grid, rgba(255, 255, 255, 0.08))",
              "var(--chart-grid-emphasis, rgba(255, 255, 255, 0.14))",
              "rgba(255, 255, 255, 0.20)",
            ]
            const bandColor = range.color || defaultBandFills[i % defaultBandFills.length]

            return (
              <rect
                key={i}
                x={rangeLeft}
                y={barY - 3}
                width={rangeWidth}
                height={barThickness + 6}
                fill={bandColor}
                rx={2}
              />
            )
          })}
        </g>
      )}

      {/* 3. Actual Measure Bar */}
      {isFiniteNumber(actual) && actualBarWidth > 0 && (
        <rect
          x={actualBarLeft}
          y={barY}
          width={actualBarWidth}
          height={barThickness}
          fill={valueColor}
          rx={actual >= 0 ? 3 : 3}
          stroke={isActive ? selectionColor : "none"}
          strokeWidth={isActive ? 1.5 : 0}
          className="transition-opacity duration-150"
        />
      )}

      {/* 4. Per-Category Target Marker Rule (Always visible, layered on top of actual bar) */}
      {hasTarget && (
        <g className="plotcn-bullet-target-marker">
          {/* Target rule shadow for contrast against same-colored bars */}
          <line
            x1={targetX}
            x2={targetX}
            y1={barY - 5}
            y2={barY + barThickness + 5}
            stroke="var(--background, #09090b)"
            strokeWidth={4}
            strokeLinecap="round"
          />
          {/* Core Target Marker */}
          <line
            x1={targetX}
            x2={targetX}
            y1={barY - 5}
            y2={barY + barThickness + 5}
            stroke={targetColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 5. Optional Inline Value Label */}
      {valueLabel !== "none" && isFiniteNumber(actual) && (
        <text
          x={actualBarRight + 8}
          y={barY + barThickness / 2 + 3.5}
          fill="var(--chart-foreground, #fafafa)"
          fontSize={10}
          fontFamily="monospace"
          fontWeight={600}
        >
          {valueFormatter ? valueFormatter(actual) : actual.toLocaleString()}
        </text>
      )}
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: BulletBars                                                */
/* -------------------------------------------------------------------------- */

export function BulletBars<TData extends Record<string, unknown> = Record<string, unknown>>({
  data,
  categoryKey,
  series,
  ranges,
  height,
  rowHeight = 48,
  domain = "auto",
  valueColor = "var(--chart-1, #10b981)",
  targetColor = "var(--chart-foreground, #fafafa)",
  selectionColor = "var(--chart-selection, #f59e0b)",
  showGrid = true,
  showLegend = false,
  valueLabel = "none",
  motion = true,
  className,
  title = "Bullet Bars — Operational Scorecard",
  description,
  loading = false,
}: BulletBarsProps<TData>) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const isAnimated = typeof motion === "boolean" ? motion : true
  const animDuration = typeof motion === "object" && motion.duration ? motion.duration : 300

  // Standardized formatting helpers
  const formatValue = React.useCallback(
    (val: number | null | undefined): string => {
      if (!isFiniteNumber(val)) return "Unavailable"
      return series.valueFormatter ? series.valueFormatter(val) : val.toLocaleString()
    },
    [series]
  )

  const formatTarget = React.useCallback(
    (val: number | null | undefined): string => {
      if (!isFiniteNumber(val)) return "Unavailable"
      return series.targetFormatter
        ? series.targetFormatter(val)
        : series.valueFormatter
        ? series.valueFormatter(val)
        : val.toLocaleString()
    },
    [series]
  )

  const formatDelta = React.useCallback(
    (delta: number | null): string => {
      if (!isFiniteNumber(delta)) return "Unavailable"
      const prefix = delta > 0 ? "+" : delta < 0 ? "−" : ""
      const absVal = Math.abs(delta)
      const formatted = series.valueFormatter ? series.valueFormatter(absVal) : absVal.toLocaleString()
      return `${prefix}${formatted}`
    },
    [series]
  )

  // Memoized canonical data preparation
  const preparedData = React.useMemo<PreparedBulletDatum<TData>[]>(() => {
    if (!Array.isArray(data) || !data.length) return []

    return data.map((d, index) => {
      const cat = d[categoryKey] as string | number
      const rawActual = d[series.valueKey]
      const rawTarget = d[series.targetKey]

      const actual = isFiniteNumber(rawActual) ? rawActual : null
      const target = isFiniteNumber(rawTarget) ? rawTarget : null
      const delta = computeTargetDelta(actual, target)
      const position = classifyTargetPosition(actual, target)

      return {
        __source: d,
        __index: index,
        __category: cat ?? `Category ${index + 1}`,
        __actual: actual,
        __target: target,
        __delta: delta,
        __position: position,
      }
    })
  }, [data, categoryKey, series.valueKey, series.targetKey])

  // Derive quantitative scale domain
  const resolvedDomain = React.useMemo<[number, number]>(() => {
    const actuals = preparedData.map((d) => d.__actual)
    const targets = preparedData.map((d) => d.__target)
    return resolveBulletDomain(actuals, targets, ranges, domain)
  }, [preparedData, ranges, domain])

  // Derive auto height if omitted
  const resolvedHeight = React.useMemo<number | string>(() => {
    if (height !== undefined) return height
    return Math.max(220, preparedData.length * rowHeight + 64)
  }, [height, preparedData.length, rowHeight])

  // Keyboard navigation across scorecard rows (Horizontal canonical: ArrowDown / ArrowUp)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!preparedData.length) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev === null) return 0
          return Math.min(prev + 1, preparedData.length - 1)
        })
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev === null) return preparedData.length - 1
          return Math.max(prev - 1, 0)
        })
        break
      case "Home":
        e.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        e.preventDefault()
        setActiveIndex(preparedData.length - 1)
        break
      case "Escape":
        e.preventDefault()
        setActiveIndex(null)
        break
    }
  }

  if (loading) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof resolvedHeight === "number" ? resolvedHeight : 240 }}
      >
        <ChartLoadingState title="Loading operational scorecard..." />
      </figure>
    )
  }

  if (!preparedData.length) {
    return (
      <figure
        ref={rootRef}
        className={cn("w-full", className)}
        style={{ minHeight: typeof resolvedHeight === "number" ? resolvedHeight : 240 }}
      >
        <ChartEmptyState
          title="No operational records"
          description="Provide categorical observations with actual and target values to inspect operational performance."
        />
      </figure>
    )
  }

  // Factual screen-reader accessibility summary
  const aboveCount = preparedData.filter((d) => d.__position === "above").length
  const belowCount = preparedData.filter((d) => d.__position === "below").length
  const onTargetCount = preparedData.filter((d) => d.__position === "equal").length
  const unavailableCount = preparedData.filter((d) => d.__position === "unavailable").length

  const a11ySummary = `${title}. Operational comparison of ${series.label} against explicit targets across ${preparedData.length} categories. ${aboveCount} above target, ${belowCount} below target, ${onTargetCount} on target${
    unavailableCount > 0 ? `, and ${unavailableCount} with incomplete values` : ""
  }.`

  return (
    <figure
      ref={rootRef}
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#10b981)] focus-visible:ring-offset-2 rounded-xl",
        className
      )}
      style={{ height: resolvedHeight, minHeight: typeof resolvedHeight === "number" ? resolvedHeight : 240 }}
    >
      {/* Screen Reader Offscreen Analytical Summary & Data Table */}
      <div className="sr-only">
        <h2>{title}</h2>
        <p>{description || a11ySummary}</p>
        <table>
          <caption>{title} — Structured Scorecard</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">{series.valueLabel || series.label || "Actual"}</th>
              <th scope="col">{series.targetLabel || "Target"}</th>
              <th scope="col">Delta</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((d) => (
              <tr key={String(d.__category)}>
                <th scope="row">{String(d.__category)}</th>
                <td>{formatValue(d.__actual)}</td>
                <td>{formatTarget(d.__target)}</td>
                <td>{formatDelta(d.__delta)}</td>
                <td>
                  {d.__position === "above"
                    ? "Above target"
                    : d.__position === "below"
                    ? "Below target"
                    : d.__position === "equal"
                    ? "On target"
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Structural Legend */}
      {showLegend && (
        <div
          aria-hidden="true"
          className="flex flex-wrap items-center justify-end gap-5 px-3 py-1.5 text-xs text-muted-foreground font-medium"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: valueColor }}
            />
            <span>{series.valueLabel || series.label || "Actual"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-0.5 h-3 shrink-0 rounded-full"
              style={{ backgroundColor: targetColor }}
            />
            <span>{series.targetLabel || "Target"}</span>
          </div>
          {ranges && ranges.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-zinc-700/50 shrink-0" />
              <span>Qualitative Ranges</span>
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
            initialDimension={{ width: 320, height: typeof resolvedHeight === "number" ? resolvedHeight : 240 }}
          >
            <BarChart
              data={preparedData}
              layout="vertical"
              margin={{
                top: 12,
                right: valueLabel !== "none" ? 44 : 20,
                left: 10,
                bottom: 8,
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
                  horizontal={false}
                  vertical={true}
                  stroke="var(--chart-grid, rgba(255,255,255,0.06))"
                />
              )}

              {/* Shared Quantitative Scale (X-axis) */}
              <XAxis
                type="number"
                domain={resolvedDomain}
                stroke="var(--chart-axis, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (series.valueFormatter ? series.valueFormatter(v) : `${v}`)}
              />

              {/* Categorical Scale (Y-axis) */}
              <YAxis
                type="category"
                dataKey="__category"
                stroke="var(--chart-axis, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />

              {/* Synchronized Analytical Tooltip */}
              <Tooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{
                  fill: "var(--chart-grid, rgba(255, 255, 255, 0.04))",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const row = payload[0]?.payload as PreparedBulletDatum<TData> | undefined
                  if (!row) return null

                  const isMissingActual = row.__actual === null
                  const isMissingTarget = row.__target === null
                  const isAbove = row.__position === "above"
                  const isBelow = row.__position === "below"
                  const isEqual = row.__position === "equal"

                  return (
                    <div
                      role="tooltip"
                      className="plotcn-chart-tooltip rounded-xl border border-white/[0.12] bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[min(210px,calc(100cqw-16px))] max-w-[min(320px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs font-sans not-prose space-y-2.5"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 gap-2">
                        <span className="font-semibold text-zinc-100 text-sm tracking-tight truncate">
                          {String(row.__category)}
                        </span>
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase",
                            isAbove
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : isBelow
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : isEqual
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                          )}
                        >
                          {isAbove
                            ? "Above Target"
                            : isBelow
                            ? "Below Target"
                            : isEqual
                            ? "On Target"
                            : "Incomplete"}
                        </span>
                      </div>

                      {/* Actual and Target Metric Rows */}
                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-400 font-sans flex items-center gap-1.5">
                            <span
                              className="size-2 rounded-sm shrink-0"
                              style={{ backgroundColor: valueColor }}
                            />
                            {series.valueLabel || series.label || "Actual"}
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              isMissingActual ? "text-zinc-500 italic" : "text-zinc-100"
                            )}
                          >
                            {formatValue(row.__actual)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-zinc-400 font-sans flex items-center gap-1.5">
                            <span
                              className="w-0.5 h-2 shrink-0 rounded-full"
                              style={{ backgroundColor: targetColor }}
                            />
                            {series.targetLabel || "Target"}
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              isMissingTarget ? "text-zinc-500 italic" : "text-zinc-200"
                            )}
                          >
                            {formatTarget(row.__target)}
                          </span>
                        </div>

                        {/* Delta Row */}
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/[0.06]">
                          <span className="text-zinc-400 font-sans">Delta</span>
                          <span
                            className={cn(
                              "font-semibold",
                              row.__delta === null
                                ? "text-zinc-500 italic"
                                : row.__delta > 0
                                ? "text-emerald-400"
                                : row.__delta < 0
                                ? "text-amber-400"
                                : "text-zinc-300"
                            )}
                          >
                            {formatDelta(row.__delta)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />

              {/* Composite Bar & Target Marker Layer */}
              <Bar
                dataKey="__actual"
                isAnimationActive={isAnimated}
                animationDuration={animDuration}
                background={{ fill: "transparent" }}
                shape={(barProps: unknown) => (
                  <BulletBarShape
                    {...(barProps as CustomBulletShapeProps)}
                    domain={resolvedDomain}
                    valueColor={valueColor}
                    targetColor={targetColor}
                    selectionColor={selectionColor}
                    isActive={activeIndex === (barProps as CustomBulletShapeProps)?.payload?.__index}
                    ranges={ranges}
                    valueLabel={valueLabel}
                    valueFormatter={series.valueFormatter}
                  />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </figure>
  )
}
