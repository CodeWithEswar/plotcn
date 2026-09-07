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
