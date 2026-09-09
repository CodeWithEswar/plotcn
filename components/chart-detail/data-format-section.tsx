import React from "react"
import type { DataFormatDoc } from "@/lib/charts/detail-docs/types"
import { CodeHighlight } from "./code-highlight"
import { DataFieldsTable } from "@/components/docs/api-table"

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
      <DataFieldsTable fields={dataFormat.fields} />

      {/* Data Safety & Policy Footnotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-400 font-medium">Null / Missing Value Policy:</span>
            <p className="text-zinc-400 leading-relaxed font-sans">{dataFormat.nullPolicy}</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[11px] text-zinc-400 font-medium">Coordinate Ordering Policy:</span>
            <p className="text-zinc-400 leading-relaxed font-sans">{dataFormat.orderingPolicy}</p>
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
