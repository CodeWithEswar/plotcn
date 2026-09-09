"use client"

import * as React from "react"
import { packageManagers, type PackageManager } from "@/lib/registry/install-command"
import { PackageManagerLogo } from "./package-manager-logo"
import { cn } from "@/lib/utils"

export interface PackageManagerSelectorProps {
  value: PackageManager
  onChange: (pm: PackageManager) => void
  variant?: "colored" | "monochrome"
  className?: string
}

/**
 * Compact technical segmented rail with authentic colored brand icons (Section 27, 30, 41, 74)
 */
export function PackageManagerSelector({
  value,
  onChange,
  variant = "colored",
  className,
}: PackageManagerSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select package manager"
      className={cn(
        "inline-flex items-center gap-1 max-w-full overflow-x-auto rounded-md border border-border/60 bg-muted/40 p-0.5",
        className
      )}
    >
      {packageManagers.map((item) => {
        const active = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            aria-label={`Select ${item.label} package manager`}
            onClick={() => onChange(item.id)}
            className={cn(
              "group inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer select-none",
              active
                ? "bg-background text-foreground shadow-xs border border-border/60 font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <PackageManagerLogo
              manager={item.id}
              size={15}
              variant={variant}
              className={cn(
                "transition-all duration-150 shrink-0",
                active ? "scale-105 opacity-100" : "opacity-90 group-hover:opacity-100"
              )}
            />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
