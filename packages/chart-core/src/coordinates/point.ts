import type { Point } from "../types/coordinates"

/**
 * Creates an immutable 2D Point.
 */
export function createPoint(x: number, y: number): Point {
  return Object.freeze({ x, y })
}

/**
 * Tests if two 2D points are equal within an optional epsilon tolerance.
 */
export function pointsEqual(p1: Point, p2: Point, tolerance = 1e-6): boolean {
  return Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance
}
