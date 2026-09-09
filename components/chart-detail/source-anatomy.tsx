"use client"

import React, { useState } from "react"
import type { SourceAnatomyDoc } from "@/lib/charts/detail-docs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, File01Icon, SourceCodeIcon, TextWrapIcon } from "@hugeicons/core-free-icons"
import { CodeHighlight } from "./code-highlight"
import { cn } from "@/lib/utils"

interface SourceAnatomyProps {
  anatomy: SourceAnatomyDoc
  sourceCode: string
  highlightedSourceCode?: string
  componentPath: string
}

export function SourceAnatomy({ anatomy, sourceCode, highlightedSourceCode, componentPath }: SourceAnatomyProps) {
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="section-source" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-muted-foreground font-semibold uppercase">
          07 / Source Anatomy
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Internal Architecture & File Dependencies
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Source-first ownership model. Inspect the exact component call tree, dependencies, and full implementation below.
        </p>
      </div>

      {/* Module Hierarchy Tree with CSS Connectors */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-5 space-y-3 font-mono text-xs">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          Component Architecture Call Tree
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-white/[0.04] text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <span>●</span>
            <span>{anatomy.tree.name}</span>
            <span className="text-[10px] text-zinc-500 font-normal">({anatomy.tree.role})</span>
          </div>

          {anatomy.tree.children?.map((child, i, arr) => {
            const isLast = i === arr.length - 1
            return (
              <div key={child.name} className="pl-4 border-l border-white/[0.1] ml-1.5 space-y-1 py-1">
                <div className="flex items-center gap-2 text-zinc-200">
                  <span className="text-zinc-500">{isLast ? "└──" : "├──"}</span>
                  <span className="font-medium text-sky-400">{child.name}</span>
                  <span className="text-[10px] text-zinc-500">[{child.role}]</span>
                </div>
                <p className="pl-6 text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {child.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Real Source Files Involved */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Involved Source Files & Registry Assets
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {anatomy.sourceFiles.map((file) => (
            <div
              key={file.path}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-white/[0.06] bg-zinc-900/40 text-xs font-mono"
            >
              <HugeiconsIcon icon={File01Icon} size={15} className="text-zinc-500 shrink-0 mt-0.5" />
              <div className="min-w-0 space-y-0.5">
                <div className="text-zinc-200 font-medium truncate">{file.path}</div>
                <div className="text-[11px] text-zinc-400 font-sans leading-relaxed">{file.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Inline Source Viewer */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/90 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2.5 sm:px-4 bg-white/[0.02] gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 min-w-0 flex-1 mr-1">
            <HugeiconsIcon icon={SourceCodeIcon} size={14} className="text-muted-foreground shrink-0" />
            <span className="font-semibold truncate" title={componentPath}>{componentPath}</span>
          </div>

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
              className="h-7 sm:h-7.5 inline-flex items-center justify-center gap-1.5 px-2.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-mono text-zinc-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                size={13}
                className={cn("shrink-0", copied ? "text-emerald-400" : "")}
              />
              <span>
                {copied ? "Copied" : <>Copy<span className="hidden xs:inline"> Source</span></>}
              </span>
            </button>
          </div>
        </div>

        <div className="relative max-h-[500px] overflow-auto scrollbar-thin p-3 font-mono text-xs bg-black/60 selection:bg-zinc-800">
          <CodeHighlight
            code={sourceCode || "// Source code unavailable"}
            language="tsx"
            initialHtml={highlightedSourceCode}
            showLineNumbers={true}
            isWrapped={isWrapped}
          />
        </div>
      </div>
    </section>
  )
}
