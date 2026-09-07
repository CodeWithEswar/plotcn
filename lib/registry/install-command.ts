import { getRegistryItemUrl } from "./registry-url"

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

export function getInstallCommand(name: string, pm: PackageManager = "npm"): string {
  const url = getRegistryItemUrl(name)
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`
    case "yarn":
      return `npx shadcn@latest add ${url}`
    case "bun":
      return `bunx --bun shadcn@latest add ${url}`
    default:
      return `npx shadcn@latest add ${url}`
  }
}

export function getNamespaceInstallCommand(name: string, pm: PackageManager = "npm"): string {
  const cleanName = name.replace(/\.json$/, "")
  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add @plotcn/${cleanName}`
    case "yarn":
      return `npx shadcn@latest add @plotcn/${cleanName}`
    case "bun":
      return `bunx --bun shadcn@latest add @plotcn/${cleanName}`
    default:
      return `npx shadcn@latest add @plotcn/${cleanName}`
  }
}
