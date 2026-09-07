import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const REGISTRY_JSON_PATH = path.join(ROOT, "registry.json")
const PUBLIC_R = path.join(ROOT, "public", "r")

// Ensure public/r exists
if (!fs.existsSync(PUBLIC_R)) {
  fs.mkdirSync(PUBLIC_R, { recursive: true })
}

if (!fs.existsSync(REGISTRY_JSON_PATH)) {
  console.error(`[build-registry] Error: registry.json not found at ${REGISTRY_JSON_PATH}`)
  process.exit(1)
}

const catalogRaw = fs.readFileSync(REGISTRY_JSON_PATH, "utf-8")
const catalog = JSON.parse(catalogRaw)

if (!catalog.items || !Array.isArray(catalog.items)) {
  console.error("[build-registry] Error: registry.json does not contain valid items array.")
  process.exit(1)
}

console.log(`[build-registry] Building ${catalog.items.length} items from canonical registry.json...`)

let builtCount = 0

for (const item of catalog.items) {
  const itemFiles = []

  for (const f of item.files || []) {
    const fullPath = path.join(ROOT, f.path)
    if (!fs.existsSync(fullPath)) {
      console.warn(`[build-registry] Warning: File ${f.path} not found for item ${item.name}`)
      continue
    }

    const content = fs.readFileSync(fullPath, "utf-8")
    itemFiles.push({
      path: f.target || f.path,
      content,
      type: f.type || "registry:component",
      target: f.target || f.path,
    })
  }

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type || "registry:block",
    title: item.title || item.name,
    description: item.description || "",
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
    files: itemFiles,
    categories: item.categories || ["charts"],
  }

  const outPath = path.join(PUBLIC_R, `${item.name}.json`)
  fs.writeFileSync(outPath, JSON.stringify(registryItem, null, 2), "utf-8")
  builtCount++
}

// Write the global registry index
fs.writeFileSync(
  path.join(PUBLIC_R, "registry.json"),
  JSON.stringify(catalog, null, 2),
  "utf-8"
)

console.log(`[build-registry] Successfully generated ${builtCount} registry items into public/r/`)
