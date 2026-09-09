"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockKeyIcon } from "@hugeicons/core-free-icons"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartLoadingState,
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

export type BaselineClassification = "above" | "equal" | "below"

/**
 * Series definition for Baseline Area (single quantitative series relative to explicit baseline).
 */
export interface BaselineAreaSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key for quantitative observation values */
  key: NumericKeyOf<TData>

  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string

  /** Optional custom numeric formatter for metric values */
  valueFormatter?: (value: number) => string
}

export interface BaselineAreaActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  value: number | null
  baseline: number
  deviation: number | null
  position: BaselineClassification | "unavailable"
  isLocked: boolean
}

export interface BaselineAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for horizontal domain coordinate (e.g. date, month, hour). */
  xKey: keyof TData & string

  /** Semantic series descriptor defining metric key and label. */
  series: BaselineAreaSeries<TData>

  /**
   * Explicit constant reference baseline value.
   * REQUIRED: Plotcn never silently defaults to zero.
   */
  baseline: number

  /** Optional label for the reference baseline (e.g. "Target", "SLA", "Benchmark"). */
  baselineLabel?: string

  /** Optional label for values exceeding the baseline. (default: "Above reference") */
  aboveLabel?: string

  /** Optional label for values below the baseline. (default: "Below reference") */
  belowLabel?: string

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation. */
  domain?: [number, number] | "auto"

  /** Primary signal stroke and active point color. (default: "var(--chart-1, #3b82f6)") */
  color?: string

  /** Fill color for occupied area above the baseline. (default: "var(--chart-1, #3b82f6)") */
  aboveColor?: string

  /** Fill color for occupied area below the baseline. (default: "var(--chart-2, #10b981)") */
  belowColor?: string

  /** Reference baseline stroke and indicator color. (default: "var(--chart-axis, #71717a)") */
  baselineColor?: string

  /** Active selection / crosshair highlight color. (default: "var(--chart-selection, #38bdf8)") */
  selectionColor?: string

  /** Fill opacity for above and below occupied regions. (default: 0.24) */
  fillOpacity?: number

  /** Whether to render subtle horizontal grid reference lines. (default: true) */
  showGrid?: boolean

  /** Whether to render horizontal domain tick labels. (default: true) */
  showXAxis?: boolean

  /** Whether to render vertical metric scale ticks. (default: true) */
  showYAxis?: boolean

  /** Whether to render above/below/baseline status legend. (default: false) */
  showLegend?: boolean

  /** Whether to derive and display signed deviation in the inspection tooltip. (default: true) */
  showDeviation?: boolean

  /** Whether to allow locking tooltip inspection on click or Enter/Space. (default: true) */
  lockableTooltip?: boolean

  /** Handling of missing/null values: "gap" (truthful break) | "connect" (bridge). (default: "gap") */
  missingValuePolicy?: "gap" | "connect"

  /** Motion preferences. (default: true) */
  motion?: boolean | { duration?: number }

  /** Initial inspection lock index. */
  defaultLockedIndex?: number | null

  /** Callback fired when the active inspection datum changes. */
  onActiveChange?: (active: BaselineAreaActiveDatum<TData, XVal> | null) => void

  /** Optional custom title announced to assistive technology. */
  title?: string

  /** Optional extended description for assistive technology. */
  description?: string

  /** Explicit loading state fallback. */
  loading?: boolean

  /** Explicit empty state fallback. */
  empty?: boolean

  /** Explicit error state fallback. */
  error?: string | Error

  /** Explicit unavailable state fallback. */
  unavailable?: boolean

  /** Additional CSS class for outer container figure. */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Mathematical Helpers                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Factual classification of an observed numeric value relative to an explicit baseline.
 * Does not assign judgmental "good/bad" value labels.
 */
export function classifyAgainstBaseline(
  value: number,
  baseline: number
): BaselineClassification {
  if (value > baseline) return "above"
  if (value < baseline) return "below"
  return "equal"
}

/**
 * Normalizes input records into clean numeric data.
 * Clamps or sanitizes non-finite values to null to protect SVG geometry.
 */
export function normalizeBaselineData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  key: string
): Array<TData & { _normalizedValue: number | null }> {
  if (!Array.isArray(data)) return []

  return data.map((item) => {
    if (!item || typeof item !== "object") {
      return { ...item, _normalizedValue: null }
    }
    const val = item[key]
    const num = typeof val === "number" && Number.isFinite(val) ? val : null
    return {
      ...item,
      _normalizedValue: num,
    }
  })
}

/**
 * Computes a safe Y-domain enclosing all valid series observations AND the explicit baseline.
 */
