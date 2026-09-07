import type { TooltipAnchor } from "../types/interaction"

export interface TooltipSize {
  width: number
  height: number
}

export interface ContainerBounds {
  width: number
  height: number
}

export interface TooltipPositionOptions {
  offset?: { x: number; y: number }
  padding?: number
  preferredPlacement?: "top" | "bottom" | "left" | "right"
  compact?: boolean
}

export interface ResolvedTooltipPosition {
  x: number
  y: number
  placement: "top" | "bottom" | "left" | "right" | "anchored"
  isFlippedX: boolean
  isFlippedY: boolean
}

/**
 * Calculates collision-aware, viewport-safe coordinates for chart tooltips.
 * Handles horizontal and vertical flips, safe clamping, and compact anchored mode.
 * Section 8.9, 8.10, 8.11, 8.14.
 */
export function calculateTooltipPosition(
  anchor: TooltipAnchor,
  tooltipSize: TooltipSize,
  containerBounds: ContainerBounds,
  options: TooltipPositionOptions = {}
): ResolvedTooltipPosition {
  const {
    offset = { x: 12, y: 12 },
    padding = 8,
    preferredPlacement = "right",
    compact = false,
  } = options

  // Compact mode: anchor tooltip to fixed header region to avoid obscuring chart data (Section 8.14)
  if (compact || containerBounds.width < 360) {
    return {
      x: padding,
      y: padding,
      placement: "anchored",
      isFlippedX: false,
      isFlippedY: false,
    }
  }

  let x = anchor.x + offset.x
  let y = anchor.y - tooltipSize.height / 2
  let isFlippedX = false
  let isFlippedY = false
  let placement: ResolvedTooltipPosition["placement"] = preferredPlacement

  // 1. Horizontal positioning & collision flip
  if (preferredPlacement === "right") {
    if (x + tooltipSize.width + padding > containerBounds.width) {
      // Flip left
      x = anchor.x - tooltipSize.width - offset.x
      isFlippedX = true
      placement = "left"
    }
  } else if (preferredPlacement === "left") {
    x = anchor.x - tooltipSize.width - offset.x
    if (x < padding) {
      // Flip right
      x = anchor.x + offset.x
      isFlippedX = true
      placement = "right"
    }
  }

  // 2. Vertical positioning & collision flip
  if (preferredPlacement === "top") {
    y = anchor.y - tooltipSize.height - offset.y
    if (y < padding) {
      // Flip bottom
      y = anchor.y + offset.y
      isFlippedY = true
      placement = "bottom"
    }
  } else if (preferredPlacement === "bottom") {
    y = anchor.y + offset.y
    if (y + tooltipSize.height + padding > containerBounds.height) {
      // Flip top
      y = anchor.y - tooltipSize.height - offset.y
      isFlippedY = true
      placement = "top"
    }
  }

  // 3. Clamping to container boundaries (Section 8.10 & 8.11)
  const maxX = Math.max(padding, containerBounds.width - tooltipSize.width - padding)
  const maxY = Math.max(padding, containerBounds.height - tooltipSize.height - padding)

  x = Math.max(padding, Math.min(x, maxX))
  y = Math.max(padding, Math.min(y, maxY))

  return {
    x: Math.round(x),
    y: Math.round(y),
    placement,
    isFlippedX,
    isFlippedY,
  }
}
