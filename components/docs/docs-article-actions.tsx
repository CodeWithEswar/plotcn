"use client"

import React, { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit02Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  ArrowDown01Icon,
  GithubIcon,
  SourceCodeIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import { site } from "@/lib/site"

interface DocsArticleActionsProps {
  rawContent: string
  slug: string
}

export function DocsArticleActions({ rawContent, slug }: DocsArticleActionsProps) {
  const [copied, setCopied] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)

  const githubFileMap: Record<string, string> = {
    introduction: "getting-started/introduction.mdx",
    installation: "getting-started/installation.mdx",
    "project-setup": "getting-started/project-setup.mdx",
    shadcn: "getting-started/shadcn-setup.mdx",
    registry: "getting-started/registry.mdx",
    usage: "fundamentals/usage.mdx",
    theming: "fundamentals/theming.mdx",
    accessibility: "fundamentals/accessibility.mdx",
  }

  const relativePath = githubFileMap[slug] || `getting-started/${slug}.mdx`
  const githubUrl = `${site.github}/blob/main/content/docs/${relativePath}`

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(rawContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 my-6 select-none">
      {/* 1. Edit on GitHub */}
      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border transition-colors shadow-xs"
      >
        <HugeiconsIcon icon={Edit02Icon} size={14} strokeWidth={1.8} className="text-muted-foreground" />
        <span>Edit on GitHub</span>
      </a>

      {/* 2. Copy Markdown */}
      <button
        type="button"
        onClick={handleCopyMarkdown}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border transition-colors shadow-xs"
      >
        <HugeiconsIcon
          icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
          size={14}
          strokeWidth={1.8}
          className={copied ? "text-foreground" : "text-muted-foreground"}
        />
        <span>{copied ? "Copied Markdown" : "Copy Markdown"}</span>
      </button>

      {/* 3. Open Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border transition-colors shadow-xs"
        >
          <span>Open</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={12}
            className={`text-muted-foreground transition-transform ${openDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {openDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpenDropdown(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-52 rounded-xl border border-border bg-popover text-popover-foreground p-1.5 shadow-xl z-50 backdrop-blur-xl">
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenDropdown(false)}
                className="group flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <HugeiconsIcon icon={GithubIcon} size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>View on GitHub</span>
              </a>
              <a
                href={`${site.github}/raw/main/content/docs/${relativePath}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenDropdown(false)}
                className="group flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <HugeiconsIcon icon={SourceCodeIcon} size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>View Raw Content</span>
              </a>
              <a
                href={`${site.github}/issues/new`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpenDropdown(false)}
                className="group flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <HugeiconsIcon icon={AlertCircleIcon} size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Report Issue</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
