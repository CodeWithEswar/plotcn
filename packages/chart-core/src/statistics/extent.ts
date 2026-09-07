import type { Accessor } from "../types/accessors"
import type { NumericDomain } from "../types/domain"
import { isFiniteNumber } from "../data/predicates"

/**
 * Calculates the min and max [min, max] of a series, returning null if empty or non-finite.
 */
export function calculateExtent<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): NumericDomain | null {
  if (!data || data.length === 0) return null

  let min = Infinity
  let max = -Infinity
  let count = 0

  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      if (val < min) min = val
      if (val > max) max = val
      count++
    }
  }

  if (count === 0) return null
  return [min, max]
}
