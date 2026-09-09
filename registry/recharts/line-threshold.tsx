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
  Legend,
  ReferenceLine as RechartsReferenceLine,
  ReferenceArea as RechartsReferenceArea,
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

/* -------------------------------------------------------------------------- */
/*  Type Definitions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Line threshold representing a single horizontal boundary value.
 */
export interface ThresholdBoundary {
  /**
   * Stable, unique threshold identifier. Never derived from array index.
   */
  id: string

  /**
   * Discriminated union discriminant for single-value line boundary.
   */
  kind: "line"

  /**
   * Numeric Y-axis boundary value. Must be a finite number.
   */
  value: number

  /**
   * Human-readable label (e.g. "SLA limit", "Target ceiling", "Minimum quota").
   */
  label: string

  /**
   * Optional threshold-specific stroke color override.
   * Precedence: threshold.color > thresholdColor > theme default.
   */
  color?: string

  /**
   * Optional SVG stroke dash pattern (default: "4 4").
   */
  strokeDasharray?: string
}

/**
 * Region threshold representing a bounded horizontal operating band or range.
 */
export interface ThresholdRegion {
  /**
   * Stable, unique threshold identifier. Never derived from array index.
   */
  id: string

  /**
   * Discriminated union discriminant for range region.
   */
  kind: "region"

  /**
   * Lower boundary of the region. If omitted, extends from domain minimum.
   */
  from?: number

  /**
   * Upper boundary of the region. If omitted, extends to domain maximum.
   */
  to?: number

  /**
   * Human-readable label (e.g. "Target operating band", "Warning zone", "Acceptable range").
   */
  label: string

  /**
   * Optional threshold-specific fill color override.
   */
  color?: string

  /**
   * Optional fill opacity override for this region (e.g. 0.12).
   */
  fillOpacity?: number
}

export type ThresholdDefinition = ThresholdBoundary | ThresholdRegion

export interface ThresholdSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key?: keyof TData & string
  label?: string
  valueFormatter?: (value: number) => string
  color?: string
}

export interface ThresholdLineProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /**
   * Readonly array of observation records. Caller data is never mutated.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. time, date, sprint, index).
   */
  xKey: keyof TData & string

  /**
   * Direct key for the active numeric series to plot.
   * Fallback to series.key if not provided.
   */
  seriesKey?: keyof TData & string

  /**
   * Optional semantic series descriptor combining key, label, formatter, and color.
   */
  series?: ThresholdSeriesConfig<TData>

  /**
   * Human-readable label for the primary metric series.
   * Default: "Signal" or series.label
   */
  label?: string

  /**
   * Readonly array of configured horizontal threshold boundaries or bounded regions.
   */
  thresholds?: readonly ThresholdDefinition[]

  /**
   * Primary stroke color for the continuous signal line.
   * Default: "var(--chart-1, #3b82f6)"
   */
  color?: string

  /**
   * Default fallback color for threshold lines, region fills, and threshold badges.
   * Default: "var(--chart-4, #f59e0b)"
   */
  thresholdColor?: string

  /**
   * Default opacity for threshold region fills (subordinate to primary line).
   * Default: 0.12
   */
  regionOpacity?: number

  /**
   * Color used for persistent locked datum selection point.
   * Default: "var(--chart-selection, #38bdf8)"
   */
  selectionColor?: string

  /**
   * Curve interpolation for primary continuous trend: "linear", "monotone", or "step".
   * Note: Threshold geometry itself is always horizontal.
   * Default: "monotone"
   */
  curve?: "linear" | "monotone" | "step"

  /**
   * Container height in pixels or standard CSS dimension string.
   * Default: 340
   */
  height?: number | string

  /**
   * Explicit Y-axis numeric domain, or "auto" calculation.
   * Default: "auto" (automatically covers both series observations and active thresholds)
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Handling of null or undefined values in the primary series:
   * - "gap": Truthful break in the signal where measurement is unknown (default).
   * - "carry": Persists the last known finite level forward.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "carry"

  /**
   * Formatter function for Y-axis ticks and tooltip values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Formatter function for X-axis tick labels.
   */
  xFormatter?: (value: XVal) => string

  /**
   * Whether to display subtle horizontal background reference gridlines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display the chart legend.
   * Default: false
   */
  showLegend?: boolean

  /**
   * Whether to display the horizontal category axis.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to display the vertical numeric scale.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Optional generic reference lines (distinct from analytical thresholds).
   */
  referenceLines?: readonly {
    value: number
    label?: string
    color?: string
    strokeDasharray?: string
  }[]

  /**
   * Enable or disable entry animation.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title announced by screen readers.
   * Default: "Threshold Line Chart"
   */
  title?: string

  /**
   * Optional long-form description for assistive technologies.
   */
  description?: string

  /**
   * Loading state indicator.
   */
  loading?: boolean

  /**
   * Error state indicator or Error instance.
   */
  error?: Error | string | null

  /**
   * Unavailable state indicator.
   */
  unavailable?: boolean | string

  /**
   * Callback invoked when the user clicks retry in the error state.
   */
  onRetry?: () => void

  /**
   * Custom content overrides for state placeholders.
   */
  emptyContent?: React.ReactNode
  errorContent?: React.ReactNode
  loadingContent?: React.ReactNode

  /**
   * Additional CSS classes applied to the root figure element.
   */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*  Pure Data Safety & Domain Algorithms                                      */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

