import type { ChartMargins } from "../types/dimensions"

export const DEFAULT_CHART_MARGINS: ChartMargins = Object.freeze({
  top: 16,
  right: 16,
  bottom: 24,
  left: 24,
})

/**
 * Creates a normalized ChartMargins object with fallback to defaults.
 */
export function createMargins(partial?: Partial<ChartMargins>): ChartMargins {
  return {
    top: partial?.top ?? DEFAULT_CHART_MARGINS.top,
    right: partial?.right ?? DEFAULT_CHART_MARGINS.right,
    bottom: partial?.bottom ?? DEFAULT_CHART_MARGINS.bottom,
    left: partial?.left ?? DEFAULT_CHART_MARGINS.left,
  }
}

/**
 * Normalizes either a uniform numeric margin or partial object into standard ChartMargins.
 */
export function normalizeMargins(input: Partial<ChartMargins> | number = DEFAULT_CHART_MARGINS): ChartMargins {
  if (typeof input === "number") {
    const val = Math.max(0, input)
    return { top: val, right: val, bottom: val, left: val }
  }
  return createMargins(input)
}
