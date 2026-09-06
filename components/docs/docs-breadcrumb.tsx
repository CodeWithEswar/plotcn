import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

interface DocsBreadcrumbProps {
  section: string
  title: string
}

export function DocsBreadcrumb({ section, title }: DocsBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumbs" className="mb-4 flex items-center gap-1.5 text-xs text-zinc-400 select-none">
      <Link href="/docs" className="hover:text-zinc-200 transition-colors">
        Docs
      </Link>
      <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-zinc-600" />
      <span className="text-zinc-400">{section}</span>
      <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="text-zinc-600" />
      <span className="text-zinc-200 font-medium truncate">{title}</span>
    </nav>
  )
}
