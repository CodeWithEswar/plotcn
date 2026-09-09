"use client"

import * as React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

/**
 * Filter keys of TData that correspond to number or null/undefined values.
 */
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
 * Configuration descriptor for an individual series within the multi-signal chart.
 */
export interface MultiSignalSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on the data row containing this series' numeric metrics */
  key: NumericKeyOf<TData>
  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string
  /** Explicit stroke and indicator color. If omitted, resolves from deterministic palette */
  color?: string
  /** Stroke dash style for multi-modal and monochrome differentiation */
  strokeStyle?: "solid" | "dashed" | "dotted"
  /** Custom numeric metric formatter for tooltip and scale values */
  valueFormatter?: (value: number) => string
}

/**
 * Resolved internal representation of a series with deterministic palette tokens.
 */
export interface ResolvedMultiSignalSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  key: NumericKeyOf<TData>
  label: string
  color: string
  strokeDasharray?: string
  strokeStyle: "solid" | "dashed" | "dotted"
  valueFormatter?: (value: number) => string
  originalIndex: number
}

/**
 * Inspection datum structure passed to active observation callbacks.
 */
export interface MultiSignalActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  values: Record<string, number | null>
  isLocked: boolean
}

export interface MultiSignalLineProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for the horizontal domain coordinate (e.g. month, date, timestamp, sprint). */
  xKey: keyof TData & string

  /** Readonly array of series definitions to render as peer signals. */
  series: readonly MultiSignalSeries<TData>[]

  /** Container height in pixels or CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "linear" | "monotone" | "step"

  /** Explicit Y-axis numeric domain, or "auto" calculation across visible series. */
  domain?: [number, number] | ["auto", "auto"] | "auto"

  /** Whether to render subtle horizontal background reference gridlines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical numeric scale. (default: true) */
  showYAxis?: boolean

  /** Whether to render the series identity legend. (default: true) */
  showLegend?: boolean

  /** Whether legend items can be clicked/keyboard-activated to toggle series visibility. (default: true) */
  interactiveLegend?: boolean

  /** Whether clicking or pressing Enter/Space pins the currently inspected X datum. (default: true) */
  lockableTooltip?: boolean

  /** Default observation index to pin/lock on initial mount. (default: null) */
  defaultLockedIndex?: number | null

  /** Default set of series keys that should be initially visible. (defaults to all series) */
  defaultVisibleSeries?: readonly string[]

  /** Callback fired whenever the set of visible series changes. */
  onVisibleSeriesChange?: (visibleKeys: readonly string[]) => void

  /** Accent color for locked crosshair and selection markers. (default: var(--chart-selection)) */
  selectionColor?: string

  /** Custom formatter for Y-axis scale numbers and default tooltip metric values. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Visual policy for missing (null/undefined) observations: 'gap' leaves breaks, 'carry' forward-fills. (default: "gap") */
  missingValuePolicy?: "gap" | "carry"

  /** Animation style: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Motion toggle or configuration object. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: MultiSignalActiveDatum<TData, XVal> | null) => void

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
/*  Deterministic Palette & Series Resolver                                   */
/* -------------------------------------------------------------------------- */

const PALETTE_TOKENS = [
  "var(--chart-1, #3b82f6)",
  "var(--chart-2, #10b981)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #8b5cf6)",
  "var(--chart-6, #06b6d4)",
  "var(--chart-7, #ec4899)",
  "var(--chart-8, #84cc16)",
]

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Resolves each series configuration into a deterministic identity.
 * Rule: Palette tokens map strictly by original canonical series index.
 * Hiding a series will NEVER shift or re-assign the colors of remaining series.
 */
export function resolveMultiSignalSeries<TData extends Record<string, unknown>>(
  seriesList: readonly MultiSignalSeries<TData>[]
): ResolvedMultiSignalSeries<TData>[] {
  if (!Array.isArray(seriesList)) return []

  return seriesList.map((s, idx) => {
    const fallbackColor = PALETTE_TOKENS[idx % PALETTE_TOKENS.length]
    const resolvedColor = s.color && s.color.trim() !== "" ? s.color : fallbackColor

    let dashArray: string | undefined = undefined
    if (s.strokeStyle === "dashed") dashArray = "5 5"
    if (s.strokeStyle === "dotted") dashArray = "2 3"

    return {
      key: s.key,
      label: s.label || String(s.key),
      color: resolvedColor,
      strokeDasharray: dashArray,
      strokeStyle: s.strokeStyle || "solid",
      valueFormatter: s.valueFormatter,
      originalIndex: idx,
    }
  })
}

