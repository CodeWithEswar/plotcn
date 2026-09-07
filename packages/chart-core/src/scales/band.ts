export interface BandScale {
  (key: string): number | undefined
  bandwidth: number
  step: number
  domain(): readonly string[]
  range(): readonly [number, number]
}

/**
 * Creates a categorical band scale for discrete categorical axes (bars, columns).
 */
export function createBandScale(
  domain: readonly string[],
  range: readonly [number, number],
  padding = 0.1
): BandScale {
  const [r0, r1] = range
  const totalSpan = Math.abs(r1 - r0)
  const n = domain.length

  const safePadding = Math.max(0, Math.min(1, padding))
  const step = n === 0 ? 0 : totalSpan / Math.max(1, n - safePadding)
  const bandwidth = step * (1 - safePadding)

  const indexMap = new Map<string, number>()
  domain.forEach((d, i) => indexMap.set(d, i))

  const scale = (key: string): number | undefined => {
    const idx = indexMap.get(key)
    if (idx === undefined) return undefined
    const offset = idx * step
    return r0 < r1 ? r0 + offset : r0 - offset - bandwidth
  }

  scale.bandwidth = bandwidth
  scale.step = step
  scale.domain = () => domain
  scale.range = () => range

  return scale
}
