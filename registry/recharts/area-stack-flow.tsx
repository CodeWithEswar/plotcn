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
 * Semantic descriptor for an individual contributing series in the stack.
 */
export interface StackFlowSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on observation records containing numeric additive metric */
  key: NumericKeyOf<TData>
  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string
  /** Explicit stroke and fill color override. Defaults to deterministic palette tokens */
  color?: string
  /** Custom numeric metric formatter for tooltip and scale values */
  valueFormatter?: (value: number) => string
}

export interface ResolvedStackFlowSeries<TData extends Record<string, unknown> = any> {
  key: NumericKeyOf<TData>
  label: string
  color: string
  valueFormatter?: (value: number) => string
  originalIndex: number
}

export interface StackFlowActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  values: Record<string, number | null>
  percentValues: Record<string, number | null>
  total: number | null
  isComplete: boolean
  isLocked: boolean
}

export interface NormalizedStackFlowRow<TData = any> {
  __x: string | number
  __index: number
  __raw: TData
  __values: Record<string, number | null>
  __percentValues: Record<string, number | null>
  __total: number | null
  __isComplete: boolean
  [key: string]: any
}

export interface StackFlowAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for horizontal domain coordinate (e.g. month, date, sprint, version). */
  xKey: keyof TData & string

  /** Ordered array of additive series. Stack order follows canonical array order (bottom -> top). */
  series: readonly StackFlowSeries<TData>[]

  /** Stack visualization mode: "absolute" (sum magnitude) or "percent" (100% relative share). (default: "absolute") */
  stackMode?: "absolute" | "percent"

  /** Container height in pixels or standard CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation for area boundaries: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Explicit Cartesian Y-domain, or "auto" calculation across visible stack totals. */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /** Overall fill opacity for stacked layers (0.0 to 1.0). (default: 0.65) */
  fillOpacity?: number

  /** Gradient fill mode: "none" (solid translucent) or "vertical-fade". (default: "none") */
  gradientMode?: "none" | "vertical-fade"

  /** Accent color for locked crosshair and selection markers. (default: "var(--chart-selection)") */
  selectionColor?: string

  /** Whether to render subtle horizontal Cartesian grid reference lines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical numeric scale. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series identity legend. (default: true) */
  showLegend?: boolean

  /** Whether legend items can be clicked/keyboard-activated to toggle layer visibility. (default: true) */
  interactiveLegend?: boolean

  /** Default set of series keys that should be initially visible. (defaults to all configured series) */
  defaultVisibleSeries?: readonly string[]

  /** Callback fired whenever the set of visible series changes. */
  onVisibleSeriesChange?: (visibleKeys: readonly string[]) => void

  /** Whether clicking or pressing Enter/Space pins the currently inspected X datum. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Handling of missing (null/undefined) observations: 'gap' marks stack incomplete, 'zero' treats as 0. (default: "gap") */
  missingValuePolicy?: "gap" | "zero"

  /** Animation mode: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Motion toggle or configuration object. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Custom formatter for Y-axis scale numbers and default tooltip metric values. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: StackFlowActiveDatum<TData, XVal> | null) => void

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
/*  Algorithmic & Normalization Helpers                                       */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Resolves canonical series definitions to concrete color tokens.
 * Crucial contract: Series index determines default palette token.
 * Hiding one series will never shift another series' assigned color.
 */
