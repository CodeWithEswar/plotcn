"use client"

import * as React from "react"
import { CopyButton } from "./copy-button"
import { Icon } from "./icons"
import {
  type PackageManager,
  getInstallCommand,
  getStoredPackageManager,
  setStoredPackageManager,
} from "@/lib/registry/install-command"
import { PackageManagerSelector } from "@/components/registry/package-manager-selector"

export function InstallCommand({
  name = "@plotcn",
  compact = false,
  showTabs = true,
}: {
  name?: string
  compact?: boolean
  showTabs?: boolean
}) {
  const [pm, setPm] = React.useState<PackageManager>("pnpm")

  React.useEffect(() => {
    React.startTransition(() => {
      setPm(getStoredPackageManager())
    })
    const handlePmChangeEvt = (e: Event) => {
      const customEvent = e as CustomEvent<PackageManager>
      if (customEvent.detail && ["pnpm", "npm", "yarn", "bun"].includes(customEvent.detail)) {
        setPm(customEvent.detail)
      }
    }
    window.addEventListener("plotcn-pm-change", handlePmChangeEvt)
    return () => window.removeEventListener("plotcn-pm-change", handlePmChangeEvt)
  }, [])

  const handlePmChange = (newPm: PackageManager) => {
    setPm(newPm)
    setStoredPackageManager(newPm)
  }

  const command = getInstallCommand(name, pm)

  return (
    <div
      className={`install-command-wrap ${compact ? "compact items-center w-fit mx-auto" : "items-start w-full"} flex flex-col gap-2 min-w-0 max-w-full`}
    >
      {showTabs && (
        <div className="install-command-switcher flex items-center justify-center">
          <PackageManagerSelector value={pm} onChange={handlePmChange} variant="colored" />
        </div>
      )}
      <div className={`install-command ${compact ? "compact" : ""} min-w-0 max-w-full`}>
        <Icon name="terminal" />
        <code title={command} className="min-w-0">
          {command}
        </code>
        <CopyButton value={command} />
      </div>
    </div>
  )
}
