import React from "react"
import { type TocItem } from "@/lib/docs"
import { DocsTocObserver } from "./docs-toc-observer"

interface DocsTocProps {
  toc: TocItem[]
}

export function DocsToc({ toc }: DocsTocProps) {
  if (!toc || toc.length === 0) {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-3 text-xs select-none">
      <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </p>

      <DocsTocObserver toc={toc} />
    </div>
  )
}