export function resolveStackFlowSeries<TData extends Record<string, unknown>>(
  series: readonly StackFlowSeries<TData>[]
): ResolvedStackFlowSeries<TData>[] {
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

export interface NormalizationResult<TData> {
  rows: NormalizedStackFlowRow<TData>[]
  hasNegativeValues: boolean
  negativeErrorDetails?: string
}

/**
 * Normalizes input observations for additive stacked composition:
 * 1. Checks for negative values (violates additive contract; never silently clamped).
 * 2. Missing values: under "gap", remains null (stack incomplete). Under "zero", coerced to 0.
 * 3. In percent mode: normalizes proportional shares without divide-by-zero or NaN.
 * 4. Never mutates caller array or objects.
 */
export function normalizeStackFlowData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  resolvedSeries: readonly ResolvedStackFlowSeries<TData>[],
  visibleKeys: ReadonlySet<string>,
  missingValuePolicy: "gap" | "zero" = "gap"
): NormalizationResult<TData> {
  if (!Array.isArray(data) || data.length === 0) {
    return { rows: [], hasNegativeValues: false }
  }

  const rows: NormalizedStackFlowRow<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const values: Record<string, number | null> = {}
    const percentValues: Record<string, number | null> = {}
    let isComplete = true
    let total = 0

    // First pass: extract and validate individual series numbers
    for (const s of resolvedSeries) {
      const rawV = d[s.key]
      if (typeof rawV === "number") {
        if (!Number.isFinite(rawV)) {
          values[s.key] = null
          if (visibleKeys.has(s.key)) isComplete = false
        } else if (rawV < 0) {
          return {
            rows: [],
            hasNegativeValues: true,
            negativeErrorDetails: `Stacked area requires non-negative additive contributions. Found negative value (${rawV}) for series "${s.label}" at "${xVal}".`,
          }
        } else {
          values[s.key] = rawV
          if (visibleKeys.has(s.key)) {
            total += rawV
          }
        }
      } else if (rawV === null || rawV === undefined) {
        if (missingValuePolicy === "zero") {
          values[s.key] = 0
          // Under explicit zero policy, stack is considered complete with 0
        } else {
          values[s.key] = null
          if (visibleKeys.has(s.key)) {
            isComplete = false
          }
        }
      } else {
        // Unknown type / NaN / invalid
        values[s.key] = null
        if (visibleKeys.has(s.key)) isComplete = false
      }
    }

    const effectiveTotal = isComplete ? total : null

    // Second pass: compute percent values safely
    for (const s of resolvedSeries) {
      const val = values[s.key]
      if (val === null) {
        percentValues[s.key] = null
      } else if (effectiveTotal !== null && effectiveTotal > 0) {
        percentValues[s.key] = (val / effectiveTotal) * 100
      } else if (effectiveTotal === 0) {
        percentValues[s.key] = 0
      } else {
        percentValues[s.key] = null
      }
    }

    const rowObj: NormalizedStackFlowRow<TData> = {
      __x: xVal,
      __index: i,
      __raw: d,
      __values: values,
      __percentValues: percentValues,
      __total: effectiveTotal,
      __isComplete: isComplete,
    }

    // Attach flattened keys for Recharts Area primitives
    for (const s of resolvedSeries) {
      rowObj[`__abs_${s.key}`] = values[s.key]
      rowObj[`__pct_${s.key}`] = percentValues[s.key]
    }

    rows.push(rowObj)
  }

  return { rows, hasNegativeValues: false }
}

/**
 * Calculates a safe Cartesian Y-domain covering additive stack totals.
 * - In percent mode: strictly [0, 100].
 * - In absolute mode: [0, maxVisibleTotal * 1.08] with baseline anchored to 0.
 */
