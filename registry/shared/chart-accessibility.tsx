"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AccessibleChartProps {
  title: string
  description?: string
  summary?: string
  data?: Array<Record<string, any>>
  columns?: Array<{ key: string; label: string; format?: (val: any) => string }>
  children: React.ReactNode
  className?: string
}

/**
 * Accessible Chart Wrapper
 * Wraps visualization in a semantic region with screen-reader summary and accessible data table.
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
  const id = React.useId()
  const titleId = `chart-title-${id}`
  const descId = `chart-desc-${id}`

  return (
    <figure
      className={cn("relative flex flex-col space-y-2", className)}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <figcaption className="sr-only">
        <h3 id={titleId}>{title}</h3>
        {description && <p id={descId}>{description}</p>}
        {summary && <p>{summary}</p>}
      </figcaption>

      {children}

      {data && data.length > 0 && (
        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded px-1"
            aria-expanded={showTable}
          >
            {showTable ? "Hide data table" : "View accessible data table"}
          </button>

          {showTable && (
            <div className="mt-2 max-h-48 overflow-auto rounded-lg border border-white/[0.08] bg-zinc-950 p-2 text-left">
              <table className="w-full text-xs font-mono text-zinc-300">
                <thead>
                  <tr className="border-b border-white/[0.08] text-zinc-500">
                    {columns
                      ? columns.map((col) => <th key={col.key} className="p-1 text-left font-medium">{col.label}</th>)
                      : Object.keys(data[0] || {}).map((key) => <th key={key} className="p-1 text-left font-medium">{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/[0.04] last:border-0 hover:bg-zinc-900/50">
                      {columns
                        ? columns.map((col) => (
                            <td key={col.key} className="p-1">
                              {col.format ? col.format(row[col.key]) : String(row[col.key] ?? "")}
                            </td>
                          ))
                        : Object.keys(row).map((k) => (
                            <td key={k} className="p-1">
                              {String(row[k] ?? "")}
                            </td>
                          ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </figure>
  )
}
