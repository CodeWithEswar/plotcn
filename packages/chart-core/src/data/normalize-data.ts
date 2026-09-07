import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "./predicates"

/**
 * Normalizes an array of records into a pure numeric sequence using an accessor.
 * Excludes non-finite or invalid numbers.
 */
export function normalizeNumericSeries<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>
): readonly number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      result.push(val)
    }
  }
  return Object.freeze(result)
}
