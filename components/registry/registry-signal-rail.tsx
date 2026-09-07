"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface RegistrySignalRailProps {
  registryName: string
  isVerified?: boolean
  copied?: boolean
  className?: string
}

/**
 * RegistrySignalRail (Section 35, 53, 55)
 * Technical breadcrumb rail: PLOTCN / REGISTRY / [NAME] / SOURCE
 * Reflects verified registry presence truthfully and shows copy status transitions.
 */
export function RegistrySignalRail({
  registryName,
  isVerified = false,
  copied = false,
  className,
}: RegistrySignalRailProps) {
  const cleanName = registryName.replace(/\.json$/, "").toUpperCase()

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
        className
      )}
      aria-label="Registry component verification and status"
    >
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="font-semibold text-foreground/80">PLOTCN</span>
        <span className="text-muted-foreground/40">/</span>
        <span>REGISTRY</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="font-medium text-foreground">{cleanName}</span>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-muted-foreground/70">SOURCE</span>
      </div>

      {/* Verification / Copy Status Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        {copied ? (
          <span
            role="status"
            className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-500 transition-colors animate-in fade-in"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            COPIED
          </span>
        ) : isVerified ? (
          <span className="inline-flex items-center gap-1 rounded bg-foreground/[0.04] px-1.5 py-0.5 text-[9px] font-medium text-foreground/80 border border-border/50">
            <span className="size-1.5 rounded-full bg-emerald-500/80" aria-hidden="true" />
            REGISTRY VERIFIED
          </span>
        ) : null}
      </div>
    </div>
  )
}
