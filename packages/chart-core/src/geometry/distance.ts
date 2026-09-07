import type { Point } from "../types/coordinates"

/**
 * Calculates straight-line Euclidean distance between two points.
 */
export function euclideanDistance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates grid-based Manhattan distance between two points.
 */
export function manhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}
