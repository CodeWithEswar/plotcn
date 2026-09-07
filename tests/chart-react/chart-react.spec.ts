import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"

import {
  ChartRoot,
  ChartProvider,
  ChartSurface,
  useChart,
  Plot,
  XAxis,
  YAxis,
  Grid,
  Line,
  Area,
  Bar,
  ScatterPoint,
  PolarPlot,
  RadialAxis,
  AngularAxis,
  RadialGrid,
  Crosshair,
  Cursor,
  HitArea,
  ChartTooltip,
  Legend,
  LegendItem,
  LegendList,
  ReferenceLine,
  ReferenceBand,
  ReferencePoint,
  Annotation,
  ChartTitle,
  ChartDescription,
  ChartSummary,
} from "../../packages/chart-react/src"

describe("@plotcn/chart-react Root & Context", () => {
  it("should throw a helpful error when useChart is called outside ChartProvider", () => {
    function TestConsumer() {
      useChart()
      return null
    }

    assert.throws(
      () => ReactDOMServer.renderToStaticMarkup(React.createElement(TestConsumer)),
      /useChart must be used within a <ChartRoot> or <ChartProvider>/
    )
  })

  it("should calculate inner dimensions and render root wrapper", () => {
    let capturedContext: ReturnType<typeof useChart> | null = null

    function TestConsumer() {
      capturedContext = useChart()
      return React.createElement("span", null, "child")
    }

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        {
          width: 600,
          height: 400,
          margins: { top: 20, right: 30, bottom: 40, left: 50 },
          id: "custom-chart-id",
        },
        React.createElement(TestConsumer)
      )
    )

    assert.ok(html.includes("plotcn-chart-root"))
    assert.ok(capturedContext !== null)
    const ctx = capturedContext as unknown as ReturnType<typeof useChart>
    assert.equal(ctx.width, 600)
    assert.equal(ctx.height, 400)
    assert.equal(ctx.innerWidth, 600 - 50 - 30) // 520
    assert.equal(ctx.innerHeight, 400 - 20 - 40) // 340
    assert.equal(ctx.chartId, "custom-chart-id")
  })

  it("should render ChartSurface SVG with accessibility and viewBox attributes", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        {
          width: 500,
          height: 300,
          titleId: "sales-title",
          descriptionId: "sales-desc",
        },
        React.createElement(
          ChartSurface,
          null,
          React.createElement("circle", { cx: 10, cy: 10, r: 5 })
        )
      )
    )

    assert.ok(html.includes('<svg width="100%" height="100%" viewBox="0 0 500 300"'))
    assert.ok(html.includes('role="graphics-document"'))
    assert.ok(html.includes('aria-roledescription="chart"'))
    assert.ok(html.includes('aria-labelledby="sales-title"'))
    assert.ok(html.includes('aria-describedby="sales-desc"'))
    assert.ok(html.includes('<circle cx="10" cy="10" r="5"'))
  })
})

describe("@plotcn/chart-react Cartesian Primitives", () => {
  it("should render Plot with margin translation and optional clipPath", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        {
          width: 500,
          height: 300,
          margins: { top: 25, right: 25, bottom: 35, left: 45 },
          id: "test-chart",
        },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            { clip: true },
            React.createElement("rect", { width: 100, height: 100 })
          )
        )
      )
    )

    assert.ok(html.includes('transform="translate(45, 25)"'))
    assert.ok(html.includes('clip-path="url(#test-chart-plot-clip)"'))
    assert.ok(html.includes('<clipPath id="test-chart-plot-clip"'))
  })

  it("should render XAxis, YAxis, and Grid lines", () => {
    const xTicks = [
      { value: "Jan", position: 50, label: "Jan" },
      { value: "Feb", position: 150, label: "Feb" },
    ]
    const yTicks = [
      { value: 0, position: 200, label: "0" },
      { value: 100, position: 0, label: "100" },
    ]

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 400, height: 300 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            null,
            React.createElement(Grid, { xTicks, yTicks }),
            React.createElement(XAxis, { ticks: xTicks, label: "Months" }),
            React.createElement(YAxis, { ticks: yTicks, label: "Value" })
          )
        )
      )
    )

    assert.ok(html.includes("plotcn-cartesian-grid"))
    assert.ok(html.includes("plotcn-x-axis"))
    assert.ok(html.includes("plotcn-y-axis"))
    assert.ok(html.includes("Jan"))
    assert.ok(html.includes("Feb"))
    assert.ok(html.includes("Months"))
    assert.ok(html.includes("Value"))
  })

  it("should render Line, Area, Bar, and ScatterPoint SVG marks", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 400, height: 300 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            null,
            React.createElement(Area, { path: "M 0 100 L 50 20 L 100 100 Z" }),
            React.createElement(Line, { path: "M 0 100 L 50 20 L 100 100" }),
            React.createElement(Bar, {
              geometry: { x: 10, y: 20, width: 30, height: 80, rx: 4 },
            }),
            React.createElement(ScatterPoint, { x: 50, y: 20, radius: 6 })
          )
        )
      )
    )

    assert.ok(html.includes('d="M 0 100 L 50 20 L 100 100 Z"'))
    assert.ok(html.includes("plotcn-area"))
    assert.ok(html.includes('d="M 0 100 L 50 20 L 100 100"'))
    assert.ok(html.includes("plotcn-line"))
    assert.ok(html.includes('<rect x="10" y="20" width="30" height="80" rx="4"'))
    assert.ok(html.includes('<circle cx="50" cy="20" r="6"'))
  })
})

