import type { Accessor } from "../types/accessors"
import { isFiniteNumber } from "./predicates"

/**
 * Creates an accessor function that reads a given key from a datum.
 */
export function propertyAccessor<TDatum, TKey extends keyof TDatum>(
  key: TKey
): Accessor<TDatum, TDatum[TKey]> {
  return (datum: TDatum) => datum[key]
}

/**
 * Creates an accessor guaranteed to return a finite number, with an optional fallback.
 */
export function numericAccessor<TDatum>(
  key: keyof TDatum,
  fallback = 0
): Accessor<TDatum, number> {
  return (datum: TDatum) => {
    const val = datum[key]
    return isFiniteNumber(val) ? val : fallback
  }
}
