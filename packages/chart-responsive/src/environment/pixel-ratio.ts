/**
 * Resolves effective device pixel ratio with a practical cap to prevent
 * excessive canvas memory allocations on ultra-high-density mobile screens.
 * Section 7.55 & 7.56.
 */
export function resolveEffectiveDpr(
  maxDpr = 2,
  devicePixelRatio?: number
): number {
  if (devicePixelRatio !== undefined) {
    return Math.max(1, Math.min(devicePixelRatio, maxDpr))
  }

  if (typeof window === "undefined") {
    return 1
  }

  const rawDpr = window.devicePixelRatio || 1
  return Math.max(1, Math.min(rawDpr, maxDpr))
}