export function calculateBaselineAreaDomain<TData extends Record<string, unknown>>(
  data: ReadonlyArray<TData & { _normalizedValue: number | null }>,
  baseline: number,
  explicitDomain?: [number, number] | "auto"
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    explicitDomain.length === 2 &&
    typeof explicitDomain[0] === "number" &&
    typeof explicitDomain[1] === "number" &&
    Number.isFinite(explicitDomain[0]) &&
    Number.isFinite(explicitDomain[1])
  ) {
    return [explicitDomain[0], explicitDomain[1]]
  }

  const validValues = data
    .map((d) => d._normalizedValue)
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v))

  if (validValues.length === 0) {
    if (Number.isFinite(baseline)) {
      return [baseline - 10, baseline + 10]
    }
    return [0, 100]
  }

  const rawMin = Math.min(...validValues, baseline)
  const rawMax = Math.max(...validValues, baseline)

  if (rawMin === rawMax) {
    const pad = Math.abs(rawMin) > 0 ? Math.abs(rawMin) * 0.15 : 10
    return [Number((rawMin - pad).toFixed(2)), Number((rawMax + pad).toFixed(2))]
  }

  const span = rawMax - rawMin
  const padding = span * 0.08

  return [
    Number((rawMin - padding).toFixed(2)),
    Number((rawMax + padding).toFixed(2)),
  ]
}

/**
 * Computes normalized vertical offset (0.0 to 1.0) of the baseline within the Area polygon's bounding box.
 * The polygon's top is Math.max(baseline, ...values) (y=0 in objectBoundingBox),
 * and its bottom is Math.min(baseline, ...values) (y=1 in objectBoundingBox).
 */
export function calculateBaselineGradientOffset(
  min: number,
  max: number,
  baseline: number
): number {
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(baseline)) {
    return 0.5
  }
  if (max === min) {
    return 0.5
  }
  const offset = (max - baseline) / (max - min)
  return Math.max(0, Math.min(1, offset))
}

/* -------------------------------------------------------------------------- */
/*  Main Component: BaselineArea                                              */
/* -------------------------------------------------------------------------- */

