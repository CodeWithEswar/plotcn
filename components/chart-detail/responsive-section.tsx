"use client"

import React from "react"
import type { ResponsiveBreakpointDoc } from "@/lib/charts/detail-docs/types"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerIcon, Tablet01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons"
import { useChartColors } from "./chart-color-context"

interface ResponsiveSectionProps {
  overview: string
  breakpoints: readonly ResponsiveBreakpointDoc[]
  registryName: string
}

export function ResponsiveSection({ overview, breakpoints, registryName }: ResponsiveSectionProps) {
  const colorContext = useChartColors()
  const customColors = colorContext.customColors
  const activeColor = customColors["color"] || customColors["primaryColor"]

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {breakpoints.map((bp, i) => {
          const cleanName = bp.name.replace(/\s*\(.*?\)\s*/g, "").trim() || bp.name
          return (
            <div
              key={bp.name}
              className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-2.5 shadow-xs backdrop-blur-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 min-w-0">
                  <HugeiconsIcon
                    icon={i === 0 ? ComputerIcon : i === 1 ? Tablet01Icon : SmartPhone01Icon}
                    size={15}
                    className="shrink-0 text-emerald-400"
                  />
                  <span className="truncate">{cleanName}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/[0.08] bg-white/[0.03] text-zinc-400 shrink-0 font-medium">
                  {bp.width}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans flex-1">
                {bp.behavior}
              </p>
            </div>
          )
        })}
      </div>

      {/* Side-by-Side Responsive Viewports */}
      <div className="space-y-4">
        {/* Tablet Simulated Container (768px max) */}
        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 sm:p-4 space-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <HugeiconsIcon icon={Tablet01Icon} size={14} className="shrink-0 text-emerald-400" />
              Tablet Preview (768px Container Constraint)
            </span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Auto-measuring</span>
          </div>

          <div
            className="w-full max-w-[768px] mx-auto charts-surface rounded-xl border border-white/[0.06] bg-zinc-950/80 p-2 sm:p-3 shadow-md overflow-hidden"
            style={colorContext.cssVariables}
          >
            <DynamicChartRenderer
              registryName={registryName}
              height={200}
              motion={false}
              color={activeColor}
              chartProps={customColors}
            />
          </div>
        </div>

        {/* Mobile Simulated Container (390px max) */}
        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-3.5 sm:p-4 space-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <HugeiconsIcon icon={SmartPhone01Icon} size={14} className="shrink-0 text-emerald-400" />
              Mobile Preview (390px Container Constraint)
            </span>
            <span className="text-[10px] text-zinc-500 hidden sm:inline">Compact tap region</span>
          </div>

          <div
            className="w-full max-w-[390px] mx-auto charts-surface rounded-xl border border-white/[0.06] bg-zinc-950/80 p-2 sm:p-3 shadow-md overflow-hidden"
            style={colorContext.cssVariables}
          >
            <DynamicChartRenderer
              registryName={registryName}
              height={180}
              motion={false}
              color={activeColor}
              chartProps={customColors}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
