export interface TimeScale {
  (date: Date | number): number
  invert(rangeValue: number): Date
  domain(): readonly [Date, Date]
  range(): readonly [number, number]
}

/**
 * Creates a continuous time scale mapping Date instances to a numeric range.
 */
export function createTimeScale(
  domain: readonly [Date, Date],
  range: readonly [number, number],
  clamp = false
): TimeScale {
  const [d0, d1] = domain
  const t0 = d0.getTime()
  const t1 = d1.getTime()
  const [r0, r1] = range
  const span = t1 - t0 === 0 ? 1 : t1 - t0
  const rSpan = r1 - r0

  const scale = (date: Date | number): number => {
    const t = typeof date === "number" ? date : date.getTime()
    let frac = (t - t0) / span
    if (clamp) {
      frac = Math.max(0, Math.min(1, frac))
    }
    return r0 + frac * rSpan
  }

  scale.invert = (rVal: number): Date => {
    const frac = rSpan === 0 ? 0 : (rVal - r0) / rSpan
    return new Date(t0 + frac * span)
  }

  scale.domain = () => domain
  scale.range = () => range

  return scale
}
