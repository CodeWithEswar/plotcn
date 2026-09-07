import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  calculateTooltipPosition,
  ChartTooltip,
  Crosshair,
  Cursor,
  Legend,
  LegendMarkerIcon,
  normalizeRechartsTooltip,
  normalizeD3Interaction,
  normalizeGoogleSelection,
  ChartProvider,
} from "../../packages/chart-react/src"
import type { TooltipDatum, ChartLegendItem } from "../../packages/chart-react/src"

describe("Section 8: Collision-Aware Tooltip Positioning Engine", () => {
  const containerBounds = { width: 800, height: 500 }
  const tooltipSize = { width: 180, height: 100 }

  it("should place tooltip to the right of anchor when space is available", () => {
    const anchor = { x: 200, y: 250 }
    const pos = calculateTooltipPosition(anchor, tooltipSize, containerBounds, {
      offset: { x: 12, y: 12 },
    })

    assert.equal(pos.x, 212)
    assert.equal(pos.isFlippedX, false)
    assert.equal(pos.placement, "right")
  })

  it("should flip tooltip horizontally when colliding with right container boundary", () => {
    // Anchor at x=750 on a 800px container; 750 + 12 + 180 = 942 > 800
    const anchor = { x: 750, y: 250 }
    const pos = calculateTooltipPosition(anchor, tooltipSize, containerBounds, {
      offset: { x: 12, y: 12 },
    })

    assert.equal(pos.isFlippedX, true)
    assert.equal(pos.placement, "left")
    // Should be anchor.x - tooltip.width - offset.x = 750 - 180 - 12 = 558
    assert.equal(pos.x, 558)
  })

  it("should clamp tooltip within container safe bounds", () => {
    // Extreme edge: anchor at x=795
    const anchor = { x: 795, y: 10 }
    const pos = calculateTooltipPosition(anchor, tooltipSize, containerBounds, {
      padding: 10,
    })

    assert.ok(pos.x >= 10 && pos.x + tooltipSize.width <= 790)
    assert.ok(pos.y >= 10 && pos.y + tooltipSize.height <= 490)
  })

  it("should use anchored header placement in compact mode", () => {
    const anchor = { x: 150, y: 150 }
    const pos = calculateTooltipPosition(anchor, tooltipSize, { width: 320, height: 240 }, {
      compact: true,
      padding: 8,
    })

    assert.equal(pos.placement, "anchored")
    assert.equal(pos.x, 8)
    assert.equal(pos.y, 8)
  })
})

describe("Section 8: Shared Tooltip Presentation & Null Formatting", () => {
  const sampleItems: TooltipDatum[] = [
    {
      id: "revenue",
      label: "Revenue",
      value: 84200,
      datum: {},
      index: 0,
      color: "#10b981",
      marker: { shape: "line", lineStyle: "solid", color: "#10b981" },
    },
    {
      id: "profit",
      label: "Profit",
      value: null, // Null value must format as em dash
      datum: {},
      index: 0,
      color: "#6366f1",
      marker: { shape: "line", lineStyle: "dashed", color: "#6366f1" },
    },
  ]

  it("should render series labels and format null values as em dash", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ChartTooltip, {
        active: true,
        anchor: { x: 100, y: 100 },
        label: "May 2026",
        items: sampleItems,
      })
    )

    assert.ok(markup.includes("May 2026"), "Should render primary header label")
    assert.ok(markup.includes("Revenue"), "Should render Revenue series")
    assert.ok(markup.includes("84200"), "Should render Revenue value")
    assert.ok(markup.includes("Profit"), "Should render Profit series")
    assert.ok(markup.includes("—"), "Null value must be formatted as em dash rather than null/NaN")
    assert.ok(!markup.includes("NaN"), "Must not contain NaN")
    assert.ok(!markup.includes("null"), "Must not contain raw null string")
  })

  it("should support strongly typed custom tooltip render functions", () => {
    const markup = renderToStaticMarkup(
      React.createElement(ChartTooltip, {
        active: true,
        anchor: { x: 100, y: 100 },
        label: "Q2 2026",
        items: sampleItems,
        locked: true,
        children: (ctx) =>
          React.createElement(
            "div",
            { className: "custom-tooltip" },
            React.createElement("h3", null, String(ctx.label)),
            React.createElement("p", null, `Count: ${ctx.items.length}`),
            ctx.locked ? React.createElement("span", { className: "locked-badge" }, "Locked") : null
          ),
      })

    )

    assert.ok(markup.includes("custom-tooltip"))
    assert.ok(markup.includes("Q2 2026"))
    assert.ok(markup.includes("Count: 2"))
    assert.ok(markup.includes("Locked"))
  })
})

