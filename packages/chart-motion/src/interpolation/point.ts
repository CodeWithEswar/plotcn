import { interpolateNumber } from "./number"

export type Point2D = [number, number]

/**
 * Interpolates between two 2D coordinates.
 * Section 10.18, 10.29.
 */
export function interpolatePoint(p1: Point2D, p2: Point2D, progress: number): Point2D {
  return [
    interpolateNumber(p1[0], p2[0], progress),
    interpolateNumber(p1[1], p2[1], progress),
  ]
}

/**
 * Interpolates between two arrays of 2D coordinates.
 * If arrays have equal length, performs direct 1-to-1 coordinate interpolation.
 * If topologies mismatch, returns target points or safe fallback.
 * Section 10.22, 10.29.
 */
export function interpolatePoints(
  pointsA: readonly Point2D[],
  pointsB: readonly Point2D[],
  progress: number
): Point2D[] {
  const t = Math.max(0, Math.min(1, progress))
  if (t >= 1) return [...pointsB]
  if (t <= 0) return [...pointsA]

  if (pointsA.length !== pointsB.length) {
    // Topological mismatch fallback: switch at midpoint or resample
    return t < 0.5 ? [...pointsA] : [...pointsB]
  }

  return pointsA.map((pt, i) => interpolatePoint(pt, pointsB[i], t))
}
