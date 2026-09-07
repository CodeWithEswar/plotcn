import type { TooltipDatum } from "../../types/interaction"

export interface GoogleSelectionItem {
  row?: number | null
  column?: number | null
}

export interface GoogleDataTableLike {
  getValue: (rowIndex: number, columnIndex: number) => unknown
  getNumberOfRows?: () => number
  getNumberOfColumns?: () => number
  getColumnLabel?: (columnIndex: number) => string
}

export interface GoogleSeriesColumn {
  id: string
  columnIndex: number
  label: string
  color?: string
}

/**
 * Normalizes Google Charts selection event into Plotcn TooltipDatum items.
 * Section 8.82.
 */
export function normalizeGoogleSelection(
  selection: readonly GoogleSelectionItem[],
  dataTable: GoogleDataTableLike,
  seriesColumns: readonly GoogleSeriesColumn[],
  labelColumnIndex = 0
): {
  items: TooltipDatum[]
  label?: unknown
} {
  if (!selection || selection.length === 0) {
    return { items: [] }
  }

  const first = selection[0]
  if (first.row === null || first.row === undefined) {
    return { items: [] }
  }

  const row = first.row
  const label = dataTable.getValue(row, labelColumnIndex)

  const items: TooltipDatum[] = seriesColumns.map((col, idx) => {
    const rawVal = dataTable.getValue(row, col.columnIndex)
    const numVal = typeof rawVal === "number" || typeof rawVal === "string" ? rawVal : null

    return {
      id: col.id,
      seriesId: col.id,
      label: col.label,
      value: numVal,
      color: col.color,
      datum: { row, value: rawVal },
      index: row,
      marker: {
        shape: "dot",
        color: col.color,
      },
    }
  })

  return {
    items,
    label,
  }
}
