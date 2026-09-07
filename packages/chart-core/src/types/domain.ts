export type NumericDomain = readonly [minimum: number, maximum: number]

export type DomainPolicy =
  | "exact"
  | "include-zero"
  | "padded"
  | "symmetric"
  | "manual"

export interface DomainOptions {
  policy?: DomainPolicy
  padding?: number
  zeroInclusive?: boolean
  manualDomain?: NumericDomain
}

/**
 * Pure numeric domain calculation result distinguishing empty from invalid datasets.
 * Section 12.51, 12.134.
 */
export type NumericDomainResult =
  | { status: "valid"; domain: readonly [number, number] }
  | { status: "empty" }
  | { status: "invalid"; reason: string }
