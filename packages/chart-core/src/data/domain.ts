import type { Accessor } from "../types/accessors"
import type { NumericDomain, DomainOptions } from "../types/domain"
import { isFiniteNumber } from "./predicates"

/**
 * Calculates a pure numeric scale domain from data using a given accessor and policy.
 * Policies: "exact" | "include-zero" | "padded" | "symmetric" | "manual"
 */
export function calculateNumericDomain<TDatum>(
  data: readonly TDatum[],
  accessor: Accessor<TDatum, number>,
  options: DomainOptions = {}
): NumericDomain {
  const { policy = "exact", padding = 0.05, zeroInclusive = false, manualDomain } = options

  if (policy === "manual" && manualDomain) {
    return manualDomain
  }

  if (!data || data.length === 0) {
    return zeroInclusive || policy === "include-zero" ? [0, 1] : [0, 1]
  }

  let min = Infinity
  let max = -Infinity
  let count = 0

  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      if (val < min) min = val
      if (val > max) max = val
      count++
    }
  }

  if (count === 0) {
    return [0, 1]
  }

  // Handle single-value or zero-span datasets
  if (min === max) {
    if (min === 0) return [0, 1]
    if (min > 0) return [0, min * 1.2]
    return [min * 1.2, 0]
  }

  let domainMin = min
  let domainMax = max

  if (zeroInclusive || policy === "include-zero") {
    domainMin = Math.min(0, domainMin)
    domainMax = Math.max(0, domainMax)
  }

  if (policy === "symmetric") {
    const maxAbs = Math.max(Math.abs(domainMin), Math.abs(domainMax))
    return [-maxAbs, maxAbs]
  }

  if (policy === "padded" && padding > 0) {
    const span = domainMax - domainMin
    const pad = span * padding
    domainMin -= pad
    domainMax += pad
  }

  return [domainMin, domainMax]
}
