"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Tick02Icon,
  ComputerTerminal01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons"
import {
  type PackageManager,
  getInstallCommand,
  tokenizeInstallCommand,
  getStoredPackageManager,
  setStoredPackageManager,
} from "@/lib/registry/install-command"
import { getRegistryItemInfo } from "@/lib/registry/manifest"
import { PackageManagerSelector } from "./package-manager-selector"
import { RegistrySignalRail } from "./registry-signal-rail"
import { RegistryMetadata } from "./registry-metadata"
import { checkRegistryAvailability, type RegistryAvailability } from "@/lib/registry/availability"
import { cn } from "@/lib/utils"

export interface InstallCommandProps {
  registryName: string
  engine?: "recharts" | "d3" | "google"
  variant?: "full" | "compact"
  className?: string
  showRail?: boolean
}

/**
 * InstallCommand Registry Console (Section 28-56, 81-83)
 * Unified installation experience across gallery cards, chart detail, playground, blocks, and docs.
 */
export function InstallCommand({
  registryName,
  engine,
  variant = "full",
  className,
  showRail = true,
}: InstallCommandProps) {
  const [pm, setPm] = React.useState<PackageManager>("pnpm")
  const [availability, setAvailability] = React.useState<RegistryAvailability | "checking">("checking")
  const [copyError, setCopyError] = React.useState("")
  React.useEffect(() => { let active = true; checkRegistryAvailability(registryName).then(result => { if(active) setAvailability(result) }); return () => {active = false} }, [registryName])
  const [copied, setCopied] = React.useState(false)
  const [showDetails, setShowDetails] = React.useState(false)
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initialize and persist preferred package manager in localStorage (Section 48)
  React.useEffect(() => {
    React.startTransition(() => setPm(getStoredPackageManager()))
  }, [])

  const handlePmChange = (newPm: PackageManager) => {
    setPm(newPm)
    setStoredPackageManager(newPm)
  }

  // Registry metadata lookup (Section 35, 42: truthful, never fabricated)
  const info = React.useMemo(() => getRegistryItemInfo(registryName), [registryName])
  const resolvedEngine =
    engine ||
    (info?.categories?.includes?.("d3")
      ? "d3"
      : info?.categories?.includes?.("google")
        ? "google"
        : "recharts")

  const command = React.useMemo(() => getInstallCommand(registryName, pm), [registryName, pm])
  const tokens = React.useMemo(() => tokenizeInstallCommand(command), [command])

  const handleCopy = async () => {
    setCopyError("")
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(command)
        setCopied(true)
      } else {
        // Safe fallback for non-secure contexts
        const textarea = document.createElement("textarea")
        textarea.value = command
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand("copy")
        document.body.removeChild(textarea)
        if (!success) throw new Error("Clipboard unavailable")
        setCopied(true)
      }

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2500)
    } catch {
      // Graceful error handling (Section 38): Never claim copied if it failed
      setCopied(false)
      setCopyError("Could not copy. Select the command and copy it manually.")
    }
  }

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const isCompact = variant === "compact"
  const cleanName = registryName.replace(/\.json$/, "")

  // All dependencies for the trace
  const allDeps = React.useMemo(() => {
    if (!info) return []
    return [
      ...info.dependencies.map((d) => ({ name: d, type: "npm" as const })),
      ...info.registryDependencies.map((d) => ({ name: d, type: "registry" as const })),
    ]
  }, [info])

  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-background text-foreground",
        isCompact ? "p-3 space-y-2.5 text-xs" : "space-y-0 text-sm",
        className
      )}
    >
      {/* 1. Registry Signal Rail (Full mode only) */}
      {!isCompact && showRail && (
        <RegistrySignalRail
          registryName={registryName}
          isVerified={availability === "ready" && !!info}
          copied={copied}
        />
      )}

      <div className={cn(isCompact ? "space-y-2" : "p-3.5 space-y-3")}>
        {/* 2. Package Manager Selector Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <PackageManagerSelector value={pm} onChange={handlePmChange} variant="colored" />

          {!isCompact && allDeps.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-expanded={showDetails}
              aria-label="Toggle dependency trace"
            >
              <span>
                {allDeps.length} {allDeps.length === 1 ? "dep" : "deps"}
              </span>
              <HugeiconsIcon icon={showDetails ? ArrowUp01Icon : ArrowDown01Icon} size={13} />
            </button>
          )}
        </div>

        {/* 3. Command Viewport & Copy Action */}
        <div className="group relative flex items-center justify-between gap-2 rounded-md border border-border/90 bg-muted/30  p-2 sm:p-2.5 transition-colors focus-within:border-foreground/30">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <HugeiconsIcon
              icon={ComputerTerminal01Icon}
              size={15}
              className="text-muted-foreground/60 shrink-0 select-none"
              aria-hidden="true"
            />
            <div
              className="overflow-x-auto whitespace-nowrap font-mono text-xs leading-relaxed text-foreground select-all pt-0.5 pb-1 scrollbar-thin"
              tabIndex={0}
              role="region"
              aria-label="Install command line"
            >
              <span className="text-muted-foreground font-normal">{tokens.runner}</span>{" "}
              <span className="text-muted-foreground/80 font-normal">{tokens.tool}</span>{" "}
              <span className="text-muted-foreground font-normal">{tokens.action}</span>{" "}
              <span className="font-semibold text-foreground">{tokens.target}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={availability !== "ready"}
            aria-label={`Copy ${pm} install command to clipboard`}
            className={cn(
              "inline-flex items-center justify-center size-7 rounded-md border text-xs font-mono font-medium transition-all shrink-0 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                : "border-border/80 bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Copy01Icon}
              size={14}
              className={cn("transition-transform duration-150", copied && "scale-110")}
            />
          </button>
        </div>

        <p role="status" className="text-xs text-muted-foreground leading-relaxed">{copied ? "Copied" : copyError || (availability === "checking" ? "Checking public registry…" : availability === "unpublished" ? "Publication pending. Inspect the source or local registry JSON; this public command is not available yet." : availability === "unavailable" ? "Public registry could not be reached. Source remains available." : "Public registry item is reachable.")}</p><a className="text-xs underline underline-offset-4" href={"/r/"+cleanName+".json"}>View local registry JSON</a>
        {/* 4. Dependency Trace (Section 54: DOM/CSS semantic trace) */}
        {!isCompact && showDetails && allDeps.length > 0 && (
          <div
            className="rounded-md border border-border/60 bg-muted/20 p-2.5 font-mono text-[11px] text-muted-foreground motion-safe:animate-in motion-safe:fade-in duration-150"
            aria-label="Dependency breakdown"
          >
            <div className="text-foreground/90 font-medium mb-1.5 flex items-center gap-1.5">
              <span>{cleanName}</span>
              <span className="text-[10px] text-muted-foreground">({info?.type || "registry:block"})</span>
            </div>
            <div className="space-y-1 pl-1">
              {allDeps.map((dep, idx) => {
                const isLast = idx === allDeps.length - 1
                return (
                  <div key={dep.name} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground/40">{isLast ? "└──" : "├──"}</span>
                    <span className={dep.type === "npm" ? "text-foreground/80" : "text-foreground/80"}>
                      {dep.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground/60 uppercase">
                      [{dep.type}]
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 5. Metadata Rail & Source Ownership Message (Section 42 & 43) */}
        {!isCompact && <RegistryMetadata info={info} engine={resolvedEngine} />}
      </div>
    </div>
  )
}
