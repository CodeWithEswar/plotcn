import type { Point } from "../types/coordinates"
import type { Bounds } from "../types/dimensions"

/**
 * Checks whether a 2D Point is inside geometric Bounds.
 * Renderer-independent hit-testing (SVG, Canvas, HTML overlays).
 */
export function isPointInsideBounds(point: Point, bounds: Bounds): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  )
}

/**
 * Alias for isPointInsideBounds.
 */
export const isPointInsideRect = isPointInsideBounds

/**
 * Checks whether two Bounds rectangles intersect.
 */
export function rectIntersectsRect(r1: Bounds, r2: Bounds): boolean {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  )
}
