import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  getInstallCommand,
  getUrlInstallCommand,
  getNamespaceInstallCommand,
  tokenizeInstallCommand,
  packageManagers,
  getStoredPackageManager,
  setStoredPackageManager,
  getRegistryAddCommand,
} from "../../lib/registry/install-command"
import { getRegistryItemInfo } from "../../lib/registry/manifest"

describe("Registry Install Command System", () => {
  it("generates correct registry add commands across all four package managers for @plotcn", () => {
    const pnpmCmd = getRegistryAddCommand("pnpm")
    const npmCmd = getRegistryAddCommand("npm")
    const yarnCmd = getRegistryAddCommand("yarn")
    const bunCmd = getRegistryAddCommand("bun")

    assert.equal(pnpmCmd, "pnpm dlx shadcn@latest registry add @plotcn")
    assert.equal(npmCmd, "npx shadcn@latest registry add @plotcn")
    assert.equal(yarnCmd, "yarn dlx shadcn@latest registry add @plotcn")
    assert.equal(bunCmd, "bunx --bun shadcn@latest registry add @plotcn")

    assert.equal(getInstallCommand("@plotcn", "npm"), "npx shadcn@latest registry add @plotcn")
    assert.equal(getInstallCommand("@plotcn", "pnpm"), "pnpm dlx shadcn@latest registry add @plotcn")
  })

  it("generates correct commands across all four package managers for reference chart line-basic", () => {
    const pnpmCmd = getInstallCommand("line-basic", "pnpm")
    const npmCmd = getInstallCommand("line-basic", "npm")
    const yarnCmd = getInstallCommand("line-basic", "yarn")
    const bunCmd = getInstallCommand("line-basic", "bun")

    assert.equal(pnpmCmd, "pnpm dlx shadcn@latest add @plotcn/line-basic")
    assert.equal(npmCmd, "npx shadcn@latest add @plotcn/line-basic")
    assert.equal(yarnCmd, "yarn dlx shadcn@latest add @plotcn/line-basic")
    assert.equal(bunCmd, "bunx --bun shadcn@latest add @plotcn/line-basic")
  })

  it("supports flexible parameter ordering (name, pm) and (pm, name)", () => {
    assert.equal(
      getInstallCommand("pnpm", "line-basic"),
      "pnpm dlx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getInstallCommand("line-basic", "pnpm"),
      "pnpm dlx shadcn@latest add @plotcn/line-basic"
    )
  })

  it("supports direct URL install commands when explicitly requested", () => {
    assert.equal(
      getUrlInstallCommand("line-basic", "pnpm"),
      "pnpm dlx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json"
    )
  })

  it("generates correct namespace commands when namespace distribution is invoked", () => {
    assert.equal(
      getNamespaceInstallCommand("line-basic", "pnpm"),
      "pnpm dlx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getNamespaceInstallCommand("line-basic", "yarn"),
      "yarn dlx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getNamespaceInstallCommand("line-basic", "bun"),
      "bunx --bun shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getNamespaceInstallCommand("line-basic", "npm"),
      "npx shadcn@latest add @plotcn/line-basic"
    )
  })

  it("correctly tokenizes commands for syntax styling without breaking selectable text", () => {
    const pnpmTokens = tokenizeInstallCommand("pnpm dlx shadcn@latest add @plotcn/line-basic")
    assert.equal(pnpmTokens.runner, "pnpm dlx")
    assert.equal(pnpmTokens.tool, "shadcn@latest")
    assert.equal(pnpmTokens.action, "add")
    assert.equal(pnpmTokens.target, "@plotcn/line-basic")

    const bunTokens = tokenizeInstallCommand("bunx --bun shadcn@latest add https://plotcn.vercel.app/r/line-basic.json")
    assert.equal(bunTokens.runner, "bunx --bun")
    assert.equal(bunTokens.tool, "shadcn@latest")
    assert.equal(bunTokens.action, "add")
    assert.equal(bunTokens.target, "https://plotcn.vercel.app/r/line-basic.json")

    const npxTokens = tokenizeInstallCommand("npx shadcn@latest add https://plotcn.vercel.app/r/bar-basic.json")
    assert.equal(npxTokens.runner, "npx")
    assert.equal(npxTokens.tool, "shadcn@latest")
    assert.equal(npxTokens.action, "add")
    assert.equal(npxTokens.target, "https://plotcn.vercel.app/r/bar-basic.json")

    const yarnTokens = tokenizeInstallCommand("yarn dlx shadcn@latest add https://plotcn.vercel.app/r/area-basic.json")
    assert.equal(yarnTokens.runner, "yarn dlx")
    assert.equal(yarnTokens.tool, "shadcn@latest")
    assert.equal(yarnTokens.action, "add")
    assert.equal(yarnTokens.target, "https://plotcn.vercel.app/r/area-basic.json")
  })

  it("truthfully verifies registry presence and extracts metadata without fabrication", () => {
    const lineBasicInfo = getRegistryItemInfo("line-basic")
    assert.ok(lineBasicInfo)
    assert.equal(lineBasicInfo.name, "line-basic")
    assert.equal(lineBasicInfo.isVerified, false)
    assert.equal(lineBasicInfo.fileCount, 1)
    assert.deepEqual(lineBasicInfo.dependencies, ["recharts"])
    assert.ok(lineBasicInfo.registryDependencies.some((d) => d.includes("chart-tooltip")))

    const unknownInfo = getRegistryItemInfo("non-existent-chart-xyz")
    assert.equal(unknownInfo, null)
  })

  it("declares the approved package managers with authentic IDs", () => {
    const ids = packageManagers.map((pm) => pm.id)
    assert.deepEqual(ids, ["pnpm", "npm", "yarn", "bun"])
  })

  it("handles getStoredPackageManager and setStoredPackageManager with mock window", () => {
    // SSR fallback without window
    assert.equal(getStoredPackageManager(), "pnpm")

    // Mock window & localStorage
    const storage: Record<string, string> = {}
    let dispatchedEvent: any = null
    ;(globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => { storage[k] = v },
      },
      dispatchEvent: (e: any) => { dispatchedEvent = e },
    }
    ;(globalThis as any).CustomEvent = class CustomEvent {
      type: string
      detail: any
      constructor(type: string, init?: any) {
        this.type = type
        this.detail = init?.detail
      }
    }

    setStoredPackageManager("bun")
    assert.equal(storage["plotcn-preferred-pm"], "bun")
    assert.equal(storage["plotcn_pkg_mgr"], "bun")
    assert.equal(dispatchedEvent?.type, "plotcn-pm-change")
    assert.equal(dispatchedEvent?.detail, "bun")
    assert.equal(getStoredPackageManager(), "bun")

    setStoredPackageManager("yarn")
    assert.equal(getStoredPackageManager(), "yarn")
    assert.equal(dispatchedEvent?.detail, "yarn")

    // Clean up mock
    delete (globalThis as any).window
    delete (globalThis as any).CustomEvent
  })
})
