import type { ChartBreakpoint } from "../types"

export type AnnotationDensity = "minimal" | "standard" | "full"

/**
 * Resolves annotation density policy from chart breakpoint.
 * Section 7.33.
 */
export function resolveAnnotationDensity(breakpoint: ChartBreakpoint): AnnotationDensity {
  switch (breakpoint) {
    case "xs":
      return "minimal"
    case "sm":
    case "md":
      return "standard"
    case "lg":
    case "xl":
      return "full"
  }
}
