"use client"

import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, TextWrapIcon } from "@hugeicons/core-free-icons"
import { CodeHighlight } from "./code-highlight"
import { cn } from "@/lib/utils"

interface UsageSectionProps {
  chart: ChartMetadata
  basicSnippet: string
}

export function UsageSection({ chart, basicSnippet }: UsageSectionProps) {
  const [copied, setCopied] = React.useState(false)
  const [isWrapped, setIsWrapped] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(basicSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="section-usage" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          01 / Component Usage
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Basic & Interactive Integration
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Import {chart.exportName} directly into your React client component. Provide an array of observations conforming to the data shape.
        </p>
      </div>

      {/* Code + Live Mini Result Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4 sm:p-5 overflow-hidden">
        {/* Left: Code Snippet */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-zinc-400 font-medium truncate">page.tsx</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsWrapped(!isWrapped)}
                aria-label={isWrapped ? "Disable line wrapping" : "Enable line wrapping"}
                className={cn(
                  "h-7 sm:h-7.5 inline-flex items-center justify-center gap-1 px-2.5 rounded-md border text-xs font-mono whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                  isWrapped
                    ? "bg-white/[0.15] border-white/20 text-white font-medium shadow-xs"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-zinc-400 hover:text-zinc-200"
                )}
              >
                <HugeiconsIcon icon={TextWrapIcon} size={13} className="shrink-0" />
                <span>{isWrapped ? "Wrapped" : "Wrap"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="h-7 sm:h-7.5 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-zinc-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <HugeiconsIcon
                  icon={copied ? Tick02Icon : Copy01Icon}
                  size={13}
                  className={cn("shrink-0", copied ? "text-emerald-400" : "")}
                />
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/[0.06] bg-black/60 p-3 overflow-x-auto scrollbar-thin text-xs font-mono selection:bg-zinc-800">
            <CodeHighlight code={basicSnippet} language="tsx" showLineNumbers={false} isWrapped={isWrapped} />
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
            Requires a client context (<code className="text-zinc-400">&apos;use client&apos;</code>) for DOM lifecycle and container measurement.
          </p>
        </div>

        {/* Right: Expected Live Result (Mini preview) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2 pt-2 lg:pt-0 lg:border-l lg:border-white/[0.06] lg:pl-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 font-medium">Expected Result</span>
            <span className="text-[10px] font-mono text-emerald-400">Live 220px</span>
          </div>

          <div className="charts-surface rounded-xl border border-white/[0.06] bg-black/40 p-2 overflow-hidden shadow-inner flex items-center justify-center min-h-[220px]">
            <DynamicChartRenderer registryName={chart.registryName} height={200} motion={false} />
          </div>

          <span className="text-[10px] font-mono text-zinc-500 text-center">
            Container-aware width · 200px height
          </span>
        </div>
      </div>
    </section>
  )
}
