import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "node:fs"
import path from "node:path"
import { SignalLine } from "../../registry/recharts/line-signal"

describe("Component 001: Signal Line (line-signal)", () => {
  const telemetryData = [
    { timestamp: "2026-09-01", latency: 42 },
    { timestamp: "2026-09-02", latency: 58 },
    { timestamp: "2026-09-03", latency: 35 },
    { timestamp: "2026-09-04", latency: 74 },
    { timestamp: "2026-09-05", latency: 61 },
  ] as const

  describe("Unit & Rendering Correctness (Section 114)", () => {
    it("should render valid time-series data without throwing", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          title: "API Telemetry",
        })
      )

      assert.ok(html.includes("<figure"), "Must render as semantic <figure>")
      assert.ok(html.includes("API Telemetry"), "Must include accessible title")
      assert.ok(html.includes("aria-labelledby"), "Must link title via aria-labelledby")
      assert.ok(html.includes("tabindex=\"0\""), "Must have container keyboard focus entrypoint")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: [],
          xKey: "timestamp",
          seriesKey: "latency",
        })
      )

      assert.ok(html.includes("No signal observations"), "Must display truthful empty state")
    })

    it("should render truthful loading skeleton when loading=true without fake data", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          loading: true,
          height: 360,
        })
      )

      assert.ok(html.includes("Loading signal visualization..."), "Must display loading state")
      assert.ok(html.includes("360px"), "Must preserve layout height to prevent layout shift")
    })

    it("should render actionable error state when error is provided", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          error: "Failed to connect to Prometheus host",
        })
      )

      assert.ok(html.includes("Unable to load signal"), "Must render error banner")
      assert.ok(html.includes("Failed to connect to Prometheus host"), "Must show truthful error description")
    })

    it("should render unavailable state when unavailable=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          unavailable: "Telemetry retention limit reached",
        })
      )

      assert.ok(html.includes("Telemetry retention limit reached"), "Must render unavailable state")
    })

    it("should reject non-finite numbers (NaN, Infinity) without crashing", () => {
      const dirtyData = [
        { date: "Day 1", value: 10 },
        { date: "Day 2", value: Number.NaN },
        { date: "Day 3", value: Number.POSITIVE_INFINITY },
        { date: "Day 4", value: 25 },
      ]

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: dirtyData,
          xKey: "date",
          seriesKey: "value",
        })
      )

      assert.ok(!html.includes('x="NaN"'), "Must never emit x=NaN in SVG")
      assert.ok(!html.includes('y="NaN"'), "Must never emit y=NaN in SVG")
      assert.ok(!html.includes('d="M NaN'), "Must never emit d=M NaN in SVG path")
    })

    it("should format metric values using custom valueFormatter", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          series: {
            key: "latency",
            label: "P99 Latency",
            valueFormatter: (v: number) => `${v.toFixed(1)} ms`,
          },
        })
      )

      // figcaption screen-reader summary must contain formatted values
      assert.ok(html.includes("ms"), "Must apply custom valueFormatter to summary calculations")
    })
  })

  describe("Accessible Figure & Quantitative Summary (Section 35-37)", () => {
    it("should generate a factual quantitative summary in a hidden figcaption", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          title: "Production Latency",
        })
      )

      assert.ok(html.includes("<figcaption"), "Must include semantic <figcaption>")
      assert.ok(html.includes("sr-only"), "Summary must be visually hidden for screen readers")
      assert.ok(html.includes("5 observations"), "Must state truthful observation count")
      assert.ok(html.includes("minimum of"), "Must compute minimum value")
      assert.ok(html.includes("maximum of"), "Must compute maximum value")
    })

    it("should never generate opinionated marketing conclusions in the factual summary", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(SignalLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
        })
      )

      assert.ok(!html.includes("excellent"), "Must not invent business conclusions")
      assert.ok(!html.includes("poor performance"), "Must not invent business opinions")
    })
  })

  describe("Registry Artifact & Source Autonomy (Section 53-58)", () => {
    it("should ensure public/r/line-signal.json exists and adheres to official shadcn schema", () => {
      const jsonPath = path.join(process.cwd(), "public", "r", "line-signal.json")
      assert.ok(fs.existsSync(jsonPath), "public/r/line-signal.json must exist")

      const registryItem = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
      assert.equal(registryItem.name, "line-signal")
      assert.equal(registryItem.type, "registry:component")
      assert.ok(registryItem.dependencies.includes("recharts"), "Must declare recharts dependency")
      assert.ok(
        registryItem.registryDependencies.some((d: string) => d.includes("chart-container")),
        "Must declare chart-container primitive"
      )
      assert.ok(
        registryItem.registryDependencies.some((d: string) => d.includes("chart-motion")),
        "Must declare chart-motion primitive"
      )
    })

    it("installed source should contain ZERO monorepo @plotcn/* package imports", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-signal.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      assert.ok(!source.includes("@plotcn/chart-core"), "Must not import @plotcn/chart-core")
      assert.ok(!source.includes("@plotcn/chart-react"), "Must not import @plotcn/chart-react")
      assert.ok(!source.includes("@plotcn/runtime"), "Must not import @plotcn/runtime")
    })

    it("installed source must retain recognizable Recharts primitives", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-signal.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      assert.ok(source.includes("LineChart"), "Must import Recharts LineChart")
      assert.ok(source.includes("Line"), "Must import Recharts Line")
      assert.ok(source.includes("XAxis"), "Must import Recharts XAxis")
      assert.ok(source.includes("YAxis"), "Must import Recharts YAxis")
      assert.ok(source.includes("CartesianGrid"), "Must import Recharts CartesianGrid")
      assert.ok(source.includes("Tooltip"), "Must import Recharts Tooltip")
    })
  })
})
