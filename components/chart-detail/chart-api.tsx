import React from "react"
import { ApiTable, type ApiTableColumn } from "@/components/docs/api-table"

export interface PropItem {
  name: string
  type: string
  default?: string
  description: string
}

export interface ChartApiProps {
  propsList?: PropItem[]
}

const defaultProps: PropItem[] = [
  { name: "data", type: "Array<Record<string, any>>", default: "required", description: "Array of data records to bind to chart series and axes." },
  { name: "color", type: "string", default: '"var(--chart-1)"', description: "Primary theme stroke or fill color." },
  { name: "height", type: "number | string", default: "300", description: "Explicit height for the chart container." },
  { name: "valueKey", type: "string", default: '"value"', description: "Key name in data records to read numeric values from." },
  { name: "labelKey", type: "string", default: '"label"', description: "Key name in data records to read category labels from." },
  { name: "className", type: "string", default: "undefined", description: "Custom Tailwind CSS classes applied to container wrapper." },
]

export function ChartApi({ propsList = defaultProps }: ChartApiProps) {
  const columns: readonly ApiTableColumn[] = [
    { key: "property", label: "Property", width: "18%", kind: "name" },
    { key: "type", label: "Type", width: "24%", kind: "type" },
    { key: "default", label: "Default", width: "16%", kind: "default" },
    { key: "description", label: "Description", width: "42%", kind: "description" },
  ]

  return (
    <div className="flex flex-col mb-8">
      <h2 className="text-xl font-semibold text-foreground tracking-tight mb-3">API Reference</h2>
      <ApiTable
        caption="Chart API reference"
        columns={columns}
        rows={propsList.map((item) => ({
          id: `api-${item.name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
          cells: {
            property: <code>{item.name}</code>,
            type: <code>{item.type}</code>,
            default: <code>{item.default || "—"}</code>,
            description: item.description,
          },
        }))}
      />
    </div>
  )
}
