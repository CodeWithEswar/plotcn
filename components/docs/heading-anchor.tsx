"use client"

import React, { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

interface HeadingAnchorProps {
  level: 2 | 3 | 4
  id: string
  children: React.ReactNode
}

export function HeadingAnchor({ level, id, children }: HeadingAnchorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    window.history.pushState(null, "", `#${id}`)
  }

  const Tag = level === 2 ? "h2" : level === 3 ? "h3" : "h4"

  const sizeClasses =
    level === 2
      ? "text-2xl sm:text-[26px] font-bold text-foreground tracking-tight mt-12 mb-4"
      : level === 3
      ? "text-lg sm:text-xl font-semibold text-foreground/90 tracking-tight mt-8 mb-3"
      : "text-base font-medium text-foreground/80 mt-6 mb-2"

  return (
    <Tag id={id} className={`group relative flex items-center gap-2 scroll-mt-24 ${sizeClasses}`}>
      <span className="flex-1">{children}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy link to section "${id}"`}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle01Icon : Link01Icon}
          size={16}
          strokeWidth={1.8}
        />
      </button>
    </Tag>
  )
}
