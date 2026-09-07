"use client"

import React, { useState } from "react"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { EngineBadge } from "@/components/chart-detail/engine-badge"
import type { ChartEngine } from "@/lib/charts/metadata"
import { Play, Code, Sliders, Check, Copy } from "lucide-react"
import { getInstallCommand } from "@/lib/registry/install-command"
import { cn } from "@/lib/utils"

const playgroundPresets: Array<{
  id: string
  name: string
  engine: ChartEngine
  registryName: string
  description: string
}> = [
  {
    id: "recharts-line",
    name: "Recharts Spline Line",
    engine: "recharts",
    registryName: "line-basic",
    description: "Approachable Cartesian line with dark theme styling.",
  },
  {
    id: "recharts-area",
    name: "Recharts Gradient Area",
    engine: "recharts",
    registryName: "area-basic",
    description: "Volume metric distribution with vertical gradient fill.",
  },
  {
    id: "d3-anim-line",
    name: "D3 Precision Path",
    engine: "d3",
    registryName: "d3-animated-line",
    description: "Direct SVG path calculation with stroke animation.",
  },
  {
    id: "d3-force",
    name: "D3 Force Simulation",
    engine: "d3",
    registryName: "d3-force-network",
    description: "Interactive physics-driven network topology.",
  },
  {
    id: "google-geo",
    name: "Google GeoChart Map",
    engine: "google",
    registryName: "google-geochart",
    description: "Global geographic choropleth vector map.",
  },
  {
    id: "google-column",
    name: "Google Column Chart",
    engine: "google",
    registryName: "google-bar",
    description: "Hosted runtime ColumnChart with dark gridlines.",
  },
]

export function PlaygroundShell() {
  const [selectedId, setSelectedId] = useState(playgroundPresets[0].id)
  const [height, setHeight] = useState(360)
  const [copied, setCopied] = useState(false)

  const activePreset = playgroundPresets.find((p) => p.id === selectedId) || playgroundPresets[0]
  const installCmd = getInstallCommand(activePreset.registryName)

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
            <Sliders className="size-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Preset Selector</h2>
          </div>

          <div className="flex flex-col gap-2">
            {playgroundPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedId(preset.id)}
                className={cn(
                  "flex flex-col text-left p-3 rounded-xl border transition-all",
                  selectedId === preset.id
                    ? "bg-white/10 border-white/20 text-white shadow-sm"
                    : "border-white/[0.04] bg-white/[0.01] text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold">{preset.name}</span>
                  <EngineBadge engine={preset.engine} size="sm" />
                </div>
                <span className="text-[11px] text-zinc-500 line-clamp-1">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Viewport Height Slider */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>Container Height</span>
            <span>{height}px</span>
          </div>
          <input
            type="range"
            min="260"
            max="500"
            step="20"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Preview Stage */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300 font-medium">
                {activePreset.name}
              </span>
            </div>
            <EngineBadge engine={activePreset.engine} size="sm" />
          </div>

          <div className="p-6 sm:p-10 flex items-center justify-center bg-zinc-950/40">
            <div className="w-full" style={{ height }}>
              <DynamicChartRenderer registryName={activePreset.registryName} height={height} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.06] p-4 bg-white/[0.01]">
            <div className="overflow-x-auto no-scrollbar font-mono text-xs text-zinc-300">
              <span className="text-emerald-400 mr-2">$</span>
              <span>{installCmd}</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono shrink-0 ml-3 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
