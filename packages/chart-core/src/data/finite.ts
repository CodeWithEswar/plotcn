/**
 * Pure numeric finiteness guards.
 * Section 12.32, 12.53, 12.133.
 */

/**
 * Returns true if and only if val is a finite number.
 * Explicitly guards against NaN, Infinity, -Infinity, and non-numeric types.
 */
export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val)
}

/**
 * Safely resolves a finite number, returning a fallback if the input is not finite.
 */
export function ensureFinite(val: unknown, fallback = 0): number {
  return isFiniteNumber(val) ? val : fallback
}

/**
 * Throws a descriptive error if a value is not a finite number.
 */
export function assertFinite(val: unknown, fieldName = "value"): asserts val is number {
  if (!isFiniteNumber(val)) {
    throw new TypeError(
      `Plotcn geometry guard: expected ${fieldName} to be a finite number, but received ${String(val)}.`
    )
  }
}
