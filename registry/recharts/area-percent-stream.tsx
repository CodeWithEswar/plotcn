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
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { ChartContainer } from "../shared/chart-container"
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
 * Semantic descriptor for an individual contributing series in the normalized percent composition.
 */
export interface PercentStreamSeries<TData extends Record<string, unknown> = Record<string, unknown>> {
  /** Property key on observation records containing numeric additive metric */
  key: NumericKeyOf<TData>
  /** Human-readable display label for legend, tooltips, and screen readers */
  label: string
  /** Explicit stroke and fill color override. Defaults to deterministic palette tokens */
  color?: string
  /** Custom numeric metric formatter for raw tooltip values */
  valueFormatter?: (value: number) => string
}

export interface ResolvedPercentStreamSeries<TData extends Record<string, unknown> = any> {
  key: NumericKeyOf<TData>
  label: string
  color: string
  valueFormatter?: (value: number) => string
  originalIndex: number
}

export type ObservationCompositionState = "valid" | "incomplete" | "zero-total"

export interface PercentStreamActiveDatum<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  index: number
  x: XVal
  raw: TData
  rawValues: Record<string, number | null>
  shares: Record<string, number | null>
  visibleRawTotal: number | null
  state: ObservationCompositionState
  isLocked: boolean
}

export interface NormalizedPercentStreamRow<TData = any> {
  __x: string | number
  __index: number
  __raw: TData
  __rawValues: Record<string, number | null>
  __shares: Record<string, number | null>
  __visibleRawTotal: number | null
  __state: ObservationCompositionState
  [key: string]: any
}

export interface PercentStreamAreaProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /** Readonly array of observation records. Caller data is never mutated. */
  data: readonly TData[]

  /** Key for horizontal domain coordinate (e.g. month, date, sprint, version). */
  xKey: keyof TData & string

  /** Ordered array of additive series. Stack order follows canonical array order (bottom -> top). */
  series: readonly PercentStreamSeries<TData>[]

  /** Container height in pixels or standard CSS dimension string. (default: 320) */
  height?: number | string

  /** Curve interpolation for area boundaries: "monotone" | "linear" | "step". (default: "monotone") */
  curve?: "monotone" | "linear" | "step"

  /** Overall fill opacity for normalized layers (0.0 to 1.0). (default: 0.75) */
  fillOpacity?: number

  /** Gradient fill mode: "none" (solid translucent) or "vertical-fade". (default: "none") */
  gradientMode?: "none" | "vertical-fade"

  /** Accent color for locked crosshair and selection markers. (default: "var(--chart-selection)") */
  selectionColor?: string

  /** Whether to render subtle horizontal Cartesian grid reference lines. (default: true) */
  showGrid?: boolean

  /** Whether to render the horizontal category scale. (default: true) */
  showXAxis?: boolean

  /** Whether to render the vertical percentage scale (0% - 100%). (default: true) */
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

  /** Handling of missing observations: 'gap' marks composition incomplete, 'zero' treats as 0. (default: "gap") */
  missingValuePolicy?: "gap" | "zero"

  /** Animation mode: "draw" | "fade" | "none". (default: "draw") */
  animation?: "draw" | "fade" | "none"

  /** Motion toggle or configuration object. Respects prefers-reduced-motion. */
  motion?: boolean | { duration?: number }

  /** Custom formatter for normalized share percentages in tooltips. (default: `${share.toFixed(1)}%`) */
  shareFormatter?: (share: number) => string

  /** Custom formatter for raw metric values in tooltips. */
  valueFormatter?: (value: number) => string

  /** Custom formatter for X-axis coordinate labels. */
  xFormatter?: (value: string | number) => string

  /** Callback fired whenever the active inspected observation changes. */
  onActiveDatumChange?: (datum: PercentStreamActiveDatum<TData, XVal> | null) => void

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
 * Hiding one series will never shift another series' assigned color token.
 */
