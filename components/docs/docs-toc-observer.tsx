"use client"

import React, { useEffect, useState } from "react"
import { type TocItem } from "@/lib/docs"

interface DocsTocObserverProps {
  toc: TocItem[]
}

export function DocsTocObserver({ toc }: DocsTocObserverProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!toc.length) return

    const headingElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!headingElements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          )
          setActiveId(topEntry.target.id)
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      }
    )

    headingElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", `#${id}`)
      setActiveId(id)
    }
  }

  return (
    <ul className="flex flex-col gap-1.5 border-l border-white/[0.08] pl-3 py-0.5">
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
                  ? "text-zinc-100 font-medium"
                  : "text-zinc-500 hover:text-zinc-300"
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