/**
 * Safely normalizes observation rows:
 * 1. Missing values remain null (truthful gaps per series).
 * 2. Non-finite values (NaN, Infinity) are treated as null.
 * 3. Never mutates input objects or arrays.
 */
export function normalizeMultiSignalData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesList: readonly ResolvedMultiSignalSeries<TData>[] | readonly MultiSignalSeries<TData>[],
  policy: "gap" | "carry" = "gap"
): Record<string, any>[] {
  if (!Array.isArray(data) || data.length === 0) return []

  const lastKnown: Record<string, number | null> = {}

  return data.map((d, idx) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const row: Record<string, any> = {
      __x: xVal,
      __index: idx,
      __raw: d,
    }

    for (const s of seriesList) {
      const keyStr = String(s.key)
      const val = d[s.key]
      if (isFiniteNumber(val)) {
        row[keyStr] = val
        lastKnown[keyStr] = val
      } else if (policy === "carry" && typeof lastKnown[keyStr] === "number") {
        row[keyStr] = lastKnown[keyStr]
      } else {
        row[keyStr] = null
      }
    }

    return row
  })
}

/**
 * Calculates a Cartesian Y-domain covering all valid values of CURRENTLY VISIBLE series.
 * Excludes hidden series from domain to optimize analytical readability for remaining signals.
 */
