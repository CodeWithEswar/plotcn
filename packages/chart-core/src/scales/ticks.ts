import type { NumericDomain } from "../types/domain"

/**
 * Generates an array of approximately `count` evenly spaced, human-friendly numeric ticks.
 */
export function generateNumericTicks(domain: NumericDomain, count = 5): readonly number[] {
  const [d0, d1] = domain
  if (d0 === d1) return [d0]

  const span = d1 - d0
  const safeCount = Math.max(2, count)
  const rawStep = span / (safeCount - 1)

  // Find power of 10
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const normalizedStep = rawStep / magnitude

  let niceStep = magnitude
  if (normalizedStep < 1.5) {
    niceStep = magnitude
  } else if (normalizedStep < 3) {
    niceStep = 2 * magnitude
  } else if (normalizedStep < 7) {
    niceStep = 5 * magnitude
  } else {
    niceStep = 10 * magnitude
  }

  const start = Math.ceil(d0 / niceStep) * niceStep
  const ticks: number[] = []

  let current = start
  // Prevent floating point drift
  const precision = Math.max(0, -Math.floor(Math.log10(niceStep)) + 2)

  while (current <= d1 + 1e-9) {
    ticks.push(Number(current.toFixed(precision)))
    current += niceStep
  }

  return Object.freeze(ticks)
}
