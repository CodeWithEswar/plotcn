import type { ArcGeometry } from "../types"
import { interpolateNumber } from "./number"

/**
 * Interpolates between two arc geometries.
 * Section 10.24, 10.25.
 */
export function interpolateArc(
  arcA: ArcGeometry,
  arcB: ArcGeometry,
  progress: number
): ArcGeometry {
  const t = Math.max(0, Math.min(1, progress))

  return {
    id: arcB.id || arcA.id,
    startAngle: interpolateNumber(arcA.startAngle, arcB.startAngle, t),
    endAngle: interpolateNumber(arcA.endAngle, arcB.endAngle, t),
    innerRadius: interpolateNumber(arcA.innerRadius, arcB.innerRadius, t),
    outerRadius: interpolateNumber(arcA.outerRadius, arcB.outerRadius, t),
    padAngle:
      arcA.padAngle !== undefined && arcB.padAngle !== undefined
        ? interpolateNumber(arcA.padAngle, arcB.padAngle, t)
        : arcB.padAngle,
  }
}

/**
 * Coordinates interpolation across lists of arc segments using stable segment identity.
 * Section 10.25.
 */
export function interpolateArcList(
  currentArcs: readonly ArcGeometry[],
  targetArcs: readonly ArcGeometry[],
  progress: number,
  options?: { reducedMotion?: boolean }
): ArcGeometry[] {
  const t = Math.max(0, Math.min(1, progress))
  if (options?.reducedMotion || t >= 1) return [...targetArcs]
  if (t <= 0) return [...currentArcs]

  const currentMap = new Map<string, ArcGeometry>()
  for (const a of currentArcs) {
    currentMap.set(a.id, a)
  }

  return targetArcs.map((target) => {
    const existing = currentMap.get(target.id)
    if (!existing) {
      // Entering segment: expands from its own startAngle
      const zeroArc: ArcGeometry = {
        ...target,
        endAngle: target.startAngle,
      }
      return interpolateArc(zeroArc, target, t)
    }

    // Updating segment: smooth transition between states
    return interpolateArc(existing, target, t)
  })
}
