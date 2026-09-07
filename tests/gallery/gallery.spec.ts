import { describe, it } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { charts } from "../../config/charts"
import {
  filterCharts,
  searchCharts,
  defaultFilters,
  parseChartFilters,
  serializeChartFilters,
  chartHref,
} from "../../lib/charts/filters"
import { getInstallCommand } from "../../lib/registry/install-command"

describe("Charts discovery", () => {
  it("combines engine, category, feature, renderer and status without fabricated capabilities", () => {
    assert.equal(
      filterCharts(charts, {
        ...defaultFilters,
        engine: "d3",
        feature: "interactive",
      }).length,
      0
    )
    assert.deepEqual(
      filterCharts(charts, {
        ...defaultFilters,
        engine: "recharts",
        category: "line",
        feature: "legend",
        renderer: "svg",
        status: "stable",
      }).map((c) => c.registryName),
      ["line-multiple"]
    )
    assert.equal(filterCharts(charts, defaultFilters).length, charts.length)
  })
  it("searches metadata and requires all query terms", () => {
    assert.equal(searchCharts(charts, "GOOGLE runtime").length, 3)
    assert.ok(
      searchCharts(charts, "keyboard").every((c) =>
        c.features.includes("keyboard")
      )
    )
    assert.equal(searchCharts(charts, "nonexistent visualization").length, 0)
    assert.ok(searchCharts(charts, "network").length > 0)
  })
  it("round-trips shareable state and normalizes unsupported values", () => {
    const filters = {
      ...defaultFilters,
      engine: "d3" as const,
      category: "network" as const,
      q: "force simulation",
      status: "beta" as const,
    }
    assert.deepEqual(
      parseChartFilters(
        new URLSearchParams(serializeChartFilters(filters)),
        charts
      ),
      filters
    )
    assert.deepEqual(
      parseChartFilters(
        new URLSearchParams("engine=unknown&feature=zoom&renderer=canvas"),
        charts
      ),
      defaultFilters
    )
    assert.equal(serializeChartFilters(defaultFilters), "")
  })
  it("links every entry to its engine route and real installable source", () => {
    for (const chart of charts) {
      assert.equal(chartHref(chart), `/charts/${chart.engine}/${chart.slug}`)
      assert.ok(fs.existsSync(`app/charts/${chart.engine}/[chart]/page.tsx`))
      const item = JSON.parse(
        fs.readFileSync(`public/r/${chart.registryName}.json`, "utf8")
      )
      assert.equal(item.name, chart.registryName)
      assert.ok(item.files.length > 0)
      assert.ok(
        fs
          .readFileSync(chart.componentPath, "utf8")
          .includes(`function ${chart.exportName}`)
      )
      for (const pm of ["npm", "pnpm", "bun"] as const)
        assert.match(
          getInstallCommand(chart.registryName, pm),
          new RegExp(`/r/${chart.registryName}\\.json$`)
        )
      assert.ok(!getInstallCommand(chart.registryName).includes("localhost"))
    }
  })
  it("resolves registry dependencies and relative imports inside each install closure", () => {
    const catalog = JSON.parse(fs.readFileSync("registry.json", "utf8"))
    for (const chart of charts) {
      const items = new Map<
        string,
        {
          files: { target: string; content: string }[]
          registryDependencies: string[]
        }
      >()
      function collect(name: string) {
        if (items.has(name)) return
        const item = JSON.parse(
          fs.readFileSync(`public/r/${name}.json`, "utf8")
        )
        items.set(name, item)
        for (const dep of item.registryDependencies) {
          const name = dep
            .split("/")
            .at(-1)!
            .replace(/\.json$/, "")
          if (catalog.items.some((x: { name: string }) => x.name === name)) {
            assert.ok(dep.startsWith("@plotcn/") || /^https?:\/\//.test(dep))
            collect(name)
          }
        }
      }
      collect(chart.registryName)
      const files = [...items.values()].flatMap((item) => item.files)
      const targets = new Set(
        files.map((f) => f.target.replace(/\.(tsx?|jsx?)$/, ""))
      )
      for (const file of files)
        for (const match of file.content.matchAll(/from ["'](\.[^"']+)["']/g)) {
          const resolved = path.posix.normalize(
            path.posix.join(path.posix.dirname(file.target), match[1])
          )
          assert.ok(
            targets.has(resolved),
            `${chart.registryName}: unresolved ${resolved}`
          )
        }
    }
  })
})
