"use client"

import React, { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Share2, FileCode, Check } from "lucide-react"

export interface ChartActionsProps {
  registryName: string
  componentPath: string
}

export function ChartActions({ registryName, componentPath }: ChartActionsProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const registryJsonUrl = `/r/${registryName}.json`
  const githubSourceUrl = `${siteConfig.github}/blob/main/${componentPath}`

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      {/* Inspect Registry Manifest */}
      <Link
        href={registryJsonUrl}
        target="_blank"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-950/60 hover:bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
      >
        <FileCode className="size-3.5 text-zinc-400" />
        <span>Inspect registry.json</span>
      </Link>

      {/* GitHub Source Link */}
      <a
        href={githubSourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-950/60 hover:bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
      >
        <svg viewBox="0 0 24 24" className="size-3.5 text-zinc-400" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
        <span>Source on GitHub</span>
      </a>

      {/* Share Page */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-zinc-950/60 hover:bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
      >
        {copiedLink ? (
          <>
            <Check className="size-3.5 text-emerald-400" />
            <span className="text-emerald-400">URL Copied</span>
          </>
        ) : (
          <>
            <Share2 className="size-3.5 text-zinc-400" />
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  )
}
