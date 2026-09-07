import type { Accessor, AccessorInput } from "../types/accessors"
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

/**
 * Resolves an AccessorInput (either a property key or a functional accessor)
 * into a single normalized Accessor function (section 6.30 - 6.31).
 */
export function resolveAccessor<TDatum, TValue>(
  accessor: AccessorInput<TDatum, TValue>
): Accessor<TDatum, TValue> {
  if (typeof accessor === "function") {
    return accessor
  }
  return (datum: TDatum) => datum[accessor as keyof TDatum] as unknown as TValue
}
