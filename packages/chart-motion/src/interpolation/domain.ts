import { interpolateNumber } from "./number"

export type NumericDomain = [number, number]

/**
 * Interpolates between two continuous numerical domains.
 * Ensures marks and scales remain geometrically synchronized during axis transitions.
 * Section 10.32, 10.33.
 */
export function interpolateDomain(
  domainA: NumericDomain,
  domainB: NumericDomain,
  progress: number
): NumericDomain {
  const t = Math.max(0, Math.min(1, progress))

  return [
    interpolateNumber(domainA[0], domainB[0], t),
    interpolateNumber(domainA[1], domainB[1], t),
  ]
}
