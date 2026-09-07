"use client"

import * as React from "react"
import { InstallCommand } from "@/components/registry/install-command"
import type { ChartEngine } from "@/lib/charts/metadata"

export interface ChartInstallProps {
  registryName: string
  engine?: ChartEngine
  variant?: "full" | "compact"
  className?: string
}

/**
 * ChartInstall adapter for backward compatibility and drop-in use.
 * Section 28 & 45: Delegates to canonical InstallCommand Registry Console.
 */
export function ChartInstall({
  registryName,
  engine,
  variant = "full",
  className,
}: ChartInstallProps) {
  return (
    <section className="lens-install-container my-6" aria-label="Install chart from registry">
      <InstallCommand
        registryName={registryName}
        engine={engine}
        variant={variant}
        className={className}
      />
    </section>
  )
}