export function resolvePercentStreamSeries<TData extends Record<string, unknown>>(
  series: readonly PercentStreamSeries<TData>[]
): ResolvedPercentStreamSeries<TData>[] {
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

export interface PercentStreamNormalizationResult<TData> {
  rows: NormalizedPercentStreamRow<TData>[]
  hasNegativeValues: boolean
  negativeErrorDetails?: string
}

/**
 * Normalizes input observations for 100% stacked percent composition:
 * 1. Checks for negative values (violates additive composition contract; rejected in V1).
 * 2. Missing values: under "gap", remains null (composition incomplete). Under "zero", coerced to 0.
 * 3. Zero total (sum = 0): shares are null / 0, avoiding divide-by-zero or NaN.
 * 4. Normalizes visible series so they sum to exactly 100% of visible total (Model A).
 * 5. Never mutates caller array or objects.
 */
export function normalizePercentStreamData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  resolvedSeries: readonly ResolvedPercentStreamSeries<TData>[],
  visibleKeys: ReadonlySet<string>,
  missingValuePolicy: "gap" | "zero" = "gap"
): PercentStreamNormalizationResult<TData> {
  if (!Array.isArray(data) || data.length === 0) {
    return { rows: [], hasNegativeValues: false }
  }

  const rows: NormalizedPercentStreamRow<TData>[] = []

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawValues: Record<string, number | null> = {}
    const shares: Record<string, number | null> = {}
    let isComplete = true
    let visibleRawTotal = 0

    // First pass: extract and validate individual series numbers
    for (const s of resolvedSeries) {
      const rawV = d[s.key]
      if (typeof rawV === "number") {
        if (!Number.isFinite(rawV)) {
          rawValues[s.key] = null
          if (visibleKeys.has(s.key)) isComplete = false
        } else if (rawV < 0) {
          return {
            rows: [],
            hasNegativeValues: true,
            negativeErrorDetails: `Percent Stream Area requires non-negative raw contributions. Found negative value (${rawV}) for series "${s.label}" at "${xVal}".`,
          }
        } else {
          rawValues[s.key] = rawV
          if (visibleKeys.has(s.key)) {
            visibleRawTotal += rawV
          }
        }
      } else if (rawV === null || rawV === undefined) {
        if (missingValuePolicy === "zero") {
          rawValues[s.key] = 0
        } else {
          rawValues[s.key] = null
          if (visibleKeys.has(s.key)) {
            isComplete = false
          }
        }
      } else {
        // Unknown type / NaN / invalid
        rawValues[s.key] = null
        if (visibleKeys.has(s.key)) isComplete = false
      }
    }

    // Determine state
    let state: ObservationCompositionState = "valid"
    if (!isComplete) {
      state = "incomplete"
    } else if (visibleRawTotal === 0) {
      state = "zero-total"
    }

    // Second pass: compute normalized 0–100% shares safely
    for (const s of resolvedSeries) {
      const val = rawValues[s.key]
      if (!visibleKeys.has(s.key)) {
        shares[s.key] = null
      } else if (state === "valid" && visibleRawTotal > 0 && val !== null) {
        // Derive proportional share in 0–100 range
        shares[s.key] = (val / visibleRawTotal) * 100
      } else if (state === "zero-total") {
        // Defined as zero height, distinct from missing
        shares[s.key] = 0
      } else {
        // Incomplete / missing
        shares[s.key] = null
      }
    }

    const rowObj: NormalizedPercentStreamRow<TData> = {
      __x: xVal,
      __index: i,
      __raw: d,
      __rawValues: rawValues,
      __shares: shares,
      __visibleRawTotal: state === "incomplete" ? null : visibleRawTotal,
      __state: state,
    }

    // Attach flattened keys for Recharts Area primitives
    for (const s of resolvedSeries) {
      rowObj[`__share_${s.key}`] = shares[s.key]
    }

    rows.push(rowObj)
  }

  return { rows, hasNegativeValues: false }
}

