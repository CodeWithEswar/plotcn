"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  CheckmarkCircle01Icon,
  ComputerTerminal01Icon,
} from "@hugeicons/core-free-icons"
import { PackageManagerIcon } from "./installation/package-manager-icons"
import { useOptionalInstallation } from "./installation/installation-context"
import { type PackageManager, formatCommand } from "./package-manager-utils"
export type { PackageManager }
export { formatCommand }

export interface PackageManagerTabsProps {
  command?: string
  commands?: Partial<Record<PackageManager, string>>
  highlightedCommands?: Partial<Record<PackageManager, string>>
}

export function PackageManagerTabs({
  command = "",
  commands,
  highlightedCommands,
}: PackageManagerTabsProps) {
  // Synchronize with global installation context if available
  const installation = useOptionalInstallation()
  const [localTab, setLocalTab] = useState<PackageManager>("pnpm")
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    React.startTransition(() => {
      setMounted(true)
      const stored = (localStorage.getItem("plotcn-preferred-pm") || localStorage.getItem("plotcn_pkg_mgr")) as PackageManager | null
      if (stored && ["pnpm", "npm", "yarn", "bun"].includes(stored)) {
        setLocalTab(stored)
      }
    })
    const handlePmChangeEvt = (e: Event) => {
      const customEvent = e as CustomEvent<PackageManager>
      if (customEvent.detail && ["pnpm", "npm", "yarn", "bun"].includes(customEvent.detail)) {
        setLocalTab(customEvent.detail)
      }
    }
    window.addEventListener("plotcn-pm-change", handlePmChangeEvt)
    return () => window.removeEventListener("plotcn-pm-change", handlePmChangeEvt)
  }, [])

  // Priority: global context packageManager if mounted & inside provider, otherwise localTab
  const activeTab: PackageManager = mounted && installation
    ? installation.packageManager
    : localTab

  const handleTabChange = (val: string) => {
    const pkg = val as PackageManager
    setLocalTab(pkg)
    if (installation?.setPackageManager) {
      installation.setPackageManager(pkg)
    }
    try {
      localStorage.setItem("plotcn-preferred-pm", pkg)
      localStorage.setItem("plotcn_pkg_mgr", pkg)
      window.dispatchEvent(new CustomEvent("plotcn-pm-change", { detail: pkg }))
    } catch {
      // Ignore in sandbox
    }
  }

  // Derive commands for each package manager from base command
  const resolvedCommands: Record<PackageManager, string> = {
    pnpm: commands?.pnpm || formatCommand(command, "pnpm"),
    npm: commands?.npm || formatCommand(command, "npm"),
    yarn: commands?.yarn || formatCommand(command, "yarn"),
    bun: commands?.bun || formatCommand(command, "bun"),
  }

  const currentCommand = resolvedCommands[activeTab] || resolvedCommands.pnpm

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="my-6 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-1.5 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 pl-1" aria-hidden="true">
              <HugeiconsIcon icon={ComputerTerminal01Icon} size={15} strokeWidth={1.8} />
            </span>
            <TabsList className="bg-transparent h-8 p-0 gap-1">
              {(["pnpm", "npm", "yarn", "bun"] as const).map((pkg) => (
                <TabsTrigger
                  key={pkg}
                  value={pkg}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 h-7 rounded-md font-mono text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-zinc-800/90 data-[state=active]:shadow-none transition-colors"
                >
                  <PackageManagerIcon pkg={pkg} size={13} className="shrink-0" />
                  <span>{pkg}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Copy Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    aria-label="Copy command"
                    className="h-7 px-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-xs gap-1.5"
                  />
                }
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
                  size={14}
                  strokeWidth={1.8}
                  className={copied ? "text-emerald-400" : "text-zinc-400"}
                />
                <span className={`text-[11px] font-mono ${copied ? "text-emerald-400 font-medium" : ""}`}>
                  {copied ? "Copied" : "Copy"}
                </span>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs font-mono bg-zinc-900 border-zinc-800 text-zinc-200">
                {copied ? "Copied to clipboard!" : "Copy command"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Code Content Tabs */}
        {(["pnpm", "npm", "yarn", "bun"] as const).map((pkg) => (
          <TabsContent
            key={pkg}
            value={pkg}
            className="m-0 p-4 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto selection:bg-zinc-800"
          >
            {highlightedCommands?.[pkg] ? (
              <div
                className="plotcn-code-content"
                dangerouslySetInnerHTML={{ __html: highlightedCommands[pkg]! }}
              />
            ) : (
              <div className="plotcn-code-content">
                <pre className="shiki vesper !bg-transparent !m-0 !p-0 font-mono text-[13px] leading-relaxed">
                  <code>
                    <span className="line">
                      {renderShellHighlight(resolvedCommands[pkg])}
                    </span>
                  </code>
                </pre>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

/**
 * Client-side shell syntax tokenizer that matches Shiki's Vesper dark theme.
 * Used as an instant fallback when server-side Shiki pre-highlighted HTML is not provided.
 */
function renderShellHighlight(command: string): React.ReactNode {
  const words = command.split(/(\s+)/)
  const keywords = new Set(["pnpm", "npm", "npx", "yarn", "bun", "bunx", "dlx"])
  const subcommands = new Set([
    "add",
    "install",
    "i",
    "create",
    "registry",
    "init",
    "view",
    "list",
    "search",
    "run",
    "build",
    "dev",
  ])

  return words.map((token, index) => {
    // Preserve whitespace
    if (/^\s+$/.test(token)) {
      return <React.Fragment key={index}>{token}</React.Fragment>
    }

    // Executables / Keywords (Vesper peach/amber #FFC799)
    if (keywords.has(token)) {
      return (
        <span key={index} style={{ color: "#FFC799" }} className="font-semibold">
          {token}
        </span>
      )
    }

    // Subcommands (Vesper cyan/aqua #99FFE4)
    if (subcommands.has(token)) {
      return (
        <span key={index} style={{ color: "#99FFE4" }}>
          {token}
        </span>
      )
    }

    // CLI Flags (Vesper pink/rose #F472B6)
    if (token.startsWith("-")) {
      return (
        <span key={index} style={{ color: "#F472B6" }}>
          {token}
        </span>
      )
    }

    // Key=Value args (e.g. @plotcn=https://plotcn.vercel.app/r/{name}.json)
    if (token.includes("=")) {
      const eqIdx = token.indexOf("=")
      const left = token.slice(0, eqIdx)
      const right = token.slice(eqIdx + 1)
      return (
        <span key={index}>
          <span style={{ color: "#A1A1AA" }}>{left}</span>
          <span style={{ color: "#71717A" }}>=</span>
          <span style={{ color: "#6EE7B7" }}>{right}</span>
        </span>
      )
    }

    // Namespaces & Scoped Packages (e.g. @plotcn/line-basic)
    if (token.startsWith("@")) {
      return (
        <span key={index} style={{ color: "#6EE7B7" }}>
          {token}
        </span>
      )
    }

    // URLs
    if (token.startsWith("http://") || token.startsWith("https://")) {
      return (
        <span key={index} style={{ color: "#2DD4BF" }}>
          {token}
        </span>
      )
    }

    // Package with version tag (e.g. shadcn@latest)
    if (token.includes("@")) {
      const atIdx = token.indexOf("@")
      const pkgName = token.slice(0, atIdx)
      const ver = token.slice(atIdx)
      return (
        <span key={index}>
          <span style={{ color: "#FFFFFF" }}>{pkgName}</span>
          <span style={{ color: "#F472B6" }}>{ver}</span>
        </span>
      )
    }

    // Default arguments
    return (
      <span key={index} style={{ color: "#E4E4E7" }}>
        {token}
      </span>
    )
  })
}


