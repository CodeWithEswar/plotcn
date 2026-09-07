import { getRegistryItemUrl } from "./registry-url"

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

export interface InstallCommandOptions {
  packageManager?: PackageManager
  useNamespace?: boolean
  baseUrl?: string
}

/**
 * Returns the exact terminal command to install a component via the shadcn CLI.
 * Centralized to power gallery, detail pages, documentation, and copy buttons (section 5.44).
 */
export function getRegistryInstallCommand(
  name: string,
  options: InstallCommandOptions = {}
): string {
  const { packageManager = "pnpm", useNamespace = true, baseUrl } = options
  const cleanName = name.startsWith("@plotcn/") ? name.replace("@plotcn/", "") : name
  const target = useNamespace ? `@plotcn/${cleanName}` : getRegistryItemUrl(cleanName, baseUrl)

  switch (packageManager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${target}`
    case "npm":
      return `npx shadcn@latest add ${target}`
    case "yarn":
      return `npx shadcn@latest add ${target}`
    case "bun":
      return `bunx --bun shadcn@latest add ${target}`
    default:
      return `pnpm dlx shadcn@latest add ${target}`
  }
}

/**
 * Returns the command to inspect a registry payload before installation (section 5.59).
 */
export function getRegistryViewCommand(
  name: string,
  useNamespace = true,
  packageManager: PackageManager = "pnpm"
): string {
  const cleanName = name.startsWith("@plotcn/") ? name.replace("@plotcn/", "") : name
  const target = useNamespace ? `@plotcn/${cleanName}` : getRegistryItemUrl(cleanName)

  switch (packageManager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest view ${target}`
    case "npm":
    case "yarn":
      return `npx shadcn@latest view ${target}`
    case "bun":
      return `bunx --bun shadcn@latest view ${target}`
    default:
      return `pnpm dlx shadcn@latest view ${target}`
  }
}
