"use client"

import React, { useState } from "react"
import type { PropDoc, PropCategory } from "@/lib/charts/detail-docs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, SparklesIcon, ColorsIcon } from "@hugeicons/core-free-icons"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { CustomColorDialog } from "./custom-color-dialog"
import { cn } from "@/lib/utils"

interface PropsExplorerProps {
  propsList: readonly PropDoc[]
  chartId: string
  sampleData: readonly any[]
  registryName: string
}

const categoryLabels: Record<PropCategory, string> = {
  core: "Core",
  visual: "Appearance",
  interaction: "Interaction",
  a11y: "Accessibility",
  advanced: "Advanced",
}

export function PropsExplorer({ propsList, registryName }: PropsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filtered props list for the table
  const filteredProps = propsList.filter((prop) => {
    const matchesCategory = selectedCategory === "all" || prop.category === selectedCategory
    const matchesSearch =
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Visual previewable props for the Prop Preview Lab
  const previewableProps = propsList.filter((p) => p.previewable)

  return (
    <section id="section-props" className="space-y-8 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          03 / Component API
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Props Reference & Interactive Prop Lab
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Inspect every component property, understand default behaviors, and interact with the visual Prop Lab to preview styling configurations in real-time.
        </p>
      </div>

      {/* ── Part A: Interactive Prop Preview Lab ────────────────────────── */}
      {previewableProps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
            <HugeiconsIcon icon={SparklesIcon} size={14} className="text-emerald-400" />
            <span>Interactive Prop Preview Lab</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {previewableProps.map((prop) => (
              <PropLabCard
                key={prop.name}
                prop={prop}
                registryName={registryName}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Part B: Complete Props Reference Table ──────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-300 font-medium uppercase tracking-wider">
            All Properties ({propsList.length})
          </div>

          {/* Category Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900/80 border border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer",
                  selectedCategory === "all" ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                All
              </button>
              {(["core", "visual", "advanced"] as PropCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer",
                    selectedCategory === cat ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Filter props..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-zinc-950 text-xs text-zinc-200 placeholder:text-zinc-500 font-mono outline-none focus:border-white/20 w-36 sm:w-44"
            />
          </div>
        </div>

        {/* Props Table */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] font-mono text-[11px] text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Prop</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Default</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {filteredProps.map((prop) => (
                  <tr key={prop.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 align-top font-mono font-semibold text-emerald-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{prop.name}</span>
                        {prop.required && (
                          <span className="text-[9px] font-mono uppercase text-rose-400 bg-rose-500/10 px-1 py-0.2 rounded border border-rose-500/20">
                            req
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-sky-400 whitespace-nowrap">{prop.type}</td>
                    <td className="px-4 py-3 align-top font-mono text-zinc-400 whitespace-nowrap">{prop.default}</td>
                    <td className="px-4 py-3 align-top leading-relaxed text-zinc-300">
                      <div>{prop.description}</div>
                      {prop.bestFor && (
                        <div className="text-[11px] text-zinc-500 mt-1 font-sans">
                          <span className="text-zinc-400 font-medium">Best for: </span>
                          {prop.bestFor}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function PropLabCard({
  prop,
  registryName,
}: {
  prop: PropDoc
  registryName: string
}) {
  const [currentVal, setCurrentVal] = useState<any>(
    prop.controlOptions?.[0]?.value ?? (prop.name === "showGrid" ? true : prop.name === "pointSize" ? 5 : "function")
  )
  const [copied, setCopied] = useState(false)
  const [customColorOpen, setCustomColorOpen] = useState(false)

  const isColorProp = prop.name === "color"
  const propSnippet = typeof currentVal === "string" ? `${prop.name}="${currentVal}"` : `${prop.name}={${currentVal}}`

  const handleCopy = () => {
    navigator.clipboard.writeText(propSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Construct prop overrides for live chart rendering
  const chartPropsOverride: Record<string, any> = {
    [prop.name]: currentVal,
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 space-y-3.5 backdrop-blur-sm shadow-md transition-all hover:border-white/[0.12]">
      {/* Card Header: Prop Name + Type Badge + Copy Action */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-emerald-400">{prop.name}</span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.2 rounded">
              {prop.type}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{prop.description}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${prop.name} prop snippet`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-[11px] font-mono text-zinc-300 transition-colors shrink-0 cursor-pointer"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={12} className={copied ? "text-emerald-400" : ""} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Interactive Controls (Segmented Pill Switcher + Optional Color Customizer) */}
      {prop.controlOptions && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Select value to preview live:</span>
            {isColorProp && (
              <span className="text-zinc-400 normal-case flex items-center gap-1">
                <span
                  className="size-2 rounded-full inline-block border border-white/30"
                  style={{ backgroundColor: typeof currentVal === "string" ? currentVal : "#10b981" }}
                />
                {String(currentVal)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/[0.06]" role="group" aria-label={`${prop.name} options`}>
            {prop.controlOptions.map((opt) => {
              const active = currentVal === opt.value
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCurrentVal(opt.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer",
                    active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  {isColorProp && (
                    <span
                      className="size-2.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: String(opt.value) }}
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              )
            })}

            {/* Professional Customize Color Button */}
            {isColorProp && (
              <button
                type="button"
                onClick={() => setCustomColorOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all cursor-pointer ml-auto"
              >
                <HugeiconsIcon icon={ColorsIcon} size={12} className="text-emerald-400" />
                <span>Custom Color...</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live Mini Preview Canvas (~190px) */}
      <div className="space-y-1">
        <div className="charts-surface rounded-xl border border-white/[0.06] bg-black/50 p-2 overflow-hidden min-h-[190px] flex items-center justify-center">
          <DynamicChartRenderer
            key={registryName}
            registryName={registryName}
            height={170}
            motion={false}
            color={isColorProp ? currentVal : undefined}
            chartProps={chartPropsOverride}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1 pt-1">
          <span>Active: <code className="text-zinc-300 font-semibold">{propSnippet}</code></span>
          <span>Default: {prop.default}</span>
        </div>
      </div>

      {/* Professional Custom Color Dialog */}
      {isColorProp && (
        <CustomColorDialog
          open={customColorOpen}
          onOpenChange={setCustomColorOpen}
          currentColor={String(currentVal)}
          onApplyColor={(color) => setCurrentVal(color)}
        />
      )}
    </div>
  )
}
