import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  REGISTRY_SCHEMA,
  REGISTRY_ITEM_SCHEMA,
  DEFAULT_REGISTRY_NAMESPACE,
  normalizeChartMetadata,
  sortChartMetadata,
  collectChartCatalog,
  buildRegistryItem,
  buildRegistry,
  serializeRegistryJson,
  buildDependencyGraph,
  resolveTransitiveDependencies,
  validateDependencyGraph,
  validateRegistrySchema,
  validateRegistryItems,
  validateEngineIsolation,
  getRegistryItemUrl,
  getRegistryIndexUrl,
  getRegistryInstallCommand,
  getRegistryViewCommand,
} from "../../packages/registry/src"

describe("@plotcn/registry Schema & Metadata", () => {
  it("should declare official shadcn schema URLs and default namespace", () => {
    assert.equal(REGISTRY_SCHEMA, "https://ui.shadcn.com/schema/registry.json")
    assert.equal(REGISTRY_ITEM_SCHEMA, "https://ui.shadcn.com/schema/registry-item.json")
    assert.equal(DEFAULT_REGISTRY_NAMESPACE, "@plotcn")
  })

  it("should normalize partial metadata with canonical defaults", () => {
    const raw = {
      id: "line-basic",
      title: "Basic Line Chart",
    }
    const normalized = normalizeChartMetadata(raw)

    assert.equal(normalized.id, "line-basic")
    assert.equal(normalized.registryName, "line-basic")
    assert.equal(normalized.engine, "recharts")
    assert.equal(normalized.renderer, "svg")
    assert.equal(normalized.status, "stable")
    assert.deepEqual(normalized.dependencies, [])
    assert.deepEqual(normalized.registryDependencies, [])
    assert.ok(normalized.tags.length > 0)
  })

  it("should set google-runtime as default renderer for Google Charts", () => {
    const googleItem = normalizeChartMetadata({
      id: "google-geochart",
      title: "Google GeoChart",
      engine: "google",
    })
    assert.equal(googleItem.renderer, "google-runtime")
    assert.deepEqual(googleItem.externalRuntime, ["Google Charts"])
  })
})

describe("@plotcn/registry Catalog & Deterministic Sorting", () => {
  it("should sort catalog deterministically by engine, category, and name", () => {
    const items = [
      { engine: "google" as const, category: "geo", registryName: "google-geochart" },
      { engine: "recharts" as const, category: "line", registryName: "line-multiple" },
      { engine: "d3" as const, category: "cartesian", registryName: "d3-animated-line" },
      { engine: "recharts" as const, category: "area", registryName: "area-gradient" },
      { engine: "recharts" as const, category: "line", registryName: "line-basic" },
    ]

    const sorted = sortChartMetadata(items)

    assert.equal(sorted[0].registryName, "area-gradient") // recharts, area
    assert.equal(sorted[1].registryName, "line-basic") // recharts, line
    assert.equal(sorted[2].registryName, "line-multiple") // recharts, line
    assert.equal(sorted[3].registryName, "d3-animated-line") // d3
    assert.equal(sorted[4].registryName, "google-geochart") // google
  })

  it("should filter catalog items by engine, query, and status", () => {
    const catalog = [
      { id: "c1", title: "Line Basic", engine: "recharts" as const, category: "line", status: "stable" as const },
      { id: "c2", title: "D3 Force Network", engine: "d3" as const, category: "network", status: "beta" as const },
      { id: "c3", title: "Google GeoChart", engine: "google" as const, category: "geo", status: "stable" as const },
      { id: "c4", title: "Secret Draft", engine: "recharts" as const, category: "experimental", status: "draft" as any },
    ]

    const rechartsOnly = collectChartCatalog(catalog, { engine: "recharts" })
    assert.equal(rechartsOnly.length, 1)
    assert.equal(rechartsOnly[0].id, "c1")

    const searchGeo = collectChartCatalog(catalog, { query: "geochart" })
    assert.equal(searchGeo.length, 1)
    assert.equal(searchGeo[0].id, "c3")

    // Drafts excluded by default
    const allPublic = collectChartCatalog(catalog)
    assert.ok(allPublic.every((c) => (c.status as string) !== "draft"))
  })
})

