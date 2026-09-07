"use client"

import React, { useState } from "react"
import type { ExampleVariantDoc } from "@/lib/charts/detail-docs/types"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { CodeHighlight } from "./code-highlight"

interface ExamplesGalleryProps {
  examples: readonly ExampleVariantDoc[]
  registryName: string
}

export function ExamplesGallery({ examples, registryName }: ExamplesGalleryProps) {
  return (
    <section id="section-examples" className="space-y-8 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          04 / Cookbook & States
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Component Variants & Edge States
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Production cookbooks showcasing configuration variants alongside verified handling of loading, empty data, and network error states.
        </p>
      </div>

      {/* ── Feature Variants ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {examples.map((example) => (
          <VariantCard
            key={example.id}
            example={example}
            registryName={registryName}
          />
        ))}
      </div>

      {/* ── Lifecycle & Data Safety States (Loading, Empty, Error) ────── */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
          <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-sky-400" />
          <span>Lifecycle & Exception States</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Loading State */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-amber-400">01. Loading State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Skeletons indicate runtime fetch or pending data queries.</p>
            <div className="charts-surface rounded-xl overflow-hidden min-h-[160px] border border-white/[0.04] p-4 flex flex-col justify-end gap-2 bg-zinc-950/40">
              <div className="h-2 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-24 w-full bg-white/5 rounded-lg animate-pulse flex items-end gap-2 p-2">
                <div className="h-1/3 w-full bg-emerald-500/20 rounded" />
                <div className="h-2/3 w-full bg-emerald-500/25 rounded" />
                <div className="h-1/2 w-full bg-emerald-500/20 rounded" />
                <div className="h-5/6 w-full bg-emerald-500/30 rounded" />
              </div>
            </div>
          </div>

          {/* 2. Empty Data State */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-zinc-300">02. Empty Data State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Handles empty collections (<code className="text-zinc-400">[]</code>) gracefully without crashing.</p>
            <div className="charts-surface rounded-xl overflow-hidden min-h-[160px] border border-white/[0.04] flex flex-col items-center justify-center p-4 text-center bg-zinc-950/40">
              <span className="text-xs font-mono text-zinc-400">No data points provided</span>
              <span className="text-[11px] text-zinc-500 mt-1">Empty collection fallback</span>
            </div>
          </div>

          {/* 3. Error Recovery State */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-rose-400">03. Error State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Graceful failure banner when data source or script fails.</p>
            <div className="charts-surface rounded-xl overflow-hidden min-h-[160px] border border-rose-500/20 bg-rose-500/5 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-xs font-mono text-rose-400 font-medium">Render Exception Handled</span>
              <span className="text-[11px] text-zinc-400 mt-1">Component caught error without unmounting</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function VariantCard({
  example,
  registryName,
}: {
  example: ExampleVariantDoc
  registryName: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(example.snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-3 shadow-sm hover:border-white/[0.12] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 font-sans">{example.title}</h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">{example.description}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-zinc-300 transition-colors shrink-0 cursor-pointer"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} className={copied ? "text-emerald-400" : ""} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="charts-surface rounded-xl border border-white/[0.06] bg-black/50 p-2 overflow-hidden min-h-[180px] flex items-center justify-center">
        <DynamicChartRenderer
          registryName={registryName}
          height={170}
          motion={false}
        />
      </div>

      <div className="rounded-lg overflow-hidden border border-white/[0.04] bg-black/40 p-2">
        <CodeHighlight code={example.snippet} language="tsx" showLineNumbers={false} />
      </div>
    </div>
  )
}
