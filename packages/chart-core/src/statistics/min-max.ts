import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "../data/predicates"

/**
 * Calculates minimum value of a series, or null if empty.
 */
export function calculateMin<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): number | null {
  if (!data || data.length === 0) return null

  let min = Infinity
  let found = false

  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val) && val < min) {
      min = val
      found = true
    }
  }

  return found ? min : null
}

/**
 * Calculates maximum value of a series, or null if empty.
 */
export function calculateMax<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): number | null {
  if (!data || data.length === 0) return null

  let max = -Infinity
  let found = false

  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val) && val > max) {
      max = val
      found = true
    }
  }

  return found ? max : null
}
