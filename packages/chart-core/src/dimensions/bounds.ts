import type { Bounds, InnerChartDimensions } from "../types/dimensions"

/**
 * Creates an explicit geometric Bounds rectangle.
 */
export function createBounds(x: number, y: number, width: number, height: number): Bounds {
  return {
    x,
    y,
    width: Math.max(0, width),
    height: Math.max(0, height),
  }
}

/**
 * Derives the drawable inner Bounds rectangle from an InnerChartDimensions layout.
 */
export function innerDimensionsToBounds(inner: InnerChartDimensions): Bounds {
  return {
    x: inner.margins.left,
    y: inner.margins.top,
    width: inner.innerWidth,
    height: inner.innerHeight,
  }
}
