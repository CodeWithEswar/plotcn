import type { GoogleDataTableInstance, GoogleGlobal } from "./types"

export type TabularData = unknown[][]

export interface ObjectDataOptions<T> {
  columns: Array<{
    key: keyof T
    label?: string
    type?: "string" | "number" | "boolean" | "date"
  }>
}

/**
 * Transforms standard 2D arrays or array of objects into a valid Google DataTable instance.
 */
export function buildDataTable<T extends Record<string, unknown>>(
  google: GoogleGlobal,
  data: TabularData | readonly T[],
  options?: ObjectDataOptions<T>
): GoogleDataTableInstance {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Cannot build DataTable from empty or non-array data.")
  }

  // Case 1: 2D Array format (e.g. [["Country", "Value"], ["IN", 500]])
  if (Array.isArray(data[0])) {
    return google.visualization.arrayToDataTable(data as unknown[][])
  }

  // Case 2: Array of objects (e.g. [{ region: "IN", value: 500 }])
  const objectRows = data as unknown as readonly T[]
  const dataTable = new google.visualization.DataTable()

  if (options?.columns && options.columns.length > 0) {
    for (const col of options.columns) {
      const detectedType = col.type || inferType(objectRows[0][col.key])
      dataTable.addColumn(detectedType, col.label || String(col.key))
    }

    const rows = objectRows.map((item) =>
      options.columns.map((col) => item[col.key])
    )
    dataTable.addRows(rows)
  } else {
    // Auto-detect columns from first object
    const keys = Object.keys(objectRows[0]) as Array<keyof T>
    for (const key of keys) {
      const detectedType = inferType(objectRows[0][key])
      dataTable.addColumn(detectedType, String(key))
    }

    const rows = objectRows.map((item) => keys.map((key) => item[key]))
    dataTable.addRows(rows)
  }

  return dataTable
}

function inferType(val: unknown): "string" | "number" | "boolean" | "date" {
  if (typeof val === "number") return "number"
  if (typeof val === "boolean") return "boolean"
  if (val instanceof Date) return "date"
  return "string"
}
