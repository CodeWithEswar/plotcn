"use client"

import React, { useState } from "react"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChartCodeProps {
  sourceCode: string
  usageSnippet?: string
  dataShape?: string
  componentPath: string
}

export function ChartCode({
  sourceCode,
  usageSnippet = "",
  dataShape = "",
  componentPath,
}: ChartCodeProps) {
  const [tab, setTab] = useState<"usage" | "source" | "data">("usage")
  const [copied, setCopied] = useState(false)

  const activeContent = tab === "usage" ? usageSnippet : tab === "source" ? sourceCode : dataShape

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col rounded-2xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden shadow-xl backdrop-blur-md mb-8">
      {/* Top Header with Tabs & Copy Button */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("usage")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
              tab === "usage" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            Usage Example
          </button>
          <button
            onClick={() => setTab("source")}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
              tab === "source" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            Component Code
          </button>
          {dataShape && (
            <button
              onClick={() => setTab("data")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                tab === "data" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
              )}
            >
              Data Shape
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline truncate max-w-[200px]">
            {tab === "source" ? componentPath : tab === "data" ? "types.ts" : "page.tsx"}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative max-h-[460px] overflow-y-auto overflow-x-auto p-4 font-mono text-xs text-zinc-200 bg-zinc-950/60 leading-relaxed no-scrollbar">
        <pre>
          <code>{activeContent || "// No code available"}</code>
        </pre>
      </div>
    </div>
  )
}
