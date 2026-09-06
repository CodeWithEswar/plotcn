import React from "react"

export default function DocsLoading() {
  return (
    <div className="flex flex-col min-w-0 animate-pulse">
      <div className="flex items-start justify-between gap-8 xl:gap-14 px-0 lg:px-8 min-w-0 min-h-full">
        <div className="flex-1 min-w-0 max-w-3xl py-8 lg:py-10 pb-20 sm:pb-32 space-y-6">
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-9 w-48 bg-zinc-800/60 rounded-lg" />
            <div className="h-5 w-full max-w-lg bg-zinc-800/40 rounded" />
          </div>

          {/* Action bar skeleton */}
          <div className="flex items-center gap-2.5 pt-2">
            <div className="h-8 w-28 bg-zinc-800/40 rounded-lg" />
            <div className="h-8 w-32 bg-zinc-800/40 rounded-lg" />
            <div className="h-8 w-20 bg-zinc-800/40 rounded-lg" />
          </div>

          {/* Body paragraphs skeleton */}
          <div className="space-y-4 pt-4">
            <div className="h-4 w-full bg-zinc-800/30 rounded" />
            <div className="h-4 w-5/6 bg-zinc-800/30 rounded" />
            <div className="h-4 w-4/6 bg-zinc-800/30 rounded" />
          </div>

          {/* Code block skeleton */}
          <div className="h-48 w-full rounded-xl border border-zinc-800/60 bg-zinc-950/60" />
        </div>

        {/* Right TOC placeholder */}
        <div className="hidden xl:block w-[220px] shrink-0 py-8 lg:py-10 space-y-3">
          <div className="h-4 w-24 bg-zinc-800/40 rounded" />
          <div className="space-y-2 pl-3 border-l border-white/[0.06]">
            <div className="h-3.5 w-28 bg-zinc-800/30 rounded" />
            <div className="h-3.5 w-36 bg-zinc-800/30 rounded" />
            <div className="h-3.5 w-24 bg-zinc-800/30 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
