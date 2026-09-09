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
  Legend,
  type TooltipProps,
} from "recharts"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartContainer } from "../shared/chart-container"
import {
  ChartLoadingState,
  ChartEmptyState,
  ChartErrorState,
  ChartUnavailableState,
} from "../shared/chart-state"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { LockKeyIcon } from "@hugeicons/core-free-icons"

/* -------------------------------------------------------------------------- */
/*  Type Definitions                                                          */
/* -------------------------------------------------------------------------- */

export type CurveType = "linear" | "monotone" | "step"
export type DeltaType = "absolute" | "percentage" | "both"

export type NumericKeyOf<T> = {
  [K in keyof T]: T[K] extends number | null | undefined ? K : never
}[keyof T] & string

export interface ComparisonAreaSeriesItem<TData = Record<string, unknown>> {
  /** Property key on datum representing this role's numeric metric */
  key: keyof TData & string
  /** Human-readable display label */
  label: string
  /** Optional role-specific color override */
  color?: string
  /** Optional custom value formatter */
  valueFormatter?: (value: number) => string
}

export interface ComparisonAreaSeries<TData = Record<string, unknown>> {
  /** The primary (current / dominant) series */
  primary: ComparisonAreaSeriesItem<TData>
  /** The reference (baseline / previous period) series */
  reference: ComparisonAreaSeriesItem<TData>
}

export interface ComparisonAreaProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * The array of observation records to visualize.
   * Readonly array; caller data is never mutated.
   */
  data: readonly TData[]

  /**
   * Property name for horizontal domain coordinates (time, date, category).
   */
  xKey: keyof TData & string

  /**
   * Explicit primary and reference series configuration.
   */
  series: ComparisonAreaSeries<TData>

  /**
   * Container height in pixels or CSS dimension string.
   * Default: 320
   */
  height?: number | string

  /**
   * Curve interpolation algorithm.
   * Default: "monotone"
   */
  curve?: CurveType

  /**
   * Shared vertical domain [min, max] or "auto".
   * Automatically computed across both roles to guarantee honest comparison.
   */
  domain?: [number, number] | "auto"

  /**
   * Primary series color.
   * Default: "var(--chart-1)"
   */
  primaryColor?: string

  /**
   * Reference series color.
   * Default: "var(--chart-2)"
   */
  referenceColor?: string

  /**
   * Selection / locked indicator color.
   * Default: "var(--chart-selection)"
   */
  selectionColor?: string

  /**
   * Primary area fill opacity (0.05 to 1.0).
   * Default: 0.28
   */
  fillOpacity?: number

  /**
   * Explicit primary fill opacity override.
   */
  primaryFillOpacity?: number

  /**
   * Explicit reference fill opacity override.
   * Defaults to a restrained attenuation of primary opacity (~0.14).
   */
  referenceFillOpacity?: number

  /**
   * Handling of missing / null values.
   * "gap" produces a truthful visual break; "connect" interpolates across missing coordinates.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "connect"

  /**
   * Whether to display comparison delta (primary − reference) in the tooltip.
   * Default: true
   */
  showDelta?: boolean

  /**
   * Format for delta readout: "absolute", "percentage", or "both".
   * Default: "both"
   */
  deltaType?: DeltaType

  /**
   * Whether to invert delta semantics (e.g. for latency or error counts where lower is better).
   * Default: false
   */
  invertDelta?: boolean

  /**
   * Custom formatter for metric values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Custom formatter for horizontal domain ticks.
   */
  xFormatter?: (value: any) => string

  /**
   * Whether to display Cartesian background grid lines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display horizontal X axis ticks.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to display vertical Y axis ticks.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to render the series legend.
   * Default: true
   */
  showLegend?: boolean

  /**
   * Whether legend items can be clicked to toggle role visibility.
   * Default: true
   */
  interactiveLegend?: boolean

  /**
   * Enables persistent tooltip pinning on click, tap, or Enter/Space.
   * Default: true
   */
  lockableTooltip?: boolean

  /**
   * Controls entry transitions. Automatically bypassed under reduced motion.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible name announced by screen readers for the `<figure>` container.
   * Default: "Comparison Area Chart"
   */
  title?: string

  /**
   * Extended description for assistive technologies.
   */
  description?: string

  /**
   * Displays loading placeholder skeleton while preserving dimensions.
   */
  loading?: boolean

  /**
   * Error state indicator or Error instance.
   */
  error?: Error | string | null

  /**
   * Unavailable notice (e.g. tier restrictions or retention limits).
   */
  unavailable?: boolean | string | null

  /**
   * Callback invoked when user clicks error retry.
   */
  onRetry?: () => void

  /**
   * Callback fired when active hovered/locked observation changes.
   */
  onActiveDatumChange?: (datum: TData | null) => void

  /**
   * Additional CSS classes for root figure container.
   */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Math & Domain Safety Helpers                                         */
