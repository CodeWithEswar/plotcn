export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

/**
 * Translates a base shell command to the requested package manager.
 * Pure server-safe and client-safe utility.
 */
export function formatCommand(cmd: string, pkg: PackageManager): string {
  const trimmed = cmd.trim()

  // 1. shadcn registry commands (e.g. registry add @plotcn=...)
  if (trimmed.includes("registry add") || trimmed.includes("registry")) {
    const isLatest = trimmed.includes("@latest")
    const specifier = isLatest ? "shadcn@latest" : "shadcn"
    const regIdx = trimmed.indexOf("registry")
    const rest = trimmed.slice(regIdx)
    switch (pkg) {
      case "npm":
        return `npx ${specifier} ${rest}`
      case "yarn":
        return `yarn dlx ${specifier} ${rest}`
      case "bun":
        return `bunx --bun ${specifier} ${rest}`
      case "pnpm":
      default:
        return `pnpm dlx ${specifier} ${rest}`
    }
  }

  // 2. shadcn commands (add, view, search, list, init)
  if (trimmed.includes("shadcn@latest") || trimmed.includes("shadcn")) {
    const isLatest = trimmed.includes("shadcn@latest")
    const specifier = isLatest ? "shadcn@latest" : "shadcn"
    const idx = trimmed.indexOf(specifier)
    const rest = trimmed.slice(idx + specifier.length).trim()
    switch (pkg) {
      case "npm":
        return `npx ${specifier} ${rest}`
      case "yarn":
        return `yarn dlx ${specifier} ${rest}`
      case "bun":
        return `bunx --bun ${specifier} ${rest}`
      case "pnpm":
      default:
        return `pnpm dlx ${specifier} ${rest}`
    }
  }

  // 3. create app commands
  if (trimmed.includes("create-next-app") || trimmed.includes("create next-app")) {
    const rest = trimmed.replace(/^(pnpm|npm|yarn|bun)( dlx|x| create| create-next-app)?( create-next-app| next-app)?/, "").trim()
    switch (pkg) {
      case "npm":
        return `npx create-next-app@latest ${rest}`
      case "yarn":
        return `yarn create next-app ${rest}`
      case "bun":
        return `bun create next-app ${rest}`
      case "pnpm":
      default:
        return `pnpm create next-app ${rest}`
    }
  }

  // 4. install dev dependencies
  if (trimmed.match(/^(pnpm|npm|yarn|bun)\s+(add|install|i)\s+(-D|--save-dev|-d)/)) {
    const rest = trimmed.replace(/^(pnpm|npm|yarn|bun)\s+(add|install|i)\s+(-D|--save-dev|-d)\s*/, "")
    switch (pkg) {
      case "npm":
        return `npm install -D ${rest}`
      case "yarn":
        return `yarn add -D ${rest}`
      case "bun":
        return `bun add -d ${rest}`
      case "pnpm":
      default:
        return `pnpm add -D ${rest}`
    }
  }

  // 5. install dependencies
  if (trimmed.match(/^(pnpm|npm|yarn|bun)\s+(add|install|i)\s+/)) {
    const rest = trimmed.replace(/^(pnpm|npm|yarn|bun)\s+(add|install|i)\s*/, "")
    switch (pkg) {
      case "npm":
        return `npm install ${rest}`
      case "yarn":
        return `yarn add ${rest}`
      case "bun":
        return `bun add ${rest}`
      case "pnpm":
      default:
        return `pnpm add ${rest}`
    }
  }

  // 6. Generic dlx / npx / bunx
  if (trimmed.match(/^(pnpm dlx|npx|yarn dlx|bunx)\s+/)) {
    const rest = trimmed.replace(/^(pnpm dlx|npx|yarn dlx|bunx)\s+/, "")
    switch (pkg) {
      case "npm":
        return `npx ${rest}`
      case "yarn":
        return `yarn dlx ${rest}`
      case "bun":
        return `bunx ${rest}`
      case "pnpm":
      default:
        return `pnpm dlx ${rest}`
    }
  }

  return trimmed
}
