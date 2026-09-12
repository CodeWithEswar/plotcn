import { getRegistryItemUrl } from "./registry-url"

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

export interface PackageManagerOption {
  id: PackageManager
  label: string
  commandPrefix: string
}

export const packageManagers: readonly PackageManagerOption[] = [
  { id: "pnpm", label: "pnpm", commandPrefix: "pnpm dlx" },
  { id: "npm", label: "npm", commandPrefix: "npx" },
  { id: "yarn", label: "yarn", commandPrefix: "yarn dlx" },
  { id: "bun", label: "bun", commandPrefix: "bunx --bun" },
] as const

export const registryConfig = {
  namespace: "@plotcn",
  basePath: "/r",
} as const

const PM_STORAGE_KEY = "plotcn-preferred-pm"
const PM_LEGACY_KEY = "plotcn_pkg_mgr"

export function getStoredPackageManager(): PackageManager {
  if (typeof window === "undefined") return "pnpm"
  try {
    const stored =
      window.localStorage.getItem(PM_STORAGE_KEY) ||
      window.localStorage.getItem(PM_LEGACY_KEY)
    if (stored === "pnpm" || stored === "npm" || stored === "yarn" || stored === "bun") {
      return stored
    }
  } catch {
    // fallback to pnpm
  }
  return "pnpm"
}

export function setStoredPackageManager(pm: PackageManager): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PM_STORAGE_KEY, pm)
    window.localStorage.setItem(PM_LEGACY_KEY, pm)
    window.dispatchEvent(new CustomEvent("plotcn-pm-change", { detail: pm }))
  } catch {
    // fallback
  }
}

/**
 * Generates the canonical shadcn registry add command to configure @plotcn.
 * e.g., npx shadcn@latest registry add @plotcn
 */
export function getRegistryAddCommand(
  pm: PackageManager = "npm",
  namespace: string = registryConfig.namespace
): string {
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest registry add ${namespace}`
    case "yarn":
      return `yarn dlx shadcn@latest registry add ${namespace}`
    case "bun":
      return `bunx --bun shadcn@latest registry add ${namespace}`
    case "npm":
    default:
      return `npx shadcn@latest registry add ${namespace}`
  }
}

/**
 * Generates the canonical shadcn add command for a registry item or the registry itself.
 * Since @plotcn is accepted in the official shadcn community directory,
 * the command targets @plotcn/<name> or registry add @plotcn.
 * Supports both getInstallCommand(name, pm) and getInstallCommand(pm, name) for consumer flexibility.
 */
export function getInstallCommand(
  nameOrPm: string | PackageManager,
  pmOrName: PackageManager | string = "npm"
): string {
  const isFirstParamPm = nameOrPm === "pnpm" || nameOrPm === "npm" || nameOrPm === "yarn" || nameOrPm === "bun"
  const pm: PackageManager = isFirstParamPm ? (nameOrPm as PackageManager) : (pmOrName as PackageManager)
  const name: string = isFirstParamPm ? (pmOrName as string) : (nameOrPm as string)

  const cleanName = name.replace(/\.json$/, "").replace(/^@plotcn\/?/, "")
  if (!cleanName || cleanName === "registry" || name === "@plotcn") {
    return getRegistryAddCommand(pm)
  }

  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "bun":
      return `bunx --bun shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "npm":
    default:
      return `npx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
  }
}

/**
 * Generates a direct URL add command for environments or tests requiring full endpoints.
 */
export function getUrlInstallCommand(
  nameOrPm: string | PackageManager,
  pmOrName: PackageManager | string = "npm"
): string {
  const isFirstParamPm = nameOrPm === "pnpm" || nameOrPm === "npm" || nameOrPm === "yarn" || nameOrPm === "bun"
  const pm: PackageManager = isFirstParamPm ? (nameOrPm as PackageManager) : (pmOrName as PackageManager)
  const name: string = isFirstParamPm ? (pmOrName as string) : (nameOrPm as string)

  const url = getRegistryItemUrl(name)
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${url}`
    case "bun":
      return `bunx --bun shadcn@latest add ${url}`
    case "npm":
    default:
      return `npx shadcn@latest add ${url}`
  }
}

export function getNamespaceInstallCommand(
  name: string,
  pm: PackageManager = "npm"
): string {
  const cleanName = name.replace(/\.json$/, "")
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "bun":
      return `bunx --bun shadcn@latest add ${registryConfig.namespace}/${cleanName}`
    case "npm":
    default:
      return `npx shadcn@latest add ${registryConfig.namespace}/${cleanName}`
  }
}

export interface CommandTokens {
  runner: string
  tool: string
  action: string
  target: string
}

export function tokenizeInstallCommand(command: string): CommandTokens {
  const trimmed = command.trim()
  const patterns = [
    /^bunx\s+--bun/,
    /^pnpm\s+dlx/,
    /^yarn\s+dlx/,
    /^npx/,
  ]

  let runner = ""
  let rest = trimmed
  for (const pat of patterns) {
    const match = trimmed.match(pat)
    if (match) {
      runner = match[0]
      rest = trimmed.slice(runner.length).trim()
      break
    }
  }

  if (!runner) {
    const parts = trimmed.split(/\s+/)
    runner = parts[0] || ""
    rest = parts.slice(1).join(" ")
  }

  const parts = rest.split(/\s+/)
  const tool = parts[0] || "shadcn@latest"
  let action = parts[1] || "add"
  let target = parts.slice(2).join(" ")
  if (parts[1] === "registry" && parts[2] === "add") {
    action = "registry add"
    target = parts.slice(3).join(" ")
  }

  return {
    runner,
    tool,
    action,
    target,
  }
}