/* -------------------------------------------------------------------------- */

function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Calculates a single honest shared Y-domain covering both Primary and Reference.
 * Guarantees zero-division safety and truthful scaling.
 */
export function calculateSharedDomain(
  data: readonly Record<string, unknown>[],
  primaryKey: string,
  referenceKey: string,
  explicitDomain?: [number, number] | "auto",
  visibleSeries: Set<"primary" | "reference"> = new Set(["primary", "reference"])
): [number, number] {
  if (explicitDomain && explicitDomain !== "auto") {
    return explicitDomain
  }

  const values: number[] = []
  for (const row of data) {
    if (visibleSeries.has("primary")) {
      const p = row[primaryKey]
      if (isFiniteNumber(p)) values.push(p)
    }
    if (visibleSeries.has("reference")) {
      const r = row[referenceKey]
      if (isFiniteNumber(r)) values.push(r)
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  // Single-value scale protection
  if (min === max) {
    if (min === 0) return [-1, 1]
    if (min > 0) return [0, Math.ceil(min * 1.25)]
    return [Math.floor(min * 1.25), 0]
  }

  // Cross-zero or positive-only padding
  const span = max - min
  const pad = span * 0.08
  const safeMin = min >= 0 ? 0 : Math.floor(min - pad)
  const safeMax = Math.ceil(max + pad)

  return [safeMin, safeMax]
}

/**
 * Normalizes dataset without mutating original caller objects.
 * Missing/non-finite observations are converted to null for truthful gap rendering.
 */
export function normalizeComparisonData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: string,
  primaryKey: string,
  referenceKey: string
): Record<string, unknown>[] {
  return data.map((item, idx) => {
    const rawPrimary = item[primaryKey]
    const rawReference = item[referenceKey]
    const xVal = item[xKey] ?? `Point ${idx + 1}`

    return {
      ...item,
      [xKey]: xVal,
      [primaryKey]: isFiniteNumber(rawPrimary) ? rawPrimary : null,
      [referenceKey]: isFiniteNumber(rawReference) ? rawReference : null,
    }
  })
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Comparison Tooltip Component                                 */
/* -------------------------------------------------------------------------- */

interface ComparisonAreaTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; [key: string]: any }[]
  label?: React.ReactNode
  primaryKey: string
  referenceKey: string
  primaryLabel: string
  referenceLabel: string
  primaryColor: string
  referenceColor: string
  valueFormatter: (value: number) => string
  showDelta?: boolean
  deltaType?: DeltaType
  invertDelta?: boolean
  isCompact?: boolean
  isLocked?: boolean
  onUnlock?: () => void
}