export function calculateMultiSignalDomain(
  normalized: readonly Record<string, any>[],
  visibleSeries: readonly ResolvedMultiSignalSeries<any>[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto"
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
    for (const s of visibleSeries) {
      const val = row[s.key]
      if (val !== null && Number.isFinite(val)) {
        values.push(val)
      }
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
/*  Synchronized Shared Multi-Series Tooltip                                  */
/* -------------------------------------------------------------------------- */

interface MultiSignalTooltipContentProps {
  active?: boolean
  payload?: readonly any[]
  label?: React.ReactNode
  activeX: string | number | null
  activeDatum: MultiSignalActiveDatum | null
  visibleSeries: readonly ResolvedMultiSignalSeries<any>[]
  allSeries: readonly ResolvedMultiSignalSeries<any>[]
  valueFormatter?: (value: number) => string
  xFormatter?: (value: string | number) => string
  lockableTooltip?: boolean
  isLocked?: boolean
  selectionColor?: string
}

function MultiSignalTooltipContent({
  active,
  payload,
  label: _label,
  activeX,
  activeDatum,
  visibleSeries,
  allSeries: _allSeries,
  valueFormatter,
  xFormatter,
  lockableTooltip,
  isLocked = false,
  selectionColor = "var(--chart-selection, #8b5cf6)",
}: MultiSignalTooltipContentProps) {
  const payloadRow = payload?.[0]?.payload as Record<string, any> | undefined
  const hasPayload = Boolean(payloadRow)

  if (!activeDatum && (!active || !hasPayload)) {
    return null
  }

  const rawX = activeDatum ? activeDatum.x : (payloadRow?.__x ?? activeX ?? "")
  const xDisplay = xFormatter ? xFormatter(rawX) : String(rawX)
  const lockedState = activeDatum ? activeDatum.isLocked : isLocked
  const defaultValueFmt = valueFormatter ?? ((n: number) => n.toLocaleString())

  const isCustomHex = typeof selectionColor === "string" && selectionColor.startsWith("#")

  return (
    <div
      className={cn(
        "rounded-xl border bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[200px] max-w-[290px] text-left transition-all duration-150 pointer-events-none select-none z-50",
        lockedState
          ? "border-violet-500/40 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),0_0_16px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/25"
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
      {/* Header: X-Domain Coordinate + Optional Lock Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2.5">
        <span className="font-mono text-xs font-semibold text-zinc-200 tracking-wide truncate">
          {xDisplay}
        </span>
        {lockedState && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-tight border bg-violet-500/15 border-violet-500/40 text-violet-300 dark:bg-violet-400/15 dark:border-violet-400/40 dark:text-violet-200 shadow-2xs"
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

      {/* Peer Series Values in Canonical Order */}
      <div className="space-y-1.5">
        {visibleSeries.map((s) => {
          const val = activeDatum
            ? activeDatum.values[s.key]
            : (payloadRow ? payloadRow[s.key] : null)
          const isMissing = val === null || val === undefined
          const fmt = s.valueFormatter || defaultValueFmt

          return (
            <div key={s.key} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="size-2 rounded-full shrink-0 ring-1 ring-white/20 shadow-xs"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-zinc-300 font-sans truncate text-xs font-medium">
                  {s.label}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-white shrink-0 tabular-nums">
                {isMissing ? "—" : fmt(val)}
              </span>
            </div>
          )
        })}
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
/*  Main MultiSignalLine Component                                            */
/* -------------------------------------------------------------------------- */

export function MultiSignalLine<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  series,
  height = 320,
  curve = "monotone",
  domain = "auto",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  lockableTooltip = true,
  defaultLockedIndex = null,
  defaultVisibleSeries,
  onVisibleSeriesChange,
  selectionColor = "var(--chart-selection, #8b5cf6)",
  missingValuePolicy = "gap",
  animation = "draw",
  valueFormatter,
  xFormatter,
  motion = true,
  onActiveDatumChange,
  title,
  description,
  className,
  loading = false,
  error = null,
  unavailable = false,
}: MultiSignalLineProps<TData, XVal>) {
  // Accessibility and container hooks
  const reducedMotion = useChartReducedMotion()
  const uid = React.useId()
  const titleId = `plotcn-multisignal-title-${uid}`
  const descId = `plotcn-multisignal-desc-${uid}`

  // 1. Resolve deterministic series identities
  const resolvedSeries = React.useMemo(
    () => resolveMultiSignalSeries(series),
    [series]
  )

  // 2. Normalize dataset
  const normalizedData = React.useMemo(
    () => normalizeMultiSignalData(data, xKey, resolvedSeries, missingValuePolicy),
    [data, xKey, resolvedSeries, missingValuePolicy]
  )

  // 3. Interactive Series Visibility State (keyed by stable series.key)
  const [hiddenSeries, setHiddenSeries] = React.useState<Set<string>>(() => {
    if (defaultVisibleSeries && Array.isArray(defaultVisibleSeries)) {
      const visibleSet = new Set(defaultVisibleSeries)
      const initialHidden = new Set<string>()
      for (const s of resolvedSeries) {
        if (!visibleSet.has(s.key)) {
          initialHidden.add(s.key)
        }
      }
      return initialHidden
    }
    return new Set<string>()
  })

  // Clean stale keys if series list changes
  React.useEffect(() => {
    const validKeys = new Set<string>(resolvedSeries.map((s) => String(s.key)))
    setHiddenSeries((prev) => {
      let changed = false
      const next = new Set<string>()
      for (const k of prev) {
        if (validKeys.has(k)) {
          next.add(k)
        } else {
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [resolvedSeries])

  // Toggle single series visibility
  const toggleSeriesVisibility = React.useCallback(
    (key: string) => {
      if (!interactiveLegend) return
      setHiddenSeries((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          next.delete(key)
        } else {
          next.add(key)
        }
        if (onVisibleSeriesChange) {
          const visible = resolvedSeries.filter((s) => !next.has(String(s.key))).map((s) => String(s.key))
          onVisibleSeriesChange(visible)
        }
        return next
      })
    },
    [interactiveLegend, onVisibleSeriesChange, resolvedSeries]
  )

  // Show all series recovery action
  const showAllSeries = React.useCallback(() => {
    setHiddenSeries(new Set<string>())
    if (onVisibleSeriesChange) {
      onVisibleSeriesChange(resolvedSeries.map((s) => String(s.key)))
    }
  }, [onVisibleSeriesChange, resolvedSeries])

  // Derive visible series list in canonical order
  const visibleSeries = React.useMemo(
    () => resolvedSeries.filter((s) => !hiddenSeries.has(s.key)),
    [resolvedSeries, hiddenSeries]
  )

  // Safe Y-axis domain covering all visible series
  const safeDomain = React.useMemo(
    () => calculateMultiSignalDomain(normalizedData, visibleSeries, domain),
    [normalizedData, visibleSeries, domain]
  )

  // 4. Inspection State: active hover vs locked persistent datum
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

  // Construct active datum for consumers and tooltips
  const activeDatum = React.useMemo<MultiSignalActiveDatum<TData, XVal> | null>(() => {
    if (effectiveIndex === null || effectiveIndex < 0 || effectiveIndex >= normalizedData.length) {
      return null
    }
    const row = normalizedData[effectiveIndex]
    const values: Record<string, number | null> = {}
    for (const s of resolvedSeries) {
      values[s.key] = row[s.key]
    }
    return {
      index: effectiveIndex,
      x: row.__x as XVal,
      raw: row.__raw as TData,
      values,
      isLocked: lockedIndex !== null && lockedIndex === effectiveIndex,
    }
  }, [effectiveIndex, lockedIndex, normalizedData, resolvedSeries])

  // Notify consumer callback
  React.useEffect(() => {
    if (onActiveDatumChange) {
      onActiveDatumChange(activeDatum)
    }
  }, [activeDatum, onActiveDatumChange])

  /* -------------------------------------------------------------------------- */
  /*  Keyboard & Pointer Scrubbing Handlers                                     */
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
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Factual screen reader summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No observations recorded."
    const visibleCount = visibleSeries.length
    const totalCount = resolvedSeries.length
    const obsCount = normalizedData.length
    const activeInfo = activeDatum
      ? ` Currently ${activeDatum.isLocked ? "locked on" : "inspecting"} observation ${activeDatum.index + 1} of ${obsCount} at ${String(activeDatum.x)}.`
      : " Use Left and Right Arrow keys to inspect observations across all visible signals."
    return `Multi-series line chart with ${visibleCount} visible of ${totalCount} series across ${obsCount} observations.${activeInfo}`
  }, [normalizedData.length, visibleSeries.length, resolvedSeries.length, activeDatum])

  /* -------------------------------------------------------------------------- */
  /*  Early Return Error / Loading States                                       */
  /* -------------------------------------------------------------------------- */

  if (error) {
    return (
      <figure
        role="region"
        aria-label={title || "Multi-signal chart error state"}
        className={cn("plotcn-multi-signal relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Unable to render multi-signal series"
          description={typeof error === "string" ? error : error?.message || "An unexpected error occurred while loading series data."}
        />
      </figure>
    )
  }

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Multi-signal chart loading state"}
        className={cn("plotcn-multi-signal relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState
          title="Loading multi-signal series…"
          description="Preparing time-series trends and series comparison data"
        />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Multi-signal chart unavailable state"}
        className={cn("plotcn-multi-signal relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Multi-signal metrics unavailable"
          description={typeof unavailable === "string" ? unavailable : "Comparative series data is currently unavailable."}
        />
      </figure>
    )
  }

  if (normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Multi-signal chart empty state"}
        className={cn("plotcn-multi-signal relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No data available"
          description="Provide ordered observations and series keys to display comparative signals."
        />
      </figure>
    )
  }

  const activeXCoordinate = effectiveIndex !== null ? normalizedData[effectiveIndex].__x : null
  const isCurrentlyLocked = lockedIndex !== null

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
        "plotcn-multi-signal relative flex flex-col w-full outline-none select-none transition-all duration-150 rounded-xl",
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
        <h3 id={titleId}>{title || "Multi-Signal Comparison Line Chart"}</h3>
        <p id={descId}>{description ? `${description} ${factualSummary}` : factualSummary}</p>
      </div>

      {/* Chart Canvas Area */}
      <ChartContainer className="w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden relative">
        {/* All-Series Hidden Truthful Recovery Overlay */}
        {visibleSeries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full w-full py-12 px-4 text-center space-y-3 z-20">
            <div className="size-10 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center text-zinc-400">
              <HugeiconsIcon icon={ViewOffSlashIcon} size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200">No visible series</p>
              <p className="text-xs text-zinc-400 max-w-xs">
                Select a series in the legend below to display its trend on the chart.
              </p>
            </div>
            {interactiveLegend && (
              <button
                type="button"
                onClick={showAllSeries}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-xs font-mono font-medium text-white transition-all cursor-pointer"
              >
                <HugeiconsIcon icon={ViewIcon} size={14} />
                <span>Show all series</span>
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
            <LineChart
              data={normalizedData}
              margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
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
                  <MultiSignalTooltipContent
                    activeX={activeXCoordinate}
                    activeDatum={activeDatum}
                    visibleSeries={visibleSeries}
                    allSeries={resolvedSeries}
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

              {/* Peer Continuous Lines for all VISIBLE series */}
              {visibleSeries.map((s) => (
                <Line
                  key={s.key}
                  type={curve === "step" ? "stepAfter" : curve}
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeDasharray={s.strokeDasharray}
                  connectNulls={false}
                  isAnimationActive={isAnimated}
                  animationDuration={animationDuration}
                  dot={(dotProps: any) => {
                    const { cx, cy, index, payload } = dotProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload[s.key] === null) {
                      return <React.Fragment key={`dot-${s.key}-${index}`} />
                    }

                    // Special active/locked marker for active observation
                    if (index === effectiveIndex) {
                      if (index === lockedIndex) {
                        return (
                          <g key={`locked-marker-${s.key}-${index}`} className="pointer-events-none">
                            <circle cx={cx} cy={cy} r={7} fill="none" stroke={s.color} strokeWidth={2} />
                            <circle cx={cx} cy={cy} r={3.5} fill={s.color} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                          </g>
                        )
                      }
                      return (
                        <circle
                          key={`active-marker-${s.key}-${index}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={s.color}
                          stroke="var(--chart-background, #09090b)"
                          strokeWidth={2}
                          className="pointer-events-none"
                        />
                      )
                    }

                    return <React.Fragment key={`dot-${s.key}-${index}`} />
                  }}
                  activeDot={(activeProps: any) => {
                    const { cx, cy, index, payload } = activeProps
                    if (typeof cx !== "number" || typeof cy !== "number" || payload?.[s.key] === null) {
                      return <React.Fragment key={`act-dot-${s.key}-${index}`} />
                    }
                    if (index === lockedIndex) {
                      return (
                        <g key={`locked-act-${s.key}-${index}`} className="pointer-events-none">
                          <circle cx={cx} cy={cy} r={7} fill="none" stroke={s.color} strokeWidth={2} />
                          <circle cx={cx} cy={cy} r={3.5} fill={s.color} stroke="var(--chart-background, #09090b)" strokeWidth={1.5} />
                        </g>
                      )
                    }
                    return (
                      <circle
                        key={`hover-dot-${s.key}-${index}`}
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={s.color}
                        stroke="var(--chart-background, #09090b)"
                        strokeWidth={2}
                        className="pointer-events-none"
                      />
                    )
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* Interactive Responsive Series Legend */}
      {showLegend && (
        <div
          role="group"
          aria-label="Chart series visibility toggles"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 px-2 text-xs font-mono select-none"
        >
          {resolvedSeries.map((s) => {
            const isHidden = hiddenSeries.has(s.key)
            return (
              <button
                key={s.key}
                type="button"
                role="switch"
                aria-checked={!isHidden}
                aria-label={`${s.label} series: ${isHidden ? "hidden, click to show" : "visible, click to hide"}`}
                disabled={!interactiveLegend}
                onClick={() => toggleSeriesVisibility(s.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-2.5 py-1 rounded-md transition-all",
                  interactiveLegend
                    ? "cursor-pointer hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                    : "cursor-default",
                  isHidden ? "opacity-35 line-through text-zinc-500" : "opacity-100 text-zinc-300 font-medium"
                )}
              >
                {/* Structural Line Stroke Sample */}
                <svg width={16} height={6} className="shrink-0 overflow-visible" aria-hidden="true">
                  <line
                    x1={0}
                    y1={3}
                    x2={16}
                    y2={3}
                    stroke={isHidden ? "currentColor" : s.color}
                    strokeWidth={2}
                    strokeDasharray={s.strokeDasharray}
                  />
                </svg>
                <span className="truncate">{s.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </figure>
  )
}
