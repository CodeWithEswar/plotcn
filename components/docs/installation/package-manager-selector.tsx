"use client"

import React from "react"
import { useInstallation } from "./installation-context"
import { type PackageManager, packageManagerTokens } from "./installation-config"
import { PnpmIcon, NpmIcon, YarnIcon, BunIcon } from "./package-manager-icons"

export function PackageManagerSelector() {
  const { packageManager, setPackageManager } = useInstallation()

  const managers: readonly PackageManager[] = ["pnpm", "npm", "yarn", "bun"]

  const renderIcon = (pkg: PackageManager) => {
    switch (pkg) {
      case "pnpm":
        return <PnpmIcon size={15} />
      case "npm":
        return <NpmIcon size={15} />
      case "yarn":
        return <YarnIcon size={15} />
      case "bun":
        return <BunIcon size={15} />
    }
  }

  return (
    <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.08] bg-zinc-950/60 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-300">Package manager</span>
        <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">
          — select to switch commands
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Choose your package manager"
        className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900/80 border border-white/[0.06] overflow-x-auto no-scrollbar"
      >
        {managers.map((pkg) => {
          const isSelected = packageManager === pkg
          const token = packageManagerTokens[pkg]

          return (
            <button
              key={pkg}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${token.name}`}
              onClick={() => setPackageManager(pkg)}
              style={
                isSelected
                  ? {
                      backgroundColor: "var(--muted)",
                      borderColor: "var(--border)",
                    }
                  : undefined
              }
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-150 outline-none focus-visible:ring-1 focus-visible:ring-white/30 ${
                isSelected
                  ? "text-white font-medium shadow-sm"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
              }`}
            >
              <div className="shrink-0">{renderIcon(pkg)}</div>
              <span>{token.name}</span>

              {/* Brand Accent Bottom Rail */}
              {isSelected && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                  style={{ backgroundColor: "var(--foreground)" }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
