"use client"

import React, { useState } from "react"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerIcon, Tablet01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export interface ChartPreviewProps {
  registryName?: string
  name?: string
  title?: string
}

export function ChartPreview({ registryName: propRegistryName, name, title }: ChartPreviewProps) {
  const registryName = propRegistryName || name || ""
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const widthClasses = {
    desktop: "w-full",
    tablet: "w-full max-w-2xl",
    mobile: "w-full max-w-md",
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card/80 overflow-hidden shadow-2xl backdrop-blur-md mb-8">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-foreground/60 animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">Interactive Preview</span>
        </div>

        {/* Viewport Width Controls */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
          <button
            onClick={() => setDevice("desktop")}
            title="Desktop view (100%)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "desktop" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={ComputerIcon} size={15} />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            title="Tablet view (768px)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "tablet" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            <HugeiconsIcon icon={Tablet01Icon} size={15} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            title="Mobile view (480px)"
            className={cn(
              "p-1.5 rounded text-xs transition-colors",
              device === "mobile" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            <HugeiconsIcon icon={SmartPhone01Icon} size={15} />
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
