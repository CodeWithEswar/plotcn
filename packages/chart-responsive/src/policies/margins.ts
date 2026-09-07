import type { MarginOptions } from "../types"

export interface ResolvedMargins {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Resolves adaptive chart margins based on container breakpoint, axis titles,
 * legend placement, and compact layout rules.
 * Section 7.17 & 7.18.
 */
export function resolveResponsiveMargins(options: MarginOptions): ResolvedMargins {
  const {
    breakpoint,
    isCompact = breakpoint === "xs" || breakpoint === "sm",
    hasXAxisTitle = false,
    hasYAxisTitle = false,
    hasLegend = false,
    legendPosition = "bottom",
    margins: overrides = {},
  } = options

  // Baseline margins scaled by breakpoint
  const baseMargins: Record<string, ResolvedMargins> = {
    xs: { top: 12, right: 12, bottom: 24, left: 32 },
    sm: { top: 16, right: 16, bottom: 28, left: 36 },
    md: { top: 20, right: 20, bottom: 32, left: 44 },
    lg: { top: 24, right: 24, bottom: 36, left: 48 },
    xl: { top: 24, right: 24, bottom: 40, left: 52 },
  }

  const base = { ...(baseMargins[breakpoint] || baseMargins.md) }

  // Compact mode reduces outer whitespace while guaranteeing labels never clip (Section 7.18)
  if (isCompact) {
    base.top = Math.max(8, base.top - 4)
    base.right = Math.max(8, base.right - 4)
    base.bottom = Math.max(20, base.bottom - 4)
    base.left = Math.max(28, base.left - 4) // minimum 28px to prevent number clipping
  }

  // Allocate extra space for axis titles if present
  if (hasYAxisTitle) {
    base.left += isCompact ? 14 : 20
  }
  if (hasXAxisTitle) {
    base.bottom += isCompact ? 14 : 18
  }

  // Allocate space for top/bottom legends if rendered inside margins
  if (hasLegend) {
    if (legendPosition === "bottom") {
      base.bottom += isCompact ? 20 : 28
    } else if (legendPosition === "top") {
      base.top += isCompact ? 16 : 24
    } else if (legendPosition === "left") {
      base.left += 60
    } else if (legendPosition === "right") {
      base.right += 60
    }
  }

  // Apply developer overrides while maintaining safe non-negative limits
  return {
    top: Math.max(0, overrides.top ?? base.top),
    right: Math.max(0, overrides.right ?? base.right),
    bottom: Math.max(0, overrides.bottom ?? base.bottom),
    left: Math.max(0, overrides.left ?? base.left),
  }
}
