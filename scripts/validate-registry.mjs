import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json")

console.log("[validate-registry] Validating canonical registry.json...")

if (!fs.existsSync(REGISTRY_JSON_PATH)) {
  console.error(`[validate-registry] Error: ${REGISTRY_JSON_PATH} not found.`)
  process.exit(1)
}

const raw = fs.readFileSync(REGISTRY_JSON_PATH, "utf-8")
let catalog
try {
  catalog = JSON.parse(raw)
} catch (e) {
  console.error(`[validate-registry] JSON syntax error: ${e.message}`)
  process.exit(1)
}

const seenNames = new Set()
let errors = 0
let warnings = 0

for (const item of catalog.items || []) {
  // 1. Unique name
  if (!item.name || typeof item.name !== "string") {
    console.error(`[validate-registry] Item missing valid name:`, item)
    errors++
  } else if (seenNames.has(item.name)) {
    console.error(`[validate-registry] Duplicate item name detected: "${item.name}"`)
    errors++
  } else {
    seenNames.add(item.name)
  }

  // 2. File existence
  for (const f of item.files || []) {
    const fullPath = path.join(ROOT, f.path)
    if (!fs.existsSync(fullPath)) {
      console.error(`[validate-registry] File does not exist: "${f.path}" for item "${item.name}"`)
      errors++
    }
  }

  // 3. Registry dependencies check
  for (const regDep of item.registryDependencies || []) {
    const depItem = (catalog.items || []).find((i) => i.name === regDep)
    if (!depItem) {
      console.error(`[validate-registry] Item "${item.name}" references unknown registryDependency: "${regDep}"`)
      errors++
    }
  }

  // 4. Google items must declare google-chart-loader or google-chart-container
  if (item.name.startsWith("google-") && item.name !== "google-chart-loader" && item.name !== "google-chart-container") {
    const regDeps = item.registryDependencies || []
    if (!regDeps.includes("google-chart-container") && !regDeps.includes("google-chart-loader")) {
      console.warn(`[validate-registry] Warning: Google item "${item.name}" should declare google-chart-container in registryDependencies.`)
      warnings++
    }
  }
}

if (errors > 0) {
  console.error(`\n[validate-registry] FAILED with ${errors} error(s) and ${warnings} warning(s).`)
  process.exit(1)
}

console.log(`[validate-registry] SUCCESS: All ${seenNames.size} items passed validation with 0 errors!`)
