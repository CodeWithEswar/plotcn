import type { Accessor } from "../types/accessors"
import type { ValidationIssue, ValidationResult } from "../types/data"
import { isFiniteNumber } from "./finite"
import { isDefined } from "./predicates"

export interface ValidationOptions<TDatum> {
  valueAccessor?: Accessor<TDatum, unknown>
  dateAccessor?: Accessor<TDatum, unknown>
  idAccessor?: Accessor<TDatum, unknown>
  strict?: boolean
  allowDuplicates?: boolean
}

/**
 * Validates a dataset for common visualization safety issues.
 * Implements Section 12.23 - 12.27, 12.32, 12.34, 12.64.
 *
 * Rules:
 * - Empty arrays [] are valid (representing an empty visualization state, not a failure).
 * - Non-finite values (NaN, Infinity, -Infinity) produce diagnostic issues.
 * - Invalid Date objects produce diagnostic issues.
 * - In strict mode, any issue marks the result as invalid. In tolerant mode, issues are recorded but valid rows are preserved.
 * - Caller input data is treated as immutable and never modified.
 */
export function validateDataset<TDatum>(
  data: readonly TDatum[],
  options: ValidationOptions<TDatum> = {}
): ValidationResult<TDatum> {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      data: [] as readonly TDatum[],
      issues: [
        {
          code: "NOT_AN_ARRAY",
          message: "Data source must be an array.",
        },
      ],
    }
  }

  // Section 12.25: Empty is valid input (signals empty visualization state)
  if (data.length === 0) {
    return {
      valid: true,
      data: [] as readonly TDatum[],
      issues: [],
    }
  }

  const { valueAccessor, dateAccessor, idAccessor, strict = true, allowDuplicates = true } = options
  const issues: ValidationIssue[] = []
  const validData: TDatum[] = []
  const seenIds = new Set<unknown>()

  for (let i = 0; i < data.length; i++) {
    const datum = data[i]
    let datumValid = true

    if (!isDefined(datum)) {
      issues.push({
        code: "NULL_DATUM",
        message: `Datum at index ${i} is null or undefined.`,
        index: i,
      })
      datumValid = false
      continue
    }

    // Check unique identifier if accessor provided
    if (idAccessor && !allowDuplicates) {
      const id = idAccessor(datum, i)
      if (seenIds.has(id)) {
        issues.push({
          code: "DUPLICATE_ID",
          message: `Duplicate identifier detected at index ${i}: ${String(id)}.`,
          index: i,
          field: "id",
        })
        datumValid = false
      } else {
        seenIds.add(id)
      }
    }

    // Check numeric value finiteness
    if (valueAccessor) {
      const val = valueAccessor(datum, i)
      if (val !== null && val !== undefined) {
        if (!isFiniteNumber(val)) {
          issues.push({
            code: "NON_FINITE_VALUE",
            message: `Value at index ${i} is not a finite number (${String(val)}).`,
            index: i,
            field: "value",
          })
          datumValid = false
        }
      }
    }

    // Check Date validity
    if (dateAccessor) {
      const dateVal = dateAccessor(datum, i)
      if (dateVal instanceof Date) {
        if (Number.isNaN(dateVal.getTime())) {
          issues.push({
            code: "INVALID_DATE",
            message: `Invalid Date object at index ${i}.`,
            index: i,
            field: "date",
          })
          datumValid = false
        }
      }
    }

    if (datumValid) {
      validData.push(datum)
    }
  }

  const isValid = strict ? issues.length === 0 : validData.length > 0

  return {
    valid: isValid,
    data: Object.freeze(strict ? (isValid ? data : []) : validData),
    issues: Object.freeze(issues),
  }
}

/**
 * Backward-compatible validation helper.
 */
export function validateData<TDatum>(
  data: readonly TDatum[],
  valueAccessor?: Accessor<TDatum, unknown>
): ValidationResult<TDatum> {
  return validateDataset(data, { valueAccessor })
}
