/**
 * Checks whether the dimension delta exceeds the jitter threshold.
 * Ignores fractional sub-pixel layout oscillations.
 * Section 7.71.
 */
export function shouldUpdateSize(
  current: { width: number; height: number },
  next: { width: number; height: number },
  threshold = 0.5
): boolean {
  const deltaW = Math.abs(current.width - next.width)
  const deltaH = Math.abs(current.height - next.height)
  return deltaW >= threshold || deltaH >= threshold
}

/**
 * Normalizes measured dimensions: non-negative and finite.
 */
export function normalizeDimensions(
  width: number,
  height: number
): { width: number; height: number } {
  return {
    width: Math.max(0, Number.isFinite(width) ? width : 0),
    height: Math.max(0, Number.isFinite(height) ? height : 0),
  }
}