export interface NormalizedThresholdDatum {
  __x: string | number
  __value: number | null
  __raw: Record<string, unknown>
}

/**
 * Normalizes input data safely:
 * 1. Missing values are preserved as null under "gap" policy (no null-to-zero coercion).
 * 2. Non-finite values (NaN, Infinity) are safely treated as missing.
 * 3. Never mutates caller array or objects.
 */
export function normalizeThresholdData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesKey: string,
  missingValuePolicy: "gap" | "carry" = "gap"
): NormalizedThresholdDatum[] {
  if (!Array.isArray(data) || data.length === 0) return []

  let lastKnownValid: number | null = null

  return data.map((d) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")

    const rawV = d[seriesKey]
    const isDirectFinite = isFiniteNumber(rawV)

    let finalVal: number | null = null

    if (isDirectFinite) {
      finalVal = rawV
      lastKnownValid = rawV
    } else if (missingValuePolicy === "carry" && lastKnownValid !== null) {
      finalVal = lastKnownValid
    } else {
      finalVal = null
      if (missingValuePolicy === "gap") {
        lastKnownValid = null
      }
    }

    return {
      __x: xVal,
      __value: finalVal,
      __raw: d,
    }
  })
}

/**
 * Validates threshold definitions:
 * 1. Ensures unique stable IDs (warns and deduplicates).
 * 2. Validates finite numbers for line thresholds.
 * 3. Validates region bounds (skips invalid if from > to).
 */
export function validateThresholds(
  thresholds: readonly ThresholdDefinition[] | undefined
): ThresholdDefinition[] {
  if (!Array.isArray(thresholds) || thresholds.length === 0) return []

  const seenIds = new Set<string>()
  const valid: ThresholdDefinition[] = []

  for (const t of thresholds) {
    if (!t || typeof t !== "object") continue
    if (!t.id || typeof t.id !== "string") continue

    if (seenIds.has(t.id)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[ThresholdLine] Duplicate threshold ID detected: "${t.id}". Skipping duplicate.`)
      }
      continue
    }
    seenIds.add(t.id)

    if (t.kind === "line") {
      if (!isFiniteNumber(t.value)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[ThresholdLine] Line threshold "${t.id}" has non-finite value: ${t.value}. Skipping.`)
        }
        continue
      }
      valid.push(t)
    } else if (t.kind === "region") {
      const fromFinite = t.from !== undefined ? isFiniteNumber(t.from) : true
      const toFinite = t.to !== undefined ? isFiniteNumber(t.to) : true

      if (!fromFinite || !toFinite) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[ThresholdLine] Region threshold "${t.id}" has non-finite bounds. Skipping.`)
        }
        continue
      }

      if (t.from !== undefined && t.to !== undefined && t.from > t.to) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[ThresholdLine] Invalid region bounds for "${t.id}": from (${t.from}) > to (${t.to}). Skipping.`)
        }
        continue
      }

      valid.push(t)
    }
  }

  return valid
}

