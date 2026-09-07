import { describe, it } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

describe("Plotcn Registry Verification", () => {
  const rootDir = process.cwd()
  const registryJsonPath = path.join(rootDir, "registry.json")

  it("should have a valid registry.json catalog", () => {
    assert.equal(fs.existsSync(registryJsonPath), true)
    const raw = fs.readFileSync(registryJsonPath, "utf-8")
    const catalog = JSON.parse(raw)
    assert.equal(catalog.name, "plotcn")
    assert.equal(Array.isArray(catalog.items), true)
    assert.ok(catalog.items.length > 0)
  })

  it("should ensure every declared file exists on disk", () => {
    const raw = fs.readFileSync(registryJsonPath, "utf-8")
    const catalog = JSON.parse(raw)

    for (const item of catalog.items) {
      for (const f of item.files || []) {
        const fullPath = path.join(rootDir, f.path)
        assert.equal(fs.existsSync(fullPath), true, `File missing: ${f.path}`)
      }
    }
  })

  it("should enforce engine isolation rules", () => {
    const raw = fs.readFileSync(registryJsonPath, "utf-8")
    const catalog = JSON.parse(raw)

    for (const item of catalog.items) {
      if (item.categories?.includes("recharts")) {
        assert.ok(!item.dependencies?.includes("d3"), `${item.name} must not depend on d3`)
        assert.ok(!item.dependencies?.includes("d3-scale"), `${item.name} must not depend on d3-scale`)
      }
      if (item.categories?.includes("d3")) {
        assert.ok(!item.dependencies?.includes("recharts"), `${item.name} must not depend on recharts`)
      }
    }
  })
})
