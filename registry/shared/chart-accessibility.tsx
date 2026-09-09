"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AccessibleChartProps {
  title: string
  description?: string
  summary?: string
  data?: Array<Record<string, unknown>>
  columns?: Array<{ key: string; label: string; format?: (val: unknown) => string }>
  children: React.ReactNode
  className?: string
}

/**
 * Accessible Chart Wrapper
 * Wraps visualization in a semantic region with screen-reader summary and accessible data table.
 * Section 11.4, 11.6, 11.8, 11.16.
 */
export function AccessibleChart({
  title,
  description,
  summary,
  data,
  columns,
  children,
  className,
}: AccessibleChartProps) {
  const [showTable, setShowTable] = React.useState(false)
  const id = React.useId().replace(/[:]/g, "")
  const titleId = `chart-title-${id}`
  const descId = `chart-desc-${id}`
  const summaryId = `chart-summary-${id}`
  const tableId = `chart-table-${id}`

  // Compute fallback factual summary if none provided (Section 11.8 - 11.10)
  const effectiveSummary = React.useMemo(() => {
    if (summary) return summary
    if (!data || data.length === 0) return undefined

    const sample = data[0]
    const numKey = Object.keys(sample).find((k) => typeof sample[k] === "number")
    if (!numKey) return undefined

    const nums = data.map((d) => Number(d[numKey])).filter(Number.isFinite)
    if (nums.length === 0) return undefined

    const min = Math.min(...nums)
    const max = Math.max(...nums)
    const first = nums[0]
    const last = nums[nums.length - 1]
    const net = last - first
    const direction = net > 0 ? "increased" : net < 0 ? "decreased" : "remained steady"

    return `Data contains ${nums.length} observations. Values ${direction} from ${first} to ${last}. Minimum was ${min}; maximum was ${max}.`
  }, [summary, data])

  const maxRows = 100
  const isTruncated = (data?.length ?? 0) > maxRows
  const displayData = isTruncated ? data?.slice(0, maxRows) : data

  return (
    <figure
      className={cn("relative flex flex-col space-y-2", className)}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : effectiveSummary ? summaryId : undefined}
    >
      <figcaption className="sr-only">
        <h3 id={titleId}>{title}</h3>
        {description && <p id={descId}>{description}</p>}
        {effectiveSummary && <p id={summaryId}>{effectiveSummary}</p>}
      </figcaption>

      {children}

      {data && data.length > 0 && (
        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chart-focus)] rounded px-1"
            aria-expanded={showTable}
            aria-controls={tableId}
          >
            {showTable ? "Hide data table" : "View accessible data table"}
          </button>

          {showTable && (
            <div
              id={tableId}
              className="mt-2 max-h-48 overflow-auto rounded-lg border border-border bg-background p-2 text-left"
            >
              <table className="w-full text-xs font-mono text-foreground">
                <caption className="sr-only">
                  {title} data table
                  {isTruncated ? ` (Showing first ${maxRows} of ${data.length} rows)` : ""}
                </caption>
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    {columns
                      ? columns.map((col) => (
                          <th key={col.key} scope="col" className="p-1 text-left font-medium">
                            {col.label}
                          </th>
                        ))
                      : Object.keys(data[0] || {}).map((key) => (
                          <th key={key} scope="col" className="p-1 text-left font-medium">
                            {key}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData?.map((row, idx) => {
                    const keys = columns ? columns.map((c) => c.key) : Object.keys(row)
                    return (
                      <tr key={idx} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                        {keys.map((k, colIdx) => {
                          const colDef = columns?.find((c) => c.key === k)
                          const formatted = colDef?.format ? colDef.format(row[k]) : String(row[k] ?? "—")

                          if (colIdx === 0) {
                            return (
                              <th key={k} scope="row" className="p-1 font-normal text-zinc-200">
                                {formatted}
                              </th>
                            )
                          }
                          return (
                            <td key={k} className="p-1">
                              {formatted}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </figure>
  )
}
