import type { NumericDomain } from "../types/domain"
import { ChartDataError } from "../errors/chart-data-error"

export interface LogScale {
  (value: number): number
  invert(rangeValue: number): number
  domain(): NumericDomain
  range(): readonly [number, number]
}

/**
 * Creates a logarithmic scale for exponential datasets.
 * Requires strictly positive (or strictly negative) domain values.
 */
export function createLogScale(
  domain: NumericDomain,
  range: readonly [number, number],
  base = 10
): LogScale {
  const [d0, d1] = domain
  if ((d0 <= 0 && d1 >= 0) || base <= 1) {
    throw new ChartDataError(
      "INVALID_LOG_DOMAIN",
      `Log scale domain must not cross zero: [${d0}, ${d1}] with base ${base}`
    )
  }

  const [r0, r1] = range
  const logBase = Math.log(base)
  const logD0 = Math.log(d0) / logBase
  const logD1 = Math.log(d1) / logBase
  const dSpan = logD1 - logD0 === 0 ? 1 : logD1 - logD0
  const rSpan = r1 - r0

  const scale = (val: number): number => {
    const logVal = Math.log(Math.max(1e-12, val)) / logBase
    const t = (logVal - logD0) / dSpan
    return r0 + t * rSpan
  }

  scale.invert = (rVal: number): number => {
    const t = rSpan === 0 ? 0 : (rVal - r0) / rSpan
    const logVal = logD0 + t * dSpan
    return Math.pow(base, logVal)
  }

  scale.domain = () => domain
  scale.range = () => range

  return scale
}