export function BaselineArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data = [],
  xKey,
  series,
  baseline,
  baselineLabel = "Reference",
  aboveLabel = "Above reference",
  belowLabel = "Below reference",
  height = 320,
  curve = "monotone",
  domain = "auto",
  color = "var(--chart-1, #3b82f6)",
  aboveColor = "var(--chart-1, #3b82f6)",
  belowColor = "var(--chart-2, #10b981)",
  baselineColor = "var(--chart-axis, #71717a)",
  selectionColor = "var(--chart-selection, #38bdf8)",
  fillOpacity = 0.24,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  showDeviation = true,
  lockableTooltip = true,
  missingValuePolicy = "gap",
  motion = true,
  defaultLockedIndex = null,
  onActiveChange,
  title = "Baseline Area Chart",
  description,
  loading = false,
  empty = false,
  error,
  unavailable = false,
  className,
}: BaselineAreaProps<TData, XVal>) {
  // 1. Validate explicit baseline requirement
  const isBaselineValid = typeof baseline === "number" && Number.isFinite(baseline)

  // 2. Reduced motion detection
  const prefersReducedMotion = useChartReducedMotion()
  const isMotionEnabled = motion !== false && !prefersReducedMotion

  // 3. Normalize dataset
  const normalizedData = React.useMemo(() => {
    return normalizeBaselineData(data, series.key)
  }, [data, series.key])

  // 4. Safe Y domain enclosing both data and baseline
  const safeDomain = React.useMemo(() => {
    if (!isBaselineValid) return [0, 100] as [number, number]
    return calculateBaselineAreaDomain(normalizedData, baseline, domain)
  }, [normalizedData, baseline, domain, isBaselineValid])

  // 5. Data range for polygon bounding box
  const polygonBounds = React.useMemo(() => {
    if (!isBaselineValid) return { min: 0, max: 100 }
    const validValues = normalizedData
      .map((d) => d._normalizedValue)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v))

    if (validValues.length === 0) {
      return { min: baseline, max: baseline }
    }
    return {
      min: Math.min(...validValues, baseline),
      max: Math.max(...validValues, baseline),
    }
  }, [normalizedData, baseline, isBaselineValid])

  // 6. Hard-stop gradient offset calculation
  const baselineOffset = React.useMemo(() => {
    if (!isBaselineValid) return 0.5
    return calculateBaselineGradientOffset(polygonBounds.min, polygonBounds.max, baseline)
  }, [polygonBounds.min, polygonBounds.max, baseline, isBaselineValid])

  const offsetPercent = React.useMemo(() => {
    return Number((baselineOffset * 100).toFixed(3))
  }, [baselineOffset])

  // 7. SSR-safe deterministic gradient and clip IDs
  const rawId = React.useId()
  const gradientId = React.useMemo(
    () => `plotcn-baseline-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId]
  )

  // 8. Opacity clamping
  const clampedOpacity = Math.max(
    0,
    Math.min(1, typeof fillOpacity === "number" && Number.isFinite(fillOpacity) ? fillOpacity : 0.24)
  )

  // 9. Inspection state
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(() => {
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedData.length
    ) {
      return defaultLockedIndex
    }
    return null
  })

  const [activeIndex, setActiveIndex] = React.useState<number | null>(() => {
    if (lockedIndex !== null) return lockedIndex
    return normalizedData.length > 0 ? 0 : null
  })

  // Synchronize inspection datum callback
  React.useEffect(() => {
    if (!onActiveChange) return
    const idx = lockedIndex !== null ? lockedIndex : activeIndex
    if (idx === null || idx < 0 || idx >= normalizedData.length) {
      onActiveChange(null)
      return
    }

    const item = normalizedData[idx]
    const val = item._normalizedValue
    const dev = val !== null && isBaselineValid ? val - baseline : null
    const pos: BaselineClassification | "unavailable" =
      val === null || !isBaselineValid
        ? "unavailable"
        : classifyAgainstBaseline(val, baseline)

    onActiveChange({
      index: idx,
      x: item[xKey] as XVal,
      raw: item,
      value: val,
      baseline,
      deviation: dev,
      position: pos,
      isLocked: lockedIndex !== null,
    })
  }, [activeIndex, lockedIndex, normalizedData, xKey, baseline, isBaselineValid, onActiveChange])

  // Keyboard navigation on root figure
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (normalizedData.length === 0) return

    const currentIndex = activeIndex ?? 0

    switch (e.key) {
      case "ArrowLeft": {
        e.preventDefault()
        const next = Math.max(0, currentIndex - 1)
        setActiveIndex(next)
        if (lockedIndex !== null) setLockedIndex(next)
        break
      }
      case "ArrowRight": {
        e.preventDefault()
        const next = Math.min(normalizedData.length - 1, currentIndex + 1)
        setActiveIndex(next)
        if (lockedIndex !== null) setLockedIndex(next)
        break
      }
      case "Home": {
        e.preventDefault()
        setActiveIndex(0)
        if (lockedIndex !== null) setLockedIndex(0)
        break
      }
      case "End": {
        e.preventDefault()
        const last = normalizedData.length - 1
        setActiveIndex(last)
        if (lockedIndex !== null) setLockedIndex(last)
        break
      }
      case "Enter":
      case " ": {
        if (!lockableTooltip) return
        e.preventDefault()
        if (lockedIndex === activeIndex) {
          setLockedIndex(null)
        } else {
          setLockedIndex(activeIndex)
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        setLockedIndex(null)
        break
      }
    }
  }

  // Fallback states
  if (loading) {
    return (
      <ChartContainer style={{ height }} className={className}>
        <ChartLoadingState description="Loading baseline observation records..." />
      </ChartContainer>
    )
  }

  if (unavailable) {
    return (
      <ChartContainer style={{ height }} className={className}>
        <ChartUnavailableState description="Baseline Area data service is temporarily unavailable." />
      </ChartContainer>
    )
  }

  if (!isBaselineValid) {
    return (
      <ChartContainer style={{ height }} className={className}>
        <ChartErrorState
          title="Invalid baseline reference"
          description="baseline must be an explicit finite number."
        />
      </ChartContainer>
    )
  }

  if (error) {
    const errorDescription =
      error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred."
    return (
      <ChartContainer style={{ height }} className={className}>
        <ChartErrorState title="Baseline Area Error" description={errorDescription} />
      </ChartContainer>
    )
  }

  if (empty || normalizedData.length === 0) {
    return (
      <ChartContainer style={{ height }} className={className}>
        <ChartEmptyState description="No observations available for Baseline Area." />
      </ChartContainer>
    )
  }

  // Active observation computation
  const activeObsIndex = lockedIndex !== null ? lockedIndex : activeIndex
  const activeRecord =
    activeObsIndex !== null && activeObsIndex >= 0 && activeObsIndex < normalizedData.length
      ? normalizedData[activeObsIndex]
      : null

  const activeRawValue = activeRecord ? activeRecord._normalizedValue : null
  const activeDeviation =
    activeRawValue !== null ? activeRawValue - baseline : null
  const activeClassification =
    activeRawValue !== null
      ? classifyAgainstBaseline(activeRawValue, baseline)
      : "unavailable"

  return (
    <figure
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#3b82f6)] focus-visible:ring-offset-2 rounded-xl",
        className
      )}
    >
      {/* Optional Accessible Screen Reader Caption */}
      <figcaption className="sr-only">
        {title}. Reference baseline is set to {baseline}.{" "}
        {description ||
          `Single quantitative series comparing ${series.label} above and below the reference across ${normalizedData.length} observations.`}
      </figcaption>

      {/* Main Recharts Area */}
      <ChartContainer style={{ height }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart
            data={normalizedData as any}
            margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
            onMouseMove={(state) => {
              if (lockedIndex !== null) return
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(Number(state.activeTooltipIndex))
              }
            }}
            onMouseLeave={() => {
              if (lockedIndex !== null) return
              setActiveIndex(null)
            }}
            onClick={(state) => {
              if (!lockableTooltip) return
              if (state && state.activeTooltipIndex !== undefined) {
                const clicked = Number(state.activeTooltipIndex)
                setLockedIndex(lockedIndex === clicked ? null : clicked)
                setActiveIndex(clicked)
              }
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {offsetPercent <= 0 ? (
                  <>
                    <stop offset="0%" stopColor={belowColor} stopOpacity={clampedOpacity} />
                    <stop offset="100%" stopColor={belowColor} stopOpacity={clampedOpacity} />
                  </>
                ) : offsetPercent >= 100 ? (
                  <>
                    <stop offset="0%" stopColor={aboveColor} stopOpacity={clampedOpacity} />
                    <stop offset="100%" stopColor={aboveColor} stopOpacity={clampedOpacity} />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor={aboveColor} stopOpacity={clampedOpacity} />
                    <stop offset={`${offsetPercent}%`} stopColor={aboveColor} stopOpacity={clampedOpacity} />
                    <stop offset={`${offsetPercent}%`} stopColor={belowColor} stopOpacity={clampedOpacity} />
                    <stop offset="100%" stopColor={belowColor} stopOpacity={clampedOpacity} />
                  </>
                )}
              </linearGradient>
            </defs>

            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border, rgba(255, 255, 255, 0.08))"
                vertical={false}
              />
            )}

            {showXAxis && (
              <XAxis
                dataKey={xKey as any}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground, #a1a1aa)", fontSize: 11 }}
                dy={6}
              />
            )}

            {showYAxis && (
              <YAxis
                domain={safeDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground, #a1a1aa)", fontSize: 11 }}
                dx={-4}
                tickFormatter={(v) =>
                  series.valueFormatter ? series.valueFormatter(v) : v.toLocaleString()
                }
              />
            )}

            {/* Explicit Baseline Reference Line */}
            <ReferenceLine
              y={baseline}
              stroke={baselineColor}
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={
                baselineLabel
                  ? {
                      value: `${baselineLabel} (${baseline})`,
                      position: "insideTopRight",
                      fill: "var(--muted-foreground, #a1a1aa)",
                      fontSize: 10,
                      fontFamily: "monospace",
                      dy: -8,
                    }
                  : undefined
              }
            />

            {/* Persistent Locked Crosshair */}
            {lockedIndex !== null && activeRecord && (
              <ReferenceLine
                x={activeRecord[xKey] as any}
                stroke={selectionColor}
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
            )}

            {/* Main Area Geometry with Baseline BaseValue & Hard-Stop Fill */}
            <Area
              type={curve}
              dataKey="_normalizedValue"
              baseValue={baseline}
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              fillOpacity={1}
              isAnimationActive={isMotionEnabled}
              animationDuration={
                typeof motion === "object" && motion.duration ? motion.duration : 400
              }
              connectNulls={missingValuePolicy === "connect"}
              activeDot={{
                r: 5,
                fill: color,
                stroke: "var(--background, #09090b)",
                strokeWidth: 2,
              }}
            />

            {/* Synchronized Nearest-X Tooltip */}
            <Tooltip
              isAnimationActive={false}
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{
                stroke: lockedIndex !== null ? "transparent" : "var(--chart-crosshair, rgba(255,255,255,0.15))",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null
                const datum = payload[0].payload as TData & { _normalizedValue: number | null }
                const val = datum._normalizedValue
                const dev = val !== null ? val - baseline : null
                const classification =
                  val !== null ? classifyAgainstBaseline(val, baseline) : "unavailable"

                const formattedVal =
                  val !== null
                    ? series.valueFormatter
                      ? series.valueFormatter(val)
                      : val.toLocaleString()
                    : "—"

                const formattedBaseline = series.valueFormatter
                  ? series.valueFormatter(baseline)
                  : baseline.toLocaleString()

                const formattedDev =
                  dev !== null
                    ? series.valueFormatter
                      ? series.valueFormatter(dev)
                      : `${dev > 0 ? "+" : ""}${dev.toLocaleString()}`
                    : "—"

                const isLocked = lockedIndex !== null

                let positionText = "Unavailable"
                let positionBadgeColor = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"

                if (classification === "above") {
                  positionText = aboveLabel
                  positionBadgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/25"
                } else if (classification === "below") {
                  positionText = belowLabel
                  positionBadgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                } else if (classification === "equal") {
                  positionText = "On reference"
                  positionBadgeColor = "bg-zinc-400/10 text-zinc-300 border-zinc-400/25"
                }

                return (
                  <div
                    role="tooltip"
                    className="plotcn-chart-tooltip rounded-lg border border-border/60 bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur-md min-w-[min(180px,calc(100cqw-16px))] max-w-[min(300px,calc(100cqw-16px))] max-h-[calc(100cqh-16px)] overflow-y-auto text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-1.5 gap-2">
                      <span className="font-mono font-medium text-foreground text-xs">
                        {String(datum[xKey])}
                      </span>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-sky-400 font-semibold">
                          <HugeiconsIcon icon={LockKeyIcon} size={11} /> Locked
                        </span>
                      )}
                    </div>

                    {/* Series Value */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-muted-foreground">{series.label}</span>
                      </div>
                      <span className="font-mono font-semibold text-foreground">
                        {formattedVal}
                      </span>
                    </div>

                    {/* Baseline Reference */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-0.5"
                          style={{ backgroundColor: baselineColor }}
                        />
                        <span className="text-muted-foreground">{baselineLabel}</span>
                      </div>
                      <span className="font-mono text-muted-foreground">
                        {formattedBaseline}
                      </span>
                    </div>

                    {/* Factual Signed Deviation */}
                    {showDeviation && dev !== null && (
                      <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/30">
                        <span className="text-muted-foreground">Deviation</span>
                        <span
                          className={cn(
                            "font-mono font-bold",
                            dev > 0 ? "text-blue-400" : dev < 0 ? "text-emerald-400" : "text-muted-foreground"
                          )}
                        >
                          {dev > 0 ? `+${series.valueFormatter ? series.valueFormatter(dev) : dev.toLocaleString()}` : dev < 0 ? `-${series.valueFormatter ? series.valueFormatter(Math.abs(dev)) : Math.abs(dev).toLocaleString()}` : "0"}
                        </span>
                      </div>
                    )}

                    {/* Relative Position Classification */}
                    <div className="pt-0.5">
                      <span
                        className={cn(
                          "inline-block w-full text-center text-[10px] font-mono px-1.5 py-0.5 rounded border",
                          positionBadgeColor
                        )}
                      >
                        {positionText}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Optional Series / Baseline Status Legend */}
      {showLegend && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-xs border"
              style={{
                backgroundColor: aboveColor,
                borderColor: aboveColor,
                opacity: clampedOpacity + 0.3,
              }}
            />
            <span>{aboveLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-xs border"
              style={{
                backgroundColor: belowColor,
                borderColor: belowColor,
                opacity: clampedOpacity + 0.3,
              }}
            />
            <span>{belowLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-0.5 border-t border-dashed"
              style={{ borderColor: baselineColor }}
            />
            <span>{baselineLabel} ({baseline})</span>
          </div>
        </div>
      )}

      {/* Off-screen Structured HTML Data Table for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title} - Data Table</caption>
          <thead>
            <tr>
              <th scope="col">{xKey}</th>
              <th scope="col">{series.label}</th>
              <th scope="col">Reference Baseline</th>
              <th scope="col">Deviation</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((row, idx) => {
              const val = row._normalizedValue
              const dev = val !== null ? val - baseline : null
              const pos = val !== null ? classifyAgainstBaseline(val, baseline) : "Unavailable"
              return (
                <tr key={idx}>
                  <td>{String(row[xKey])}</td>
                  <td>{val !== null ? val : "Unavailable"}</td>
                  <td>{baseline}</td>
                  <td>
                    {dev !== null
                      ? dev > 0
                        ? `+${dev}`
                        : `${dev}`
                      : "Unavailable"}
                  </td>
                  <td>{pos}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
