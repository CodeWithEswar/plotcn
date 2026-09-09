"use client"

import React, { useEffect, useState } from "react"
import { type TocItem } from "@/lib/docs"

interface DocsTocObserverProps {
  toc: TocItem[]
}

export function DocsTocObserver({ toc }: DocsTocObserverProps) {
  const [activeId, setActiveId] = useState<string>("")

  const isManualScrolling = React.useRef(false)
  const manualScrollTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !toc.length) return

    const updateActiveSection = () => {
      if (isManualScrolling.current) return

      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollY < 120) {
        if (toc[0]) setActiveId(toc[0].id)
        return
      }

      if (windowHeight + scrollY >= documentHeight - 60) {
        for (let i = toc.length - 1; i >= 0; i--) {
          if (document.getElementById(toc[i].id)) {
            setActiveId(toc[i].id)
            return
          }
        }
      }

      const readingOffset = 130
      const elementsWithPos = toc
        .map((item) => {
          const el = document.getElementById(item.id)
          return el ? { id: item.id, top: el.getBoundingClientRect().top } : null
        })
        .filter((item): item is { id: string; top: number } => item !== null)

      if (!elementsWithPos.length) return

      let active = elementsWithPos[0]
      for (const item of elementsWithPos) {
        if (item.top <= readingOffset) {
          active = item
        } else {
          break
        }
      }

      setActiveId(active.id)
    }

    let rafId: number | null = null
    const onScroll = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection()
        rafId = null
      })
    }

    updateActiveSection()
    const timer1 = setTimeout(updateActiveSection, 150)
    const timer2 = setTimeout(updateActiveSection, 500)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
    }
  }, [toc])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      isManualScrolling.current = true
      if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current)
      setActiveId(id)

      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = Math.max(0, elementPosition - headerOffset)

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      window.history.pushState(null, "", `#${id}`)

      manualScrollTimer.current = setTimeout(() => {
        isManualScrolling.current = false
      }, 800)
    }
  }

  return (
    <ul className="flex flex-col gap-1.5 border-l border-border pl-3 py-0.5">
      {toc.map((item) => {
        const isActive = activeId === item.id
        const isH3 = item.level === 3

        return (
          <li key={item.id} className={isH3 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block py-1 transition-colors leading-normal truncate ${
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
