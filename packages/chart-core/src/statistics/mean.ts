import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "../data/predicates"

/**
 * Calculates arithmetic mean (average) of a series, or null if empty.
 */
export function calculateMean<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): number | null {
  if (!data || data.length === 0) return null

  let sum = 0
  let count = 0

  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      sum += val
      count++
    }
  }

  return count > 0 ? sum / count : null
}

/**
 * Calculates median of a series, or null if empty.
 * Guarantees immutability by copying input array before sorting.
 */
export function calculateMedian<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): number | null {
  if (!data || data.length === 0) return null

  const values: number[] = []
  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      values.push(val)
    }
  }

  if (values.length === 0) return null

  values.sort((a, b) => a - b)
  const mid = Math.floor(values.length / 2)

  if (values.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2
  }
  return values[mid]
}
