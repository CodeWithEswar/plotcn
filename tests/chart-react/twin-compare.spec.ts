import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "node:fs"
import path from "node:path"
import { TwinlineCompare } from "../../registry/recharts/line-twin-compare"

describe("Component 003: Twinline Compare (line-twin-compare)", () => {
  const comparisonData = [
    { period: "Jan", current: 120, previous: 100 },
    { period: "Feb", current: 150, previous: 130 },
    { period: "Mar", current: 180, previous: 190 },
    { period: "Apr", current: 220, previous: 210 },
    { period: "May", current: 280, previous: 240 },
    { period: "Jun", current: 310, previous: 290 },
  ] as const

  describe("Unit & Rendering Correctness", () => {
    it("should render valid comparison data without throwing", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
          primaryLabel: "2024 Actual",
          referenceLabel: "2023 Benchmark",
          title: "Annual Revenue Comparison",
        })
      )

      assert.ok(html.includes("<figure"), "Must render as semantic <figure>")
      assert.ok(html.includes("Annual Revenue Comparison"), "Must include accessible title")
      assert.ok(html.includes("aria-labelledby"), "Must link title via aria-labelledby")
      assert.ok(html.includes("tabindex=\"0\""), "Must have container keyboard focus entrypoint")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: [],
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
        })
      )

      assert.ok(html.includes("No comparative observations"), "Must display truthful empty state")
    })

    it("should render truthful loading state when loading=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
          loading: true,
          height: 300,
        })
      )

      assert.ok(html.includes("Loading comparative visualization"), "Must display loading state")
      assert.ok(html.includes("300px"), "Must preserve layout height to prevent layout shift")
    })

    it("should render actionable error state when error is provided", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
          error: "Failed to synchronize reference series",
        })
      )

      assert.ok(html.includes("Unable to load comparative data"), "Must display error title")
      assert.ok(html.includes("Failed to synchronize reference series"), "Must display error description")
    })

    it("should render unavailable state when unavailable=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
          unavailable: "Comparative analytics requires Growth tier",
        })
      )

      assert.ok(html.includes("Comparison unavailable"), "Must display unavailable title")
      assert.ok(html.includes("Growth tier"), "Must display unavailable description")
    })

    it("should reject non-finite numbers (NaN, Infinity) without crashing", () => {
      const dirtyData = [
        { period: "Jan", current: NaN, previous: 100 },
        { period: "Feb", current: 150, previous: Infinity },
        { period: "Mar", current: -Infinity, previous: 180 },
        { period: "Apr", current: 220, previous: null as any },
      ]

      assert.doesNotThrow(() => {
        ReactDOMServer.renderToStaticMarkup(
          React.createElement(TwinlineCompare, {
            data: dirtyData,
            xKey: "period",
            primaryKey: "current",
            referenceKey: "previous",
          })
        )
      }, "Must sanitize non-finite values safely")
    })
  })

  describe("Comparison Visual Hierarchy & Single Shared Scale", () => {
    it("should render exactly two series with distinct primary vs reference visual hierarchy", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-twin-compare.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      assert.ok(source.includes('strokeDasharray="4 4"'), "Reference line must have dashed stroke in source")
      assert.ok(source.includes("strokeWidth={2.5}"), "Primary line must have dominant 2.5px strokeWidth in source")
      assert.ok(source.includes("strokeWidth={1.8}"), "Reference line must have lighter 1.8px strokeWidth in source")
    })

    it("should enforce a single shared vertical scale without dual Y-axes", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-twin-compare.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      // Count occurrences of <YAxis in the JSX return
      const yAxisMatches = source.match(/<YAxis/g)
      assert.equal(yAxisMatches?.length, 1, "Must render exactly ONE YAxis to guarantee truthful comparison without dual axes")
      assert.ok(!source.includes("yAxisId"), "Must not assign separate yAxisId props that create dual axes")
    })
  })

  describe("Accessible Figure & Quantitative Summary", () => {
    it("should generate a factual quantitative summary with primary and reference bounds", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
          primaryLabel: "Current",
          referenceLabel: "Previous",
        })
      )

      assert.ok(html.includes("<figcaption"), "Must include semantic <figcaption>")
      assert.ok(html.includes("sr-only"), "Summary must be visually hidden for screen readers")
      assert.ok(html.includes("6 observations"), "Must state truthful observation count")
      assert.ok(html.includes("Current spans from 120 to 310"), "Must state primary range")
      assert.ok(html.includes("Previous spans from 100 to 290"), "Must state reference range")
      assert.ok(html.includes("single uniform vertical scale"), "Must declare single shared vertical scale")
    })

    it("should never generate opinionated marketing conclusions in the factual summary", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(TwinlineCompare, {
          data: comparisonData,
          xKey: "period",
          primaryKey: "current",
          referenceKey: "previous",
        })
      )

      assert.ok(!html.includes("impressive"), "Must not include marketing adjectives")
      assert.ok(!html.includes("outperforming"), "Must not invent business interpretations")
      assert.ok(!html.includes("stellar"), "Must avoid emotional commentary")
    })
  })

  describe("Registry Artifact & Source Autonomy", () => {
    it("should ensure public/r/line-twin-compare.json exists and adheres to official shadcn schema", () => {
      const jsonPath = path.join(process.cwd(), "public", "r", "line-twin-compare.json")
      assert.ok(fs.existsSync(jsonPath), "public/r/line-twin-compare.json must exist")

      const registryItem = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
      assert.equal(registryItem.name, "line-twin-compare")
      assert.equal(registryItem.type, "registry:component")
      assert.ok(registryItem.dependencies.includes("recharts"), "Must declare recharts dependency")
      assert.ok(
        registryItem.registryDependencies.some((d: string) => d.includes("chart-container")),
        "Must declare chart-container primitive"
      )
      assert.ok(
        registryItem.registryDependencies.some((d: string) => d.includes("chart-legend")),
        "Must declare chart-legend primitive"
      )
    })

    it("installed source should contain ZERO monorepo @plotcn/* package imports", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-twin-compare.tsx")
      const source = fs.readFileSync(sourcePath, "utf-8")

      assert.ok(!source.includes("@plotcn/chart-core"), "Must not import @plotcn/chart-core")
      assert.ok(!source.includes("@plotcn/chart-react"), "Must not import @plotcn/chart-react")
      assert.ok(!source.includes("@plotcn/runtime"), "Must not import @plotcn/runtime")
    })

    it("installed source must retain recognizable Recharts primitives", () => {
      const sourcePath = path.join(process.cwd(), "registry", "recharts", "line-twin-compare.tsx")
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
