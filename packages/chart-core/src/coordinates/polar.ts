import type { Point, PolarPoint } from "../types/coordinates"

const ORIGIN: Point = Object.freeze({ x: 0, y: 0 })

/**
 * Converts polar coordinates (angle in radians, radius) into a 2D Cartesian point.
 */
export function polarToCartesian(polar: PolarPoint, center: Point = ORIGIN): Point {
  return {
    x: center.x + polar.radius * Math.cos(polar.angle),
    y: center.y + polar.radius * Math.sin(polar.angle),
  }
}
