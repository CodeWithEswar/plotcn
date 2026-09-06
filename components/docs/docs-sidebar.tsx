import React from "react"
import { docsConfig, type DocsGroup } from "@/config/docs"
import { DocsSidebarLink } from "./docs-sidebar-link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Book02Icon,
  MenuSquareIcon,
  Layers01Icon,
  ChartNetworkIcon,
} from "@hugeicons/core-free-icons"

interface DocsSidebarProps {
  onSelect?: () => void
}

const sectionIcons: Record<string, any> = {
  Guide: Book02Icon,
  "Getting Started": Book02Icon,
  Fundamentals: MenuSquareIcon,
  Menu: MenuSquareIcon,
  "Google Charts": ChartNetworkIcon,
}

export function DocsSidebar({ onSelect }: DocsSidebarProps) {
  return (
    <nav aria-label="Documentation Navigation" className="w-full flex flex-col gap-8 py-2 select-none">
      {docsConfig.navigation.map((group: DocsGroup) => {
        const Icon = sectionIcons[group.title] || Layers01Icon

        return (
          <div key={group.title} className="flex flex-col">
            {/* Section Header with Icon Box */}
            <div className="flex items-center gap-2 mb-3">
              <div className="size-5 rounded-md bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-zinc-400 shrink-0">
                <HugeiconsIcon icon={Icon} size={12} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium text-zinc-400 tracking-wide">
                {group.title}
              </span>
            </div>

            {/* Continuous Vertical Rail with Child Items */}
            <ul className="relative ml-2.5 border-l border-zinc-800 pl-4 flex flex-col gap-3.5">
              {group.items.map((item) => (
                <DocsSidebarLink
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
