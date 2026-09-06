"use client"

import React, { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { DocsSidebar } from "./docs-sidebar"
import { type TocItem } from "@/lib/docs"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Menu01Icon,
  MenuSquareIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"

interface DocsMobileNavProps {
  currentTitle?: string
  toc?: TocItem[]
}

export function DocsMobileNav({ currentTitle = "Documentation", toc = [] }: DocsMobileNavProps) {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openToc, setOpenToc] = useState(false)

  const handleTocClick = (id: string) => {
    setOpenToc(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", `#${id}`)
    }
  }

  return (
    <div className="lg:hidden sticky top-[68px] z-30 w-full border-b border-white/[0.08] bg-zinc-950/90 backdrop-blur-md px-4 py-2.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        {/* Left: Open Navigation Drawer */}
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs px-2.5"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} size={15} strokeWidth={1.8} />
            <span className="font-medium">Docs Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="dark w-[280px] bg-zinc-950 border-zinc-800 p-6 overflow-y-auto">
            <SheetHeader className="text-left mb-4">
              <SheetTitle className="text-base text-zinc-100">Documentation</SheetTitle>
              <SheetDescription className="text-xs text-zinc-400">
                Browse installation and guides
              </SheetDescription>
            </SheetHeader>
            <DocsSidebar onSelect={() => setOpenSidebar(false)} />
          </SheetContent>
        </Sheet>

        {/* Right: "On this page" mobile popover */}
        {toc && toc.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenToc(!openToc)}
              className="h-8 gap-1.5 text-zinc-400 hover:text-zinc-200 text-xs px-2"
            >
              <HugeiconsIcon icon={MenuSquareIcon} size={14} strokeWidth={1.8} />
              <span>On this page</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                className={`transition-transform ${openToc ? "rotate-180" : ""}`}
              />
            </Button>

            {openToc && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenToc(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full mt-2 w-64 max-h-[320px] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/95 p-3 shadow-2xl z-50 backdrop-blur-xl">
                  <p className="text-[11px] font-mono uppercase text-zinc-500 mb-2 px-2">
                    Sections
                  </p>
                  <ul className="flex flex-col gap-1 text-xs">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleTocClick(item.id)}
                          className={`w-full text-left px-2 py-1.5 rounded-md truncate hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors ${
                            item.level === 3 ? "pl-4 text-zinc-400 text-[11px]" : ""
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
