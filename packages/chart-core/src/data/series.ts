import type { Accessor } from "../types/accessors"
import type { SeriesDefinition } from "../types/series"
import { isFiniteNumber } from "./predicates"

/**
 * Creates an immutable engine-neutral SeriesDefinition.
 */
export function createSeries<TDatum>(
  id: string,
  label: string,
  valueAccessor: Accessor<TDatum, number>
): SeriesDefinition<TDatum> {
  return Object.freeze({
    id,
    label,
    value: valueAccessor,
  })
}

/**
 * Extracts a numeric array for a given series from data, filtering non-finite values.
 */
export function extractSeriesValues<TDatum>(
  data: readonly TDatum[],
  series: SeriesDefinition<TDatum>
): readonly number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    const val = series.value(data[i], i)
    if (isFiniteNumber(val)) {
      result.push(val)
    }
  }
  return Object.freeze(result)
}
