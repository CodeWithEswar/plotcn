import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  getInstallCommand,
  getNamespaceInstallCommand,
  tokenizeInstallCommand,
  packageManagers,
  type PackageManager,
} from "../../lib/registry/install-command"
import { getRegistryItemInfo } from "../../lib/registry/manifest"

describe("Registry Install Command System", () => {
  it("generates correct commands across all four package managers for reference chart line-basic", () => {
    const pnpmCmd = getInstallCommand("line-basic", "pnpm")
    const npmCmd = getInstallCommand("line-basic", "npm")
    const yarnCmd = getInstallCommand("line-basic", "yarn")
    const bunCmd = getInstallCommand("line-basic", "bun")

    assert.equal(pnpmCmd, "pnpm dlx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json")
    assert.equal(npmCmd, "npx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json")
    assert.equal(yarnCmd, "yarn dlx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json")
    assert.equal(bunCmd, "bunx --bun shadcn@latest add https://plotcn.vercel.app/r/line-basic.json")
  })

  it("supports flexible parameter ordering (name, pm) and (pm, name)", () => {
    assert.equal(
      getInstallCommand("pnpm", "line-basic"),
      "pnpm dlx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json"
    )
    assert.equal(
      getInstallCommand("line-basic", "pnpm"),
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
    assert.equal(lineBasicInfo.isVerified, true)
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
})
