/**
 * Pure linear interpolation between values a and b at progress t (0 to 1).
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Calculates normalized progress t (0 to 1) of a value between range [a, b].
 */
export function inverseLerp(a: number, b: number, value: number): number {
  if (a === b) return 0
  return (value - a) / (b - a)
}
