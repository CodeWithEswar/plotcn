export { isFiniteNumber } from "./finite"

/**
 * Pure type-guard checking if a value is a valid Date instance.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Type-guard checking that a value is neither null nor undefined.
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
