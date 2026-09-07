export interface ResponsiveLegendResult {
  mode: "hidden" | "inline" | "bottom" | "side"
  collapsible: boolean
  scrollable: boolean
}

export interface ResponsiveLegendOptions {
  seriesCount: number
  containerWidth: number
  isCompact?: boolean
  preferredPosition?: "top" | "bottom" | "left" | "right"
  showSingleSeriesLegend?: boolean
}

/**
 * Derives responsive legend layout policy based on series count and available container width.
 * Section 7.31 & 7.32.
 */
export function resolveResponsiveLegend(
  options: ResponsiveLegendOptions
): ResponsiveLegendResult {
  const {
    seriesCount,
    containerWidth,
    isCompact = containerWidth < 480,
    preferredPosition = "bottom",
    showSingleSeriesLegend = false,
  } = options

  // Single series charts generally omit the legend as axis labels/titles describe the metric (Section 7.31)
  if (seriesCount <= 1 && !showSingleSeriesLegend) {
    return {
      mode: "hidden",
      collapsible: false,
      scrollable: false,
    }
  }

  // Compact or narrow containers reflow the legend to bottom with scrolling/collapsible affordances (Section 7.32)
  if (isCompact || containerWidth < 480) {
    return {
      mode: "bottom",
      collapsible: seriesCount > 3,
      scrollable: true,
    }
  }

  // Large desktop containers (>= 960px) with explicit right/left side preference and manageable series count
  if (containerWidth >= 960 && (preferredPosition === "right" || preferredPosition === "left") && seriesCount <= 8) {
    return {
      mode: "side",
      collapsible: false,
      scrollable: seriesCount > 6,
    }
  }

  // Default desktop/tablet layout
  return {
    mode: "bottom",
    collapsible: false,
    scrollable: seriesCount > 6,
  }
}
