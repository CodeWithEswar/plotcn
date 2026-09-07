export interface ValidationIssue {
  code: string
  message: string
  index?: number
}

export interface ValidationResult {
  valid: boolean
  issues: readonly ValidationIssue[]
}
