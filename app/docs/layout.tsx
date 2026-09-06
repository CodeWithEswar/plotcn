import React from "react"
import { SiteHeader } from "@/components/site/site-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="docs-shell min-h-screen bg-[#060608] text-foreground flex flex-col">
      <SiteHeader />

      <div className="flex-1 w-full mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-start min-h-[calc(100svh-80px)]">
          {/* Desktop Left Sticky Navigation */}
          <aside className="hidden lg:block w-[220px] shrink-0 self-start sticky top-[80px] h-[calc(100svh-80px)] overflow-y-auto no-scrollbar py-8 lg:py-10 pr-5 border-r border-white/[0.08]">
            <DocsSidebar />
          </aside>

          {/* Center Content & Right TOC Region */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
