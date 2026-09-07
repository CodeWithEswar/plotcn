import React from "react"
import type { DataFormatDoc } from "@/lib/charts/detail-docs/types"
import { CodeHighlight } from "./code-highlight"

interface DataFormatSectionProps {
  dataFormat: DataFormatDoc
}

export function DataFormatSection({ dataFormat }: DataFormatSectionProps) {
  return (
    <section id="section-data" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          02 / Data Contract
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Input Schema & Coordinates
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {dataFormat.summary}
        </p>
      </div>

      {/* Fields Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[11px] text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Field</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {dataFormat.fields.map((f) => (
                <tr key={f.field} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-emerald-400">{f.field}</td>
                  <td className="px-4 py-3 font-mono text-sky-400">{f.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                        f.required
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {f.required ? "Required" : "Optional"}
                    </span>
                  </td>
                  <td className="px-4 py-3 leading-relaxed text-zinc-300">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Safety & Policy Footnotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-white/[0.08] bg-zinc-900/30 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-400 font-medium">Null / Missing Value Policy:</span>
            <p className="text-zinc-400 leading-relaxed font-sans">{dataFormat.nullPolicy}</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-400 font-medium">Coordinate Ordering Policy:</span>
            <p className="text-zinc-400 leading-relaxed font-sans">{dataFormat.orderingPolicy}</p>
          </div>
        </div>
      </div>

      {/* Example Data Rows Preview */}
      <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
        <div className="text-[11px] font-mono text-zinc-400 font-medium">Example Observation Payload:</div>
        <div className="rounded-lg overflow-hidden border border-white/[0.04] bg-zinc-950/80 p-2">
          <CodeHighlight
            code={JSON.stringify(dataFormat.exampleRows, null, 2)}
            language="json"
            showLineNumbers={false}
          />
        </div>
      </div>
    </section>
  )
}
