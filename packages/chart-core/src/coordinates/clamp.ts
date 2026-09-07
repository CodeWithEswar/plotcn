import type { Point } from "../types/coordinates"
import type { Bounds } from "../types/dimensions"

/**
 * Clamps a number between [min, max].
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Clamps a Point inside a geometric Bounds rectangle.
 */
export function clampPoint(point: Point, bounds: Bounds): Point {
  return {
    x: clampNumber(point.x, bounds.x, bounds.x + bounds.width),
    y: clampNumber(point.y, bounds.y, bounds.y + bounds.height),
  }
}
