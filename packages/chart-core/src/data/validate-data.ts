import type { Accessor } from "../types/accessors"
import type { ValidationIssue, ValidationResult } from "../types/data"
import { isFiniteNumber, isDefined } from "./predicates"

/**
 * Validates a dataset for common visualization issues (NaN, non-finite values, undefined fields).
 * Note: An empty array is a valid application state (empty state), not a validation failure.
 */
export function validateData<TDatum>(
  data: readonly TDatum[],
  valueAccessor?: Accessor<TDatum, unknown>
): ValidationResult {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      issues: [
        {
          code: "NOT_AN_ARRAY",
          message: "Data must be an array.",
        },
      ],
    }
  }

  // Empty data is valid (signals an empty state to components)
  if (data.length === 0) {
    return { valid: true, issues: [] }
  }

  const issues: ValidationIssue[] = []

  if (valueAccessor) {
    for (let i = 0; i < data.length; i++) {
      const datum = data[i]
      if (!isDefined(datum)) {
        issues.push({
          code: "NULL_DATUM",
          message: `Datum at index ${i} is null or undefined.`,
          index: i,
        })
        continue
      }

      const val = valueAccessor(datum, i)
      if (typeof val === "number" && !isFiniteNumber(val)) {
        issues.push({
          code: "NON_FINITE_VALUE",
          message: `Value at index ${i} is not a finite number (${String(val)}).`,
          index: i,
        })
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  }
}
