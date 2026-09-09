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

const ALIASES = {
  line: "line-basic",
  area: "area-basic",
  bar: "bar-basic",
  donut: "donut-basic",
  geochart: "google-geochart",
  geographic: "google-geochart",
  network: "d3-force-network",
  "d3-plot": "d3-animated-line",
  heatmap: "d3-animated-line",
  candles: "d3-animated-line",
  treemap: "d3-force-network",
  scatter: "d3-animated-line",
  stream: "d3-animated-line",
}

// Clean stale files from public/r
const validFileNames = new Set([
  "registry.json",
  ...catalog.items.map((i) => `${i.name}.json`),
  ...Object.keys(ALIASES).map((a) => `${a}.json`)
])
if (fs.existsSync(PUBLIC_R)) {
  for (const existingFile of fs.readdirSync(PUBLIC_R)) {
    if (existingFile.endsWith(".json") && !validFileNames.has(existingFile)) {
      fs.unlinkSync(path.join(PUBLIC_R, existingFile))
      console.log(`[build-registry] Removed stale file: ${existingFile}`)
    }
  }
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
    type: item.type || "registry:component",
    title: item.title || item.name,
    description: item.description || "",
    dependencies: item.dependencies || [],
    registryDependencies: (item.registryDependencies || []).map((dependency) => {
      const cleanDependency = dependency.replace(/^@plotcn\//, "")
      return catalog.items.some((entry) => entry.name === cleanDependency)
        ? `${(process.env.NEXT_PUBLIC_SITE_URL || catalog.homepage).replace(/\/$/, "")}/r/${cleanDependency}.json`
        : dependency
    }),
    files: itemFiles,
    categories: item.categories || ["charts"],
  }

  const outPath = path.join(PUBLIC_R, `${item.name}.json`)
  fs.writeFileSync(outPath, JSON.stringify(registryItem, null, 2), "utf-8")
  builtCount++
}

// Generate backward-compatible aliases
for (const [aliasName, targetItemName] of Object.entries(ALIASES)) {
  const targetPath = path.join(PUBLIC_R, `${targetItemName}.json`)
  if (fs.existsSync(targetPath)) {
    const raw = fs.readFileSync(targetPath, "utf-8")
    const itemData = JSON.parse(raw)
    itemData.name = aliasName
    fs.writeFileSync(
      path.join(PUBLIC_R, `${aliasName}.json`),
      JSON.stringify(itemData, null, 2),
      "utf-8"
    )
  }
}

// Write the global registry index
fs.writeFileSync(
  path.join(PUBLIC_R, "registry.json"),
  JSON.stringify(catalog, null, 2),
  "utf-8"
)

console.log(`[build-registry] Successfully generated ${builtCount} canonical items + ${Object.keys(ALIASES).length} aliases into public/r/`)
