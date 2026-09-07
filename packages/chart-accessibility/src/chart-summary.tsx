import React, { forwardRef, type HTMLAttributes } from "react"
import type {
  FactualSummaryOptions,
  FactualSummaryResult,
  FactualSummaryStats,
} from "./types"

/**
 * Computes factual statistics and conservative human-readable prose from chart data.
 * Adheres strictly to Section 11.8 - 11.10: observable metrics without invented business hype.
 */
export function generateFactualSummary<TData = Record<string, unknown>>(
  options: FactualSummaryOptions<TData>
): FactualSummaryResult {
  const {
    data,
    valueKey = "value",
    labelKey = "label",
    seriesName,
    unit,
    currency,
    locale = "en-US",
    customSummary,
  } = options

  if (!data || data.length === 0) {
    const emptyStats: FactualSummaryStats = {
      count: 0,
      min: { value: 0 },
      max: { value: 0 },
      first: { value: 0 },
      last: { value: 0 },
      range: 0,
      netChange: 0,
      direction: "flat",
    }
    return {
      stats: emptyStats,
      prose: seriesName
        ? `No data available for ${seriesName}.`
        : "No data available for this visualization.",
    }
  }

  const resolveVal = (item: TData): number => {
    if (typeof valueKey === "function") return Number(valueKey(item))
    return Number((item as Record<string, unknown>)[valueKey])
  }

  const resolveLabel = (item: TData): string => {
    if (typeof labelKey === "function") return String(labelKey(item))
    const raw = (item as Record<string, unknown>)[labelKey]
    return raw !== undefined && raw !== null ? String(raw) : ""
  }

  const validEntries = data
    .map((d, index) => ({
      value: resolveVal(d),
      label: resolveLabel(d) || `Index ${index + 1}`,
      raw: d,
    }))
    .filter((e) => Number.isFinite(e.value))

  if (validEntries.length === 0) {
    const emptyStats: FactualSummaryStats = {
      count: 0,
      min: { value: 0 },
      max: { value: 0 },
      first: { value: 0 },
      last: { value: 0 },
      range: 0,
      netChange: 0,
      direction: "flat",
    }
    return {
      stats: emptyStats,
      prose: "No valid numeric observations available.",
    }
  }

  let minEntry = validEntries[0]
  let maxEntry = validEntries[0]

  for (const entry of validEntries) {
    if (entry.value < minEntry.value) minEntry = entry
    if (entry.value > maxEntry.value) maxEntry = entry
  }

  const firstEntry = validEntries[0]
  const lastEntry = validEntries[validEntries.length - 1]
  const range = maxEntry.value - minEntry.value
  const netChange = lastEntry.value - firstEntry.value

  const direction: "increasing" | "decreasing" | "flat" =
    netChange > 0 ? "increasing" : netChange < 0 ? "decreasing" : "flat"

  const stats: FactualSummaryStats = {
    count: validEntries.length,
    min: { value: minEntry.value, label: minEntry.label },
    max: { value: maxEntry.value, label: maxEntry.label },
    first: { value: firstEntry.value, label: firstEntry.label },
    last: { value: lastEntry.value, label: lastEntry.label },
    range,
    netChange,
    direction,
  }

  // Allow custom override
  if (typeof customSummary === "function") {
    return {
      stats,
      prose: customSummary(stats, data),
    }
  }
  if (typeof customSummary === "string" && customSummary.trim().length > 0) {
    return {
      stats,
      prose: customSummary,
    }
  }

  // Number formatter
  const formatter = new Intl.NumberFormat(locale, {
    style: currency ? "currency" : unit ? "unit" : "decimal",
    currency: currency,
    unit: unit,
    maximumFractionDigits: 2,
  })

  const formatVal = (num: number) => formatter.format(num)

  // Construct conservative factual prose (Section 11.8 - 11.10)
  const namePrefix = seriesName ? `${seriesName}: ` : ""
  let prose = ""

  if (validEntries.length === 1) {
    prose = `${namePrefix}Single observation recorded at ${firstEntry.label} with value ${formatVal(firstEntry.value)}.`
  } else {
    const trendText =
      direction === "increasing"
        ? `increased from ${formatVal(firstEntry.value)} at ${firstEntry.label} to ${formatVal(lastEntry.value)} at ${lastEntry.label}`
        : direction === "decreasing"
        ? `decreased from ${formatVal(firstEntry.value)} at ${firstEntry.label} to ${formatVal(lastEntry.value)} at ${lastEntry.label}`
        : `remained flat at ${formatVal(firstEntry.value)} between ${firstEntry.label} and ${lastEntry.label}`

    prose = `${namePrefix}Values ${trendText} across ${validEntries.length} observations. Highest value was ${formatVal(maxEntry.value)} at ${maxEntry.label}; lowest value was ${formatVal(minEntry.value)} at ${minEntry.label}.`
  }

  return {
    stats,
    prose,
  }
}

export interface ChartSummaryComponentProps extends HTMLAttributes<HTMLDivElement> {
  summary?: string
  visuallyHidden?: boolean
}

/**
 * ChartSummary
 * Renders an accessible factual summary region for assistive technologies.
 * Section 11.8, 11.11.
 */
export const ChartSummary = forwardRef<HTMLDivElement, ChartSummaryComponentProps>(
  function ChartSummary(
    { summary, visuallyHidden = true, className, children, ...props },
    ref
  ) {
    if (!summary && !children) return null

    const hiddenClass = visuallyHidden ? "sr-only" : ""

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Chart Insight Summary"
        className={
          className
            ? `plotcn-chart-summary ${hiddenClass} ${className}`
            : `plotcn-chart-summary ${hiddenClass}`
        }
        {...props}
      >
        {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        {children}
      </div>
    )
  }
)
