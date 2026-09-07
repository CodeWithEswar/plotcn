import type { ChartDimensions, ChartMargins, InnerChartDimensions } from "../types/dimensions"
import { normalizeMargins } from "./margins"

/**
 * Calculates the inner drawable area of a chart given outer dimensions and margins.
 * Guarantees non-negative innerWidth and innerHeight.
 */
export function calculateInnerSize(
  dimensions: ChartDimensions,
  margins: Partial<ChartMargins> | number = {}
): InnerChartDimensions {
  const normMargins = normalizeMargins(margins)
  const innerWidth = Math.max(0, dimensions.width - normMargins.left - normMargins.right)
  const innerHeight = Math.max(0, dimensions.height - normMargins.top - normMargins.bottom)

  return {
    width: Math.max(0, dimensions.width),
    height: Math.max(0, dimensions.height),
    innerWidth,
    innerHeight,
    margins: normMargins,
  }
}
