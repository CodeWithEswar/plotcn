import React from "react"
import type { PackageManager } from "@/lib/registry/install-command"
import { PnpmIcon, NpmIcon, YarnIcon, BunIcon } from "@/components/docs/installation/package-manager-icons"

export interface PackageManagerLogoProps {
  manager: PackageManager | string
  size?: number
  className?: string
  variant?: "monochrome" | "colored"
}

export function PackageManagerLogo({
  manager,
  size = 15,
  className = "",
  variant = "colored",
}: PackageManagerLogoProps) {
  const isMonochrome = variant === "monochrome"

  const icon = (() => {
    switch (manager) {
      case "pnpm":
        return <PnpmIcon size={size} className={className} />
      case "npm":
        return <NpmIcon size={size} className={className} />
      case "yarn":
        return <YarnIcon size={size} className={className} />
      case "bun":
        return <BunIcon size={size} className={className} />
      default:
        return <PnpmIcon size={size} className={className} />
    }
  })()

  if (isMonochrome) {
    return <span className="inline-flex shrink-0 grayscale opacity-70">{icon}</span>
  }

  return <span className="inline-flex shrink-0 drop-shadow-xs">{icon}</span>
}

export const PnpmLogo = (props: Omit<PackageManagerLogoProps, "manager">) => (
  <PackageManagerLogo manager="pnpm" {...props} />
)
export const NpmLogo = (props: Omit<PackageManagerLogoProps, "manager">) => (
  <PackageManagerLogo manager="npm" {...props} />
)
export const YarnLogo = (props: Omit<PackageManagerLogoProps, "manager">) => (
  <PackageManagerLogo manager="yarn" {...props} />
)
export const BunLogo = (props: Omit<PackageManagerLogoProps, "manager">) => (
  <PackageManagerLogo manager="bun" {...props} />
)