function ComparisonAreaTooltipContent({
  active,
  payload,
  label,
  primaryKey,
  referenceKey,
  primaryLabel,
  referenceLabel,
  primaryColor,
  referenceColor,
  valueFormatter,
  showDelta = true,
  deltaType = "both",
  invertDelta = false,
  isCompact = false,
  isLocked = false,
  onUnlock,
}: ComparisonAreaTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const primaryItem = payload.find((p) => p.dataKey === primaryKey)
  const referenceItem = payload.find((p) => p.dataKey === referenceKey)

  const primaryVal = primaryItem?.value
  const referenceVal = referenceItem?.value

  const hasPrimary = isFiniteNumber(primaryVal)
  const hasReference = isFiniteNumber(referenceVal)

  // Delta calculation: primary − reference
  let absoluteDelta: number | null = null
  let percentageDelta: number | null = null

  if (hasPrimary && hasReference) {
    absoluteDelta = primaryVal - referenceVal
    if (referenceVal !== 0) {
      percentageDelta = ((primaryVal - referenceVal) / Math.abs(referenceVal)) * 100
    }
  }

  const formatDeltaString = () => {
    if (absoluteDelta === null) return "—"
    const sign = absoluteDelta > 0 ? "+" : absoluteDelta < 0 ? "−" : ""
    const absVal = Math.abs(absoluteDelta)

    if (deltaType === "absolute") {
      return `${sign}${valueFormatter(absVal)}`
    }
    if (deltaType === "percentage") {
      if (percentageDelta === null) return `${sign}${valueFormatter(absVal)}`
      const pctSign = percentageDelta > 0 ? "+" : percentageDelta < 0 ? "−" : ""
      return `${pctSign}${Math.abs(percentageDelta).toFixed(1)}%`
    }
    // "both"
    if (percentageDelta !== null) {
      const pctSign = percentageDelta > 0 ? "+" : percentageDelta < 0 ? "−" : ""
      return `${sign}${valueFormatter(absVal)} (${pctSign}${Math.abs(percentageDelta).toFixed(1)}%)`
    }
    return `${sign}${valueFormatter(absVal)}`
  }

  return (
    <div
      className={cn(
        "plotcn-interactive-tooltip z-50 rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] shadow-lg backdrop-blur-md select-none",
        isCompact
          ? "min-w-[120px] max-w-[190px] p-2 text-[10px]"
          : "min-w-[190px] max-w-[270px] p-2.5 text-xs"
      )}
    >
      {/* Header with coordinate & optional pin badge */}
      <div className={cn("flex items-center justify-between gap-2 border-b border-white/[0.08] pb-1.5", isCompact ? "mb-1.5" : "mb-2")}>
        <span className={cn("font-mono font-medium text-[var(--chart-tooltip-muted)] truncate", isCompact ? "text-[10px]" : "text-[11px]")}>
          {label}
        </span>
        {isLocked && (
          <button
            type="button"
            onClick={onUnlock}
            aria-label="Unlock tooltip"
            className={cn(
              "flex items-center gap-1 rounded font-mono font-semibold transition-colors",
              "bg-primary/20 text-primary hover:bg-primary/30",
              isCompact ? "px-1 py-0.2 text-[8px]" : "px-1.5 py-0.5 text-[9px]"
            )}
          >
            <HugeiconsIcon icon={LockKeyIcon} size={isCompact ? 9 : 11} />
            <span>Locked</span>
          </button>
        )}
      </div>

      <div className={isCompact ? "space-y-1" : "space-y-1.5"}>
        {/* Primary Series Row (Solid identity) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn("rounded-xs border border-white/20 shrink-0", isCompact ? "size-2" : "size-2.5")}
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)] truncate">
              {primaryLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)] shrink-0">
            {hasPrimary ? valueFormatter(primaryVal) : "—"}
          </span>
        </div>

        {/* Reference Series Row (Quieter dashed identity) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn("rounded-xs border border-dashed border-white/40 shrink-0 opacity-80", isCompact ? "size-2" : "size-2.5")}
              style={{ backgroundColor: referenceColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)] truncate">
              {referenceLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)] shrink-0">
            {hasReference ? valueFormatter(referenceVal) : "—"}
          </span>
        </div>

        {/* Delta Row (Neutral factual arithmetic) */}
        {showDelta && (
          <div className={cn("mt-2 flex items-center justify-between border-t border-white/[0.08] pt-1.5", isCompact ? "text-[9px]" : "text-[11px]")}>
            <span className="text-[var(--chart-tooltip-muted)] font-medium">Difference</span>
            <span className="font-mono font-medium text-[var(--chart-tooltip-foreground)]">
              {formatDeltaString()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Custom Legend Component with Non-Color Structural Samples                 */
/* -------------------------------------------------------------------------- */

interface ComparisonAreaLegendProps {
  primaryLabel: string
  referenceLabel: string
  primaryColor: string
  referenceColor: string
  visibleSeries: Set<"primary" | "reference">
  onToggle: (role: "primary" | "reference") => void
  interactive?: boolean
  isCompact?: boolean
}

function ComparisonAreaLegend({
  primaryLabel,
  referenceLabel,
  primaryColor,
  referenceColor,
  visibleSeries,
  onToggle,
  interactive = true,
  isCompact = false,
}: ComparisonAreaLegendProps) {
  const isPrimaryVisible = visibleSeries.has("primary")
  const isReferenceVisible = visibleSeries.has("reference")

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4 pt-3 select-none", isCompact ? "text-[10px]" : "text-xs")}>
      {/* Primary Legend Item (Solid boundary & fill) */}
      <button
        type="button"
        disabled={!interactive}
        onClick={() => onToggle("primary")}
        aria-pressed={isPrimaryVisible}
        className={cn(
          "flex items-center gap-1.5 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--chart-focus)] rounded px-1.5 py-0.5",
          !isPrimaryVisible && "opacity-40 line-through text-muted-foreground",
          interactive ? "cursor-pointer hover:opacity-80" : "cursor-default"
        )}
      >
        <span
          className="relative inline-flex items-center justify-center size-3 rounded-xs border border-white/20 shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="w-2 h-0.5 bg-white/70 rounded-full" />
        </span>
        <span className="font-medium text-foreground">{primaryLabel}</span>
      </button>

      {/* Reference Legend Item (Dashed boundary & quieter fill) */}
      <button
        type="button"
        disabled={!interactive}
        onClick={() => onToggle("reference")}
        aria-pressed={isReferenceVisible}
        className={cn(
          "flex items-center gap-1.5 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--chart-focus)] rounded px-1.5 py-0.5",
          !isReferenceVisible && "opacity-40 line-through text-muted-foreground",
          interactive ? "cursor-pointer hover:opacity-80" : "cursor-default"
        )}
      >
        <span
          className="relative inline-flex items-center justify-center size-3 rounded-xs border border-dashed border-white/50 shrink-0 opacity-80"
          style={{ backgroundColor: referenceColor }}
        >
          <span className="w-2 h-0.5 border-t border-dashed border-white/90" />
        </span>
        <span className="font-medium text-foreground">{referenceLabel}</span>
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: ComparisonArea                                            */
/* -------------------------------------------------------------------------- */

export function ComparisonArea<TData extends Record<string, unknown> = Record<string, unknown>>({
  data = [],
  xKey,
  series,
  height = 320,
  curve = "monotone",
  domain,
  primaryColor = "var(--chart-1)",
  referenceColor = "var(--chart-2)",
  selectionColor = "var(--chart-selection)",
  fillOpacity = 0.28,
  primaryFillOpacity,
  referenceFillOpacity,
  missingValuePolicy = "gap",
  showDelta = true,
  deltaType = "both",
  invertDelta = false,
  valueFormatter = (v: number) => v.toLocaleString(),
  xFormatter,
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  interactiveLegend = true,
  lockableTooltip = true,
  motion = true,
  title = "Comparison Area Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry,
  onActiveDatumChange,
  className,
}: ComparisonAreaProps<TData>) {
  const isReducedMotion = useChartReducedMotion()

  // Diagnostic warning for duplicate keys
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (series.primary.key === series.reference.key) {
        console.warn(
          `[Plotcn ComparisonArea]: Duplicate role key detected: primary and reference both use "${series.primary.key}". Comparison requires two distinct series keys.`
        )
      }
    }
  }, [series.primary.key, series.reference.key])

  // Resolved colors: explicit prop > series config > default token
  const resolvedPrimaryColor = primaryColor || series.primary.color || "var(--chart-1)"
  const resolvedReferenceColor = referenceColor || series.reference.color || "var(--chart-2)"
  const resolvedPrimaryOpacity = typeof primaryFillOpacity === "number" ? primaryFillOpacity : fillOpacity
  const resolvedReferenceOpacity =
    typeof referenceFillOpacity === "number" ? referenceFillOpacity : Math.max(0.08, resolvedPrimaryOpacity * 0.5)

  // Interactive legend visibility state
  const [visibleSeries, setVisibleSeries] = React.useState<Set<"primary" | "reference">>(
    new Set(["primary", "reference"])
  )

  const handleToggleRole = React.useCallback((role: "primary" | "reference") => {
    setVisibleSeries((prev) => {
      const next = new Set(prev)
      if (next.has(role)) {
        next.delete(role)
      } else {
        next.add(role)
      }
      return next
    })
  }, [])

  const handleRestoreRoles = React.useCallback(() => {
    setVisibleSeries(new Set(["primary", "reference"]))
  }, [])

  // Normalized dataset
  const normalizedData = React.useMemo(
    () => normalizeComparisonData(data, xKey, series.primary.key, series.reference.key),
    [data, xKey, series.primary.key, series.reference.key]
  )

  // Shared honest Y-domain
  const sharedDomain = React.useMemo(
    () => calculateSharedDomain(normalizedData, series.primary.key, series.reference.key, domain, visibleSeries),
    [normalizedData, series.primary.key, series.reference.key, domain, visibleSeries]
  )

  // Locked inspection state
  const [lockedIndex, setLockedIndex] = React.useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const activeIndex = lockedIndex ?? hoverIndex

  const activeDatum = React.useMemo(() => {
    if (activeIndex === null || activeIndex < 0 || activeIndex >= normalizedData.length) {
      return null
    }
    return (data[activeIndex] as TData) || null
  }, [activeIndex, normalizedData.length, data])

  React.useEffect(() => {
    onActiveDatumChange?.(activeDatum)
  }, [activeDatum, onActiveDatumChange])

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!normalizedData.length) return
      const maxIdx = normalizedData.length - 1
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
          if (lockedIndex !== null) setLockedIndex(null)
          else setLockedIndex(current)
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
    [normalizedData.length, activeIndex, lockedIndex, lockableTooltip]
  )

  const handleChartClick = React.useCallback(
    (state: any) => {
      if (!lockableTooltip) return
      if (state && state.activeTooltipIndex !== undefined) {
        const clicked = Number(state.activeTooltipIndex)
        setLockedIndex((prev) => (prev === clicked ? null : clicked))
      } else if (lockedIndex !== null) {
        setLockedIndex(null)
      }
    },
    [lockableTooltip, lockedIndex]
  )

  /* ------------------------------------------------------------------------ */
  /*  Early Return States                                                     */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <figure
        role="region"
        aria-label={title || "Comparison area loading"}
        className={cn("plotcn-comparison-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartLoadingState description="Loading comparison data..." />
      </figure>
    )
  }

  if (unavailable) {
    return (
      <figure
        role="region"
        aria-label={title || "Comparison area unavailable"}
        className={cn("plotcn-comparison-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartUnavailableState description={typeof unavailable === "string" ? unavailable : "Comparison data is currently unavailable."} />
      </figure>
    )
  }

  if (error) {
    const errorDescription = error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred."
    return (
      <figure
        role="region"
        aria-label={title || "Comparison area error"}
        className={cn("plotcn-comparison-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartErrorState
          title="Comparison Area Configuration Error"
          description={errorDescription}
          onRetry={onRetry}
        />
      </figure>
    )
  }

  if (!normalizedData || normalizedData.length === 0) {
    return (
      <figure
        role="region"
        aria-label={title || "Comparison area empty"}
        className={cn("plotcn-comparison-area relative w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4", className)}
        style={{ height, minHeight: typeof height === "number" ? height : 320 }}
      >
        <ChartEmptyState description="No comparison observations recorded." />
      </figure>
    )
  }

  const isCompact = typeof height === "number" ? height <= 260 : false
  const allHidden = visibleSeries.size === 0

  return (
    <figure
      role="region"
      aria-label={title}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "plotcn-comparison-area relative flex flex-col w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus)]",
        className
      )}
      style={{ height, minHeight: typeof height === "number" ? height : 320 }}
    >
      {/* Live Screen Reader Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeDatum
          ? `${activeDatum[xKey]}. ${series.primary.label}: ${
              activeDatum[series.primary.key] !== null ? valueFormatter(activeDatum[series.primary.key] as number) : "Unavailable"
            }, ${series.reference.label}: ${
              activeDatum[series.reference.key] !== null ? valueFormatter(activeDatum[series.reference.key] as number) : "Unavailable"
            }.`
          : `${title}. Comparing ${series.primary.label} against ${series.reference.label} across ${normalizedData.length} observations.`}
      </div>

      {/* Semantic off-screen data table for accessibility (100% canvas height preserved for SVG) */}
      <div className="sr-only">
        <table>
          <caption>{title} - Data Table</caption>
          <thead>
            <tr>
              <th scope="col">{xKey}</th>
              <th scope="col">{series.primary.label}</th>
              <th scope="col">{series.reference.label}</th>
              {showDelta && <th scope="col">Difference</th>}
            </tr>
          </thead>
          <tbody>
            {normalizedData.map((row, idx) => {
              const pVal = row[series.primary.key]
              const rVal = row[series.reference.key]
              const hasP = isFiniteNumber(pVal)
              const hasR = isFiniteNumber(rVal)
              const deltaVal = hasP && hasR ? pVal - rVal : null

              return (
                <tr key={idx}>
                  <td>{String(row[xKey] ?? "")}</td>
                  <td>{hasP ? valueFormatter(pVal) : "Unavailable"}</td>
                  <td>{hasR ? valueFormatter(rVal) : "Unavailable"}</td>
                  {showDelta && (
                    <td>
                      {deltaVal !== null
                        ? `${deltaVal > 0 ? "+" : deltaVal < 0 ? "−" : ""}${valueFormatter(Math.abs(deltaVal))}`
                        : "Unavailable"}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* All-series-hidden recovery state */}
      {allHidden ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center p-6 gap-3">
          <p className="text-sm font-medium text-muted-foreground">All comparison series are hidden.</p>
          <button
            type="button"
            onClick={handleRestoreRoles}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Restore comparison series
          </button>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ChartContainer className="h-full w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
              initialDimension={{ width: 600, height: typeof height === "number" ? height : 320 }}
            >
              <AreaChart
                data={normalizedData}
                onClick={handleChartClick}
                onMouseMove={(e: any) => {
                  if (lockedIndex === null && e?.activeTooltipIndex !== undefined) {
                    setHoverIndex(Number(e.activeTooltipIndex))
                  }
                }}
                onMouseLeave={() => {
                  if (lockedIndex === null) setHoverIndex(null)
                }}
                margin={{ top: 12, right: 16, bottom: 8, left: 4 }}
              >
                {showGrid && (
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--chart-grid)"
                    vertical={false}
                    strokeOpacity={0.7}
                  />
                )}

                {showXAxis && (
                  <XAxis
                    dataKey={xKey as any}
                    stroke="var(--chart-axis, #a1a1aa)"
                    tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: isCompact ? 10 : 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--chart-axis-line, rgba(255,255,255,0.12))", strokeOpacity: 0.5 }}
                    tickFormatter={xFormatter}
                  />
                )}

                {showYAxis && (
                  <YAxis
                    domain={sharedDomain as any}
                    stroke="var(--chart-axis, #a1a1aa)"
                    tick={{ fill: "var(--chart-axis, #a1a1aa)", fontSize: isCompact ? 10 : 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={valueFormatter}
                    width={isCompact ? 40 : 50}
                  />
                )}

              <Tooltip
                isAnimationActive={false}
                cursor={{
                  stroke: lockedIndex !== null ? selectionColor : "var(--chart-crosshair)",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
                content={
                  <ComparisonAreaTooltipContent
                    primaryKey={series.primary.key}
                    referenceKey={series.reference.key}
                    primaryLabel={series.primary.label}
                    referenceLabel={series.reference.label}
                    primaryColor={resolvedPrimaryColor}
                    referenceColor={resolvedReferenceColor}
                    valueFormatter={valueFormatter}
                    showDelta={showDelta}
                    deltaType={deltaType}
                    invertDelta={invertDelta}
                    isCompact={isCompact}
                    isLocked={lockedIndex !== null}
                    onUnlock={() => setLockedIndex(null)}
                  />
                }
              />

              {/* 1. Reference Area (rendered FIRST, sits underneath with dashed stroke and quieter fill) */}
              <Area
                type={curve}
                dataKey={series.reference.key as any}
                name={series.reference.label}
                stroke={resolvedReferenceColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill={resolvedReferenceColor}
                fillOpacity={resolvedReferenceOpacity}
                connectNulls={missingValuePolicy === "connect"}
                isAnimationActive={motion !== false && !isReducedMotion}
                animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 350}
                hide={!visibleSeries.has("reference")}
                dot={false}
                activeDot={{
                  r: 4.5,
                  fill: resolvedReferenceColor,
                  stroke: "var(--background, #09090b)",
                  strokeWidth: 2,
                }}
              />

              {/* 2. Primary Area (rendered SECOND, sits on top with solid boundary and stronger fill) */}
              <Area
                type={curve}
                dataKey={series.primary.key as any}
                name={series.primary.label}
                stroke={resolvedPrimaryColor}
                strokeWidth={2}
                fill={resolvedPrimaryColor}
                fillOpacity={resolvedPrimaryOpacity}
                connectNulls={missingValuePolicy === "connect"}
                isAnimationActive={motion !== false && !isReducedMotion}
                animationDuration={typeof motion === "object" && motion.duration ? motion.duration : 350}
                hide={!visibleSeries.has("primary")}
                dot={false}
                activeDot={{
                  r: 5.5,
                  fill: resolvedPrimaryColor,
                  stroke: "var(--background, #09090b)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      )}

      {/* Series Legend */}
      {showLegend && (
        <ComparisonAreaLegend
          primaryLabel={series.primary.label}
          referenceLabel={series.reference.label}
          primaryColor={resolvedPrimaryColor}
          referenceColor={resolvedReferenceColor}
          visibleSeries={visibleSeries}
          onToggle={handleToggleRole}
          interactive={interactiveLegend}
          isCompact={isCompact}
        />
      )}
    </figure>
  )
}
