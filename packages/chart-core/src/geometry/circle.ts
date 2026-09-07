import type { Point } from "../types/coordinates"
import { euclideanDistance } from "./distance"

/**
 * Checks whether a point is inside a circle defined by center and radius.
 */
export function isPointInsideCircle(point: Point, center: Point, radius: number): boolean {
  if (radius <= 0) return false
  return euclideanDistance(point, center) <= radius
}
