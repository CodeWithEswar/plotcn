import React from "react"

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
  return (
    <div className="flex flex-col mb-8">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-3">API Reference</h2>
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-md">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-mono text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Prop</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Default</th>
              <th className="px-4 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {propsList.map((item) => (
              <tr key={item.name} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-mono text-emerald-400 font-semibold">{item.name}</td>
                <td className="px-4 py-3 font-mono text-sky-400">{item.type}</td>
                <td className="px-4 py-3 font-mono text-zinc-400">{item.default || "-"}</td>
                <td className="px-4 py-3 text-zinc-300 leading-relaxed">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
