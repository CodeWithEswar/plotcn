"use client"

import React, { useState } from "react"
import type { ExampleVariantDoc } from "@/lib/charts/detail-docs/types"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { CodeHighlight } from "./code-highlight"
import { useChartColors } from "./chart-color-context"

interface ExamplesGalleryProps {
  examples: readonly ExampleVariantDoc[]
  registryName: string
}

export function ExamplesGallery({ examples, registryName }: ExamplesGalleryProps) {
  const colorContext = useChartColors()

  return (
    <section id="section-examples" className="space-y-8 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-muted-foreground font-semibold uppercase">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 min-w-0 w-full max-w-full">
        {examples.map((example) => (
          <VariantCard
            key={example.id}
            example={example}
            registryName={registryName}
            customColors={colorContext.customColors}
            cssVariables={colorContext.cssVariables}
          />
        ))}
      </div>

      {/* ── Lifecycle & Data Safety States (Loading, Empty, Error) ────── */}
      <div className="space-y-3 pt-4 min-w-0 w-full max-w-full">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
          <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-sky-400" />
          <span>Lifecycle & Exception States</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0 w-full max-w-full">
          {/* 1. Loading State */}
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-amber-400">01. Loading State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Skeletons indicate runtime fetch or pending data queries.</p>
            <div className="charts-surface w-full min-w-0 max-w-full rounded-xl overflow-hidden min-h-[170px] border border-white/[0.04] p-2 flex items-center justify-center bg-zinc-950/40">
              <DynamicChartRenderer
                registryName={registryName}
                height={150}
                motion={false}
                chartProps={{ loading: true }}
                className="w-full min-w-0 max-w-full overflow-hidden"
              />
            </div>
          </div>

          {/* 2. Empty Data State */}
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-zinc-300">02. Empty Data State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Handles empty collections (<code className="text-zinc-400">[]</code>) gracefully without crashing.</p>
            <div className="charts-surface w-full min-w-0 max-w-full rounded-xl overflow-hidden min-h-[170px] border border-white/[0.04] p-2 flex items-center justify-center bg-zinc-950/40">
              <DynamicChartRenderer
                registryName={registryName}
                height={150}
                motion={false}
                chartProps={{ data: [] }}
                className="w-full min-w-0 max-w-full overflow-hidden"
              />
            </div>
          </div>

          {/* 3. Error Recovery State */}
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-2.5">
            <div className="text-xs font-mono font-medium text-rose-400">03. Error State</div>
            <p className="text-[11px] text-zinc-400 font-sans">Graceful failure banner when data source or script fails.</p>
            <div className="charts-surface w-full min-w-0 max-w-full rounded-xl overflow-hidden min-h-[170px] border border-rose-500/20 bg-rose-500/5 p-2 flex items-center justify-center">
              <DynamicChartRenderer
                registryName={registryName}
                height={150}
                motion={false}
                chartProps={{ error: "Failed to connect to metric telemetry host" }}
                className="w-full min-w-0 max-w-full overflow-hidden"
              />
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
  customColors,
  cssVariables,
}: {
  example: ExampleVariantDoc
  registryName: string
  customColors: Record<string, string>
  cssVariables: React.CSSProperties
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(example.snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Supply truthful data with a gap for missing-data variants
  const customData = example.props?.missingValuePolicy === "gap" || example.id === "missing-data"
    ? [
        { label: "Jan", date: "Jan", time: "00:00", value: 180, latency: 40, current: 180, previous: 120, users: 45000, limit: 10000 },
        { label: "Feb", date: "Feb", time: "04:00", value: 240, latency: 55, current: 240, previous: 190, users: 52000, limit: 10000 },
        { label: "Mar", date: "Mar", time: "08:00", value: null, latency: null, current: null, previous: 220, users: null, limit: null },
        { label: "Apr", date: "Apr", time: "12:00", value: 280, latency: 45, current: 280, previous: 260, users: 63000, limit: 12000 },
        { label: "May", date: "May", time: "16:00", value: 390, latency: 70, current: 390, previous: 310, users: 78000, limit: 12000 },
        { label: "Jun", date: "Jun", time: "20:00", value: 460, latency: 85, current: 460, previous: 380, users: 84000, limit: 20000 },
        { label: "Jul", date: "Jul", time: "23:59", value: 520, latency: 95, current: 520, previous: 410, users: 95000, limit: 20000 },
      ]
    : undefined

  const variantHeight = typeof example.props?.height === "number"
    ? Math.min(Math.max(example.props.height, 180), 320)
    : 220

  const chartProps = {
    ...customColors,
    ...example.props,
    height: variantHeight,
    ...(customData ? { data: customData } : {}),
  }

  return (
    <div className="flex flex-col justify-between w-full min-w-0 max-w-full rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-3 shadow-sm hover:border-white/[0.12] transition-colors overflow-hidden">
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-200 font-sans truncate">{example.title}</h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 line-clamp-2">{example.description}</p>
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

      <div
        className="charts-surface w-full min-w-0 max-w-full rounded-xl border border-white/[0.06] bg-black/50 p-2 overflow-hidden flex items-center justify-center transition-[height,min-height] duration-200"
        style={{ minHeight: variantHeight + 16, height: variantHeight + 16, ...cssVariables }}
      >
        <DynamicChartRenderer
          registryName={registryName}
          height={variantHeight}
          motion={false}
          color={example.props?.color || customColors["color"] || customColors["primaryColor"]}
          chartProps={chartProps}
          className="w-full min-w-0 max-w-full overflow-hidden"
        />
      </div>

      <div className="w-full min-w-0 max-w-full rounded-lg overflow-hidden border border-white/[0.04] bg-black/40 p-2">
        <CodeHighlight code={example.snippet} language="tsx" showLineNumbers={false} className="w-full min-w-0 max-w-full overflow-x-auto" />
      </div>
    </div>
  )
}
