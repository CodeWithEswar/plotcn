"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockKeyIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
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

/**
 * Semantic series descriptor for Forecast Line.
 * Forecast Line enforces semantic roles: Observed Actual, Predicted Forecast,
 * and Optional Uncertainty bounds (lower & upper).
 */
export interface ForecastLineSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key for observed historical values */
  actualKey: NumericKeyOf<TData>

  /** Property key for predicted/forecast values */
  forecastKey: NumericKeyOf<TData>

  /** Optional property key for lower confidence/prediction interval bound */
  lowerKey?: NumericKeyOf<TData>

  /** Optional property key for upper confidence/prediction interval bound */
  upperKey?: NumericKeyOf<TData>

  /** Display label for observed values (default: "Actual") */
  actualLabel?: string

  /** Display label for forecast values (default: "Forecast") */
  forecastLabel?: string

  /** Display label for the uncertainty range (default: "Forecast range") */
  confidenceLabel?: string

  /** Custom formatter for metric values */
  valueFormatter?: (value: number) => string
}

export interface NormalizedForecastDatum<TData = any> {
  __x: string | number
  __index: number
  __raw: TData
  __actual: number | null
  __forecast: number | null
  __lower: number | null
  __upper: number | null
  __range: [number, number] | null
  __isBridge: boolean
  __isForecastPhase: boolean
}

export interface ForecastActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  actual: number | null
  forecast: number | null
  lower: number | null
  upper: number | null
  isBridge: boolean
  isForecastPhase: boolean
  isLocked: boolean
}

export interface ForecastLineProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Property key for horizontal domain coordinates (e.g., month, date, time). */
  xKey: keyof TData & string

  /** Semantic forecast series configuration containing actualKey, forecastKey, and optional bounds. */
  series: ForecastLineSeries<TData>

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "linear" | "monotone" | "step"

  /** Explicit Y-axis numeric domain, or "auto" safe domain. (default: "auto") */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /** Explicit color override for observed history. (default: var(--chart-1, #3b82f6)) */
  actualColor?: string

  /** Explicit color override for forecast predictions. (default: var(--chart-2, #10b981)) */
  forecastColor?: string

  /** Explicit color override for uncertainty range band. (default: derived from forecastColor) */
  confidenceColor?: string

  /** Fill opacity for the confidence band area (0.0 to 1.0). (default: 0.18) */
  confidenceOpacity?: number

  /** Accent color for locked crosshair and selection markers. (default: var(--chart-selection, #f59e0b)) */
  selectionColor?: string

  /** Whether to render subtle horizontal background reference gridlines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical numeric scale. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series identity legend. (default: true) */
  showLegend?: boolean

  /** Whether legend items can be clicked/keyboard-activated to toggle role visibility. (default: true) */
  interactiveLegend?: boolean

  /** Whether clicking or pressing Enter/Space pins the currently inspected X datum. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Visual policy for missing observations: 'gap' leaves breaks, 'carry' forward-fills. (default: "gap") */
  missingValuePolicy?: "gap" | "carry"

  /** Animation mode: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Motion toggle or configuration object. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Custom formatter for Y-axis scale numbers and default tooltip metric values. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: ForecastActiveDatum<TData, XVal> | null) => void

  /** Optional heading announced to assistive technologies. */
  title?: string

  /** Optional descriptive summary announced to assistive technologies. */
  description?: string

  /** Optional CSS class name passed to the root figure element. */
  className?: string

  /** Display neutral skeleton loading state. */
  loading?: boolean

  /** Display actionable error banner. */
  error?: Error | string | null

  /** Display metric unavailability notice. */
  unavailable?: boolean | string | null
}

/* -------------------------------------------------------------------------- */
/*  Validation & Normalization Helpers                                        */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Normalizes input observations into structured format:
 * - Extracts actual, forecast, lower, upper independently.
 * - Handles missing observations truthfully (null != 0).
 * - Identifies transition bridge observations (where actual and forecast coexist).
 * - Validates confidence intervals (if lower > upper, interval is invalidated locally; never silently swapped).
 * - Immutability: caller data is never mutated.
 */