/* -------------------------------------------------------------------------- */
/*  Custom Tooltip Component                                                  */
/* -------------------------------------------------------------------------- */

interface PercentStreamTooltipContentProps {
  active?: boolean
  activeDatum: PercentStreamActiveDatum | null
  resolvedSeries: readonly ResolvedPercentStreamSeries[]
  visibleKeys: ReadonlySet<string>
  shareFormatter: (share: number) => string
  valueFormatter: (value: number) => string
  onUnlock?: () => void
  isCompact?: boolean
}

function PercentStreamTooltipContent({
  active,
  activeDatum,
  resolvedSeries,
  visibleKeys,
  shareFormatter,
  valueFormatter,
  onUnlock,
  isCompact = false,
}: PercentStreamTooltipContentProps) {
  if (!active || !activeDatum) return null

  const isLocked = activeDatum.isLocked
  const state = activeDatum.state

  return (
    <div
      role="region"
      aria-label="Inspection Readout"
      className={cn(
        "plotcn-interactive-tooltip z-50 rounded-xl border bg-zinc-950/95 shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95 select-none",
        isCompact
          ? "min-w-[130px] max-w-[200px] p-2 text-[10px]"
          : "min-w-[220px] max-w-[300px] p-3.5 text-xs text-zinc-100",
        isLocked
          ? "border-amber-500/40 ring-2 ring-amber-500/20 shadow-amber-950/30"
          : "border-white/[0.12] shadow-black/60"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "tooltip-header flex items-center justify-between border-b border-white/[0.08]",
          isCompact ? "pb-1 mb-1.5" : "pb-2 mb-2.5"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "font-mono font-semibold text-zinc-200 truncate",
              isCompact ? "text-[10px]" : "text-xs"
            )}
          >
            {String(activeDatum.x)}
          </span>
          {!isCompact && (
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0">
              · 100% Mix
            </span>
          )}
        </div>
        {isLocked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onUnlock?.()
            }}
            className={cn(
              "flex items-center gap-1 rounded bg-amber-500/20 font-mono font-medium text-amber-300 hover:bg-amber-500/30 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400 shrink-0",
              isCompact ? "px-1 py-0.2 text-[8px]" : "px-1.5 py-0.5 text-[10px]"
            )}
            title="Press Escape or click to unlock"
          >
            <HugeiconsIcon icon={LockKeyIcon} size={isCompact ? 9 : 11} />
            <span>Pinned</span>
          </button>
        )}
      </div>

      {/* State Callouts */}
      {state === "incomplete" && (
        <div
          className={cn(
            "rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300",
            isCompact ? "p-1 mb-1 text-[9px]" : "p-2 mb-2.5 text-[11px]"
          )}
        >
          <div className="font-semibold flex items-center gap-1">
            <span className="size-1 rounded-full bg-amber-400" />
            Incomplete
          </div>
          {!isCompact && (
            <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">
              One or more visible series have missing observations at this coordinate.
            </p>
          )}
        </div>
      )}

      {state === "zero-total" && (
        <div
          className={cn(
            "rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300",
            isCompact ? "p-1 mb-1 text-[9px]" : "p-2 mb-2.5 text-[11px]"
          )}
        >
          <div className="font-semibold flex items-center gap-1">
            <span className="size-1 rounded-full bg-sky-400" />
            Zero Total
          </div>
          {!isCompact && (
            <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">
              All visible contributors recorded zero.
            </p>
          )}
        </div>
      )}

      {/* Series Breakdown */}
      <div className={isCompact ? "space-y-0.5" : "space-y-1.5"}>
        {[...resolvedSeries]
          .reverse()
          .filter((s) => visibleKeys.has(s.key))
          .map((s) => {
            const rawVal = activeDatum.rawValues[s.key]
            const shareVal = activeDatum.shares[s.key]
            const formatter = s.valueFormatter || valueFormatter

            return (
              <div
                key={s.key}
                className={cn(
                  "tooltip-row flex items-center justify-between gap-2",
                  isCompact ? "text-[10px] py-0" : "text-xs py-0.5"
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={cn(
                      "rounded-xs shrink-0 border border-black/40",
                      isCompact ? "size-2" : "size-2.5"
                    )}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="truncate text-zinc-300 font-medium">{s.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 font-mono text-right">
                  <span className="font-semibold text-white">
                    {shareVal !== null && Number.isFinite(shareVal)
                      ? shareFormatter(shareVal)
                      : "—"}
                  </span>
                  {!isCompact && (
                    <span className="text-[10px] text-zinc-400">
                      ({rawVal !== null && Number.isFinite(rawVal) ? formatter(rawVal) : "—"})
                    </span>
                  )}
                </div>
              </div>
            )
          })}
      </div>

      {/* Footer: Visible Raw Total */}
      <div
        className={cn(
          "flex items-center justify-between border-t border-white/[0.08] font-mono",
          isCompact ? "mt-1.5 pt-1 text-[10px]" : "mt-3 pt-2 text-[11px]"
        )}
      >
        <span className="text-zinc-400">Total</span>
        <span className="font-bold text-zinc-200">
          {activeDatum.visibleRawTotal !== null && Number.isFinite(activeDatum.visibleRawTotal)
            ? valueFormatter(activeDatum.visibleRawTotal)
            : state === "zero-total"
            ? "0"
            : "Incomplete"}
        </span>
      </div>

      {isLocked && !isCompact && (
        <div className="mt-2 text-center text-[10px] text-zinc-500 font-mono">
          Press <kbd className="px-1 rounded bg-zinc-800 text-zinc-400">Esc</kbd> to unlock
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: PercentStreamArea                                         */
/* -------------------------------------------------------------------------- */

export function PercentStreamArea<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data = [],
  xKey,
  series,
  height = 320,
  curve = "monotone",
  fillOpacity = 0.75,
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
  shareFormatter = (share: number) => `${share.toFixed(1)}%`,
  valueFormatter = (value: number) => (isFiniteNumber(value) ? value.toLocaleString() : "—"),
  xFormatter = (val: string | number) => String(val ?? ""),
  onActiveDatumChange,
  title = "Percent Stream Area Chart",
  description,
  className,
  loading = false,
  error = null,
  unavailable = false,
}: PercentStreamAreaProps<TData, XVal>) {
  const isReducedMotion = useChartReducedMotion()
  const motionEnabled = motion !== false && !isReducedMotion && animation !== "none"

  // 1. Resolve Canonical Series Identities
  const resolvedSeries = React.useMemo(() => {
    return resolvePercentStreamSeries(series)
  }, [series])

  // 2. Interactive Visibility State
  const [visibleKeys, setVisibleKeys] = React.useState<ReadonlySet<string>>(() => {
    if (defaultVisibleSeries && defaultVisibleSeries.length > 0) {
      return new Set(defaultVisibleSeries)
    }
    return new Set(resolvedSeries.map((s) => s.key))
  })

  // Synchronize if defaultVisibleSeries or series array changes
  React.useEffect(() => {
    if (defaultVisibleSeries && defaultVisibleSeries.length > 0) {
      setVisibleKeys(new Set(defaultVisibleSeries))
    } else {
      setVisibleKeys(new Set(resolvedSeries.map((s) => s.key)))
    }
  }, [defaultVisibleSeries, resolvedSeries])

  const toggleSeries = React.useCallback(
    (key: string) => {
      if (!interactiveLegend) return

      setVisibleKeys((prev) => {
        const next = new Set(prev)
        if (next.has(key)) {
          // Allow toggling off only if more than one series visible
          if (next.size > 1) {
            next.delete(key)
          }
        } else {
          next.add(key)
        }
        const nextArr = Array.from(next)
        onVisibleSeriesChange?.(nextArr)
        return next
      })
    },
    [interactiveLegend, onVisibleSeriesChange]
  )

  // 3. Normalization with Model A (Visible-Series Normalization)
  const normalizationResult = React.useMemo(() => {
    return normalizePercentStreamData(
      data,
      xKey,
      resolvedSeries,
      visibleKeys,
      missingValuePolicy
    )
  }, [data, xKey, resolvedSeries, visibleKeys, missingValuePolicy])

  const rows = normalizationResult.rows

  // 4. Locked and Hovered Active Observation State
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(defaultLockedIndex)
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const activeIndex = lockedIndex !== null ? lockedIndex : hoverIndex

  const activeDatum = React.useMemo<PercentStreamActiveDatum<TData, XVal> | null>(() => {
    if (activeIndex === null || !rows[activeIndex]) return null
    const row = rows[activeIndex]
    return {
      index: activeIndex,
      x: row.__x as XVal,
      raw: row.__raw,
      rawValues: row.__rawValues,
      shares: row.__shares,
      visibleRawTotal: row.__visibleRawTotal,
      state: row.__state,
      isLocked: lockedIndex !== null,
    }
  }, [activeIndex, rows, lockedIndex])

  React.useEffect(() => {
    onActiveDatumChange?.(activeDatum)
  }, [activeDatum, onActiveDatumChange])

  // Keyboard navigation & lock management
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!rows.length) return

      const maxIdx = rows.length - 1
      const current = activeIndex ?? 0

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown": {
          e.preventDefault()
          const next = Math.min(maxIdx, current + 1)
          if (lockedIndex !== null) setLockedIndex(next)
          else setHoverIndex(next)
          break
        }
        case "ArrowLeft":
        case "ArrowUp": {
          e.preventDefault()
          const prev = Math.max(0, current - 1)
          if (lockedIndex !== null) setLockedIndex(prev)
          else setHoverIndex(prev)
          break
        }
        case "Home": {
          e.preventDefault()
          if (lockedIndex !== null) setLockedIndex(0)
          else setHoverIndex(0)
          break
        }
        case "End": {
          e.preventDefault()
          if (lockedIndex !== null) setLockedIndex(maxIdx)
          else setHoverIndex(maxIdx)
          break
        }
        case "Enter":
        case " ": {
          if (!lockableTooltip) return
          e.preventDefault()
          if (lockedIndex !== null) {
            setLockedIndex(null)
          } else {
            setLockedIndex(current)
          }
          break
        }
        case "Escape": {
          if (lockedIndex !== null) {
            e.preventDefault()
            setLockedIndex(null)
          }
          break
        }
      }
    },
    [rows.length, activeIndex, lockedIndex, lockableTooltip]
  )

  // Chart Click toggles lock
  const handleChartClick = React.useCallback(
    (state: any) => {
      if (!lockableTooltip) return
      if (state && state.activeTooltipIndex !== undefined) {
        const clickedIndex = Number(state.activeTooltipIndex)
        if (lockedIndex === clickedIndex) {
          setLockedIndex(null)
        } else {
          setLockedIndex(clickedIndex)
        }
      } else if (lockedIndex !== null) {
        setLockedIndex(null)
      }
    },
    [lockableTooltip, lockedIndex]
  )

  // SSR Safe Gradient ID prefix
  const gradientIdPrefix = React.useId().replace(/:/g, "")

  /* ------------------------------------------------------------------------ */
  /*  Early States: Loading, Unavailable, Error, Empty                        */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Percent stream loading state"}
        className={cn("plotcn-percent-stream relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState description="Loading percent stream composition..." />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Percent stream unavailable state"}
        className={cn("plotcn-percent-stream relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState
          title="Composition Unavailable"
          description={typeof unavailable === "string" ? unavailable : "Composition data is currently unavailable."}
        />
      </figure>
    )
  }

  if (error || normalizationResult.hasNegativeValues) {
    const errorDescription =
      normalizationResult.negativeErrorDetails ||
      (error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred.")
    return (
      <figure
        role="region"
        aria-label={title || "Percent stream error state"}
        className={cn("plotcn-percent-stream relative w-full overflow-hidden rounded-xl border border-rose-500/20 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Percent Stream Configuration Error"
          description={errorDescription}
        />
      </figure>
    )
  }

  if (!data || data.length === 0 || !series || series.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Percent stream empty state"}
        className={cn("plotcn-percent-stream relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState
          title="No Composition Data"
          description="Supply an array of records and at least one contributing series."
        />
      </figure>
    )
  }

  // All series hidden recoverable state
  if (visibleKeys.size === 0) {
    return (
      <figure
        role="region"
        aria-label={title}
        className={cn(
          "relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950 p-4 text-zinc-200",
          className
        )}
        style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
      >
        <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
          <div className="size-10 rounded-full bg-zinc-900 border border-white/[0.1] flex items-center justify-center mb-3 text-zinc-400">
            <HugeiconsIcon icon={ViewOffSlashIcon} size={20} />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">All Series Hidden</h4>
          <p className="text-xs text-zinc-400 max-w-sm mb-4">
            No visible series remain. Click any series below to restore 100% normalized composition.
          </p>
        </div>

        {/* Accessible Interactive Legend */}
        {showLegend && (
          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-3 text-xs">
            {resolvedSeries.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => toggleSeries(s.key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.1] bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <span className="size-2 rounded-xs" style={{ backgroundColor: s.color }} />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </figure>
    )
  }

  return (
    <figure
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-sans text-zinc-200 outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-sky-500/50",
        className
      )}
      style={{
        height,
        minHeight: typeof height === "number" ? height : 320,
      }}
    >
      {/* Screen Reader Live Narration */}
      <div className="sr-only" aria-live="polite">
        {description ||
          `${title}. 100% normalized stacked area showing ${visibleKeys.size} visible series across ${rows.length} observations.`}
        {activeDatum && (
          activeDatum.state === "valid"
            ? ` Active coordinate ${String(activeDatum.x)}. Visible series shares: ${resolvedSeries
                .filter((s) => visibleKeys.has(s.key))
                .map(
                  (s) =>
                    `${s.label}: ${
                      activeDatum.shares[s.key] !== null
                        ? shareFormatter(activeDatum.shares[s.key]!)
                        : "unavailable"
                    } (raw ${valueFormatter(activeDatum.rawValues[s.key] ?? 0)})`
                )
                .join(", ")}. Visible total: ${valueFormatter(activeDatum.visibleRawTotal ?? 0)}.`
            : activeDatum.state === "zero-total"
            ? ` Active coordinate ${String(activeDatum.x)}. Total is zero. Percentage composition is unavailable.`
            : ` Active coordinate ${String(activeDatum.x)}. Composition unavailable due to missing observations.`
        )}
      </div>

      {/* Optional Legend */}
      {showLegend && (
        <div
          role="toolbar"
          aria-label="Series visibility controls"
          className="flex flex-wrap items-center justify-center gap-2 pb-2 text-xs select-none shrink-0"
        >
          {resolvedSeries.map((s) => {
            const isVisible = visibleKeys.has(s.key)
            return (
              <button
                key={s.key}
                type="button"
                disabled={!interactiveLegend}
                onClick={() => toggleSeries(s.key)}
                aria-pressed={isVisible}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 cursor-pointer",
                  isVisible
                    ? "border border-white/[0.12] bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800"
                    : "border border-white/[0.04] bg-zinc-950/40 text-zinc-500 line-through hover:text-zinc-400"
                )}
                title={
                  interactiveLegend
                    ? isVisible
                      ? `Click to hide ${s.label} (re-normalizes remaining visible series)`
                      : `Click to show ${s.label}`
                    : s.label
                }
              >
                <span
                  className={cn(
                    "size-2.5 rounded-xs shrink-0 transition-opacity",
                    isVisible ? "opacity-100" : "opacity-35"
                  )}
                  style={{ backgroundColor: s.color }}
                />
                <span>{s.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* SVG Canvas Container */}
      <ChartContainer className="relative w-full flex-1 min-w-0 min-h-0 max-w-full overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 320 }}
        >
          <AreaChart
            data={rows}
            onClick={handleChartClick}
            onMouseMove={(state: any) => {
              if (lockedIndex === null && state && state.activeTooltipIndex !== undefined) {
                setHoverIndex(Number(state.activeTooltipIndex))
              }
            }}
            onMouseLeave={() => {
              if (lockedIndex === null) {
                setHoverIndex(null)
              }
            }}
            margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
          >
            <defs>
              {/* Optional vertical gradient fills per series */}
              {resolvedSeries.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`${gradientIdPrefix}-grad-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={fillOpacity} />
                  <stop
                    offset="100%"
                    stopColor={s.color}
                    stopOpacity={gradientMode === "vertical-fade" ? fillOpacity * 0.4 : fillOpacity}
                  />
                </linearGradient>
              ))}
            </defs>

            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.06)"
              />
            )}

            {showXAxis && (
              <XAxis
                dataKey="__x"
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                tickFormatter={xFormatter}
                dy={6}
              />
            )}

            {showYAxis && (
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                tick={{ fill: "#a1a1aa", fontSize: 11, fontFamily: "monospace" }}
                width={44}
              />
            )}

            {/* 100% Ceiling Reference Line */}
            <ReferenceLine
              y={100}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="2 2"
            />

            {/* Neutral Inspection Crosshair */}
            {activeIndex !== null && rows[activeIndex] && (
              <ReferenceLine
                x={rows[activeIndex].__x}
                stroke={selectionColor || "var(--chart-selection)"}
                strokeWidth={1.5}
                strokeDasharray={lockedIndex !== null ? "none" : "3 3"}
              />
            )}

            {/* Custom Interactive Tooltip */}
            <Tooltip
              isAnimationActive={false}
              cursor={false}
              content={
                <PercentStreamTooltipContent
                  activeDatum={activeDatum}
                  resolvedSeries={resolvedSeries}
                  visibleKeys={visibleKeys}
                  shareFormatter={shareFormatter}
                  valueFormatter={valueFormatter}
                  onUnlock={() => setLockedIndex(null)}
                  isCompact={typeof height === "number" ? height <= 260 : false}
                />
              }
            />

            {/* Stacked Area Primitives (stackId="plotcn-percent-stack") */}
            {resolvedSeries.map((s) => {
              const isVisible = visibleKeys.has(s.key)
              if (!isVisible) return null

              const fillUrl =
                gradientMode === "vertical-fade"
                  ? `url(#${gradientIdPrefix}-grad-${s.key})`
                  : s.color

              return (
                <Area
                  key={s.key}
                  type={curve}
                  dataKey={`__share_${s.key}`}
                  name={s.label}
                  stackId="plotcn-percent-stack"
                  stroke={s.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.9}
                  fill={fillUrl}
                  fillOpacity={gradientMode === "vertical-fade" ? 1 : fillOpacity}
                  isAnimationActive={motionEnabled}
                  animationDuration={650}
                  animationEasing="ease-out"
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Structured Data Alternative for Screen Readers */}
      <div className="sr-only">
        <table>
          <caption>{title || "Composition data table"}</caption>
          <thead>
            <tr>
              <th scope="col">Coordinate</th>
              {resolvedSeries.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
              <th scope="col">Visible Total</th>
              <th scope="col">State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{String(r.__x)}</td>
                {resolvedSeries.map((s) => {
                  const rawVal = r.__rawValues[s.key]
                  const shareVal = r.__shares[s.key]
                  return (
                    <td key={s.key}>
                      {shareVal !== null
                        ? `${shareFormatter(shareVal)} (${rawVal !== null ? valueFormatter(rawVal) : "—"})`
                        : "—"}
                    </td>
                  )
                })}
                <td>{r.__visibleRawTotal !== null ? valueFormatter(r.__visibleRawTotal) : "—"}</td>
                <td>{r.__state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
