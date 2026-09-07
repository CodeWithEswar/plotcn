import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "../data/predicates"

/**
 * Calculates sum of all finite values in a dataset.
 */
export function calculateSum<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): number {
  if (!data || data.length === 0) return 0

  let sum = 0
  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      sum += val
    }
  }

  return sum
}