export function normalizeForecastData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  series: ForecastLineSeries<TData>,
  policy: "gap" | "carry" = "gap"
): NormalizedForecastDatum<TData>[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let lastActual: number | null = null
  let lastForecast: number | null = null

  // First pass: resolve basic values
  const normalized: NormalizedForecastDatum<TData>[] = data.map((d, idx) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawActual = d[series.actualKey]
    let actualVal = isFiniteNumber(rawActual) ? rawActual : null

    const rawForecast = d[series.forecastKey]
    let forecastVal = isFiniteNumber(rawForecast) ? rawForecast : null

    if (policy === "carry") {
      if (actualVal !== null) lastActual = actualVal
      else if (lastActual !== null) actualVal = lastActual

      if (forecastVal !== null) lastForecast = forecastVal
      else if (lastForecast !== null) forecastVal = lastForecast
    }

    const rawLower = series.lowerKey ? d[series.lowerKey] : null
    const lowerVal = isFiniteNumber(rawLower) ? rawLower : null

    const rawUpper = series.upperKey ? d[series.upperKey] : null
    const upperVal = isFiniteNumber(rawUpper) ? rawUpper : null

    // Range is valid only if both bounds exist and lower <= upper
    let range: [number, number] | null = null
    if (lowerVal !== null && upperVal !== null) {
      if (lowerVal <= upperVal) {
        range = [lowerVal, upperVal]
      } else {
        // Invalid bound: lower > upper. Do NOT silently swap!
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[ForecastLine] Invalid confidence bound at X="${xVal}": lower (${lowerVal}) > upper (${upperVal}). Interval omitted.`
          )
        }
        range = null
      }
    }

    const isBridge = actualVal !== null && forecastVal !== null

    return {
      __x: xVal,
      __index: idx,
      __raw: d,
      __actual: actualVal,
      __forecast: forecastVal,
      __lower: lowerVal,
      __upper: upperVal,
      __range: range,
      __isBridge: isBridge,
      __isForecastPhase: forecastVal !== null && actualVal === null,
    }
  })

  return normalized
}

/**
 * Calculates a Cartesian Y-domain covering all valid values of actual, forecast, lower, and upper.
 */
export function calculateForecastDomain(
  normalized: readonly NormalizedForecastDatum<any>[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto",
  rolesVisible = { actual: true, forecast: true, confidence: true }
): [number, number] {
  if (
    Array.isArray(explicitDomain) &&
    typeof explicitDomain[0] === "number" &&
    typeof explicitDomain[1] === "number" &&
    Number.isFinite(explicitDomain[0]) &&
    Number.isFinite(explicitDomain[1])
  ) {
    return explicitDomain
  }

  const values: number[] = []

  for (const row of normalized) {
    if (rolesVisible.actual && row.__actual !== null) {
      values.push(row.__actual)
    }
    if (rolesVisible.forecast && row.__forecast !== null) {
      values.push(row.__forecast)
    }
    if (rolesVisible.confidence && row.__range !== null) {
      values.push(row.__range[0], row.__range[1])
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (min === max) {
    if (min === 0) return [-10, 10]
    const delta = Math.abs(min) * 0.15 || 10
    return [Math.floor(min - delta), Math.ceil(max + delta)]
  }

  const span = max - min
  const pad = span * 0.08
  return [Math.floor(min - pad), Math.ceil(max + pad)]
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Forecast Tooltip Content                                     */
/* -------------------------------------------------------------------------- */

interface ForecastTooltipContentProps {
  active?: boolean
  payload?: readonly any[]
  label?: React.ReactNode
  activeX: string | number | null
  activeDatum: ForecastActiveDatum | null
  actualLabel: string
  forecastLabel: string
  confidenceLabel: string
  actualColor: string
  forecastColor: string
  confidenceColor: string
  rolesVisible: { actual: boolean; forecast: boolean; confidence: boolean }
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockableTooltip?: boolean
  isLocked?: boolean
  selectionColor?: string
}

function ForecastTooltipContent({
  active,
  payload,
  label: _label,
  activeX,
  activeDatum,
  actualLabel,
  forecastLabel,
  confidenceLabel,
  actualColor,
  forecastColor,
  confidenceColor,
  rolesVisible,
  valueFormatter,
  xFormatter,
  lockableTooltip,
  isLocked = false,
  selectionColor = "var(--chart-selection, #f59e0b)",
}: ForecastTooltipContentProps) {
  const payloadRow = payload?.[0]?.payload as NormalizedForecastDatum | undefined
  const hasPayload = Boolean(payloadRow)

  if (!activeDatum && (!active || !hasPayload)) {
    return null
  }

  const rawX = activeDatum ? activeDatum.x : (payloadRow?.__x ?? activeX ?? "")
  const xDisplay = xFormatter ? xFormatter(rawX) : String(rawX)
  const lockedState = activeDatum ? activeDatum.isLocked : isLocked
  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())

  const actualVal = activeDatum ? activeDatum.actual : (payloadRow ? payloadRow.__actual : null)
  const forecastVal = activeDatum ? activeDatum.forecast : (payloadRow ? payloadRow.__forecast : null)
  const lowerVal = activeDatum ? activeDatum.lower : (payloadRow ? payloadRow.__lower : null)
  const upperVal = activeDatum ? activeDatum.upper : (payloadRow ? payloadRow.__upper : null)
  const hasRange = lowerVal !== null && upperVal !== null && lowerVal <= upperVal

  const isBridge = actualVal !== null && forecastVal !== null

  const isCustomHex = typeof selectionColor === "string" && selectionColor.startsWith("#")

  return (
    <div
      className={cn(
        "rounded-xl border bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px] max-w-[290px] text-left transition-all duration-150 pointer-events-none select-none z-50",
        lockedState
          ? "border-amber-500/40 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_16px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/25"
          : "border-white/[0.12] ring-1 ring-white/[0.04]"
      )}
      style={
        lockedState && isCustomHex
          ? {
              borderColor: `${selectionColor}66`,
              boxShadow: `0 12px 32px -4px rgba(0,0,0,0.6), 0 0 16px ${selectionColor}26, 0 0 0 1px ${selectionColor}40`,
            }
          : undefined
      }
    >
      {/* Header: Observation Coordinate + Optional Lock Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wide truncate">
            {xDisplay}
          </span>
          {isBridge && (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-medium">
              Transition
            </span>
          )}
        </div>
        {lockedState && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-tight border bg-amber-500/15 border-amber-500/40 text-amber-300 dark:bg-amber-400/15 dark:border-amber-400/40 dark:text-amber-200 shadow-2xs"
            style={
              isCustomHex
                ? {
                    backgroundColor: `${selectionColor}20`,
                    borderColor: `${selectionColor}55`,
                    color: selectionColor,
                  }
                : undefined
            }
          >
            <HugeiconsIcon icon={LockKeyIcon} size={11} strokeWidth={2.2} className="shrink-0" />
            Locked
          </span>
        )}
      </div>

      {/* Semantic Rows in Canonical Order: Actual -> Forecast -> Forecast Range */}
      <div className="space-y-1.5">
        {/* Actual Row */}
        {rolesVisible.actual && (
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3.5 h-1 rounded-full shrink-0 ring-1 ring-white/20 shadow-xs"
                style={{ backgroundColor: actualColor }}
              />
              <span className="text-zinc-300 font-sans truncate text-xs font-medium">
                {actualLabel}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
              {actualVal !== null ? fmt(actualVal) : "—"}
            </span>
          </div>
        )}

        {/* Forecast Row */}
        {rolesVisible.forecast && (
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <svg width={14} height={4} className="shrink-0 overflow-visible" aria-hidden="true">
                <line x1={0} y1={2} x2={14} y2={2} stroke={forecastColor} strokeWidth={2} strokeDasharray="3 2" />
              </svg>
              <span className="text-zinc-300 font-sans truncate text-xs font-medium">
                {forecastLabel}
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
              {forecastVal !== null ? fmt(forecastVal) : "—"}
            </span>
          </div>
        )}

        {/* Confidence Interval Row */}
        {rolesVisible.confidence && (lowerVal !== null || upperVal !== null) && (
          <div className="flex items-center justify-between gap-3 text-xs pt-1 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-2 rounded-xs shrink-0 border"
                style={{
                  backgroundColor: `${confidenceColor}33`,
                  borderColor: confidenceColor,
                }}
              />
              <span className="text-zinc-400 font-sans truncate text-[11px]">
                {confidenceLabel}
              </span>
            </div>
            <span className="font-mono text-xs font-medium text-zinc-300 shrink-0 tabular-nums">
              {hasRange ? `${fmt(lowerVal)} – ${fmt(upperVal)}` : "—"}
            </span>
          </div>
        )}
      </div>

      {/* Lock Interaction Hint */}
      {lockableTooltip && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-400">
          {lockedState ? (
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-800/90 border border-white/15 text-[9px] font-mono font-semibold text-zinc-200 shadow-2xs">
                Esc
              </kbd>
              <span className="text-zinc-400">or click to release</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-500">
              <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-800/60 border border-white/10 text-[9px] font-mono font-medium text-zinc-400">
                Click
              </kbd>
              <span>to lock</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main ForecastLine Component                                               */
/* -------------------------------------------------------------------------- */

export function ForecastLine<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  series,
  height = 320,
  curve = "monotone",
  domain = "auto",
  actualColor = "var(--chart-1, #3b82f6)",
  forecastColor = "var(--chart-2, #10b981)",
  confidenceColor = "var(--chart-2, #10b981)",
  confidenceOpacity = 0.18,
  selectionColor = "var(--chart-selection, #f59e0b)",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  lockableTooltip = true,
  defaultLockedIndex = null,
  missingValuePolicy = "gap",
  animation = "draw",
  motion = true,
  valueFormatter,
  xFormatter,
  onActiveDatumChange,
  title,
  description,
  className,
  loading = false,
  error = null,
  unavailable = false,
}: ForecastLineProps<TData, XVal>) {
  const reducedMotion = useChartReducedMotion()
  const uid = React.useId()
  const titleId = `plotcn-forecast-title-${uid}`
  const descId = `plotcn-forecast-desc-${uid}`

  const actualLabel = series?.actualLabel || "Actual"
  const forecastLabel = series?.forecastLabel || "Forecast"
  const confidenceLabel = series?.confidenceLabel || "Forecast range"
  const hasConfidenceConfigured = Boolean(series?.lowerKey && series?.upperKey)

  // 1. Normalize dataset
  const normalizedData = React.useMemo(
    () => normalizeForecastData(data, xKey, series, missingValuePolicy),
    [data, xKey, series, missingValuePolicy]
  )

  // 2. Interactive Role Visibility State
  const [rolesVisible, setRolesVisible] = React.useState({
    actual: true,
    forecast: true,
    confidence: true,
  })

  const toggleRoleVisibility = (role: "actual" | "forecast" | "confidence") => {
    if (!interactiveLegend) return
    setRolesVisible((prev) => ({ ...prev, [role]: !prev[role] }))
  }

  const showAllRoles = () => {
    setRolesVisible({ actual: true, forecast: true, confidence: true })
  }

  // Safe Y-axis domain
  const safeDomain = React.useMemo(
    () => calculateForecastDomain(normalizedData, domain, rolesVisible),
    [normalizedData, domain, rolesVisible]
  )

  // 3. Inspection State: active hover vs locked persistent datum
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
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedData.length
    ) {
      return defaultLockedIndex
    }
    return null
  })

  const [isChartFocused, setIsChartFocused] = React.useState(false)

  // Clear locked index if data shrinks
  React.useEffect(() => {
    if (lockedIndex !== null && (lockedIndex >= normalizedData.length || normalizedData.length === 0)) {
      setLockedIndex(null)
    }
  }, [normalizedData.length, lockedIndex])

  const effectiveIndex = lockedIndex !== null ? lockedIndex : activeIndex

  // Active datum payload
  const activeDatum = React.useMemo<ForecastActiveDatum<TData, XVal> | null>(() => {
    if (effectiveIndex === null || effectiveIndex < 0 || effectiveIndex >= normalizedData.length) {
      return null
    }
    const row = normalizedData[effectiveIndex]
    return {
      index: effectiveIndex,
      x: row.__x as XVal,
      raw: row.__raw as TData,
      actual: row.__actual,
      forecast: row.__forecast,
      lower: row.__lower,
      upper: row.__upper,
      isBridge: row.__isBridge,
      isForecastPhase: row.__isForecastPhase,
      isLocked: lockedIndex !== null && lockedIndex === effectiveIndex,
    }
  }, [effectiveIndex, lockedIndex, normalizedData])

  React.useEffect(() => {
    if (onActiveDatumChange) {
      onActiveDatumChange(activeDatum)
    }
  }, [activeDatum, onActiveDatumChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard & Pointer Interaction                                            */
  /* -------------------------------------------------------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (normalizedData.length === 0) return

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault()
        const nextIdx = activeIndex === null ? 0 : Math.min(activeIndex + 1, normalizedData.length - 1)
        setActiveIndex(nextIdx)
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        const prevIdx =
          activeIndex === null
            ? normalizedData.length - 1
            : Math.max(activeIndex - 1, 0)
        setActiveIndex(prevIdx)
        break
      }
      case "Home": {
        e.preventDefault()
        setActiveIndex(0)
        break
      }
      case "End": {
        e.preventDefault()
        setActiveIndex(normalizedData.length - 1)
        break
      }
      case "Enter":
      case " ": {
        if (!lockableTooltip) return
        e.preventDefault()
        const targetIndex = activeIndex !== null ? activeIndex : 0
        if (lockedIndex === targetIndex) {
          setLockedIndex(null)
        } else {
          setLockedIndex(targetIndex)
          setActiveIndex(targetIndex)
        }
        break
      }
      case "Escape": {
        e.preventDefault()
        setLockedIndex(null)
        setActiveIndex(null)
        break
      }
    }
  }

  const handleChartMouseMove = (state: any) => {
    if (!state || typeof state.activeTooltipIndex !== "number") return
    const idx = state.activeTooltipIndex
    if (idx < 0 || idx >= normalizedData.length) return

    if (lockedIndex === null) {
      if (activeIndex !== idx) {
        setActiveIndex(idx)
      }
    }
  }

  const handleChartMouseLeave = () => {
    if (lockedIndex === null) {
      setActiveIndex(null)
    }
  }

  const handleChartClick = (state: any) => {
    if (!lockableTooltip || normalizedData.length === 0) return
    const clickedIdx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : activeIndex
    if (clickedIdx === null || clickedIdx < 0 || clickedIdx >= normalizedData.length) return

    if (lockedIndex === clickedIdx) {
      setLockedIndex(null)
    } else {
      setLockedIndex(clickedIdx)
      setActiveIndex(clickedIdx)
    }
  }

  // Animation settings
  const isAnimated = motion !== false && !reducedMotion && animation !== "none"
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Factual screen reader summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No forecast observations recorded."
    const totalObs = normalizedData.length
    const actualCount = normalizedData.filter((d) => d.__actual !== null).length
    const forecastCount = normalizedData.filter((d) => d.__forecast !== null).length
    const activeInfo = activeDatum
      ? ` Inspected ${activeDatum.x}: ${activeDatum.actual !== null ? `actual ${activeDatum.actual}` : ""}${activeDatum.forecast !== null ? ` forecast ${activeDatum.forecast}` : ""}.`
      : ""
    return `Forecast line chart with ${actualCount} historical observations and ${forecastCount} forecast periods across ${totalObs} total time points.${activeInfo}`
  }, [normalizedData, activeDatum])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Error / Loading States                                       */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || "Forecast chart error state"}
        className={cn("plotcn-forecast relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Unable to render forecast signal"
          description={typeof error === "string" ? error : error?.message || "An unexpected error occurred while loading forecast data."}
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Forecast chart loading state"}
        className={cn("plotcn-forecast relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState
          title="Loading forecast trajectory…"
          description="Preparing historical observations and prediction interval"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Forecast chart unavailable state"}
        className={cn("plotcn-forecast relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Forecast metrics unavailable"
          description={typeof unavailable === "string" ? unavailable : "Forecast trajectory data is currently unavailable."}
        />
      </figure>
    )
  }

  if (normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Forecast chart empty state"}
        className={cn("plotcn-forecast relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations with actual and forecast metrics to display trajectory."
        />
      </figure>
    )
  }

  const activeXCoordinate = effectiveIndex !== null ? normalizedData[effectiveIndex].__x : null
  const isCurrentlyLocked = lockedIndex !== null
  const allRolesHidden = !rolesVisible.actual && !rolesVisible.forecast && !rolesVisible.confidence

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsChartFocused(true)}
      onBlur={() => setIsChartFocused(false)}
      className={cn(
        "plotcn-forecast relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
        touchAction: "pan-y",
      }}
    >
      {/* Screen Reader Announcement */}
      <div className="sr-only">
        <h3 id={titleId}>{title || "Observed History vs. Forecast Trajectory Chart"}</h3>
        <p id={descId}>{description ? `${description} ${factualSummary}` : factualSummary}</p>
      </div>

      {/* Chart Canvas Area */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden relative">
        {allRolesHidden ? (
          <div className="flex flex-col items-center justify-center h-full w-full py-12 px-4 text-center space-y-3 z-20">
            <div className="size-10 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400">
              <HugeiconsIcon icon={ViewOffSlashIcon} size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200">All forecast elements hidden</p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Use the legend below to show observed history or forecast trajectory.
              </p>
            </div>
            {interactiveLegend && (
              <button
                type="button"
                onClick={showAllRoles}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-xs font-mono font-medium text-white transition-all cursor-pointer"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} />
                <span>Show all</span>
              </button>
            )}
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
          >
            <ComposedChart
              data={normalizedData}
              margin={{ top: 14, right: 16, bottom: 8, left: 8 }}
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartMouseLeave}
              onClick={handleChartClick}
            >
              {/* Reference Grid */}
              {showGrid && (
                <CartesianGrid
                  stroke="var(--chart-grid, rgba(255, 255, 255, 0.08))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
              )}

              {/* Horizontal Category Scale */}
              <XAxis
                hide={!showXAxis}
                dataKey="__x"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
                tickFormatter={xFormatter as any}
                dy={6}
              />

              {/* Vertical Numeric Scale */}
              <YAxis
                hide={!showYAxis}
                domain={safeDomain as any}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
                tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
                dx={-4}
              />

              {/* Persistent Vertical Inspection Crosshair */}
              {activeXCoordinate !== null && isCurrentlyLocked && (
                <ReferenceLine
                  x={activeXCoordinate}
                  stroke={selectionColor}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}

              {/* Synchronized Shared Tooltip */}
              <Tooltip
                active={isCurrentlyLocked || (isChartFocused && activeIndex !== null) ? true : undefined}
                defaultIndex={typeof defaultLockedIndex === "number" ? defaultLockedIndex : undefined}
                content={
                  <ForecastTooltipContent
                    activeX={activeXCoordinate}
                    activeDatum={activeDatum}
                    actualLabel={actualLabel}
                    forecastLabel={forecastLabel}
                    confidenceLabel={confidenceLabel}
                    actualColor={actualColor}
                    forecastColor={forecastColor}
                    confidenceColor={confidenceColor}
                    rolesVisible={rolesVisible}
                    valueFormatter={valueFormatter}
                    xFormatter={xFormatter}
                    lockableTooltip={lockableTooltip}
                    isLocked={isCurrentlyLocked}
                    selectionColor={selectionColor}
                  />
                }
                cursor={{
                  stroke: isCurrentlyLocked ? selectionColor : "var(--chart-crosshair, rgba(255, 255, 255, 0.28))",
                  strokeDasharray: "3 3",
                  strokeWidth: isCurrentlyLocked ? 1.5 : 1.2,
                }}
              />

              {/* 1. Confidence Range Area: Rendered behind trend lines */}
              {rolesVisible.confidence && hasConfidenceConfigured && (
                <Area
                  type={curve === "step" ? "stepAfter" : curve}
                  dataKey="__range"
                  name={confidenceLabel}
                  fill={confidenceColor}
                  fillOpacity={confidenceOpacity}
                  stroke="none"
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  activeDot={false}
                  dot={false}
                  connectNulls={false}
                />
              )}

              {/* 2. Observed History Line: Solid line */}
              {rolesVisible.actual && (
                <Line
                  type={curve === "step" ? "stepAfter" : curve}
                  dataKey="__actual"
                  name={actualLabel}
                  stroke={actualColor}
                  strokeWidth={2}
                  connectNulls={false}
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  dot={(dotProps: any) => {
                    const { cx, cy, index, payload } = dotProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload.__actual === null) {
                      return <React.Fragment key={`act-dot-${index}`} />
                    }

                    if (index === effectiveIndex) {
                      if (payload.__isBridge) {
                        return (
                          <g key={`bridge-dot-${index}`} className="pointer-events-none">
                            <circle cx={cx} cy={cy} r={7} fill="none" stroke={forecastColor} strokeWidth={2} strokeDasharray="2 2" />
                            <circle cx={cx} cy={cy} r={4} fill={actualColor} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                          </g>
                        )
                      }
                      if (index === lockedIndex) {
                        return (
                          <g key={`locked-act-${index}`} className="pointer-events-none">
                            <circle cx={cx} cy={cy} r={7} fill="none" stroke={actualColor} strokeWidth={2} />
                            <circle cx={cx} cy={cy} r={3.5} fill={actualColor} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                          </g>
                        )
                      }
                      return (
                        <circle
                          key={`act-dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={actualColor}
                          stroke="var(--chart-background, #09090b)"
                          strokeWidth={2}
                          className="pointer-events-none"
                        />
                      )
                    }

                    return <React.Fragment key={`act-dot-${index}`} />
                  }}
                  activeDot={(activeProps: any) => {
                    const { cx, cy, index, payload } = activeProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload?.__actual === null) {
                      return <React.Fragment key={`act-hover-${index}`} />
                    }
                    return (
                      <circle
                        key={`act-hover-${index}`}
                        cx={cx}
                        cy={cy}
                        r={5.5}
                        fill={actualColor}
                        stroke="var(--chart-background, #09090b)"
                        strokeWidth={2}
                        className="pointer-events-none"
                      />
                    )
                  }}
                />
              )}

              {/* 3. Forecast Prediction Line: Dashed line */}
              {rolesVisible.forecast && (
                <Line
                  type={curve === "step" ? "stepAfter" : curve}
                  dataKey="__forecast"
                  name={forecastLabel}
                  stroke={forecastColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  connectNulls={false}
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  dot={(dotProps: any) => {
                    const { cx, cy, index, payload } = dotProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload.__forecast === null) {
                      return <React.Fragment key={`fc-dot-${index}`} />
                    }

                    // If it's a bridge point and actual is also rendering, let actual handle the composite marker
                    if (payload.__isBridge && rolesVisible.actual) {
                      return <React.Fragment key={`fc-bridge-skip-${index}`} />
                    }

                    if (index === effectiveIndex) {
                      if (index === lockedIndex) {
                        return (
                          <g key={`locked-fc-${index}`} className="pointer-events-none">
                            <circle cx={cx} cy={cy} r={7} fill="none" stroke={forecastColor} strokeWidth={2} />
                            <circle cx={cx} cy={cy} r={3.5} fill={forecastColor} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                          </g>
                        )
                      }
                      return (
                        <circle
                          key={`fc-dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={forecastColor}
                          stroke="var(--chart-background, #09090b)"
                          strokeWidth={2}
                          className="pointer-events-none"
                        />
                      )
                    }

                    return <React.Fragment key={`fc-dot-${index}`} />
                  }}
                  activeDot={(activeProps: any) => {
                    const { cx, cy, index, payload } = activeProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload?.__forecast === null) {
                      return <React.Fragment key={`fc-hover-${index}`} />
                    }
                    return (
                      <circle
                        key={`fc-hover-${index}`}
                        cx={cx}
                        cy={cy}
                        r={5.5}
                        fill={forecastColor}
                        stroke="var(--chart-background, #09090b)"
                        strokeWidth={2}
                        className="pointer-events-none"
                      />
                    )
                  }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Interactive Responsive Legend */}
      {showLegend && (
        <div
          role="group"
          aria-label="Forecast series visibility controls"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 px-2 text-xs font-mono select-none"
        >
          {/* Actual item */}
          <button
            type="button"
            role="switch"
            aria-checked={rolesVisible.actual}
            aria-label={`${actualLabel}: ${rolesVisible.actual ? "visible, click to hide" : "hidden, click to show"}`}
            disabled={!interactiveLegend}
            onClick={() => toggleRoleVisibility("actual")}
            className={cn(
              "inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition-all",
              interactiveLegend
                ? "cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                : "cursor-default",
              !rolesVisible.actual ? "opacity-35 line-through text-zinc-500" : "opacity-100 text-zinc-300 font-medium"
            )}
          >
            <svg width={16} height={6} className="shrink-0 overflow-visible" aria-hidden="true">
              <line x1={0} y1={3} x2={16} y2={3} stroke={rolesVisible.actual ? actualColor : "currentColor"} strokeWidth={2.5} />
            </svg>
            <span>{actualLabel}</span>
          </button>

          {/* Forecast item */}
          <button
            type="button"
            role="switch"
            aria-checked={rolesVisible.forecast}
            aria-label={`${forecastLabel}: ${rolesVisible.forecast ? "visible, click to hide" : "hidden, click to show"}`}
            disabled={!interactiveLegend}
            onClick={() => toggleRoleVisibility("forecast")}
            className={cn(
              "inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition-all",
              interactiveLegend
                ? "cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                : "cursor-default",
              !rolesVisible.forecast ? "opacity-35 line-through text-zinc-500" : "opacity-100 text-zinc-300 font-medium"
            )}
          >
            <svg width={16} height={6} className="shrink-0 overflow-visible" aria-hidden="true">
              <line x1={0} y1={3} x2={16} y2={3} stroke={rolesVisible.forecast ? forecastColor : "currentColor"} strokeWidth={2.5} strokeDasharray="4 3" />
            </svg>
            <span>{forecastLabel}</span>
          </button>

          {/* Confidence interval item */}
          {hasConfidenceConfigured && (
            <button
              type="button"
              role="switch"
              aria-checked={rolesVisible.confidence}
              aria-label={`${confidenceLabel}: ${rolesVisible.confidence ? "visible, click to hide" : "hidden, click to show"}`}
              disabled={!interactiveLegend}
              onClick={() => toggleRoleVisibility("confidence")}
              className={cn(
                "inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition-all",
                interactiveLegend
                  ? "cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                  : "cursor-default",
                !rolesVisible.confidence ? "opacity-35 line-through text-zinc-500" : "opacity-100 text-zinc-300 font-medium"
              )}
            >
              <span
                className="size-3 rounded-xs shrink-0 border"
                style={{
                  backgroundColor: rolesVisible.confidence ? `${confidenceColor}33` : "transparent",
                  borderColor: rolesVisible.confidence ? confidenceColor : "currentColor",
                }}
              />
              <span>{confidenceLabel}</span>
            </button>
          )}
        </div>
      )}
    </figure>
  )
}
