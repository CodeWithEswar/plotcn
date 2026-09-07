import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react"

export interface ChartSummaryTableRow {
  label: string
  values: readonly (string | number)[]
}

export interface ChartSummaryProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Table column headers for structured screen reader table */
  headers?: readonly string[]
  /** Data rows */
  rows?: readonly ChartSummaryTableRow[]
  /** Visually hide the summary (defaults to true) */
  visuallyHidden?: boolean
}

/**
 * ChartSummary renders an accessible summary table or prose block for assistive technologies.
 * By default, applies the `sr-only` class to remain available to screen readers while hidden visually.
 */
export const ChartSummary = forwardRef<HTMLDivElement, ChartSummaryProps>(
  function ChartSummary(
    {
      children,
      headers,
      rows,
      visuallyHidden = true,
      className,
      ...props
    },
    ref
  ) {
    const hiddenClass = visuallyHidden ? "sr-only" : ""

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Accessible Data Summary"
        className={
          className
            ? `plotcn-chart-summary ${hiddenClass} ${className}`
            : `plotcn-chart-summary ${hiddenClass}`
        }
        {...props}
      >
        {children}

        {headers && rows && rows.length > 0 && (
          <table className="min-w-full text-left text-xs">
            <caption className="text-left font-semibold">Data Table</caption>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }
)
