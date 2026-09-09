import type { ReactNode } from "react"
import React from "react"
import type { DataFieldDoc, PropDoc } from "@/lib/charts/detail-docs/types"
import { cn } from "@/lib/utils"

export type ColumnKind = "name" | "type" | "default" | "status" | "description"

export interface ApiTableColumn {
  key: string
  label: string
  width?: string
  kind?: ColumnKind
}

export interface ApiTableRow {
  id?: string
  cells: Record<string, ReactNode>
}

export interface ApiTableProps {
  columns: readonly ApiTableColumn[]
  rows: readonly ApiTableRow[]
  caption: string
  className?: string
  emptyMessage?: string
}

export const apiTableStyles = {
  shell: "plotcn-api-table-shell",
  table: "plotcn-api-table",
  name: "plotcn-api-name",
  type: "plotcn-api-type",
  default: "plotcn-api-default",
  status: "plotcn-api-status",
  description: "plotcn-api-desc",
  propertyLink: "plotcn-api-link",
  statusBadge: "plotcn-api-badge",
  statusRequired: "plotcn-api-badge-req",
  statusOptional: "plotcn-api-badge-opt",
  note: "plotcn-api-note",
  empty: "plotcn-api-empty",
}

export function ApiTable({
  columns,
  rows,
  caption,
  className,
  emptyMessage = "No matching properties.",
}: ApiTableProps) {
  return (
    <div className={cn(apiTableStyles.shell, className)}>
      <table className={apiTableStyles.table}>
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index} id={row.id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  data-label={column.label}
                  className={column.kind ? apiTableStyles[column.kind] : undefined}
                >
                  {row.cells[column.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className={apiTableStyles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function propertyId(name: string) {
  return `prop-${name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`
}

const propColumns: readonly ApiTableColumn[] = [
  { key: "property", label: "Property", width: "18%", kind: "name" },
  { key: "type", label: "Type", width: "24%", kind: "type" },
  { key: "default", label: "Default", width: "12%", kind: "default" },
  { key: "required", label: "Required", width: "10%", kind: "status" },
  { key: "description", label: "Description", width: "36%", kind: "description" },
]

export function PropsReferenceTable({
  props,
  className,
  emptyMessage,
}: {
  props: readonly PropDoc[]
  className?: string
  emptyMessage?: string
}) {
  const rows: ApiTableRow[] = props.map((prop) => {
    const id = propertyId(prop.name)
    return {
      id,
      cells: {
        property: (
          <div className="flex items-center justify-between gap-2 w-full">
            <a className={apiTableStyles.propertyLink} href={`#${id}`}>
              {prop.name}
            </a>
            {prop.required ? (
              <span className={cn(apiTableStyles.statusBadge, apiTableStyles.statusRequired)}>Req</span>
            ) : (
              <span className={cn(apiTableStyles.statusBadge, apiTableStyles.statusOptional)}>Opt</span>
            )}
          </div>
        ),
        type: <code dir="ltr">{prop.type}</code>,
        default: <code dir="ltr">{prop.default || "—"}</code>,
        required: prop.required ? "Yes" : "No",
        description: (
          <div className={apiTableStyles.description}>
            <p>{prop.description}</p>
            {prop.bestFor && (
              <p className={apiTableStyles.note}>
                <strong>Best for:</strong> {prop.bestFor}
              </p>
            )}
          </div>
        ),
      },
    }
  })

  return (
    <ApiTable
      columns={propColumns}
      rows={rows}
      caption="Component properties"
      className={className}
      emptyMessage={emptyMessage}
    />
  )
}

const dataColumns: readonly ApiTableColumn[] = [
  { key: "field", label: "Field", width: "18%", kind: "name" },
  { key: "type", label: "Type", width: "25%", kind: "type" },
  { key: "required", label: "Required", width: "12%", kind: "status" },
  { key: "description", label: "Meaning", width: "45%", kind: "description" },
]

export function DataFieldsTable({ fields }: { fields: readonly DataFieldDoc[] }) {
  return (
    <ApiTable
      caption="Chart data contract"
      columns={dataColumns}
      rows={fields.map((field) => ({
        id: `field-${field.field.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
        cells: {
          field: <code dir="ltr">{field.field}</code>,
          type: <code dir="ltr">{field.type}</code>,
          required: field.required ? "Yes" : "No",
          description: field.description,
        },
      }))}
    />
  )
}

/**
 * Infer ColumnKind based on header text
 */
export function inferColumnKind(headerText: string): ColumnKind {
  const h = headerText.toLowerCase().trim()
  if (
    h === "prop" ||
    h === "property" ||
    h === "field" ||
    h === "callback" ||
    h === "feature" ||
    h === "policy" ||
    h === "name"
  ) {
    return "name"
  }
  if (h === "type" || h === "payload" || h === "prop configuration") {
    return "type"
  }
  if (h === "default") {
    return "default"
  }
  if (h === "required" || h === "status") {
    return "status"
  }
  return "description"
}
