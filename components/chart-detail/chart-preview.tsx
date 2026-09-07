"use client"

import React, { useState } from "react"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { Laptop, Tablet, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartPreviewProps {
  registryName: string
  title: string
}

export function ChartPreview({ registryName, title }: ChartPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const widthClasses = {
    desktop: "w-full",
    tablet: "w-full max-w-2xl",
    mobile: "w-full max-w-md",
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden shadow-2xl backdrop-blur-md mb-8">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-400">Interactive Preview</span>
        </div>

        {/* Viewport Width Controls */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setDevice("desktop")}
            title="Desktop view (100%)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "desktop" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            <Laptop className="size-4" />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            title="Tablet view (768px)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "tablet" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            <Tablet className="size-4" />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            title="Mobile view (480px)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "mobile" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            <Smartphone className="size-4" />
          </button>
        </div>
      </div>

      {/* Preview Stage */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-zinc-950/40 min-h-[360px] overflow-hidden">
        <div className={cn("transition-all duration-300 mx-auto", widthClasses[device])}>
          <DynamicChartRenderer registryName={registryName} height={320} />
        </div>
      </div>

      {/* Bottom Status / Meta */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2 text-[11px] font-mono text-zinc-400 bg-white/[0.01]">
        <span>Isolated Preview Boundary</span>
        <span>Viewport: {device.toUpperCase()}</span>
      </div>
    </div>
  )
}
