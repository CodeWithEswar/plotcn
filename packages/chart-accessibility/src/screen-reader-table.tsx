"use client"

import React, { useState, useId } from "react"
import type { ScreenReaderTableProps, AccessibleColumnDefinition } from "./types"

export const DEFAULT_MAX_TABLE_ROWS = 100

/**
 * ScreenReaderTable
 * Renders a semantic HTML table disclosure with typed columns, scope headers, and dataset size protection.
 * Section 11.13 - 11.16, 11.82.
 */
export function ScreenReaderTable<TData = Record<string, unknown>>({
  caption,
  data,
  columns,
  visibleDisclosure = true,
  maxRows = DEFAULT_MAX_TABLE_ROWS,
  className,
  onToggle,
}: ScreenReaderTableProps<TData>) {
  const [isExpanded, setIsExpanded] = useState(!visibleDisclosure)
  const tableId = useId()

  if (!data || data.length === 0) {
    return null
  }

  // Derive columns if not provided
  const resolvedColumns: readonly AccessibleColumnDefinition<TData>[] =
    columns && columns.length > 0
      ? columns
      : Object.keys(data[0] as Record<string, unknown>).map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }))

  const isTruncated = data.length > maxRows
  const displayRows = isTruncated ? data.slice(0, maxRows) : data

  const handleToggle = () => {
    const next = !isExpanded
    setIsExpanded(next)
    onToggle?.(next)
  }

  return (
    <div className={`plotcn-screen-reader-table-container ${className || ""}`}>
      {visibleDisclosure && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-controls={tableId}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1.5 py-0.5"
          >
            {isExpanded ? "Hide data table" : "View accessible data table"}
          </button>
        </div>
      )}

      {/* Render semantic table */}
      <div
        id={tableId}
        className={
          visibleDisclosure
            ? isExpanded
              ? "mt-2 max-h-64 overflow-auto rounded-lg border border-border bg-card p-2 text-left"
              : "hidden"
            : "sr-only"
        }
      >
        <table className="w-full text-xs text-left border-collapse">
          <caption className="sr-only">
            {caption}
            {isTruncated ? ` (Showing first ${maxRows} of ${data.length} observations)` : ""}
          </caption>

          <thead>
            <tr className="border-b border-border text-muted-foreground">
              {resolvedColumns.map((col) => (
                <th key={col.key} scope="col" className="p-1.5 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40">
            {displayRows.map((row, rowIdx) => {
              const rowData = row as Record<string, unknown>
              return (
                <tr key={rowIdx} className="hover:bg-muted/50">
                  {resolvedColumns.map((col, colIdx) => {
                    const rawVal = rowData[col.key]
                    const formatted = col.format
                      ? col.format(rawVal, row)
                      : rawVal === null || rawVal === undefined
                      ? "—"
                      : String(rawVal)

                    // First column acts as row header
                    if (colIdx === 0) {
                      return (
                        <th
                          key={col.key}
                          scope="row"
                          className="p-1.5 font-normal text-foreground whitespace-nowrap"
                        >
                          {formatted}
                        </th>
                      )
                    }

                    return (
                      <td key={col.key} className="p-1.5 font-mono text-muted-foreground">
                        {formatted}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        {isTruncated && (
          <p className="mt-2 text-[11px] text-muted-foreground italic px-1.5">
            Table truncated for performance. Showing first {maxRows} of {data.length} observations.
          </p>
        )}
      </div>
    </div>
  )
}