describe("@plotcn/registry Generation", () => {
  it("should build shadcn registry item and exclude demo files", () => {
    const meta = normalizeChartMetadata({
      id: "d3-animated-line",
      title: "D3 Animated Line",
      engine: "d3",
      dependencies: ["d3-array", "d3-scale", "motion"],
      registryDependencies: ["chart-container", "chart-tooltip"],
      files: [
        { path: "registry/d3/animated-line.tsx", target: "components/charts/animated-line.tsx" },
        { path: "registry/d3/animated-line.demo.tsx", role: "demo" },
      ],
    })

    const registryItem = buildRegistryItem(meta, {
      readFileContent: (p) => `// Content of ${p}`,
    })

    assert.equal(registryItem.$schema, REGISTRY_ITEM_SCHEMA)
    assert.equal(registryItem.name, "d3-animated-line")
    assert.equal(registryItem.files.length, 1) // demo file excluded!
    assert.equal(registryItem.files[0].path, "components/charts/animated-line.tsx")
    assert.equal(registryItem.files[0].content, "// Content of registry/d3/animated-line.tsx")
    assert.deepEqual(registryItem.dependencies, ["d3-array", "d3-scale", "motion"])
    assert.deepEqual(registryItem.registryDependencies, ["chart-container", "chart-tooltip"])
  })

  it("should build root catalog and serialize deterministic JSON", () => {
    const items = [
      {
        name: "line-basic",
        type: "registry:component",
        files: [{ path: "line-basic.tsx" }],
      },
    ]

    const root = buildRegistry(items, { name: "plotcn", homepage: "https://plotcn.vercel.app" })
    assert.equal(root.$schema, REGISTRY_SCHEMA)
    assert.equal(root.name, "plotcn")
    assert.equal(root.items.length, 1)

    const json = serializeRegistryJson(root)
    assert.ok(json.endsWith("\n"))
    assert.ok(json.includes('"name": "plotcn"'))
  })
})

describe("@plotcn/registry Dependency Graph & Cycle Detection", () => {
  it("should build dependency graph and resolve transitive dependencies", () => {
    const items = [
      { name: "chart-container", registryDependencies: [], dependencies: [] },
      { name: "chart-tooltip", registryDependencies: ["chart-container"], dependencies: [] },
      { name: "d3-animated-line", registryDependencies: ["chart-tooltip"], dependencies: [] },
    ]

    const graph = buildDependencyGraph(items)
    const transitive = resolveTransitiveDependencies("d3-animated-line", graph)

    assert.deepEqual(transitive, ["chart-container", "chart-tooltip"])
  })

  it("should detect cyclic dependencies and missing references", () => {
    const cyclicItems = [
      { name: "A", registryDependencies: ["B"], dependencies: [] },
      { name: "B", registryDependencies: ["C"], dependencies: [] },
      { name: "C", registryDependencies: ["A"], dependencies: [] },
    ]

    const graph = buildDependencyGraph(cyclicItems)
    const issues = validateDependencyGraph(cyclicItems, graph)

    assert.ok(issues.some((i) => i.type === "cycle"))

    const missingItems = [
      { name: "X", registryDependencies: ["non-existent-dep"], dependencies: [] },
    ]
    const missingGraph = buildDependencyGraph(missingItems)
    const missingIssues = validateDependencyGraph(missingItems, missingGraph)

    assert.ok(missingIssues.some((i) => i.type === "missing"))
  })
})

