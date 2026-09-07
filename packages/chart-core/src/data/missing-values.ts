import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "./finite"
import { isDefined } from "./predicates"

/**
 * Explicit handling policy for missing observations.
 * Section 12.28 - 12.30.
 */
export type MissingValuePolicy = "gap" | "connect" | "zero" | "reject"

export interface ObservationPartition<TDatum> {
  valid: readonly TDatum[]
  missing: readonly TDatum[]
  invalid: readonly TDatum[]
}

/**
 * Partitions observations into valid, missing, and invalid subsets.
 * Preserves strict distinction between missing (null/undefined) and zero (0).
 * Section 12.28, 12.30, 12.65.
 */
export function partitionObservations<TDatum>(
  data: readonly TDatum[],
  valueAccessor: Accessor<TDatum, unknown>
): ObservationPartition<TDatum> {
  const valid: TDatum[] = []
  const missing: TDatum[] = []
  const invalid: TDatum[] = []

  for (let i = 0; i < data.length; i++) {
    const datum = data[i]

    if (!isDefined(datum)) {
      missing.push(datum)
      continue
    }

    const val = valueAccessor(datum, i)

    if (val === null || val === undefined) {
      missing.push(datum)
      continue
    }

    if (isFiniteNumber(val)) {
      valid.push(datum)
    } else {
      invalid.push(datum)
    }
  }

  return {
    valid: Object.freeze(valid),
    missing: Object.freeze(missing),
    invalid: Object.freeze(invalid),
  }
}
