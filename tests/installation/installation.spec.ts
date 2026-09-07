import { describe, it } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

describe("Registry Item Installation Schema", () => {
  const rootDir = process.cwd()
  const publicR = path.join(rootDir, "public", "r")

  it("should have generated all JSON items in public/r", () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(rootDir, "registry.json"), "utf-8"))

    for (const item of catalog.items) {
      const itemJsonPath = path.join(publicR, `${item.name}.json`)
      assert.equal(fs.existsSync(itemJsonPath), true, `Manifest missing: ${itemJsonPath}`)

      const parsed = JSON.parse(fs.readFileSync(itemJsonPath, "utf-8"))
      assert.equal(parsed.name, item.name)
      assert.ok(parsed.files.length > 0)
      assert.ok(parsed.files[0].content)
    }
  })
})
