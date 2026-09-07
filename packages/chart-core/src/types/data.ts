export type ValidationIssue = {
  code: string
  message: string
  index?: number
  field?: string
}

/**
 * Structured validation outcome for visualization datasets.
 * Section 12.24.
 */
export type ValidationResult<T = unknown> =
  | {
      valid: true
      data: readonly T[]
      issues: readonly ValidationIssue[]
    }
  | {
      valid: false
      data: readonly T[]
      issues: readonly ValidationIssue[]
    }
