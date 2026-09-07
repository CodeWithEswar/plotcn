import type { ChartAriaIds } from "./types"

/**
 * Generates stable, deterministic ARIA element identifiers from a base prefix or useId string.
 * Strictly avoids Math.random() or timestamps to guarantee SSR hydration stability.
 * Section 11.7.
 */
export function generateChartAriaIds(baseId: string): ChartAriaIds {
  const sanitized = baseId.replace(/[:]/g, "")
  return {
    rootId: `plotcn-chart-${sanitized}`,
    titleId: `plotcn-chart-title-${sanitized}`,
    descId: `plotcn-chart-desc-${sanitized}`,
    summaryId: `plotcn-chart-summary-${sanitized}`,
    tableId: `plotcn-chart-table-${sanitized}`,
    instructionsId: `plotcn-chart-instructions-${sanitized}`,
  }
}

export interface ChartRegionAriaOptions {
  ids: ChartAriaIds
  hasDescription?: boolean
  hasSummary?: boolean
  hasInstructions?: boolean
  isInteractive?: boolean
  label?: string
}

/**
 * Returns canonical ARIA props for the outer chart container region.
 * Section 11.4, 11.5, 11.23.
 */
export function getChartRegionAriaProps(options: ChartRegionAriaOptions): {
  role: "region"
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-label"?: string
  tabIndex?: number
} {
  const { ids, hasDescription, hasSummary, hasInstructions, isInteractive, label } = options

  const describedByParts: string[] = []
  if (hasDescription) describedByParts.push(ids.descId)
  if (hasSummary) describedByParts.push(ids.summaryId)
  if (hasInstructions) describedByParts.push(ids.instructionsId)

  return {
    role: "region",
    "aria-labelledby": ids.titleId,
    "aria-describedby": describedByParts.length > 0 ? describedByParts.join(" ") : undefined,
    "aria-label": label,
    tabIndex: isInteractive ? 0 : undefined,
  }
}

/**
 * Standard attributes for decorative SVG marks to prevent polluting the assistive technology tree.
 * Section 11.41.
 */
export function getDecorativeSvgProps(): {
  "aria-hidden": "true"
  focusable: "false"
} {
  return {
    "aria-hidden": "true",
    focusable: "false",
  }
}

export type ChartLiveEventType =
  | "filter"
  | "series-toggle"
  | "selection"
  | "error"
  | "sort"
  | "data-refresh"
  | "pointer-move"
  | "animation-frame"
  | "resize"

/**
 * Live region policy filter.
 * Prevents screen-reader announcement spam by allowing only meaningful user-facing state changes.
 * Section 11.31 - 11.33.
 */
export function shouldAnnounceLiveEvent(eventType: ChartLiveEventType): boolean {
  switch (eventType) {
    case "filter":
    case "series-toggle":
    case "selection":
    case "error":
    case "sort":
      return true
    case "pointer-move":
    case "animation-frame":
    case "resize":
    case "data-refresh":
    default:
      return false
  }
}
