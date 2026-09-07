import type { NumericDomain } from "../types/domain"

export interface LinearScale {
  (value: number): number
  invert(rangeValue: number): number
  domain(): NumericDomain
  range(): readonly [number, number]
}

/**
 * Creates a pure linear continuous scale mapping domain [d0, d1] to range [r0, r1].
 */
export function createLinearScale(
  domain: NumericDomain,
  range: readonly [number, number],
  clamp = false
): LinearScale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const dSpan = d1 - d0 === 0 ? 1 : d1 - d0
  const rSpan = r1 - r0

  const scale = (val: number): number => {
    let t = (val - d0) / dSpan
    if (clamp) {
      t = Math.max(0, Math.min(1, t))
    }
    return r0 + t * rSpan
  }

  scale.invert = (rVal: number): number => {
    const t = rSpan === 0 ? 0 : (rVal - r0) / rSpan
    return d0 + t * dSpan
  }

  scale.domain = () => domain
  scale.range = () => range

  return scale
}
