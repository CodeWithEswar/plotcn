import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"

import {
  type NumericKey,
  type DomainKey,
  type CartesianDomainValue,
  type ValueFormatter,
  type LineSeries,
  type LineCurve,
  type FeatureConfig,
  resolveAccessor,
  resolveChartState,
} from "../../packages/types/src"

import { Chart } from "../../packages/chart-react/src"

describe("Section 6: Easy API & Type System", () => {
  interface SampleRevenueItem {
    month: string
    revenue: number
    profit: number
    region: string
    active: boolean
    createdAt: Date
  }

  it("should enforce compile-time numeric key filtering", () => {
    // Compile-time test: these keys MUST be accepted as NumericKey
    const validRevKey: NumericKey<SampleRevenueItem> = "revenue"
    const validProfitKey: NumericKey<SampleRevenueItem> = "profit"
    assert.equal(validRevKey, "revenue")
    assert.equal(validProfitKey, "profit")

    // Compile-time test: series definition with numeric key
    const series: readonly LineSeries<SampleRevenueItem>[] = [
      { key: "revenue", label: "Revenue" },
      { key: "profit", label: "Profit" },
    ]
    assert.equal(series.length, 2)
    assert.equal(series[0].key, "revenue")
  })

  it("should extract valid domain keys for Cartesian X axis", () => {
    const validMonthKey: DomainKey<SampleRevenueItem> = "month"
    const validDateKey: DomainKey<SampleRevenueItem> = "createdAt"
    const validNumKey: DomainKey<SampleRevenueItem> = "revenue"

    assert.equal(validMonthKey, "month")
    assert.equal(validDateKey, "createdAt")
    assert.equal(validNumKey, "revenue")
  })

  it("should support typed value formatters", () => {
    const formatter: ValueFormatter<number, SampleRevenueItem> = (val, datum) =>
      `$${val.toLocaleString()} in ${datum.month}`

    const sample: SampleRevenueItem = {
      month: "January",
      revenue: 42000,
      profit: 15000,
      region: "North",
      active: true,
      createdAt: new Date(),
    }

    assert.equal(formatter(sample.revenue, sample), "$42,000 in January")
  })
})

describe("Section 6: State Priority Policy", () => {
  it("should resolve states according to strict precedence: error -> loading -> empty -> ready", () => {
    // 1. Error takes highest precedence
    assert.equal(
      resolveChartState({ error: new Error("Network failed"), loading: true, dataLength: 0 }),
      "error"
    )
    assert.equal(
      resolveChartState({ error: "Failed to load", loading: false, dataLength: 10 }),
      "error"
    )

    // 2. Loading takes second precedence
    assert.equal(
      resolveChartState({ error: null, loading: true, dataLength: 0 }),
      "loading"
    )
    assert.equal(
      resolveChartState({ error: null, loading: true, dataLength: 10 }),
      "loading"
    )

    // 3. Empty dataLength === 0 takes third precedence
    assert.equal(
      resolveChartState({ error: null, loading: false, dataLength: 0 }),
      "empty"
    )

    // 4. Otherwise chart is ready to render
    assert.equal(
      resolveChartState({ error: null, loading: false, dataLength: 5 }),
      "ready"
    )
  })
})

describe("Section 6: D3 High-Level Accessor Resolution", () => {
  interface SalesRecord {
    date: string
    timestamp: number
    amount: number
  }

  const data: SalesRecord[] = [
    { date: "2026-01-01", timestamp: 1767225600000, amount: 500 },
    { date: "2026-02-01", timestamp: 1769904000000, amount: 800 },
  ]

  it("should normalize property key accessors into functions", () => {
    const amountAccessor = resolveAccessor<SalesRecord, number>("amount")
    assert.equal(typeof amountAccessor, "function")
    assert.equal(amountAccessor(data[0], 0), 500)
    assert.equal(amountAccessor(data[1], 1), 800)
  })

  it("should preserve functional accessors without alteration", () => {
    const dateAccessor = resolveAccessor<SalesRecord, Date>((d) => new Date(d.timestamp))
    assert.equal(typeof dateAccessor, "function")
    assert.equal(dateAccessor(data[0], 0).getFullYear(), 2026)
  })

  it("should support FeatureConfig boolean or options object", () => {
    interface ZoomOptions {
      axis: "x" | "y" | "xy"
      minScale: number
      maxScale: number
    }

    const simpleZoom: FeatureConfig<ZoomOptions> = true
    const advancedZoom: FeatureConfig<ZoomOptions> = {
      axis: "x",
      minScale: 1,
      maxScale: 8,
    }

    assert.equal(simpleZoom, true)
    assert.equal(typeof advancedZoom, "object")
    if (typeof advancedZoom === "object") {
      assert.equal(advancedZoom.maxScale, 8)
    }
  })
})

describe("Section 6: Primitive API & Compound Chart Namespace", () => {
  it("should render composable primitives via compound Chart.* namespace", () => {
    const html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        Chart.Root,
        { width: 500, height: 300, id: "compound-chart" },
        React.createElement(Chart.Title, null, "Quarterly Earnings"),
        React.createElement(
          Chart.Surface,
          null,
          React.createElement(
            Chart.Plot,
            null,
            React.createElement(Chart.Grid, { yTicks: [50, 100] }),
            React.createElement(Chart.XAxis, { ticks: [{ value: "Q1", position: 50, label: "Q1" }] }),
            React.createElement(Chart.YAxis, { ticks: [{ value: 100, position: 20, label: "100" }] }),
            React.createElement(Chart.Line, { path: "M 0 100 L 100 20" }),
            React.createElement(Chart.Crosshair, { x: 50, y: 20 })
          )
        ),
        React.createElement(Chart.Legend, null,
          React.createElement(Chart.LegendItem, {
            item: { id: "s1", label: "Series 1", color: "#3b82f6" },
          })
        )
      )
    )

    assert.ok(html.includes("Quarterly Earnings"))
    assert.ok(html.includes("plotcn-chart-root"))
    assert.ok(html.includes("plotcn-cartesian-plot"))
    assert.ok(html.includes("plotcn-cartesian-grid"))
    assert.ok(html.includes("plotcn-x-axis"))
    assert.ok(html.includes("plotcn-y-axis"))
    assert.ok(html.includes('d="M 0 100 L 100 20"'))
    assert.ok(html.includes("plotcn-crosshair"))
    assert.ok(html.includes("Series 1"))
  })
})