describe("@plotcn/chart-react Polar Primitives", () => {
  it("should render PolarPlot, RadialAxis, AngularAxis, and RadialGrid", () => {
    const radialTicks = [{ radius: 50, label: "50" }, { radius: 100, label: "100" }]
    const angularTicks = [
      { angle: 0, label: "North" },
      { angle: Math.PI / 2, label: "East" },
    ]

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 400, height: 400 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            PolarPlot,
            null,
            React.createElement(RadialGrid, {
              radialTicks,
              angularTicks,
              maxRadius: 100,
            }),
            React.createElement(RadialAxis, { ticks: radialTicks }),
            React.createElement(AngularAxis, { ticks: angularTicks, radius: 100 })
          )
        )
      )
    )

    assert.ok(html.includes("plotcn-polar-plot"))
    assert.ok(html.includes("plotcn-radial-axis"))
    assert.ok(html.includes("plotcn-angular-axis"))
    assert.ok(html.includes("North"))
    assert.ok(html.includes("East"))
  })
})

describe("@plotcn/chart-react Interaction & Annotations", () => {
  it("should render Crosshair and Cursor within ChartRoot", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 500, height: 300 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            null,
            React.createElement(Crosshair, { x: 120, y: 80 }),
            React.createElement(Cursor, { x: 100, width: 40 })
          )
        )
      )
    )

    assert.ok(html.includes("plotcn-crosshair"))
    assert.ok(html.includes("plotcn-cursor"))
    assert.ok(html.includes('x1="120"'))
    assert.ok(html.includes('y1="80"'))
    assert.ok(html.includes('width="40"'))
  })

  it("should render HitArea with rectangular and circular targets", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 500, height: 300 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            null,
            React.createElement(HitArea, { x: 10, y: 10, width: 30, height: 30 }),
            React.createElement(HitArea, { shape: "circle", cx: 50, cy: 50, r: 20 })
          )
        )
      )
    )

    assert.ok(html.includes('<rect x="10" y="10" width="30" height="30" fill="transparent"'))
    assert.ok(html.includes('<circle cx="50" cy="50" r="20" fill="transparent"'))
  })

  it("should render ChartTooltip overlay when active", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartTooltip,
        { active: true, x: 150, y: 100 },
        "Tooltip Content"
      )
    )

    assert.ok(html.includes("plotcn-chart-tooltip"))
    assert.ok(html.includes('role="tooltip"'))
    assert.ok(html.includes("Tooltip Content"))
    assert.ok(html.includes("translate3d(162px, 112px, 0)"))
  })

  it("should render ReferenceLine, ReferenceBand, and ReferencePoint", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        { width: 500, height: 300 },
        React.createElement(
          ChartSurface,
          null,
          React.createElement(
            Plot,
            null,
            React.createElement(
              Annotation,
              null,
              React.createElement(ReferenceLine, { y: 100, label: "Target" }),
              React.createElement(ReferenceBand, { y1: 50, y2: 80, label: "Comfort Zone" }),
              React.createElement(ReferencePoint, { x: 200, y: 100, label: "Milestone" })
            )
          )
        )
      )
    )

    assert.ok(html.includes("plotcn-annotations"))
    assert.ok(html.includes("plotcn-reference-line"))
    assert.ok(html.includes("plotcn-reference-band"))
    assert.ok(html.includes("plotcn-reference-point"))
    assert.ok(html.includes("Target"))
    assert.ok(html.includes("Comfort Zone"))
    assert.ok(html.includes("Milestone"))
  })
})

describe("@plotcn/chart-react Legend & Accessibility", () => {
  it("should render Legend and LegendList with active and hidden items", () => {
    const items = [
      { id: "s1", label: "Series 1", color: "#3b82f6", value: "4.2k" },
      { id: "s2", label: "Series 2", color: "#10b981", hidden: true },
    ]

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        Legend,
        null,
        React.createElement(LegendList, { items })
      )
    )

    assert.ok(html.includes("plotcn-legend"))
    assert.ok(html.includes("plotcn-legend-list"))
    assert.ok(html.includes("Series 1"))
    assert.ok(html.includes("(4.2k)"))
    assert.ok(html.includes("Series 2"))
    assert.ok(html.includes("opacity-35 line-through"))
  })

  it("should render ChartTitle, ChartDescription, and ChartSummary table", () => {
    const headers = ["Period", "Revenue"]
    const rows = [
      { label: "Q1", values: ["$10,000"] },
      { label: "Q2", values: ["$15,000"] },
    ]

    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        ChartRoot,
        {
          width: 500,
          height: 300,
          titleId: "rev-title",
          descriptionId: "rev-desc",
        },
        React.createElement(ChartTitle, null, "Quarterly Revenue"),
        React.createElement(ChartDescription, null, "Performance across quarters"),
        React.createElement(ChartSummary, { headers, rows })
      )
    )

    assert.ok(html.includes('id="rev-title"'))
    assert.ok(html.includes("Quarterly Revenue"))
    assert.ok(html.includes('id="rev-desc"'))
    assert.ok(html.includes("Performance across quarters"))
    assert.ok(html.includes("sr-only"))
    assert.ok(html.includes("Data Table"))
    assert.ok(html.includes('<th scope="col">Period</th>'))
    assert.ok(html.includes("<td>$10,000</td>"))
  })
})
