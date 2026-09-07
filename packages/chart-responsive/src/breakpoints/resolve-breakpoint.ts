import { chartBreakpoints, type ChartBreakpoint } from "../types"

/**
 * Resolves a container width (in pixels) to its semantic chart breakpoint.
 * Section 7.12 & 7.13.
 */
export function resolveBreakpoint(width: number): ChartBreakpoint {
  if (width < chartBreakpoints.xs) return "xs"
  if (width < chartBreakpoints.sm) return "sm"
  if (width < chartBreakpoints.md) return "md"
  if (width < chartBreakpoints.lg) return "lg"
  return "xl"
}

/**
 * Determines whether a given width or breakpoint requires compact recomposition.
 * Section 7.15 & 7.16.
 */
export function isCompact(widthOrBreakpoint: number | ChartBreakpoint): boolean {
  if (typeof widthOrBreakpoint === "string") {
    return widthOrBreakpoint === "xs" || widthOrBreakpoint === "sm"
  }
  return widthOrBreakpoint < chartBreakpoints.sm
}
