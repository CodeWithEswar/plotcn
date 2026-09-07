import React from "react"
import type { QuickFacts as QuickFactsType } from "@/lib/charts/detail-docs/types"

interface QuickFactsProps {
  facts: QuickFactsType
}

export function QuickFacts({ facts }: QuickFactsProps) {
  const items = [
    { label: "BEST FOR", value: facts.bestFor },
    { label: "DATA MODEL", value: facts.dataModel },
    { label: "INTERACTION", value: facts.interaction },
    { label: "RESPONSIVE", value: facts.responsive },
    { label: "ANIMATION", value: facts.animation },
    ...(facts.runtime ? [{ label: "RUNTIME", value: facts.runtime }] : []),
  ]

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-3 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-emerald-400/80" />
        Component Specifications
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <dt className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              {item.label}
            </dt>
            <dd className="text-xs text-zinc-300 leading-relaxed font-sans">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