/**
 * Calculates a safe Cartesian Y-domain covering both series observations and active thresholds.
 * Safe domain guarantees:
 * 1. If caller provides valid explicit numeric domain [min, max], respects it without modification.
 * 2. Auto domain gathers series values + line values + region from/to values.
 * 3. Handles empty, single-value, and constant data with graceful padding.
 * 4. Handles negative, zero-span, and mixed-sign coordinates.
 */
export function calculateThresholdDomain(
  normalized: readonly NormalizedThresholdDatum[],
  thresholds: readonly ThresholdDefinition[],
  explicitDomain?: [number, number] | ["auto", "auto"] | "auto",
  referenceLines?: readonly { value: number }[]
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

  // Series values
  for (const item of normalized) {
    if (item.__value !== null && Number.isFinite(item.__value)) {
      values.push(item.__value)
    }
  }

  // Threshold values & bounds
  for (const t of thresholds) {
    if (t.kind === "line" && isFiniteNumber(t.value)) {
      values.push(t.value)
    } else if (t.kind === "region") {
      if (t.from !== undefined && isFiniteNumber(t.from)) values.push(t.from)
      if (t.to !== undefined && isFiniteNumber(t.to)) values.push(t.to)
    }
  }

  // Optional reference lines
  if (referenceLines && referenceLines.length > 0) {
    for (const ref of referenceLines) {
      if (isFiniteNumber(ref.value)) values.push(ref.value)
    }
  }

  if (values.length === 0) {
    return [0, 100]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  // Single value or constant level
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
/*  Synchronized Tooltip                                                      */
/* -------------------------------------------------------------------------- */

interface ThresholdTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  primaryColor: string
  seriesLabel: string
  thresholds: readonly ThresholdDefinition[]
  thresholdColor: string
  valueFormatter?: (value: number) => string
}

function ThresholdTooltipContent({
  active,
  payload,
  primaryColor,
  seriesLabel,
  thresholds,
  thresholdColor,
  valueFormatter,
}: ThresholdTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  const datum = payload[0]?.payload as NormalizedThresholdDatum | undefined
  if (!datum) return null

  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
  const val = datum.__value
  const hasValue = val !== null

  // Find relevant threshold context for the active datum
  // 1. Is it inside any configured region?
  let activeRegion: ThresholdRegion | undefined
  if (hasValue) {
    for (const t of thresholds) {
      if (t.kind === "region") {
        const meetsFrom = t.from === undefined || val >= t.from
        const meetsTo = t.to === undefined || val <= t.to
        if (meetsFrom && meetsTo) {
          activeRegion = t
          break
        }
      }
    }
  }

  // 2. Nearest boundary line
  let nearestBoundary: { boundary: ThresholdBoundary; diff: number } | undefined
  if (hasValue) {
    for (const t of thresholds) {
      if (t.kind === "line") {
        const diff = Math.abs(val - t.value)
        if (!nearestBoundary || diff < nearestBoundary.diff) {
          nearestBoundary = { boundary: t, diff }
        }
      }
    }
  }

  return (
    <div className="z-50 min-w-[200px] rounded-xl border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-3 text-xs shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-2 font-mono text-[11px] text-[var(--chart-tooltip-muted)] border-b border-white/[0.06] pb-1.5">
        <span className="font-semibold text-zinc-300">{datum.__x}</span>
        {activeRegion && (
          <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-mono text-sky-400 border border-sky-500/20 truncate max-w-[110px]">
            {activeRegion.label}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Primary Metric Value */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="size-2 rounded-xs shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="font-medium text-[var(--chart-tooltip-foreground)] truncate">
              {seriesLabel}
            </span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)] shrink-0">
            {hasValue ? fmt(val) : "—"}
          </span>
        </div>

        {/* Active Region Bounds if matched */}
        {activeRegion && (
          <div className="border-t border-white/[0.06] pt-1.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-[var(--chart-tooltip-muted)]">
              <span>Operating Region</span>
              <span className="font-mono text-zinc-300">
                {activeRegion.from !== undefined && activeRegion.to !== undefined
                  ? `${fmt(activeRegion.from)} – ${fmt(activeRegion.to)}`
                  : activeRegion.from !== undefined
                  ? `≥ ${fmt(activeRegion.from)}`
                  : `≤ ${fmt(activeRegion.to!)}`}
              </span>
            </div>
          </div>
        )}

        {/* Nearest Threshold Boundary Reference */}
        {nearestBoundary && (
          <div className="border-t border-white/[0.06] pt-1.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between gap-2 text-[var(--chart-tooltip-muted)]">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="size-2 rounded-xs shrink-0"
                  style={{ backgroundColor: nearestBoundary.boundary.color || thresholdColor }}
                />
                <span className="truncate">{nearestBoundary.boundary.label}</span>
              </div>
              <span className="font-mono text-zinc-300 shrink-0">
                {fmt(nearestBoundary.boundary.value)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Custom Threshold Legend                                                   */
/* -------------------------------------------------------------------------- */

interface ThresholdLegendProps {
  seriesLabel: string
  primaryColor: string
  thresholds: readonly ThresholdDefinition[]
  thresholdColor: string
}

function ThresholdLegend({
  seriesLabel,
  primaryColor,
  thresholds,
  thresholdColor,
}: ThresholdLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs">
      {/* Primary Series Line Sample */}
      <div className="flex items-center gap-1.5">
        <span
          className="h-1 w-4 rounded-xs"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="text-[var(--chart-foreground)] font-medium">{seriesLabel}</span>
      </div>

      {/* Threshold Samples */}
      {thresholds.map((t) => {
        const itemColor = t.color || thresholdColor
        if (t.kind === "line") {
          return (
            <div key={t.id} className="flex items-center gap-1.5">
              <span
                className="h-0.5 w-3.5 border-t border-dashed"
                style={{ borderColor: itemColor }}
              />
              <span className="text-zinc-400 font-mono text-[11px]">{t.label}</span>
            </div>
          )
        }
        return (
          <div key={t.id} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-xs"
              style={{ backgroundColor: itemColor, opacity: 0.4 }}
            />
            <span className="text-zinc-400 font-mono text-[11px]">{t.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Component Implementation                                                  */
/* -------------------------------------------------------------------------- */

export function ThresholdLine<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data = [],
  xKey,
  seriesKey: propSeriesKey,
  series,
  label: propLabel,
  thresholds: propThresholds = [],
  color: propColor,
  thresholdColor: propThresholdColor,
  regionOpacity = 0.12,
  selectionColor: _selectionColor,
  curve = "monotone",
  height = 340,
  domain,
  missingValuePolicy = "gap",
  valueFormatter,
  xFormatter,
  showGrid = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  referenceLines = [],
  motion = true,
  title = "Threshold Line Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry: _onRetry,
  emptyContent,
  errorContent,
  loadingContent,
  className,
}: ThresholdLineProps<TData, XVal>) {
  const reducedMotion = useChartReducedMotion()
  const containerId = React.useId().replace(/[:]/g, "")
  const titleId = `threshold-title-${containerId}`
  const descId = `threshold-desc-${containerId}`
  const summaryId = `threshold-summary-${containerId}`

  const [, setActiveIndex] = React.useState<number | null>(null)

  // Resolve series identity, label, and colors
  const seriesKey = series?.key ?? propSeriesKey ?? ("value" as keyof TData & string)
  const seriesLabel = series?.label ?? propLabel ?? "Signal"
  const primaryColor = series?.color ?? propColor ?? "var(--chart-1, #3b82f6)"
  const thresholdColor = propThresholdColor ?? "var(--chart-4, #f59e0b)"

  // Normalized safe series observations
  const normalizedData = React.useMemo(
    () => normalizeThresholdData(data, xKey, seriesKey, missingValuePolicy),
    [data, xKey, seriesKey, missingValuePolicy]
  )

  // Validated and deduplicated threshold definitions
  const validThresholds = React.useMemo(
    () => validateThresholds(propThresholds),
    [propThresholds]
  )

  // Safe calculated domain covering both series levels and threshold bounds
  const safeDomain = React.useMemo(
    () => calculateThresholdDomain(normalizedData, validThresholds, domain, referenceLines),
    [normalizedData, validThresholds, domain, referenceLines]
  )

  // Animation config
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Screen reader factual accessibility summary
  const factualSummary = React.useMemo(() => {
    if (normalizedData.length === 0) return "No observations recorded."

    const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())
    const thresholdSummaries = validThresholds.map((t) => {
      if (t.kind === "line") {
        return `${t.label} at ${fmt(t.value)}`
      }
      if (t.from !== undefined && t.to !== undefined) {
        return `${t.label} from ${fmt(t.from)} to ${fmt(t.to)}`
      }
      if (t.from !== undefined) {
        return `${t.label} starting at ${fmt(t.from)}`
      }
      return `${t.label} up to ${fmt(t.to!)}`
    })

    const thresholdClause =
      thresholdSummaries.length > 0
        ? ` Configured thresholds: ${thresholdSummaries.join("; ")}.`
        : ""

    return `Threshold line visualization depicting ${normalizedData.length} observations.${thresholdClause}`
  }, [normalizedData, validThresholds, valueFormatter])

  if (error) {
    if (errorContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {errorContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartErrorState
          title="Unable to load threshold visualization"
          description={
            typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred while loading trend and thresholds."
          }
        />
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartUnavailableState
          title="Threshold metrics unavailable"
          description={
            typeof unavailable === "string"
              ? unavailable
              : "Trend and threshold metrics are unavailable for this view."
          }
        />
      </div>
    )
  }

  if (loading) {
    if (loadingContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {loadingContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartLoadingState
          title="Loading threshold chart…"
          description="Synchronizing metric trend and boundary regions"
        />
      </div>
    )
  }

  if (data.length === 0 || normalizedData.length === 0) {
    if (emptyContent) {
      return (
        <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
          {emptyContent}
        </div>
      )
    }
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartEmptyState
          title="No data available"
          description="Provide series observations to visualize trend against configured thresholds."
        />
      </div>
    )
  }

  // Keyboard navigation across observations
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (normalizedData.length === 0) return

    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? 0 : Math.min(normalizedData.length - 1, prev + 1)))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveIndex((prev) => (prev === null ? normalizedData.length - 1 : Math.max(0, prev - 1)))
    } else if (e.key === "Home") {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setActiveIndex(normalizedData.length - 1)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setActiveIndex(null)
    }
  }

  return (
    <figure
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : summaryId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setActiveIndex(null)}
      className={cn(
        "group relative flex flex-col w-full min-w-0 max-w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus)] rounded-xl transition-all overflow-hidden",
        className
      )}
      style={{ height }}
    >
      <figcaption className="sr-only">
        <h3 id={titleId}>{title}</h3>
        {description && <p id={descId}>{description}</p>}
        <p id={summaryId}>{factualSummary}</p>
      </figcaption>

      <ChartContainer className="w-full h-full min-w-0 max-w-full overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={0}
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 340 }}
        >
          <LineChart
            data={normalizedData}
            margin={{ top: 16, right: 16, left: showYAxis ? -16 : 10, bottom: showXAxis ? 6 : 6 }}
          >
            {/* 1. Threshold Region Fills (Subordinate bottom layer) */}
            {validThresholds
              .filter((t): t is ThresholdRegion => t.kind === "region")
              .map((reg) => {
                const fill = reg.color || thresholdColor
                const opacity = reg.fillOpacity ?? regionOpacity
                return (
                  <RechartsReferenceArea
                    key={`region-${reg.id}`}
                    y1={reg.from !== undefined ? reg.from : safeDomain[0]}
                    y2={reg.to !== undefined ? reg.to : safeDomain[1]}
                    fill={fill}
                    fillOpacity={opacity}
                    stroke="none"
                  />
                )
              })}

            {/* 2. Cartesian Grid */}
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />
            )}

            {/* 3. Threshold Boundary Lines (Dashed layer) */}
            {validThresholds
              .filter((t): t is ThresholdBoundary => t.kind === "line")
              .map((boundary) => (
                <RechartsReferenceLine
                  key={`line-${boundary.id}`}
                  y={boundary.value}
                  stroke={boundary.color || thresholdColor}
                  strokeDasharray={boundary.strokeDasharray || "4 4"}
                  strokeWidth={1.5}
                  label={
                    boundary.label
                      ? {
                          value: boundary.label,
                          position: "insideTopRight",
                          fill: "var(--chart-muted, #71717a)",
                          fontSize: 10,
                          fontFamily: "ui-monospace, monospace",
                        }
                      : undefined
                  }
                />
              ))}

            {/* Optional Generic Secondary Reference Lines */}
            {referenceLines.map((ref, idx) => (
              <RechartsReferenceLine
                key={`ref-${idx}-${ref.value}`}
                y={ref.value}
                stroke={ref.color ?? "var(--chart-reference, rgba(255, 255, 255, 0.25))"}
                strokeDasharray={ref.strokeDasharray ?? "3 3"}
                strokeWidth={1}
                label={
                  ref.label
                    ? {
                        value: ref.label,
                        position: "insideTopRight",
                        fill: "var(--chart-muted)",
                        fontSize: 10,
                        fontFamily: "ui-monospace, monospace",
                      }
                    : undefined
                }
              />
            ))}

            {/* 4. Axes */}
            <XAxis
              hide={!showXAxis}
              dataKey="__x"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={xFormatter as any}
              dy={6}
            />

            <YAxis
              hide={!showYAxis}
              domain={safeDomain as any}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={valueFormatter ? (v) => valueFormatter(Number(v)) : undefined}
              dx={-4}
            />

            {/* 5. Tooltip Overlay */}
            <Tooltip
              content={
                <ThresholdTooltipContent
                  primaryColor={primaryColor}
                  seriesLabel={seriesLabel}
                  thresholds={validThresholds}
                  thresholdColor={thresholdColor}
                  valueFormatter={valueFormatter}
                />
              }
              cursor={{
                stroke: "var(--chart-crosshair)",
                strokeDasharray: "3 3",
                strokeWidth: 1.2,
              }}
            />

            {/* 6. Legend */}
            {showLegend && (
              <Legend
                content={
                  <ThresholdLegend
                    seriesLabel={seriesLabel}
                    primaryColor={primaryColor}
                    thresholds={validThresholds}
                    thresholdColor={thresholdColor}
                  />
                }
              />
            )}

            {/* 7. Primary Continuous Signal Line (Strong solid top layer) */}
            <Line
              type={curve === "step" ? "stepAfter" : curve}
              dataKey="__value"
              name={seriesLabel}
              stroke={primaryColor}
              strokeWidth={2.2}
              dot={
                normalizedData.length === 1
                  ? { r: 4, fill: primaryColor, stroke: "var(--chart-background)", strokeWidth: 1.5 }
                  : false
              }
              activeDot={{
                r: 5,
                fill: primaryColor,
                stroke: "var(--chart-background)",
                strokeWidth: 2,
              }}
              connectNulls={false}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </figure>
  )
}
