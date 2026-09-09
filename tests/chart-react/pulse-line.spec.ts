import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "node:fs"
import path from "node:path"
import { PulseLine } from "../../registry/recharts/line-pulse"

describe("Component 002: Pulse Line (line-pulse)", () => {
  const telemetryData = [
    { timestamp: "14:20:00", latency: 42 },
    { timestamp: "14:20:05", latency: 48 },
    { timestamp: "14:20:10", latency: 35 },
    { timestamp: "14:20:15", latency: 89 },
    { timestamp: "14:20:20", latency: 64 },
    { timestamp: "14:20:25", latency: 52 },
  ] as const

  describe("Unit & Rendering Correctness (Section 114)", () => {
    it("should render valid operational telemetry without throwing", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          title: "Service Latency Telemetry",
        })
      )

      assert.ok(html.includes("<figure"), "Must render as semantic <figure>")
      assert.ok(html.includes("Service Latency Telemetry"), "Must include accessible title")
      assert.ok(html.includes("aria-labelledby"), "Must link title via aria-labelledby")
      assert.ok(html.includes("tabindex=\"0\""), "Must have container keyboard focus entrypoint")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: [],
          xKey: "timestamp",
          seriesKey: "latency",
        })
      )

      assert.ok(html.includes("No telemetry yet"), "Must display truthful empty state")
    })

    it("should render truthful loading skeleton when loading=true without fake data", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          loading: true,
          height: 280,
        })
      )

      assert.ok(html.includes("Connecting to telemetry stream..."), "Must display loading state")
      assert.ok(html.includes("280px"), "Must preserve layout height to prevent layout shift")
    })

    it("should render actionable error state when error is provided", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          error: "WebSocket stream closed unexpectedly",
        })
      )

      assert.ok(html.includes("Unable to load signal"), "Must render error banner")
      assert.ok(html.includes("WebSocket stream closed unexpectedly"), "Must show truthful error description")
    })

    it("should render unavailable state when unavailable=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          unavailable: "Stream retention limit reached",
        })
      )

      assert.ok(html.includes("Stream retention limit reached"), "Must render unavailable notice")
    })

    it("should reject non-finite numbers (NaN, Infinity) without crashing", () => {
      const dirtyData = [
        { time: "00s", value: 100 },
        { time: "05s", value: Number.NaN },
        { time: "10s", value: Number.POSITIVE_INFINITY },
        { time: "15s", value: 120 },
      ]

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: dirtyData,
          xKey: "time",
          seriesKey: "value",
        })
      )

      assert.ok(!html.includes('x="NaN"'), "Must never emit x=NaN in SVG")
      assert.ok(!html.includes('y="NaN"'), "Must never emit y=NaN in SVG")
      assert.ok(!html.includes('d="M NaN'), "Must never emit d=M NaN in SVG path")
    })

    it("should render single observation (1 datum) cleanly without zero-height division error", () => {
      const singleDatum = [{ timestamp: "14:20:00", latency: 50 }]
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: singleDatum,
          xKey: "timestamp",
          seriesKey: "latency",
        })
      )

      assert.ok(html.includes("<figure"), "Must render 1 datum cleanly")
      assert.ok(html.includes("1 observations"), "Must state 1 observation in summary")
    })

    it("should handle all-zero operational signals without collapsing scale", () => {
      const allZeroData = [
        { timestamp: "00s", errors: 0 },
        { timestamp: "05s", errors: 0 },
        { timestamp: "10s", errors: 0 },
      ]

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: allZeroData,
          xKey: "timestamp",
          seriesKey: "errors",
        })
      )

      assert.ok(html.includes("<figure"), "Must render all-zero signal cleanly")
      assert.ok(!html.includes("No telemetry yet"), "Must not mistake all-zero signal for empty")
    })

    it("should support negative operational signals (e.g. net queue delta)", () => {
      const signedData = [
        { tick: "t1", delta: -15 },
        { tick: "t2", delta: -4 },
        { tick: "t3", delta: 12 },
        { tick: "t4", delta: -8 },
      ]

      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: signedData,
          xKey: "tick",
          seriesKey: "delta",
        })
      )

      assert.ok(html.includes("<figure"), "Must render negative signals")
      assert.ok(html.includes("Minimum -15"), "Must correctly compute negative minimum")
    })
  })

  describe("Rolling Window (windowSize) (Section 10, 11, 115)", () => {
    it("should slice the latest N observations when windowSize is specified", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData, // 6 observations
          xKey: "timestamp",
          seriesKey: "latency",
          windowSize: 3,
        })
      )

      // Summary should report only the 3 visible observations
      assert.ok(html.includes("3 observations"), "Summary must reflect sliced window size of 3")
      // Should include latest value 52
      assert.ok(html.includes("Current value 52"), "Summary must reflect latest value in window")
    })

    it("should render all observations when windowSize is larger than data length", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData, // 6 observations
          xKey: "timestamp",
          seriesKey: "latency",
          windowSize: 50,
        })
      )

      assert.ok(html.includes("6 observations"), "Summary must show all 6 observations")
    })

    it("should fall back safely when windowSize is 0, negative, or invalid", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          windowSize: -5,
        })
      )

      assert.ok(html.includes("6 observations"), "Must safely render all observations on invalid windowSize")
    })

    it("should never mutate caller source data when windowSize is applied", () => {
      const originalArray = [
        { time: "1", val: 10 },
        { time: "2", val: 20 },
        { time: "3", val: 30 },
        { time: "4", val: 40 },
      ]
      const originalLength = originalArray.length

      ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: originalArray,
          xKey: "time",
          seriesKey: "val",
          windowSize: 2,
        })
      )

      assert.equal(originalArray.length, originalLength, "Caller array length must not change")
      assert.equal(originalArray[0].time, "1", "Caller array elements must not be modified")
    })
  })

  describe("Latest Point & Value Signature (Section 6, 12, 13)", () => {
    it("should render latest value header pill when showLatestValue=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          showLatestValue: true,
          series: {
            key: "latency",
            label: "P99",
            valueFormatter: (v: number) => `${v}ms`,
          },
        })
      )

      assert.ok(html.includes("P99 · LATEST"), "Must display series label with LATEST indicator")
      assert.ok(html.includes("52ms"), "Must format latest value using valueFormatter")
    })
  })

  describe("Accessible Figure & Quantitative Summary (Section 54, 55)", () => {
    it("should generate a factual quantitative summary with current value and extremes", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
          title: "Service Latency",
        })
      )

      assert.ok(html.includes("<figcaption"), "Must include semantic <figcaption>")
      assert.ok(html.includes("sr-only"), "Summary must be visually hidden for screen readers")
      assert.ok(html.includes("6 observations"), "Must state truthful observation count")
      assert.ok(html.includes("Current value 52"), "Must state current signal value")
      assert.ok(html.includes("Minimum 35"), "Must compute minimum value")
      assert.ok(html.includes("Maximum 89"), "Must compute maximum value")
    })

    it("should never generate opinionated marketing conclusions in the factual summary", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(PulseLine, {
          data: telemetryData,
          xKey: "timestamp",
          seriesKey: "latency",
        })
      )

      assert.ok(!html.includes("healthy"), "Must not invent operational health opinions")
      assert.ok(!html.includes("critical"), "Must not invent alarming status without config")
    })
  })

  describe("Registry Artifact & Source Autonomy (Section 106-110)", () => {
    it("should ensure public/r/line-pulse.json exists and adheres to official shadcn schema", () => {
      const jsonPath = path.join(process.cwd(), "public", "r", "line-pulse.json")
      assert.ok(fs.existsSync(jsonPath), "public/r/line-pulse.json must exist")

      const registryItem = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
      assert.equal(registryItem.name, "line-pulse")
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
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-pulse.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      assert.ok(!source.includes("@plotcn/chart-core"), "Must not import @plotcn/chart-core")
      assert.ok(!source.includes("@plotcn/chart-react"), "Must not import @plotcn/chart-react")
      assert.ok(!source.includes("@plotcn/runtime"), "Must not import @plotcn/runtime")
    })

    it("installed source must retain recognizable Recharts primitives", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-pulse.tsx")
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
