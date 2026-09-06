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

type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

interface PackageManagerTabsProps {
  command?: string
  commands?: Partial<Record<PackageManager, string>>
}

export function PackageManagerTabs({
  command = "",
  commands,
}: PackageManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<PackageManager>("pnpm")
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("plotcn_pkg_mgr") as PackageManager | null
    if (stored && ["pnpm", "npm", "yarn", "bun"].includes(stored)) {
      setActiveTab(stored)
    }
  }, [])

  const handleTabChange = (val: string) => {
    const pkg = val as PackageManager
    setActiveTab(pkg)
    localStorage.setItem("plotcn_pkg_mgr", pkg)
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
        <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-1.5 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 pl-1">
              <HugeiconsIcon icon={ComputerTerminal01Icon} size={15} strokeWidth={1.8} />
            </span>
            <TabsList className="bg-transparent h-8 p-0 gap-1">
              {(["pnpm", "npm", "yarn", "bun"] as const).map((pkg) => (
                <TabsTrigger
                  key={pkg}
                  value={pkg}
                  className="text-xs px-2.5 py-1 h-7 rounded-md font-mono text-zinc-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-zinc-800/90 data-[state=active]:shadow-none transition-colors"
                >
                  {pkg}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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
                />
                <span className="text-[11px] font-mono">{copied ? "Copied" : "Copy"}</span>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs font-mono bg-zinc-900 border-zinc-800 text-zinc-200">
                {copied ? "Copied to clipboard!" : "Copy command"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {(["pnpm", "npm", "yarn", "bun"] as const).map((pkg) => (
          <TabsContent
            key={pkg}
            value={pkg}
            className="m-0 p-4 font-mono text-[13px] leading-relaxed text-zinc-200 overflow-x-auto selection:bg-zinc-800 whitespace-pre"
          >
            <code>{resolvedCommands[pkg]}</code>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function formatCommand(cmd: string, pkg: PackageManager): string {
  const trimmed = cmd.trim()

  if (trimmed.startsWith("pnpm create next-app")) {
    switch (pkg) {
      case "npm":
        return trimmed.replace("pnpm create next-app", "npx create-next-app")
      case "yarn":
        return trimmed.replace("pnpm create next-app", "yarn create next-app")
      case "bun":
        return trimmed.replace("pnpm create next-app", "bun create next-app")
      default:
        return trimmed
    }
  }

  if (trimmed.startsWith("pnpm dlx shadcn@latest")) {
    switch (pkg) {
      case "npm":
        return trimmed.replace("pnpm dlx shadcn@latest", "npx shadcn@latest")
      case "yarn":
        return trimmed.replace("pnpm dlx shadcn@latest", "yarn dlx shadcn@latest")
      case "bun":
        return trimmed.replace("pnpm dlx shadcn@latest", "bunx --bun shadcn@latest")
      default:
        return trimmed
    }
  }

  if (trimmed.startsWith("pnpm add -D")) {
    switch (pkg) {
      case "npm":
        return trimmed.replace("pnpm add -D", "npm install -D")
      case "yarn":
        return trimmed.replace("pnpm add -D", "yarn add -D")
      case "bun":
        return trimmed.replace("pnpm add -D", "bun add -d")
      default:
        return trimmed
    }
  }

  if (trimmed.startsWith("pnpm add")) {
    switch (pkg) {
      case "npm":
        return trimmed.replace("pnpm add", "npm install")
      case "yarn":
        return trimmed.replace("pnpm add", "yarn add")
      case "bun":
        return trimmed.replace("pnpm add", "bun add")
      default:
        return trimmed
    }
  }

  return trimmed
}
