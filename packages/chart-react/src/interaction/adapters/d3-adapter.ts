import type { TooltipDatum, TooltipAnchor, LegendMarker } from "../../types/interaction"

export interface D3SeriesDefinition<TDatum> {
  id: string
  label?: string
  value: (datum: TDatum) => number | string | null
  color?: string
  marker?: LegendMarker
}

/**
 * Normalizes D3 active datum and series definitions into Plotcn TooltipDatum items.
 * Section 8.81.
 */
export function normalizeD3Interaction<TDatum>(
  datum: TDatum,
  index: number,
  coordinate: { x: number; y: number },
  seriesList: readonly D3SeriesDefinition<TDatum>[],
  label?: unknown
): {
  items: TooltipDatum<TDatum>[]
  anchor: TooltipAnchor
  label: unknown
} {
  const items: TooltipDatum<TDatum>[] = seriesList.map((s, idx) => ({
    id: s.id,
    seriesId: s.id,
    label: s.label || s.id,
    value: s.value(datum),
    datum,
    index,
    color: s.color,
    marker: s.marker || {
      shape: "dot",
      color: s.color,
    },
  }))

  return {
    items,
    anchor: { x: coordinate.x, y: coordinate.y },
    label,
  }
}
