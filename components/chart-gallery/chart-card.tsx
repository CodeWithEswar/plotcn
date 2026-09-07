"use client"

import React, { useState } from "react"
import Link from "next/link"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { EngineBadge } from "@/components/chart-detail/engine-badge"
import { DynamicChartRenderer } from "./chart-renderer"
import { getInstallCommand } from "@/lib/registry/install-command"
import { Copy, Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartCardProps {
  chart: ChartMetadata
}

export function ChartCard({ chart }: ChartCardProps) {
  const [copied, setCopied] = useState(false)
  const detailHref = `/charts/${chart.engine}/${chart.slug}`
  const installCmd = getInstallCommand(chart.registryName)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <EngineBadge engine={chart.engine} size="sm" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
              {chart.category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-primary transition-colors truncate">
            {chart.title}
          </h3>
        </div>

        {/* Quick Copy Command */}
        <button
          onClick={handleCopy}
          title={`Copy: ${installCmd}`}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          {copied ? (
            <Check className="size-4 text-emerald-400" />
          ) : (
            <Copy className="size-4" />
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4 min-h-[36px]">
        {chart.description}
      </p>

      {/* Live Preview Area */}
      <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/60 p-3">
        <DynamicChartRenderer registryName={chart.registryName} height={170} />
      </div>

      {/* Footer Features & Open Link */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {chart.features.slice(0, 2).map((feat) => (
            <span
              key={feat}
              className="text-[10px] font-mono text-zinc-400 truncate bg-white/[0.03] px-2 py-0.5 rounded"
            >
              {feat}
            </span>
          ))}
        </div>

        <Link
          href={detailHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2"
        >
          <span>View Source</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