describe("Section 8: Crosshair & Cursor Primitives", () => {
  const chartWrapper = (child: React.ReactNode) =>
    React.createElement(
      ChartProvider,
      { dimensions: { width: 600, height: 400 }, margins: { top: 20, right: 20, bottom: 30, left: 40 } },
      React.createElement("svg", { width: 600, height: 400 }, child)
    )


  it("should render vertical X crosshair line", () => {
    const markup = renderToStaticMarkup(
      chartWrapper(React.createElement(Crosshair, { mode: "x", x: 150 }))
    )
    assert.ok(markup.includes("<line"), "Should render crosshair line")
    assert.ok(markup.includes('x1="150"'), "Line x1 must match active x")
    assert.ok(markup.includes('x2="150"'), "Line x2 must match active x")
  })

  it("should render point halo in point crosshair mode", () => {
    const markup = renderToStaticMarkup(
      chartWrapper(React.createElement(Crosshair, { mode: "point", x: 200, y: 150, haloRadius: 10 }))
    )
    assert.ok(markup.includes("<circle"), "Should render halo circle")
    assert.ok(markup.includes('cx="200"'))
    assert.ok(markup.includes('cy="150"'))
    assert.ok(markup.includes('r="10"'))
  })

  it("should render band cursor for categorical charts", () => {
    const markup = renderToStaticMarkup(
      chartWrapper(React.createElement(Cursor, { styleType: "band", x: 120, bandWidth: 40 }))
    )
    assert.ok(markup.includes("<rect"), "Should render category band rectangle")
    assert.ok(markup.includes('x="100"'))
    assert.ok(markup.includes('width="40"'))
  })
})

describe("Section 8: Shared Legend System", () => {
  const items: ChartLegendItem[] = [
    {
      id: "series-a",
      label: "Series A",
      color: "#10b981",
      marker: { shape: "dot", color: "#10b981" },
    },
    {
      id: "series-b",
      label: "Series B",
      color: "#6366f1",
      marker: { shape: "line", lineStyle: "dashed", color: "#6366f1" },
    },
  ]

  it("should hide single-series legends by default", () => {
    const singleItem = [items[0]]
    const markup = renderToStaticMarkup(React.createElement(Legend, { items: singleItem }))
    assert.equal(markup, "", "Single series legend must be hidden by default")

    const forcedMarkup = renderToStaticMarkup(
      React.createElement(Legend, { items: singleItem, showSingleSeriesLegend: true })
    )
    assert.ok(forcedMarkup.includes("Series A"), "Forced single series legend renders")
  })

  it("should render interactive buttons with accessible aria-pressed semantics", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Legend, {
        items,
        hiddenSeriesIds: ["series-b"],
        interaction: "toggle",
        onToggleSeries: () => {},
      })
    )

    assert.ok(markup.includes('role="button"'), "Legend items must be interactive buttons")
    assert.ok(markup.includes('aria-pressed="true"'), "Visible series has aria-pressed=true")
    assert.ok(markup.includes('aria-pressed="false"'), "Hidden series has aria-pressed=false")
    assert.ok(markup.includes("line-through"), "Hidden series displays strikethrough/muted styling")
  })

  it("should render non-color marker distinctions (solid vs dashed line)", () => {
    const dotMarkup = renderToStaticMarkup(
      React.createElement(LegendMarkerIcon, { marker: { shape: "dot", color: "#10b981" } })
    )
    assert.ok(dotMarkup.includes("<circle"), "Dot marker renders SVG circle")

    const dashedMarkup = renderToStaticMarkup(
      React.createElement(LegendMarkerIcon, {
        marker: { shape: "line", lineStyle: "dashed", color: "#6366f1" },
      })
    )
    assert.ok(dashedMarkup.includes("<line"), "Line marker renders SVG line")
    assert.ok(dashedMarkup.includes('stroke-dasharray="4 2"'), "Dashed line has stroke-dasharray")
  })
})

describe("Section 8: Engine Adapters Normalization", () => {
  it("should normalize Recharts tooltip payload into standard TooltipDatum items", () => {
    const rechartsPayload = [
      { dataKey: "revenue", name: "Revenue", value: 12000, color: "#10b981" },
      { dataKey: "profit", name: "Profit", value: 4500, color: "#6366f1" },
    ]
    const normalized = normalizeRechartsTooltip(rechartsPayload, "May", { x: 140, y: 180 })

    assert.equal(normalized.items.length, 2)
    assert.equal(normalized.items[0].id, "revenue")
    assert.equal(normalized.items[0].value, 12000)
    assert.equal(normalized.items[1].id, "profit")
    assert.equal(normalized.items[1].value, 4500)
    assert.equal(normalized.anchor?.x, 140)
    assert.equal(normalized.anchor?.y, 180)
    assert.equal(normalized.label, "May")
  })

  it("should normalize D3 active datum and series list", () => {
    const datum = { date: "2026-05-01", rev: 55000, exp: 32000 }
    const seriesList = [
      { id: "rev", label: "Revenue", value: (d: typeof datum) => d.rev, color: "#10b981" },
      { id: "exp", label: "Expenses", value: (d: typeof datum) => d.exp, color: "#ef4444" },
    ]

    const normalized = normalizeD3Interaction(datum, 4, { x: 250, y: 120 }, seriesList, "May 2026")

    assert.equal(normalized.items.length, 2)
    assert.equal(normalized.items[0].label, "Revenue")
    assert.equal(normalized.items[0].value, 55000)
    assert.equal(normalized.items[1].label, "Expenses")
    assert.equal(normalized.items[1].value, 32000)
    assert.equal(normalized.anchor.x, 250)
  })

  it("should normalize Google Charts selection events", () => {
    const fakeDataTable = {
      getValue(row: number, col: number) {
        const data = [
          ["India", 45000],
          ["USA", 78000],
        ]
        return data[row][col]
      },
    }

    const selection = [{ row: 0, column: null }]
    const seriesCols = [{ id: "val", columnIndex: 1, label: "Revenue", color: "#10b981" }]

    const normalized = normalizeGoogleSelection(selection, fakeDataTable, seriesCols, 0)
    assert.equal(normalized.items.length, 1)
    assert.equal(normalized.label, "India")
    assert.equal(normalized.items[0].value, 45000)
  })
})
