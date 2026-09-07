export type NumericDomain = readonly [number, number]

export type DomainPolicy = "exact" | "include-zero" | "padded" | "symmetric"

export interface DomainOptions {
  policy?: DomainPolicy
  padding?: number
  zeroInclusive?: boolean
}
