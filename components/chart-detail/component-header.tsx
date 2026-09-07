"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  SourceCodeIcon,
  GithubIcon,
  Copy01Icon,
  Tick02Icon,
  ComputerTerminal01Icon,
} from "@hugeicons/core-free-icons"
import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartDetailDoc } from "@/lib/charts/detail-docs/types"
import { engineLabels } from "@/lib/charts/filters"
import { getCategoryLabel } from "@/lib/charts/categories"
import {
  type PackageManager,
  getInstallCommand,
  getStoredPackageManager,
  setStoredPackageManager,
} from "@/lib/registry/install-command"
import { EngineBrandBadge } from "./engine-badge"
import { PackageManagerLogo } from "@/components/registry/package-manager-logo"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

interface ComponentHeaderProps {
  chart: ChartMetadata
  doc: ChartDetailDoc
}

const PACKAGE_MANAGERS: readonly PackageManager[] = ["pnpm", "npm", "yarn", "bun"]

export function ComponentHeader({ chart }: ComponentHeaderProps) {
  const [pm, setPm] = useState<PackageManager>("pnpm")
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setPm(getStoredPackageManager())
  }, [])

  const handlePmChange = (newPm: PackageManager) => {
    setPm(newPm)
    setStoredPackageManager(newPm)
  }

  const command = useMemo(() => getInstallCommand(chart.registryName, pm), [chart.registryName, pm])

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command)
        setCopied(true)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = command
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopied(true)
      }

      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <header className="space-y-4 pt-1 pb-6 border-b border-white/[0.08]">
      {/* 1. Sleek Minimal Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
        <Link href="/charts" className="hover:text-zinc-200 transition-colors">
          Charts
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="opacity-40" />
        <Link
          href={`/charts?engine=${chart.engine}`}
          className="hover:text-zinc-200 transition-colors"
        >
          {engineLabels[chart.engine]}
        </Link>
        <HugeiconsIcon icon={ArrowRight01Icon} size={11} className="opacity-40" />
        <span className="text-zinc-300 font-medium">{chart.title}</span>
      </nav>

      {/* 2. Main Title Row + Action Links */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans">
              {chart.title}
            </h1>
            <EngineBrandBadge engine={chart.engine} />
          </div>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {chart.description}
          </p>

          {/* Minimal Inline Metadata Tags */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400">
              {getCategoryLabel(chart.category)}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400 uppercase">
              {chart.renderer}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Responsive
            </span>
          </div>
        </div>

        {/* Minimal Action Links */}
        <div className="flex items-center gap-2 shrink-0 self-start">
          <a
            href="#section-source"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition-colors"
          >
            <HugeiconsIcon icon={SourceCodeIcon} size={13} />
            Source
          </a>
          <a
            href={`${siteConfig.github}/blob/main/${chart.componentPath}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition-colors"
          >
            <HugeiconsIcon icon={GithubIcon} size={13} />
            GitHub
          </a>
        </div>
      </div>

      {/* 3. Sleek, Low-Profile Install Command Bar */}
      <div className="flex items-center justify-between gap-2.5 rounded-lg border border-white/[0.08] bg-zinc-950/70 p-2 sm:px-3 text-xs font-mono shadow-xs w-full max-w-2xl">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <HugeiconsIcon
            icon={ComputerTerminal01Icon}
            size={14}
            className="text-zinc-500 shrink-0"
            aria-hidden="true"
          />
          {/* Quick PM Switcher with Official Brand Logos */}
          <div className="flex items-center gap-1 shrink-0 border-r border-white/[0.08] pr-2.5 mr-0.5">
            {PACKAGE_MANAGERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePmChange(p)}
                aria-label={`Switch to ${p}`}
                title={p}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono transition-all cursor-pointer select-none",
                  pm === p
                    ? "bg-white/[0.12] text-white font-medium shadow-xs border border-white/[0.1]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <PackageManagerLogo
                  manager={p}
                  size={14}
                  variant="colored"
                  className={cn(
                    "transition-transform duration-150 shrink-0",
                    pm === p ? "scale-105 opacity-100" : "opacity-75 hover:opacity-100"
                  )}
                />
                <span className="hidden sm:inline">{p}</span>
              </button>
            ))}
          </div>
          <div
            className="truncate text-zinc-300 select-all font-mono text-xs"
            tabIndex={0}
            role="region"
            aria-label="Install command line"
          >
            {command}
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${pm} install command to clipboard`}
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium transition-all shrink-0 cursor-pointer",
            copied
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08]"
          )}
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={12}
            className={cn("transition-transform duration-150", copied && "scale-110")}
          />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </header>
  )
}
