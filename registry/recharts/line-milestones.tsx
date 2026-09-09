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

export interface Milestone<XValue = string | number> {
  /**
   * Stable, unique milestone identifier.
   * Never derived from array index.
   */
  id: string

  /**
   * Domain coordinate along the horizontal axis (e.g. date string or number).
   */
  x: XValue

  /**
   * Short, concise title for the milestone (e.g. "V2 launch", "Pricing update").
   */
  label: string

  /**
   * Optional contextual description displayed in the milestone tooltip or detail panel.
   */
  description?: string
}

export interface MilestoneGroup<XValue = string | number> {
  x: XValue
  milestones: Milestone<XValue>[]
  count: number
  primaryMilestone: Milestone<XValue>
}

export interface ResolvedMilestoneGroup<XValue = string | number> extends MilestoneGroup<XValue> {
  showLabel: boolean
  lane: 0 | 1
  displayLabel: string
}

export interface MilestoneSeriesConfig<TData extends Record<string, unknown> = Record<string, unknown>> {
  key?: keyof TData & string
  label?: string
  valueFormatter?: (value: number) => string
  color?: string
}

export interface MilestoneLineProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
> {
  /**
   * Readonly array of observation records. Caller data is never mutated.
   */
  data: readonly TData[]

  /**
   * Key for the horizontal axis domain (e.g. "date", "period", "month").
   */
  xKey: keyof TData & string

  /**
   * Direct key for the numeric series to plot.
   * Fallback to series.key if not provided.
   */
  seriesKey?: keyof TData & string

  /**
   * Optional semantic series descriptor combining key, label, formatter, and color.
   */
  series?: MilestoneSeriesConfig<TData>

  /**
   * Sparse collection of contextual events and milestones.
   * Separated semantically from numeric observation rows.
   */
  milestones?: readonly Milestone<XVal>[]

  /**
   * Human-readable label for the primary metric trend (e.g. "Active users").
   * Default: "Trend" or series.label
   */
  label?: string

  /**
   * Primary stroke color for the trend line. Accepts CSS variables or color values.
   * Default: "var(--chart-1, #3b82f6)"
   */
  color?: string

  /**
   * Container height in pixels or standard CSS dimension strings.
   * Default: 360
   */
  height?: number | string

  /**
   * Explicit Y-axis numeric domain, or "auto" calculation.
   * Default: "auto"
   */
  domain?: [number, number] | ["auto", "auto"]

  /**
   * Interpolation curve type for the quantitative trend line.
   * Default: "monotone"
   */
  curve?: "monotone" | "linear" | "natural" | "step"

  /**
   * Handling of null or undefined values in the series:
   * - "gap": Truthful break in the signal where metric is unrecorded (default).
   * - "connect": Linear bridge across unrecorded points.
   * Default: "gap"
   */
  missingValuePolicy?: "gap" | "connect"

  /**
   * Formatter function for Y-axis ticks and tooltip values.
   */
  valueFormatter?: (value: number) => string

  /**
   * Formatter function for X-axis tick labels.
   */
  xFormatter?: (value: string | number) => string

  /**
   * Whether to display subtle horizontal background reference gridlines.
   * Default: true
   */
  showGrid?: boolean

  /**
   * Whether to display the chart legend.
   * Default: false (single-series milestone chart emphasizes line and events)
   */
  showLegend?: boolean

  /**
   * Whether to display the horizontal category axis.
   * Default: true
   */
  showXAxis?: boolean

  /**
   * Whether to display the vertical value axis.
   * Default: true
   */
  showYAxis?: boolean

  /**
   * Whether to render thin vertical milestone guide lines from the annotation lane into the plot.
   * Default: true
   */
  showMilestoneGuides?: boolean

  /**
   * Stroke and pin color for contextual milestone markers and guides.
   * Default: "var(--chart-milestone-pin, #71717a)"
   */
  milestoneColor?: string

  /**
   * Enable or disable entry and update transitions.
   * Default: true
   */
  motion?: boolean | { duration?: number }

  /**
   * Accessible title announced by screen readers.
   * Default: "Milestone Line Chart"
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
/*  Pure Data Safety, Domain & Collision Algorithms                           */
/* -------------------------------------------------------------------------- */

export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

export interface NormalizedMilestoneDatum {
  __x: string | number
  __value: number | null
  __raw: Record<string, unknown>
}

/**
 * Normalizes observation records safely:
 * - Preserves caller data immutability.
 * - Normalizes non-finite values (NaN, Infinity) safely to null.
 * - Respects missingValuePolicy for data representation.
 */
export function normalizeMilestoneData<TData extends Record<string, unknown>>(
  data: readonly TData[],
  xKey: keyof TData & string,
  seriesKey: string
): NormalizedMilestoneDatum[] {
  if (!Array.isArray(data) || data.length === 0) return []

  return data.map((d) => {
    const rawX = d[xKey]
    const xVal = typeof rawX === "string" || typeof rawX === "number" ? rawX : String(rawX ?? "")
    const rawV = d[seriesKey]
    const finalVal = isFiniteNumber(rawV) ? rawV : null

    return {
      __x: xVal,
      __value: finalVal,
      __raw: d,
    }
  })
}

/**
 * Validates, deduplicates, and filters milestones:
 * - Excludes milestones with missing IDs or empty X coordinates.
 * - Detects duplicate IDs in development environments.
 * - Filters out-of-domain milestones (never clamps to chart borders).
 * - Never mutates caller array or objects.
 */
const warnedMilestoneKeys = new Set<string>()

export function normalizeMilestones<XVal = string | number>(
  milestones: readonly Milestone<XVal>[] | undefined,
  validXDomain: Set<string | number> | null
): Milestone<XVal>[] {
  if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
    return []
  }

  // If the observation dataset is empty, milestones cannot be placed.
  // Omit safely without logging misleading out-of-domain warnings.
  if (validXDomain !== null && validXDomain.size === 0) {
    return []
  }

  const seenIds = new Set<string>()
  const valid: Milestone<XVal>[] = []

  for (const m of milestones) {
    if (!m || typeof m !== "object") continue
    if (!m.id || typeof m.id !== "string") {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[MilestoneLine] Milestone missing stable string ID; skipped.", m)
      }
      continue
    }

    if (seenIds.has(m.id)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[MilestoneLine] Duplicate milestone ID detected: "${m.id}". Each milestone must have a unique ID.`)
      }
      continue
    }
    seenIds.add(m.id)

    if (m.x === undefined || m.x === null || m.x === "") continue

    // Out-of-domain check: if valid domain is provided and does not contain m.x, do NOT clamp; omit.
    if (validXDomain !== null && validXDomain.size > 0) {
      const matchKey = typeof m.x === "string" || typeof m.x === "number" ? m.x : String(m.x)
      if (!validXDomain.has(matchKey)) {
        if (process.env.NODE_ENV !== "production") {
          const warnKey = `${m.id}:${String(m.x)}`
          if (!warnedMilestoneKeys.has(warnKey)) {
            warnedMilestoneKeys.add(warnKey)
            console.warn(`[MilestoneLine] Milestone "${m.label}" (x: ${String(m.x)}) falls outside data domain and will not be rendered.`)
          }
        }
        continue
      }
    }

    valid.push({ ...m })
  }

  return valid
}

/**
 * Groups milestones by X coordinate:
 * - If multiple events occur at the exact same X, they form a single group.
 * - Preserves caller input order within groups.
 */
export function groupMilestonesByX<XVal = string | number>(
  milestones: readonly Milestone<XVal>[]
): MilestoneGroup<XVal>[] {
  if (!milestones || milestones.length === 0) return []

  const groupMap = new Map<string | number, Milestone<XVal>[]>()

  for (const m of milestones) {
    const key = typeof m.x === "string" || typeof m.x === "number" ? m.x : String(m.x)
    const existing = groupMap.get(key)
    if (existing) {
      existing.push(m)
    } else {
      groupMap.set(key, [m])
    }
  }

  const groups: MilestoneGroup<XVal>[] = []
  for (const [x, list] of groupMap.entries()) {
    groups.push({
      x: x as unknown as XVal,
      milestones: list,
      count: list.length,
      primaryMilestone: list[0],
    })
  }

  return groups
}

/**
 * Deterministic label collision resolution:
 * 1. Preserves every event marker position and vertical guide.
 * 2. Checks horizontal spacing between adjacent milestones.
 * 3. Uses 2-lane staggering if helpful; collapses dense secondary text labels to markers only.
 * 4. Never renders overlapping text.
 */
export function resolveMilestoneCollisions<XVal = string | number>(
  groups: readonly MilestoneGroup<XVal>[],
  validXDomainKeys: readonly (string | number)[],
  containerWidth: number = 600
): ResolvedMilestoneGroup<XVal>[] {
  if (!groups || groups.length === 0) return []

  // Create an index map for domain sequence
  const domainIndex = new Map<string | number, number>()
  validXDomainKeys.forEach((k, idx) => domainIndex.set(k, idx))

  // Sort groups by their domain position for collision analysis
  const sorted = [...groups].sort((a, b) => {
    const keyA = typeof a.x === "string" || typeof a.x === "number" ? a.x : String(a.x)
    const keyB = typeof b.x === "string" || typeof b.x === "number" ? b.x : String(b.x)
    const idxA = domainIndex.get(keyA) ?? 0
    const idxB = domainIndex.get(keyB) ?? 0
    return idxA - idxB
  })

  const totalPoints = Math.max(1, validXDomainKeys.length - 1)
  const pxPerUnit = containerWidth / totalPoints

  // Minimum pixel gap required to display adjacent text labels without overlap
  const minLabelGap = 72
  let lastVisiblePx = -9999
  let currentLane: 0 | 1 = 0

  const resolvedMap = new Map<string | number, { showLabel: boolean; lane: 0 | 1 }>()

  for (const g of sorted) {
    const key = typeof g.x === "string" || typeof g.x === "number" ? g.x : String(g.x)
    const idx = domainIndex.get(key) ?? 0
    const currentPx = idx * pxPerUnit

    const distance = currentPx - lastVisiblePx

    // If container is narrow (< 440px) or density is high, prioritize markers with compact labels
    if (containerWidth < 400 && sorted.length > 3) {
      // On narrow mobile, show at most 2 prominent milestone labels; rest are markers
      const isPriority = g === sorted[0] || g === sorted[sorted.length - 1]
      resolvedMap.set(key, { showLabel: isPriority, lane: 0 })
      if (isPriority) lastVisiblePx = currentPx
    } else if (distance >= minLabelGap) {
      resolvedMap.set(key, { showLabel: true, lane: 0 })
      lastVisiblePx = currentPx
      currentLane = 0
    } else if (distance >= minLabelGap / 2) {
      // Modest gap: stagger to lane 1 if previous was lane 0
      const lane: 0 | 1 = currentLane === 0 ? 1 : 0
      resolvedMap.set(key, { showLabel: true, lane })
      lastVisiblePx = currentPx
      currentLane = lane
    } else {
      // Overlap danger: collapse text label, marker remains 100% interactive
      resolvedMap.set(key, { showLabel: false, lane: 0 })
    }
  }

  return groups.map((g) => {
    const key = typeof g.x === "string" || typeof g.x === "number" ? g.x : String(g.x)
    const config = resolvedMap.get(key) ?? { showLabel: true, lane: 0 }
    const rawLabel = g.primaryMilestone.label
    const displayLabel = g.count > 1 ? `${rawLabel} (+${g.count - 1})` : rawLabel

    return {
      ...g,
      showLabel: config.showLabel,
      lane: config.lane,
      displayLabel,
    }
  })
}

/**
 * Calculates a safe Y-axis domain covering observation values:
 * - Single value or constant level expands gracefully.
 * - Empty or missing series handled safely.
 */
export function calculateMilestoneDomain(
  normalizedData: readonly NormalizedMilestoneDatum[],
  propDomain?: [number, number] | ["auto", "auto"]
): [number, number] {
  if (
    propDomain &&
    propDomain[0] !== "auto" &&
    isFiniteNumber(propDomain[0]) &&
    isFiniteNumber(propDomain[1])
  ) {
    return [propDomain[0], propDomain[1]]
  }

  const values: number[] = []
  for (const d of normalizedData) {
    if (d.__value !== null && isFiniteNumber(d.__value)) {
      values.push(d.__value)
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
  const pad = span * 0.1
  return [Math.floor(min - pad), Math.ceil(max + pad)]
}

/**
 * Calculates a factual screen-reader summary:
 * - Never asserts causality (e.g. never claims "launch caused user growth").
 * - Reports observation count and milestone details factually.
 */
export function calculateMilestoneSummary(
  observationCount: number,
  milestones: readonly Milestone<any>[],
  seriesLabel: string
): string {
  if (observationCount === 0) {
    return `Empty ${seriesLabel} milestone chart with no observations recorded.`
  }

  const milestoneCount = milestones.length
  if (milestoneCount === 0) {
    return `Time-series visualization showing ${observationCount} observations for ${seriesLabel} with no milestone events annotated.`
  }

  const labels = milestones
    .slice(0, 4)
    .map((m) => `"${m.label}" at ${String(m.x)}`)
    .join(", ")

  const overflowNote = milestoneCount > 4 ? ` and ${milestoneCount - 4} more` : ""

  return `Time-series visualization showing ${observationCount} observations for ${seriesLabel} with ${milestoneCount} annotated milestone events: ${labels}${overflowNote}. Events indicate contextual moments and do not infer causality.`
}

/* -------------------------------------------------------------------------- */
/*  Milestone SVG Marker & Guide Component                                    */
/* -------------------------------------------------------------------------- */

interface MilestoneMarkerShapeProps {
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  group: MilestoneGroup<any>
  resolved: ResolvedMilestoneGroup<any>
  isActive: boolean
  isHovered: boolean
  onSelect: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
  showGuides: boolean
  milestoneColor?: string
}

function MilestoneMarkerShape({
  x1 = 0,
  y1 = 0,
  y2 = 0,
  group,
  resolved,
  isActive,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
  showGuides = true,
  milestoneColor,
}: MilestoneMarkerShapeProps) {
  const isSelected = isActive || isHovered
  const isGrouped = group.count > 1

  // Top annotation lane vertical coordinate
  // Lane 0 is at y=18, Lane 1 (staggered) is at y=32
  const pinY = resolved.lane === 1 ? 32 : 18
  const bottomY = Math.max(y1, y2)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <g
      className="milestone-marker-group outline-none"
      tabIndex={0}
      role="button"
      aria-label={`Milestone: ${resolved.displayLabel}, at ${String(group.x)}`}
      aria-pressed={isActive}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onKeyDown={handleKeyDown}
      style={{ cursor: "pointer" }}
    >
      {/* Vertical Milestone Guide running through the plot */}
      {showGuides && (
        <line
          x1={x1}
          y1={pinY + 8}
          x2={x1}
          y2={bottomY}
          stroke={milestoneColor ?? "var(--chart-milestone-guide, #a1a1aa)"}
          strokeWidth={isSelected ? 1.5 : 1}
          strokeDasharray={isSelected ? "none" : "3 3"}
          strokeOpacity={isSelected ? 0.75 : 0.35}
          className="transition-all duration-150"
        />
      )}

      {/* Larger hit area for touch/mouse inspection */}
      <circle cx={x1} cy={pinY} r={14} fill="transparent" pointerEvents="all" />

      {/* Primary Milestone Pin */}
      {isGrouped ? (
        // Grouped badge when multiple milestones share the exact same date/X
        <g transform={`translate(${x1}, ${pinY})`}>
          <rect
            x={-12}
            y={-9}
            width={24}
            height={18}
            rx={9}
            fill="var(--chart-background, #09090b)"
            stroke={isSelected ? "var(--chart-focus, #38bdf8)" : (milestoneColor ?? "var(--chart-milestone-pin, #71717a)")}
            strokeWidth={isSelected ? 2 : 1.5}
            className="transition-all duration-150"
          />
          <text
            x={0}
            y={3.5}
            textAnchor="middle"
            fill="var(--chart-foreground, #f43f5e)"
            fontSize={10}
            fontWeight={600}
            fontFamily="monospace"
            pointerEvents="none"
          >
            {group.count}
          </text>
        </g>
      ) : (
        // Standard single-event pin: crisp restrained circle
        <g transform={`translate(${x1}, ${pinY})`}>
          {/* Subtle outer focus ring if active */}
          {isSelected && (
            <circle
              r={7.5}
              fill="none"
              stroke="var(--chart-focus, #38bdf8)"
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          )}
          <circle
            r={4.5}
            fill="var(--chart-background, #09090b)"
            stroke={isSelected ? "var(--chart-focus, #38bdf8)" : (milestoneColor ?? "var(--chart-milestone-pin, #a1a1aa)")}
            strokeWidth={isSelected ? 2 : 1.5}
            className="transition-all duration-150"
          />
        </g>
      )}

      {/* Persistent Text Label in Annotation Lane (when collision policy permits) */}
      {resolved.showLabel && (
        <text
          x={x1}
          y={pinY - 8}
          textAnchor="middle"
          fill={isSelected ? "var(--chart-foreground, #fafafa)" : "var(--chart-muted, #a1a1aa)"}
          fontSize={10.5}
          fontWeight={isSelected ? 600 : 500}
          fontFamily="system-ui, -apple-system, sans-serif"
          className="transition-colors duration-150 select-none"
          pointerEvents="none"
        >
          {resolved.displayLabel.length > 20
            ? `${resolved.displayLabel.slice(0, 18)}…`
            : resolved.displayLabel}
        </text>
      )}
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/*  Synchronized Milestone & Series Tooltip                                   */
/* -------------------------------------------------------------------------- */

interface MilestoneTooltipContentProps {
  active?: boolean
  payload?: readonly { dataKey?: string | number; value?: any; payload?: any; [key: string]: any }[]
  label?: React.ReactNode
  primaryColor: string
  seriesLabel: string
  valueFormatter?: (value: number) => string
  activeMilestoneGroup?: MilestoneGroup<any> | null
  onClearMilestone?: () => void
}

function MilestoneTooltipContent({
  active,
  payload,
  label: _label,
  primaryColor,
  seriesLabel,
  valueFormatter,
  activeMilestoneGroup,
}: MilestoneTooltipContentProps) {
  const fmt = valueFormatter ?? ((n: number) => n.toLocaleString())

  // Milestone direct inspection takes precedence when milestone is hovered/selected
  if (activeMilestoneGroup) {
    const isGrouped = activeMilestoneGroup.count > 1
    const xCoord = String(activeMilestoneGroup.x)

    // Check if an observation exists at this X to display metric context
    const matchingDatum = payload?.[0]?.payload as NormalizedMilestoneDatum | undefined
    const hasMatchingDatum = matchingDatum && matchingDatum.__x === activeMilestoneGroup.x
    const metricVal = hasMatchingDatum ? matchingDatum.__value : null

    return (
      <div className="z-50 min-w-[210px] max-w-[280px] rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-3 text-xs shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between gap-2 border-b border-[var(--chart-tooltip-border)] pb-1.5">
          <span className="font-mono text-[11px] font-semibold text-[var(--chart-tooltip-muted)]">
            {xCoord}
          </span>
          <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-500/20">
            {isGrouped ? `${activeMilestoneGroup.count} Milestones` : "Milestone"}
          </span>
        </div>

        <div className="space-y-2">
          {activeMilestoneGroup.milestones.map((m, idx) => (
            <div key={m.id || idx} className="space-y-0.5">
              <div className="font-medium text-[var(--chart-tooltip-foreground)]">
                {isGrouped && <span className="mr-1 text-sky-400 font-bold">•</span>}
                {m.label}
              </div>
              {m.description && (
                <div className="text-[11px] text-[var(--chart-tooltip-muted)] leading-relaxed">
                  {m.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Metric value context at milestone X (if recorded) */}
        <div className="mt-2.5 border-t border-[var(--chart-tooltip-border)] pt-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[var(--chart-tooltip-muted)]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span>{seriesLabel}</span>
          </div>
          <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)]">
            {metricVal !== null ? fmt(metricVal) : "—"}
          </span>
        </div>
      </div>
    )
  }

  // Standard nearest-X observation tooltip
  if (!active || !payload || payload.length === 0) return null

  const datum = payload[0]?.payload as NormalizedMilestoneDatum | undefined
  if (!datum) return null

  const val = datum.__value
  const hasValue = val !== null

  return (
    <div className="z-50 min-w-[180px] rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-2.5 text-xs shadow-md backdrop-blur-md">
      <div className="mb-1.5 font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
        {datum.__x}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="font-medium text-[var(--chart-tooltip-foreground)]">
            {seriesLabel}
          </span>
        </div>
        <span className="font-mono font-semibold text-[var(--chart-tooltip-foreground)]">
          {hasValue ? fmt(val) : "—"}
        </span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main Component: MilestoneLine                                             */
/* -------------------------------------------------------------------------- */

export function MilestoneLine<
  TData extends Record<string, unknown> = Record<string, unknown>,
  XVal extends string | number = string | number
>({
  data,
  xKey,
  seriesKey: propSeriesKey,
  series,
  milestones = [],
  label: propLabel,
  color: propColor,
  height = 360,
  domain,
  curve = "monotone",
  missingValuePolicy = "gap",
  valueFormatter,
  xFormatter,
  showGrid = true,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showMilestoneGuides = true,
  milestoneColor,
  motion = true,
  title = "Milestone Line Chart",
  description,
  loading = false,
  error = null,
  unavailable = false,
  onRetry: _onRetry,
  emptyContent,
  errorContent,
  loadingContent,
  className,
}: MilestoneLineProps<TData, XVal>) {
  const reducedMotion = useChartReducedMotion()
  const containerId = React.useId().replace(/[:]/g, "")
  const titleId = `milestone-title-${containerId}`
  const descId = `milestone-desc-${containerId}`
  const summaryId = `milestone-summary-${containerId}`

  // Track active milestone for inspection/locking
  const [activeMilestoneGroup, setActiveMilestoneGroup] = React.useState<MilestoneGroup<XVal> | null>(null)
  const [hoveredMilestoneGroup, setHoveredMilestoneGroup] = React.useState<MilestoneGroup<XVal> | null>(null)
  const [containerWidth, setContainerWidth] = React.useState<number>(600)
  const figureRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = figureRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry?.contentRect?.width && entry.contentRect.width > 0) {
        setContainerWidth(Math.round(entry.contentRect.width))
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Resolve series identity, label, and theme color
  const seriesKey = series?.key ?? propSeriesKey ?? ("users" as keyof TData & string)
  const seriesLabel = series?.label ?? propLabel ?? "Trend"
  const primaryColor = series?.color ?? propColor ?? "var(--chart-1, #3b82f6)"

  // Normalized safe observation data
  const normalizedData = React.useMemo(
    () => normalizeMilestoneData(data, xKey, seriesKey),
    [data, xKey, seriesKey]
  )

  // Valid domain keys for matching & collision calculations
  const validDomainKeys = React.useMemo(
    () => normalizedData.map((d) => d.__x),
    [normalizedData]
  )

  const validDomainSet = React.useMemo(
    () => new Set<string | number>(validDomainKeys),
    [validDomainKeys]
  )

  // Normalized safe milestones (filtered out-of-domain)
  const safeMilestones = React.useMemo(
    () => normalizeMilestones(milestones, validDomainSet),
    [milestones, validDomainSet]
  )

  // Grouped milestones by X
  const milestoneGroups = React.useMemo(
    () => groupMilestonesByX(safeMilestones),
    [safeMilestones]
  )

  // Collision resolution for persistent labels in top lane
  const resolvedGroups = React.useMemo(
    () => resolveMilestoneCollisions(milestoneGroups, validDomainKeys, containerWidth),
    [milestoneGroups, validDomainKeys, containerWidth]
  )

  // Map of resolved groups keyed by X
  const resolvedGroupMap = React.useMemo(() => {
    const map = new Map<string | number, ResolvedMilestoneGroup<XVal>>()
    for (const rg of resolvedGroups) {
      const key = typeof rg.x === "string" || typeof rg.x === "number" ? rg.x : String(rg.x)
      map.set(key, rg)
    }
    return map
  }, [resolvedGroups])

  // Safe calculated domain covering observation levels
  const safeDomain = React.useMemo(
    () => calculateMilestoneDomain(normalizedData, domain),
    [normalizedData, domain]
  )

  // Animation config
  const isAnimated = motion !== false && !reducedMotion
  const animationDuration =
    typeof motion === "object" && motion?.duration !== undefined ? motion.duration * 1000 : 350

  // Screen reader factual accessibility summary
  const factualSummary = React.useMemo(
    () => calculateMilestoneSummary(normalizedData.length, safeMilestones, seriesLabel),
    [normalizedData.length, safeMilestones, seriesLabel]
  )

  // Currently inspected milestone (hover or selected)
  const currentInspectedMilestone = hoveredMilestoneGroup ?? activeMilestoneGroup

  // Handle milestone selection
  const handleSelectMilestone = React.useCallback((group: MilestoneGroup<XVal>) => {
    setActiveMilestoneGroup((prev) => (prev?.x === group.x ? null : group))
  }, [])

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
          title="Unable to load milestone trend"
          description={
            typeof error === "string"
              ? error
              : error?.message || "An unexpected error occurred while loading milestone data."
          }
        />
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)} style={{ height }}>
        <ChartUnavailableState
          title="Milestone metrics unavailable"
          description={
            typeof unavailable === "string"
              ? unavailable
              : "Trend and milestone data are unavailable for this view."
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
          title="Loading milestone visualization…"
          description="Synchronizing time series and event markers"
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
          title="No series data"
          description="Provide ordered time-series observations to visualize trends with milestones."
        />
      </div>
    )
  }

  return (
    <figure
      ref={figureRef}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : summaryId}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setActiveMilestoneGroup(null)
          setHoveredMilestoneGroup(null)
        }
      }}
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
          initialDimension={{ width: 320, height: typeof height === "number" ? height : 360 }}
        >
          <LineChart
            data={normalizedData}
            margin={{
              top: milestoneGroups.length > 0 ? 46 : 16,
              right: 20,
              left: showYAxis ? -16 : 10,
              bottom: showXAxis ? 6 : 6,
            }}
            onClick={() => {
              // Click on background chart plot deselects locked milestone
              setActiveMilestoneGroup(null)
            }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid)"
              />
            )}

            <XAxis
              hide={!showXAxis}
              dataKey="__x"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
              tickFormatter={xFormatter}
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

            <Tooltip
              content={
                <MilestoneTooltipContent
                  primaryColor={primaryColor}
                  seriesLabel={seriesLabel}
                  valueFormatter={valueFormatter}
                  activeMilestoneGroup={currentInspectedMilestone}
                  onClearMilestone={() => {
                    setActiveMilestoneGroup(null)
                    setHoveredMilestoneGroup(null)
                  }}
                />
              }
              cursor={{
                stroke: "var(--chart-crosshair)",
                strokeDasharray: "3 3",
                strokeWidth: 1.2,
              }}
            />

            {showLegend && (
              <Legend
                content={() => (
                  <div className="flex items-center justify-center gap-4 text-xs text-[var(--chart-legend)] pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <span>{seriesLabel}</span>
                    </div>
                    {milestoneGroups.length > 0 && (
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="h-2 w-2 rounded-full border border-zinc-400" />
                        <span>Milestones</span>
                      </div>
                    )}
                  </div>
                )}
              />
            )}

            {/* Render Milestone Guides & Top Annotation Pins */}
            {milestoneGroups.map((group) => {
              const groupKey = typeof group.x === "string" || typeof group.x === "number" ? group.x : String(group.x)
              const resolved = resolvedGroupMap.get(groupKey) ?? {
                ...group,
                showLabel: true,
                lane: 0 as const,
                displayLabel: group.primaryMilestone.label,
              }

              return (
                <RechartsReferenceLine
                  key={`milestone-guide-${groupKey}`}
                  x={group.x as string | number}
                  stroke="var(--chart-milestone-guide, #a1a1aa)"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  ifOverflow="discard"
                  shape={(lineProps: any) => (
                    <MilestoneMarkerShape
                      {...lineProps}
                      group={group}
                      resolved={resolved}
                      isActive={activeMilestoneGroup?.x === group.x}
                      isHovered={hoveredMilestoneGroup?.x === group.x}
                      onSelect={() => handleSelectMilestone(group)}
                      onHoverStart={() => setHoveredMilestoneGroup(group)}
                      onHoverEnd={() => setHoveredMilestoneGroup(null)}
                      showGuides={showMilestoneGuides}
                      milestoneColor={milestoneColor}
                    />
                  )}
                />
              )
            })}

            {/* Primary Quantitative Trend Line */}
            <Line
              type={curve}
              dataKey="__value"
              name={seriesLabel}
              stroke={primaryColor}
              strokeWidth={2}
              dot={
                normalizedData.length === 1
                  ? { r: 4, fill: primaryColor, stroke: "var(--chart-background)", strokeWidth: 1.5 }
                  : false
              }
              activeDot={{
                r: 4.5,
                fill: primaryColor,
                stroke: "var(--chart-background)",
                strokeWidth: 2,
              }}
              connectNulls={missingValuePolicy === "connect"}
              isAnimationActive={isAnimated}
              animationDuration={animationDuration}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Mobile-Friendly Active Milestone Detail Panel */}
      {activeMilestoneGroup && (
        <div className="border-t border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-background)] p-2.5 text-xs sm:hidden">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
            <span>{String(activeMilestoneGroup.x)}</span>
            <button
              type="button"
              onClick={() => setActiveMilestoneGroup(null)}
              className="text-zinc-400 hover:text-zinc-200"
              aria-label="Dismiss milestone detail"
            >
              ✕
            </button>
          </div>
          <div className="mt-1 space-y-1">
            {activeMilestoneGroup.milestones.map((m) => (
              <div key={m.id}>
                <div className="font-semibold text-[var(--chart-tooltip-foreground)]">{m.label}</div>
                {m.description && <div className="text-[11px] text-[var(--chart-tooltip-muted)]">{m.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </figure>
  )
}
