export interface OrdinalScale<TDomain extends string | number, TRange> {
  (key: TDomain): TRange | undefined
  domain(): readonly TDomain[]
  range(): readonly TRange[]
}

/**
 * Creates an ordinal discrete scale mapping discrete keys to discrete outputs (e.g. series colors).
 */
export function createOrdinalScale<TDomain extends string | number, TRange>(
  domain: readonly TDomain[],
  range: readonly TRange[]
): OrdinalScale<TDomain, TRange> {
  const map = new Map<TDomain, TRange>()
  const rangeLen = range.length

  domain.forEach((d, idx) => {
    map.set(d, rangeLen > 0 ? range[idx % rangeLen] : (undefined as unknown as TRange))
  })

  const scale = (key: TDomain): TRange | undefined => {
    return map.get(key)
  }

  scale.domain = () => domain
  scale.range = () => range

  return scale
}
