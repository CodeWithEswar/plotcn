"use client"

import React from "react"
import type { ResponsiveBreakpointDoc } from "@/lib/charts/detail-docs/types"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerIcon, Tablet01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons"

interface ResponsiveSectionProps {
  overview: string
  breakpoints: readonly ResponsiveBreakpointDoc[]
  registryName: string
}

export function ResponsiveSection({ overview, breakpoints, registryName }: ResponsiveSectionProps) {
  return (
    <section id="section-responsive" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          05 / Responsive Lab
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Container-Driven Breakpoints
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {overview}
        </p>
      </div>

      {/* Breakpoint Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {breakpoints.map((bp, i) => (
          <div key={bp.name} className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
              <HugeiconsIcon icon={i === 0 ? ComputerIcon : i === 1 ? Tablet01Icon : SmartPhone01Icon} size={14} />
              <span>{bp.name}</span>
              <span className="text-zinc-500 font-normal">({bp.width})</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{bp.behavior}</p>
          </div>
        ))}
      </div>

      {/* Side-by-Side Responsive Viewports */}
      <div className="space-y-4">
        {/* Tablet Simulated Container (768px max) */}
        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <HugeiconsIcon icon={Tablet01Icon} size={14} />
              Tablet Preview (768px Container Constraint)
            </span>
            <span className="text-[10px] text-zinc-500">Auto-measuring</span>
          </div>

          <div className="max-w-[768px] mx-auto charts-surface rounded-xl border border-white/[0.06] bg-zinc-950/80 p-3 shadow-md">
            <DynamicChartRenderer registryName={registryName} height={200} motion={false} />
          </div>
        </div>

        {/* Mobile Simulated Container (390px max) */}
        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <HugeiconsIcon icon={SmartPhone01Icon} size={14} />
              Mobile Preview (390px Container Constraint)
            </span>
            <span className="text-[10px] text-zinc-500">Compact tap region</span>
          </div>

          <div className="max-w-[390px] mx-auto charts-surface rounded-xl border border-white/[0.06] bg-zinc-950/80 p-3 shadow-md">
            <DynamicChartRenderer registryName={registryName} height={180} motion={false} />
          </div>
        </div>
      </div>
    </section>
  )
}