export function calculateStackFlowDomain(
  rows: readonly NormalizedStackFlowRow[],
  stackMode: "absolute" | "percent",
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto"
): [number, number] {
  if (stackMode === "percent") {
    return [0, 100]
  }

  if (
    Array.isArray(explicitDomain) &&
    typeof explicitDomain[0] === "number" &&
    typeof explicitDomain[1] === "number" &&
    Number.isFinite(explicitDomain[0]) &&
    Number.isFinite(explicitDomain[1])
  ) {
    return explicitDomain
  }

  const totals: number[] = []
  for (const r of rows) {
    if (r.__total !== null && Number.isFinite(r.__total)) {
      totals.push(r.__total)
    }
  }

  if (totals.length === 0) {
    return [0, 100]
  }

  const maxTotal = Math.max(...totals)
  if (maxTotal <= 0) {
    return [0, 10]
  }

  const paddedMax = Math.ceil(maxTotal * 1.08)
  return [0, paddedMax]
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Custom Tooltip                                               */
/* -------------------------------------------------------------------------- */

interface StackFlowTooltipContentProps {
  active?: boolean
  payload?: readonly any[]
  label?: React.ReactNode
  activeX: string | number | null
  activeDatum: StackFlowActiveDatum | null
  resolvedSeries: readonly ResolvedStackFlowSeries[]
  visibleKeys: ReadonlySet<string>
  stackMode: "absolute" | "percent"
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockableTooltip?: boolean
  isLocked?: boolean
  selectionColor?: string
  isCompact?: boolean
}

function StackFlowTooltipContent({
  active,
  payload,
  label: _label,
  activeX,
  activeDatum,
  resolvedSeries,
  visibleKeys,
  stackMode,
  valueFormatter,
  xFormatter,
  lockableTooltip,
  isLocked = false,
  selectionColor = "var(--chart-selection)",
  isCompact = false,
}: StackFlowTooltipContentProps) {
  const payloadRow = payload?.[0]?.payload as NormalizedStackFlowRow | undefined
  const hasPayload = Boolean(payloadRow)

  if (!activeDatum && (!active || !hasPayload)) {
    return null
  }

  const rawX = activeDatum ? activeDatum.x : (payloadRow?.__x ?? activeX ?? "")
  const xDisplay = xFormatter ? xFormatter(rawX) : String(rawX)
  const lockedState = activeDatum ? activeDatum.isLocked : isLocked
  const defaultValueFmt = valueFormatter ?? ((n: number) => n.toLocaleString())

  const values = activeDatum ? activeDatum.values : (payloadRow ? payloadRow.__values : {})
  const percentValues = activeDatum ? activeDatum.percentValues : (payloadRow ? payloadRow.__percentValues : {})
  const total = activeDatum ? activeDatum.total : (payloadRow ? payloadRow.__total : null)
  const isComplete = activeDatum ? activeDatum.isComplete : (payloadRow ? payloadRow.__isComplete : false)

  const visibleSeriesList = resolvedSeries.filter((s) => visibleKeys.has(s.key))
  const isCustomHex = typeof selectionColor === "string" && selectionColor.startsWith("#")

  return (
    <div
      className={cn(
        "plotcn-interactive-tooltip rounded-xl border bg-zinc-950/95 shadow-2xl backdrop-blur-md text-left transition-all duration-150 pointer-events-none select-none z-50",
        isCompact
          ? "min-w-[130px] max-w-[200px] p-2 text-[10px]"
          : "min-w-[210px] max-w-[300px] p-3.5 text-xs",
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
      {/* Header: X-Domain Coordinate + Optional Mode Pill + Lock Badge */}
      <div
        className={cn(
          "tooltip-header flex items-center justify-between gap-2 border-b border-white/[0.08]",
          isCompact ? "pb-1 mb-1.5" : "pb-2 mb-2.5"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "font-mono font-semibold text-zinc-200 tracking-wide truncate",
              isCompact ? "text-[10px]" : "text-xs"
            )}
          >
            {xDisplay}
          </span>
          {stackMode === "percent" && !isCompact && (
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-medium shrink-0">
              100% Share
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

      {/* Canonical Contributing Series Rows (Top to bottom or stack order) */}
      <div className="space-y-1.5">
        {visibleSeriesList.map((s) => {
          const val = values[s.key]
          const pct = percentValues[s.key]
          const isMissing = val === null || val === undefined
          const fmt = s.valueFormatter || defaultValueFmt

          return (
            <div key={s.key} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-2 rounded-xs shrink-0 ring-1 ring-white/20 shadow-xs"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-zinc-300 font-sans truncate text-xs font-medium">
                  {s.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 font-mono text-xs">
                {isMissing ? (
                  <span className="font-bold text-zinc-400">—</span>
                ) : stackMode === "percent" ? (
                  <>
                    <span className="font-bold text-white tabular-nums">
                      {pct !== null ? `${pct.toFixed(1)}%` : "—"}
                    </span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">
                      ({fmt(val)})
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-white tabular-nums">
                    {fmt(val)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stack Total Row */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          {stackMode === "percent" ? "Normalized Total" : "Stack Total"}
        </span>
        <span
          className={cn(
            "font-mono text-xs font-bold tabular-nums",
            !isComplete
              ? "text-amber-400"
              : "text-white"
          )}
        >
          {!isComplete
            ? "Incomplete"
            : stackMode === "percent"
            ? "100%"
            : defaultValueFmt(total ?? 0)}
        </span>
      </div>

      {/* Lock Interaction Hint */}
      {lockableTooltip && !isCompact && (
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
/*  Main StackFlowArea Component                                              */
/* -------------------------------------------------------------------------- */

export function StackFlowArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  series,
  stackMode = "absolute",
  height = 320,
  curve = "monotone",
  domain = "auto",
  fillOpacity = 0.65,
  gradientMode = "none",
  selectionColor = "var(--chart-selection)",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  defaultVisibleSeries,
  onVisibleSeriesChange,
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
}: StackFlowAreaProps<TData, XVal>) {
  const reducedMotion = useChartReducedMotion()
  const rawUid = React.useId()
  const uid = rawUid.replace(/:/g, "")
  const titleId = `plotcn-stack-title-${uid}`
  const descId = `plotcn-stack-desc-${uid}`
  const gradientPrefix = `plotcn-stack-grad-${uid}`

  // 1. Resolve series with deterministic colors
  const resolvedSeries = React.useMemo(
    () => resolveStackFlowSeries(series),
    [series]
  )

  // 2. Interactive series visibility state
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(() => {
    if (Array.isArray(defaultVisibleSeries) && defaultVisibleSeries.length > 0) {
      return new Set(defaultVisibleSeries)
    }
    return new Set(resolvedSeries.map((s) => s.key))
  })

  // Synchronize when series definitions change
  React.useEffect(() => {
    setVisibleKeys((prev) => {
      const next = new Set<string>()
      const currentKeys = new Set<string>(resolvedSeries.map((s) => String(s.key)))
      for (const k of prev) {
        if (currentKeys.has(k)) next.add(k)
      }
      // If none retained, default to all current
      if (next.size === 0) {
        resolvedSeries.forEach((s) => next.add(s.key))
      }
      return next
    })
  }, [resolvedSeries])

  const toggleSeries = React.useCallback(
    (key: string) => {
      if (!interactiveLegend) return
      setVisibleKeys((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        if (onVisibleSeriesChange) {
          onVisibleSeriesChange(Array.from(next))
        }
        return next
      })
    },
    [interactiveLegend, onVisibleSeriesChange]
  )

  // 3. Normalize dataset with additive validation & missing values
  const { rows: normalizedRows, hasNegativeValues, negativeErrorDetails } = React.useMemo(
    () => normalizeStackFlowData(data, xKey, resolvedSeries, visibleKeys, missingValuePolicy),
    [data, xKey, resolvedSeries, visibleKeys, missingValuePolicy]
  )

  // 4. Safe Cartesian Y-domain
  const safeDomain = React.useMemo(
    () => calculateStackFlowDomain(normalizedRows, stackMode, domain),
    [normalizedRows, stackMode, domain]
  )

  // 5. Inspection state: active hover vs persistent locked index
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(() => {
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedRows.length
    ) {
      return defaultLockedIndex
    }
    return null
  })

  const [activeIndex, setActiveIndex] = React.useState<number | null>(() => {
    if (
      typeof defaultLockedIndex === "number" &&
      defaultLockedIndex >= 0 &&
      defaultLockedIndex < normalizedRows.length
    ) {
      return defaultLockedIndex
    }
    return null
  })

  const [isChartFocused, setIsChartFocused] = React.useState(false)

  // Clear locked index if data count shrinks
  React.useEffect(() => {
    if (lockedIndex !== null && (lockedIndex >= normalizedRows.length || normalizedRows.length === 0)) {
      setLockedIndex(null)
    }
  }, [normalizedRows.length, lockedIndex])

  const effectiveIndex = lockedIndex !== null ? lockedIndex : activeIndex

  // Construct active datum for consumers and tooltip
  const activeDatum = React.useMemo<StackFlowActiveDatum<TData, XVal> | null>(() => {
    if (effectiveIndex === null || effectiveIndex < 0 || effectiveIndex >= normalizedRows.length) {
      return null
    }
    const row = normalizedRows[effectiveIndex]
    return {
      index: effectiveIndex,
      x: row.__x as XVal,
      raw: row.__raw,
      values: row.__values,
      percentValues: row.__percentValues,
      total: row.__total,
      isComplete: row.__isComplete,
      isLocked: lockedIndex !== null && lockedIndex === effectiveIndex,
    }
  }, [effectiveIndex, lockedIndex, normalizedRows])

  // Notify consumer callback
  React.useEffect(() => {
    if (onActiveDatumChange) {
      onActiveDatumChange(activeDatum)
    }
  }, [activeDatum, onActiveDatumChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard Navigation Handlers                                              */
  /* -------------------------------------------------------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (normalizedRows.length === 0) return

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault()
        const nextIdx = activeIndex === null ? 0 : Math.min(activeIndex + 1, normalizedRows.length - 1)
        setActiveIndex(nextIdx)
        break
      }
      case "ArrowLeft": {
        e.preventDefault()
        const prevIdx =
          activeIndex === null
            ? normalizedRows.length - 1
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
        setActiveIndex(normalizedRows.length - 1)
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
    if (idx < 0 || idx >= normalizedRows.length) return

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
    if (!lockableTooltip || normalizedRows.length === 0) return
    const clickedIdx = typeof state?.activeTooltipIndex === "number" ? state.activeTooltipIndex : activeIndex
    if (clickedIdx === null || clickedIdx < 0 || clickedIdx >= normalizedRows.length) return

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
  const clampedOpacity = Math.max(0.1, Math.min(1, typeof fillOpacity === "number" && Number.isFinite(fillOpacity) ? fillOpacity : 0.65))

  // Factual screen reader summary
  const factualSummary = React.useMemo(() => {
    if (normalizedRows.length === 0) return "No observations recorded."
    const totalObs = normalizedRows.length
    const seriesCount = resolvedSeries.length
    const visibleCount = visibleKeys.size
    const modeDesc = stackMode === "percent" ? "100% normalized proportional shares" : "additive absolute contributions"
    const activeInfo = activeDatum
      ? ` Currently ${activeDatum.isLocked ? "locked on" : "inspecting"} observation ${activeDatum.index + 1} of ${totalObs} at ${String(activeDatum.x)}${activeDatum.total !== null ? `, visible total: ${activeDatum.total}` : " (incomplete total)"}.`
      : " Use Left and Right Arrow keys to inspect observations across the timeline."
    return `Stacked area chart displaying ${visibleCount} of ${seriesCount} additive series across ${totalObs} observations depicting ${modeDesc}.${activeInfo}`
  }, [normalizedRows.length, resolvedSeries.length, visibleKeys.size, stackMode, activeDatum])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Error / Exception States                                     */
  /* -------------------------------------------------------------------------- */

  if (hasNegativeValues) {
    return (
      <figure
        role="region"
        aria-label={title || "Stack flow area error state"}
        className={cn("plotcn-stack-flow relative w-full overflow-hidden rounded-xl border border-rose-500/20 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Invalid negative values in additive stack"
          description={negativeErrorDetails || "Stacked area compositions strictly require non-negative values. Negative numbers cannot be stacked truthfully."}
        />
      </figure>
    )
  }

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || "Stack flow area error state"}
        className={cn("plotcn-stack-flow relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Unable to render stacked composition"
          description={typeof error === "string" ? error : error?.message || "An unexpected error occurred while loading series data."}
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Stack flow area loading state"}
        className={cn("plotcn-stack-flow relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState
          title="Loading stacked area flow…"
          description="Preparing additive timeline observations and layer compositions"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Stack flow area unavailable state"}
        className={cn("plotcn-stack-flow relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Stacked metrics unavailable"
          description={typeof unavailable === "string" ? unavailable : "Additive composition data is currently unavailable."}
        />
      </figure>
    )
  }

  if (normalizedRows.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Stack flow area empty state"}
        className={cn("plotcn-stack-flow relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations and additive series configurations to plot stacked area flows."
        />
      </figure>
    )
  }

  const activeXCoordinate = effectiveIndex !== null ? normalizedRows[effectiveIndex].__x : null
  const isCurrentlyLocked = lockedIndex !== null
  const allSeriesHidden = visibleKeys.size === 0

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
        "plotcn-stack-flow relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
        "focus-visible:ring-2 focus-visible:ring-[var(--chart-focus,#38bdf8)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
        touchAction: "pan-y",
      }}
    >
      {/* Screen Reader Semantic Announcement */}
      <div className="sr-only">
        <h3 id={titleId}>{title || "Additive Stack Flow Area Chart"}</h3>
        <p id={descId}>{description ? `${description} ${factualSummary}` : factualSummary}</p>
      </div>

      {/* Chart Canvas Area */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden relative">
        {allSeriesHidden ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 mb-2.5">
              <HugeiconsIcon icon={ViewOffSlashIcon} size={18} />
            </div>
            <p className="text-xs font-medium text-zinc-300">No visible series</p>
            <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
              Use the legend below to show one or more contributing layers.
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
            initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
          >
            <AreaChart
              data={normalizedRows}
              margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
              onMouseMove={handleChartMouseMove}
              onMouseLeave={handleChartMouseLeave}
              onClick={handleChartClick}
            >
              {/* Optional Collision-Safe Gradient Defs */}
              {gradientMode === "vertical-fade" && (
                <defs>
                  {resolvedSeries.map((s) => (
                    <linearGradient
                      key={s.key}
                      id={`${gradientPrefix}-${s.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={s.color} stopOpacity={clampedOpacity} />
                      <stop offset="100%" stopColor={s.color} stopOpacity={Math.max(0.1, clampedOpacity * 0.4)} />
                    </linearGradient>
                  ))}
                </defs>
              )}

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

              {/* Vertical Numeric / Percentage Scale */}
              <YAxis
                hide={!showYAxis}
                domain={safeDomain as any}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--chart-axis, #71717a)" }}
                tickFormatter={
                  stackMode === "percent"
                    ? (v) => `${v}%`
                    : valueFormatter
                    ? (v) => valueFormatter(Number(v))
                    : undefined
                }
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

              {/* Synchronized Nearest-X Tooltip */}
              <Tooltip
                active={isCurrentlyLocked || (isChartFocused && activeIndex !== null) ? true : undefined}
                defaultIndex={typeof defaultLockedIndex === "number" ? defaultLockedIndex : undefined}
                content={
                  <StackFlowTooltipContent
                    activeX={activeXCoordinate}
                    activeDatum={activeDatum}
                    resolvedSeries={resolvedSeries}
                    visibleKeys={visibleKeys}
                    stackMode={stackMode}
                    valueFormatter={valueFormatter}
                    xFormatter={xFormatter}
                    lockableTooltip={lockableTooltip}
                    isLocked={isCurrentlyLocked}
                    selectionColor={selectionColor}
                    isCompact={typeof height === "number" ? height <= 260 : false}
                  />
                }
                cursor={{
                  stroke: isCurrentlyLocked ? selectionColor : "var(--chart-crosshair, rgba(255, 255, 255, 0.28))",
                  strokeDasharray: "3 3",
                  strokeWidth: isCurrentlyLocked ? 1.5 : 1.2,
                }}
              />

              {/* Additive Recharts Stacked Area Layers */}
              {resolvedSeries.map((s) => {
                if (!visibleKeys.has(s.key)) return null

                const dataPropKey = stackMode === "percent" ? `__pct_${s.key}` : `__abs_${s.key}`
                const fillRef = gradientMode === "vertical-fade" ? `url(#${gradientPrefix}-${s.key})` : s.color

                return (
                  <Area
                    key={s.key}
                    type={curve === "step" ? "stepAfter" : curve}
                    dataKey={dataPropKey}
                    name={s.label}
                    stackId="plotcn-stack"
                    stroke={s.color}
                    strokeWidth={1.2}
                    strokeOpacity={0.8}
                    fill={fillRef}
                    fillOpacity={gradientMode === "vertical-fade" ? 1 : clampedOpacity}
                    connectNulls={false}
                    isAnimationActive={isAnimated}
                    animationDuration={animationDuration}
                  />
                )
              })}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Series Identity & Interactive Legend */}
      {showLegend && (
        <div
          role="group"
          aria-label="Chart series identity and visibility"
          className="flex flex-wrap items-center justify-center gap-2 pt-3 px-2 text-xs font-mono select-none"
        >
          {resolvedSeries.map((s) => {
            const isVisible = visibleKeys.has(s.key)
            return (
              <button
                key={s.key}
                type="button"
                role="switch"
                aria-checked={isVisible}
                aria-label={`Toggle visibility for ${s.label}`}
                onClick={() => toggleSeries(s.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all duration-150 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--chart-focus,#38bdf8)]",
                  isVisible
                    ? "bg-white/[0.05] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.08]"
                    : "bg-transparent text-zinc-600 hover:text-zinc-400 border border-transparent line-through opacity-60"
                )}
              >
                {/* Rectangular area fill swatch */}
                <span
                  className={cn(
                    "w-3 h-2.5 rounded-xs shrink-0 transition-opacity",
                    isVisible ? "ring-1 ring-white/20" : "opacity-30"
                  )}
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate">{s.label}</span>
                {interactiveLegend && (
                  <HugeiconsIcon
                    icon={isVisible ? ViewIcon : ViewOffSlashIcon}
                    size={11}
                    className={cn("shrink-0 ml-0.5", isVisible ? "text-zinc-400" : "text-zinc-600")}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Structured Data Alternative for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || "Additive Stack Flow observation table"}</caption>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              {resolvedSeries.map((s) => (
                <th key={s.key} scope="col">{s.label}</th>
              ))}
              <th scope="col">{stackMode === "percent" ? "Normalized Total" : "Total"}</th>
            </tr>
          </thead>
          <tbody>
            {normalizedRows.map((d, i) => (
              <tr key={i}>
                <td>{String(d.__x)}</td>
                {resolvedSeries.map((s) => {
                  const val = d.__values[s.key]
                  const pct = d.__percentValues[s.key]
                  if (val === null) return <td key={s.key}>—</td>
                  if (stackMode === "percent") {
                    return <td key={s.key}>{pct !== null ? `${pct.toFixed(1)}%` : "—"}</td>
                  }
                  return <td key={s.key}>{s.valueFormatter ? s.valueFormatter(val) : val}</td>
                })}
                <td>
                  {!d.__isComplete
                    ? "Incomplete"
                    : stackMode === "percent"
                    ? "100%"
                    : (valueFormatter ? valueFormatter(d.__total ?? 0) : d.__total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
