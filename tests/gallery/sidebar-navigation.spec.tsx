import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToString } from "react-dom/server"
import { ChartFamilyIcon } from "../../components/chart-family-icons/chart-family-icon"
import { ChartSidebarFamily } from "../../components/chart-detail/chart-sidebar-family"
import type { ChartMetadata } from "../../lib/charts/metadata"

const mockChart: ChartMetadata = {
  id: "recharts-line-signal",
  slug: "line-signal",
  registryName: "line-signal",
  title: "Signal Line",
  description: "Signal line chart",
  engine: "recharts",
  category: "line",
  tags: ["recharts", "line"],
  componentPath: "registry/recharts/line-signal.tsx",
  exportName: "SignalLine",
  dependencies: ["recharts"],
  registryDependencies: [],
  renderer: "svg",
  status: "preview",
  difficulty: "intermediate",
  features: ["responsive"],
}

const mockSiblingChart: ChartMetadata = {
  id: "recharts-line-pulse",
  slug: "line-pulse",
  registryName: "line-pulse",
  title: "Pulse Line",
  description: "Pulse line chart",
  engine: "recharts",
  category: "line",
  tags: ["recharts", "line"],
  componentPath: "registry/recharts/line-pulse.tsx",
  exportName: "PulseLine",
  dependencies: ["recharts"],
  registryDependencies: [],
  renderer: "svg",
  status: "preview",
  difficulty: "intermediate",
  features: ["responsive"],
}

describe("Chart Family Icons & Sidebar Navigation Rail", () => {
  it("renders native SVG glyphs with currentColor and aria-hidden for all families", () => {
    const families = [
      "line",
      "area",
      "bar",
      "column",
      "pie",
      "geo",
      "network",
      "hierarchy",
      "specialized",
    ] as const

    for (const family of families) {
      const html = renderToString(<ChartFamilyIcon family={family} className="size-4" />)
      assert.ok(html.includes("<svg"), `Family ${family} must render SVG`)
      assert.ok(html.includes('aria-hidden="true"'), `Family ${family} must be aria-hidden`)
      assert.ok(html.includes('focusable="false"'), `Family ${family} must be focusable false`)
      assert.ok(html.includes('viewBox="0 0 20 20"'), `Family ${family} must have 20x20 viewBox`)
      assert.ok(html.includes("currentColor"), `Family ${family} must use currentColor`)
    }
  })

  it("renders distinct geometry for line, area, and bar", () => {
    const lineHtml = renderToString(<ChartFamilyIcon family="line" />)
    const areaHtml = renderToString(<ChartFamilyIcon family="area" />)
    const barHtml = renderToString(<ChartFamilyIcon family="bar" />)

    assert.ok(lineHtml.includes("<path"), "Line must use path")
    assert.ok(areaHtml.includes('fill-opacity="0.14"'), "Area must have subtle fill opacity")
    assert.ok(barHtml.includes("<rect"), "Bar must render stepped rects")
  })

  it("renders ChartSidebarFamily with proper disclosure ARIA attributes and metadata count", () => {
    const html = renderToString(
      <ChartSidebarFamily
        engine="recharts"
        category="line"
        items={[mockChart, mockSiblingChart]}
        currentChart={mockChart}
        isExpanded={true}
        onToggle={() => {}}
      />
    )

    // Button disclosure attributes
    assert.ok(html.includes('aria-expanded="true"'))
    assert.ok(html.includes('aria-controls="sidebar-family-recharts-line"'))

    // Canonical item count
    assert.ok(html.includes(">2</span>"), "Must display canonical metadata count of 2")

    // Active chart item state
    assert.ok(html.includes('aria-current="page"'))
    assert.ok(html.includes("Signal Line"))
    assert.ok(html.includes("Pulse Line"))

    // Active indicator dot
    assert.ok(html.includes("bg-emerald-400"))
  })

  it("hides child items from accessibility tree when collapsed", () => {
    const html = renderToString(
      <ChartSidebarFamily
        engine="recharts"
        category="line"
        items={[mockChart, mockSiblingChart]}
        currentChart={mockChart}
        isExpanded={false}
        onToggle={() => {}}
      />
    )

    assert.ok(html.includes('aria-expanded="false"'))
    assert.ok(!html.includes('aria-current="page"'), "Collapsed family should not render child links")
    assert.ok(!html.includes("Pulse Line"), "Collapsed family should omit child links")
  })
})
