"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  label: string
  index?: string
}

const defaultTocItems: TocItem[] = [
  { id: "section-preview", label: "Preview Lab", index: "00" },
  { id: "section-usage", label: "Usage", index: "01" },
  { id: "section-data", label: "Data Format", index: "02" },
  { id: "section-props", label: "Props Reference", index: "03" },
  { id: "section-examples", label: "Examples & States", index: "04" },
  { id: "section-responsive", label: "Responsive Lab", index: "05" },
  { id: "section-accessibility", label: "Accessibility", index: "06" },
  { id: "section-source", label: "Source Anatomy", index: "07" },
  { id: "section-related", label: "Related Charts", index: "08" },
]

export function ChartDetailToc({ items = defaultTocItems }: { items?: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("section-preview")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0% -60% 0%" }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return (
    <aside className="space-y-3 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin pr-2">
      <div className="text-[11px] font-mono tracking-widest text-zinc-400 font-semibold uppercase">
        On this page
      </div>

      <nav aria-label="Table of contents" className="space-y-1 text-xs font-sans">
        {items.map((item) => {
          const active = activeId === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "group flex items-center gap-2 py-1.5 px-2 rounded-md transition-all text-xs",
                active
                  ? "text-emerald-400 font-medium bg-emerald-500/10 border-l-2 border-emerald-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
              )}
            >
              {item.index && (
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-400"
                  )}
                >
                  {item.index}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
