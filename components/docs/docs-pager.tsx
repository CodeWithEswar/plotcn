import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { type DocsItem } from "@/config/docs"

interface DocsPagerProps {
  prev: DocsItem | null
  next: DocsItem | null
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  if (!prev && !next) return null

  return (
    <div className="mt-14 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={prev.href}
          prefetch={true}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-white/[0.08] hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 transition-all text-left"
        >
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Previous
          </span>
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.href}
          prefetch={true}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-white/[0.08] hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/40 transition-all text-right items-end sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  )
}
