/**
 * Pure numeric linear interpolation (lerp).
 * Section 10.51.
 */
export function interpolateNumber(start: number, target: number, progress: number): number {
  if (start === target) return target
  const t = Math.max(0, Math.min(1, progress))
  return start + (target - start) * t
}
