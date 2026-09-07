import type { Point, PolarPoint } from "../types/coordinates"

const ORIGIN: Point = Object.freeze({ x: 0, y: 0 })

/**
 * Converts a 2D Cartesian point into polar coordinates (angle in radians, radius).
 */
export function cartesianToPolar(point: Point, center: Point = ORIGIN): PolarPoint {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const radius = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  return { angle, radius }
}
