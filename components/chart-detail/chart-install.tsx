"use client"

import React, { useState } from "react"
import { getInstallCommand, type PackageManager } from "@/lib/registry/install-command"
import { Copy, Check, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartInstallProps {
  registryName: string
}

export function ChartInstall({ registryName }: ChartInstallProps) {
  const [pm, setPm] = useState<PackageManager>("npm")
  const [copied, setCopied] = useState(false)

  const command = getInstallCommand(registryName, pm)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/70 overflow-hidden shadow-lg backdrop-blur-md mb-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-zinc-400" />
          <span className="text-xs font-semibold text-white">Install Component</span>
        </div>

        {/* Package Manager Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
          {(["npm", "pnpm", "yarn", "bun"] as const).map((mgr) => (
            <button
              key={mgr}
              onClick={() => setPm(mgr)}
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-mono transition-colors",
                pm === mgr ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              {mgr}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Command Row */}
      <div className="flex items-center justify-between gap-4 p-4 font-mono text-xs">
        <div className="overflow-x-auto no-scrollbar py-1">
          <span className="text-emerald-400 select-none mr-2">$</span>
          <span className="text-zinc-200">{command}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white text-xs shrink-0 border border-white/[0.08] transition-colors"
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
  )
}
