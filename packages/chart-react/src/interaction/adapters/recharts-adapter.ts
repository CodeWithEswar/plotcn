import type { TooltipDatum, TooltipAnchor } from "../../types/interaction"

export interface RechartsPayloadItem {
  dataKey?: string | number
  name?: string
  value?: number | string | null
  color?: string
  payload?: Record<string, unknown>
}

/**
 * Normalizes Recharts active tooltip payload into Plotcn TooltipDatum items.
 * Section 8.80.
 */
export function normalizeRechartsTooltip(
  payload?: readonly RechartsPayloadItem[] | null,
  label?: unknown,
  coordinate?: { x: number; y: number } | null
): {
  items: TooltipDatum[]
  anchor: TooltipAnchor | null
  label: unknown
} {
  if (!payload || payload.length === 0) {
    return { items: [], anchor: null, label }
  }

  const items: TooltipDatum[] = payload.map((item, index) => {
    const id = String(item.dataKey || item.name || `series-${index}`)
    return {
      id,
      seriesId: id,
      label: item.name || id,
      value: item.value ?? null,
      color: item.color,
      datum: item.payload || {},
      index,
      marker: {
        shape: "dot",
        color: item.color,
      },
    }
  })

  const anchor: TooltipAnchor | null = coordinate ? { x: coordinate.x, y: coordinate.y } : null

  return {
    items,
    anchor,
    label,
  }
}
