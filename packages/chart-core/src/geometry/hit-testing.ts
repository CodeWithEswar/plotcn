import type { Point } from "../types/coordinates"
import { euclideanDistance } from "./distance"

export interface NearestItemResult<TDatum> {
  item: TDatum
  distance: number
  index: number
}

/**
 * Finds the nearest item to a target 2D coordinate from an array of items.
 * Renderer-independent, works for SVG, Canvas, and HTML overlays.
 */
export function findNearestPoint<TDatum>(
  target: Point,
  items: readonly TDatum[],
  toPoint: (item: TDatum, index: number) => Point,
  maxDistance?: number
): NearestItemResult<TDatum> | null {
  if (!items || items.length === 0) return null

  let nearest: NearestItemResult<TDatum> | null = null
  let minDistance = Infinity

  for (let i = 0; i < items.length; i++) {
    const pt = toPoint(items[i], i)
    const dist = euclideanDistance(target, pt)

    if (dist < minDistance) {
      if (maxDistance === undefined || dist <= maxDistance) {
        minDistance = dist
        nearest = { item: items[i], distance: dist, index: i }
      }
    }
  }

  return nearest
}
