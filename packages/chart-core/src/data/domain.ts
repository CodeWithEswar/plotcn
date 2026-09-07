import type { Accessor } from "../types/accessors"
import type { NumericDomain, DomainOptions, NumericDomainResult } from "../types/domain"
import { isFiniteNumber } from "./finite"

export interface SafeExtentOptions {
  zeroInclusive?: boolean
  padding?: number
  defaultSingleSpan?: number
}

/**
 * Calculates a pure safe numeric domain result, cleanly distinguishing valid, empty, and invalid datasets.
 * Section 12.38 - 12.44, 12.51, 12.134.
 */
export function safeExtent(
  values: readonly number[],
  options: SafeExtentOptions = {}
): NumericDomainResult {
  if (!values || values.length === 0) {
    return { status: "empty" }
  }

  let min = Infinity
  let max = -Infinity
  let finiteCount = 0

  for (let i = 0; i < values.length; i++) {
    const val = values[i]
    if (isFiniteNumber(val)) {
      if (val < min) min = val
      if (val > max) max = val
      finiteCount++
    }
  }

  if (finiteCount === 0) {
    // Section 12.22, 12.38: Data was provided but contained no finite numbers -> invalid!
    return {
      status: "invalid",
      reason: "Dataset contains observations, but none are finite numbers.",
    }
  }

  // Handle single-value or zero-span datasets (Section 12.39 - 12.41)
  if (min === max) {
    if (min === 0) {
      // All-zero dataset is valid data, not empty (Section 12.41)
      const domain: readonly [number, number] = options.zeroInclusive ? [0, 1] : [-1, 1]
      return { status: "valid", domain }
    }

    if (min > 0) {
      const domain: readonly [number, number] = options.zeroInclusive
        ? [0, min * 1.2]
        : [min * 0.9, min * 1.1]
      return { status: "valid", domain }
    }

    // Negative single value (Section 12.43)
    const domain: readonly [number, number] = options.zeroInclusive
      ? [min * 1.2, 0]
      : [min * 1.1, min * 0.9]
    return { status: "valid", domain }
  }

  let domainMin = min
  let domainMax = max

  if (options.zeroInclusive) {
    domainMin = Math.min(0, domainMin)
    domainMax = Math.max(0, domainMax)
  }

  if (options.padding && options.padding > 0) {
    const span = domainMax - domainMin
    const pad = span * options.padding
    domainMin -= pad
    domainMax += pad
  }

  return {
    status: "valid",
    domain: [domainMin, domainMax],
  }
}

/**
 * Calculates a pure numeric scale domain from data using a given accessor and policy.
 * Policies: "exact" | "include-zero" | "padded" | "symmetric" | "manual"
 * Section 12.52.
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
    return [0, 1]
  }

  const values: number[] = []
  for (let i = 0; i < data.length; i++) {
    const val = accessor(data[i], i)
    if (isFiniteNumber(val)) {
      values.push(val)
    }
  }

  const extentResult = safeExtent(values, {
    zeroInclusive: zeroInclusive || policy === "include-zero",
    padding: policy === "padded" ? padding : 0,
  })

  if (extentResult.status !== "valid") {
    return [0, 1]
  }

  let [domainMin, domainMax] = extentResult.domain

  if (policy === "symmetric") {
    const maxAbs = Math.max(Math.abs(domainMin), Math.abs(domainMax))
    return [-maxAbs, maxAbs]
  }

  return [domainMin, domainMax]
}
