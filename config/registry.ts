import { site } from "@/lib/site"

export interface PlotcnRegistryConfig {
  namespace: string
  basePath: string
  readonly origin: string
  readonly template: string
  readonly url: string
  status: "development" | "live" | "planned"
  version: string
  docsUrl: string
  getItemUrl(name: string): string
  getInstallCommand(name: string, packageManager?: "npm" | "pnpm" | "yarn" | "bun"): string
  getNamespaceCommand(name: string, packageManager?: "npm" | "pnpm" | "yarn" | "bun"): string
}

export const plotcnRegistry: PlotcnRegistryConfig = {
  namespace: "@plotcn",
  basePath: "/r",
  get origin() {
    return site.url
  },
  get template() {
    return `${this.origin}${this.basePath}/{name}.json`
  },
  get url() {
    return this.template
  },
  status: "live",
  version: "1.0.0-beta",
  docsUrl: "/docs/registry",
  getItemUrl(name: string) {
    return `${this.origin}${this.basePath}/${name}.json`
  },
  getInstallCommand(name: string, packageManager = "npm") {
    const url = this.getItemUrl(name)
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${url}`
      case "yarn":
        return `yarn dlx shadcn@latest add ${url}`
      case "bun":
        return `bunx --bun shadcn@latest add ${url}`
      default:
        return `npx shadcn@latest add ${url}`
    }
  },
  getNamespaceCommand(name: string, packageManager = "npm") {
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${this.namespace}/${name}`
      case "yarn":
        return `yarn dlx shadcn@latest add ${this.namespace}/${name}`
      case "bun":
        return `bunx --bun shadcn@latest add ${this.namespace}/${name}`
      default:
        return `npx shadcn@latest add ${this.namespace}/${name}`
    }
  },
}