describe("@plotcn/registry Engine Isolation Validation", () => {
  it("should reject D3 items using full d3 umbrella package", () => {
    const badD3Item = {
      name: "d3-bubble",
      type: "registry:component",
      dependencies: ["d3"], // Forbidden umbrella package
      files: [{ path: "d3-bubble.tsx" }],
    }

    const issues = validateEngineIsolation([badD3Item])
    assert.ok(issues.some((i) => i.rule === "d3-modular-dependencies"))
  })

  it("should reject Recharts items pulling Google loader or D3", () => {
    const badRechartsItem = {
      name: "line-mixed",
      type: "registry:component",
      dependencies: ["recharts", "d3-shape"], // Forbidden D3 in Recharts
      registryDependencies: ["google-chart-loader"], // Forbidden Google loader
      files: [{ path: "line-mixed.tsx" }],
    }

    const issues = validateEngineIsolation([badRechartsItem])
    assert.ok(issues.some((i) => i.rule === "recharts-no-google-leakage"))
    assert.ok(issues.some((i) => i.rule === "recharts-no-d3-leakage"))
  })

  it("should reject Google items pulling Recharts, D3, or Maps SDK", () => {
    const badGoogleItem = {
      name: "google-geochart",
      type: "registry:component",
      dependencies: ["recharts", "@google/maps"], // Forbidden
      files: [{ path: "google-geochart.tsx" }],
    }

    const issues = validateEngineIsolation([badGoogleItem])
    assert.ok(issues.some((i) => i.rule === "google-no-recharts-leakage"))
    assert.ok(issues.some((i) => i.rule === "google-no-maps-sdk"))
    assert.ok(issues.some((i) => i.rule === "google-shared-loader-required"))
  })

  it("should pass for clean isolated engine items", () => {
    const validItems = [
      {
        name: "line-basic",
        type: "registry:component",
        dependencies: ["recharts"],
        registryDependencies: ["chart-container"],
        files: [{ path: "line-basic.tsx" }],
      },
      {
        name: "d3-animated-line",
        type: "registry:component",
        dependencies: ["d3-array", "d3-scale", "d3-shape", "motion"],
        registryDependencies: ["chart-container", "chart-tooltip"],
        files: [{ path: "animated-line.tsx" }],
      },
      {
        name: "google-geochart",
        type: "registry:component",
        dependencies: [],
        registryDependencies: ["google-chart-loader", "chart-container"],
        files: [{ path: "google-geochart.tsx" }],
      },
    ]

    const issues = validateEngineIsolation(validItems)
    assert.equal(issues.length, 0)
  })
})

describe("@plotcn/registry URLs & Commands", () => {
  it("should generate public registry item and index URLs", () => {
    assert.equal(
      getRegistryItemUrl("line-basic"),
      "https://plotcn.vercel.app/r/line-basic.json"
    )
    assert.equal(
      getRegistryItemUrl("@plotcn/d3-animated-line"),
      "https://plotcn.vercel.app/r/d3-animated-line.json"
    )
    assert.equal(
      getRegistryIndexUrl(),
      "https://plotcn.vercel.app/r/registry.json"
    )
  })

  it("should generate correct install commands across package managers", () => {
    assert.equal(
      getRegistryInstallCommand("line-basic", { packageManager: "pnpm" }),
      "pnpm dlx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getRegistryInstallCommand("line-basic", { packageManager: "npm" }),
      "npx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getRegistryInstallCommand("line-basic", { packageManager: "yarn" }),
      "npx shadcn@latest add @plotcn/line-basic"
    )
    assert.equal(
      getRegistryInstallCommand("line-basic", { packageManager: "bun" }),
      "bunx --bun shadcn@latest add @plotcn/line-basic"
    )

    // Direct URL without namespace
    assert.equal(
      getRegistryInstallCommand("line-basic", { packageManager: "pnpm", useNamespace: false }),
      "pnpm dlx shadcn@latest add https://plotcn.vercel.app/r/line-basic.json"
    )
  })

  it("should generate view commands for inspect before install", () => {
    assert.equal(
      getRegistryViewCommand("google-geochart"),
      "pnpm dlx shadcn@latest view @plotcn/google-geochart"
    )
  })
})
