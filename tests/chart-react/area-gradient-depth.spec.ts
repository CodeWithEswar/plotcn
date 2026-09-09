import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"
import {
  GradientDepthArea,
  calculateGradientDepthDomain,
  calculateGradientStops,
  normalizeGradientDepthData,
} from "../../registry/recharts/area-gradient-depth"

describe("Component 016: Gradient Depth Area (area-gradient-depth)", () => {
  const sampleData = [
    { date: "May 01", requests: 12400 },
    { date: "May 05", requests: 14800 },
    { date: "May 10", requests: 13900 },
    { date: "May 15", requests: 18200 },
    { date: "May 20", requests: 21500 },
    { date: "May 25", requests: 19800 },
    { date: "May 30", requests: 24600 },
  ] as const

  const seriesConfig = {
    key: "requests" as const,
    label: "API Requests",
  }

  describe("Pure Domain & Safety Calculations", () => {
    it("should calculate a domain enclosing series observations and zero baseline by default", () => {
      const data = [
        { date: "May 01", requests: 50 },
        { date: "May 05", requests: 200 },
      ]
      const domain = calculateGradientDepthDomain(data, "requests", "zero")
      assert.equal(domain[0], 0, "Non-negative data with zero baseline should start at 0")
      assert.ok(domain[1] >= 200, "Domain upper bound must enclose maximum observation (200)")
    })

    it("should calculate domain-min baseline without forcing zero", () => {
      const data = [
        { date: "May 01", requests: 150 },
        { date: "May 05", requests: 250 },
      ]
      const domain = calculateGradientDepthDomain(data, "requests", "domain-min")
      assert.ok(domain[0] <= 150, "Domain minimum must enclose lowest observation")
      assert.ok(domain[1] >= 250, "Domain maximum must enclose highest observation")
    })

    it("should handle negative and cross-zero datasets truthfully", () => {
      const data = [
        { date: "May 01", requests: -45 },
        { date: "May 05", requests: 35 },
      ]
      const domain = calculateGradientDepthDomain(data, "requests", "zero")
      assert.ok(domain[0] <= -45, "Domain minimum must enclose negative peak (-45)")
      assert.ok(domain[1] >= 35, "Domain maximum must enclose positive peak (35)")
    })

    it("should safely expand constant single-value datasets without zero-height division", () => {
      const data = [
        { date: "May 01", requests: 100 },
        { date: "May 05", requests: 100 },
      ]
      const domain = calculateGradientDepthDomain(data, "requests", "domain-min")
      assert.ok(domain[0] < 100, "Lower bound must expand below 100")
      assert.ok(domain[1] > 100, "Upper bound must expand above 100")
    })

    it("should fallback gracefully on empty datasets", () => {
      const domain = calculateGradientDepthDomain([], "requests")
      assert.deepEqual(domain, [0, 100])
    })

    it("should normalize data, sanitize non-finite values to null, and preserve caller immutability", () => {
      const rawData = [
        { date: "May 01", requests: 100 },
        { date: "May 02", requests: null },
        { date: "May 03", requests: undefined as any },
        { date: "May 04", requests: NaN },
        { date: "May 05", requests: Infinity },
        { date: "May 06", requests: 0 },
      ]

      const clone = rawData.map((d) => ({ ...d }))
      const normalized = normalizeGradientDepthData(rawData, "date", "requests")

      // Caller immutability
      assert.deepEqual(rawData, clone, "Original caller objects must never be mutated")

      // Sanitization
      assert.equal(normalized[0].requests, 100)
      assert.equal(normalized[1].requests, null)
      assert.equal(normalized[2].requests, null)
      assert.equal(normalized[3].requests, null)
      assert.equal(normalized[4].requests, null)
      assert.equal(normalized[5].requests, 0, "Zero must remain valid 0, not null")
    })
  })

  describe("Gradient Stop & Depth Semantics", () => {
    it("should calculate proportional stops for surface fade mode", () => {
      const stops = calculateGradientStops(0.32, "surface")
      assert.equal(stops.clampedOpacity, 0.32, "Top stop matches configured fillOpacity")
      assert.ok(stops.middleOpacity < stops.clampedOpacity, "Middle stop must be lower than top stop")
      assert.ok(stops.bottomOpacity <= 0.02, "Bottom stop must dissolve near chart surface")
      assert.equal(stops.middleOpacity, 0.134)
      assert.equal(stops.bottomOpacity, 0.016)
    })

    it("should calculate uniform stops for flat fill mode (gradientMode='none')", () => {
      const stops = calculateGradientStops(0.25, "none")
      assert.equal(stops.clampedOpacity, 0.25)
      assert.equal(stops.middleOpacity, 0.25)
      assert.equal(stops.bottomOpacity, 0.25)
    })

    it("should clamp out-of-range opacity inputs safely between 0 and 1", () => {
      const negativeStops = calculateGradientStops(-0.5, "surface")
      assert.equal(negativeStops.clampedOpacity, 0)

      const excessiveStops = calculateGradientStops(2.5, "surface")
      assert.equal(excessiveStops.clampedOpacity, 1)

      const nanStops = calculateGradientStops(NaN as any, "surface")
      assert.equal(nanStops.clampedOpacity, 0.32, "Falls back safely to default 0.32 on NaN")
    })
  })

  describe("Rendering & Structural Hierarchy", () => {
    it("should render semantic figure container with accessibility attributes", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: sampleData,
          xKey: "date",
          series: seriesConfig,
          title: "API Gateway Requests",
        })
      )

      assert.ok(html.includes("<figure"), "Must render semantic figure element")
      assert.ok(html.includes('role="region"'), "Must declare region role")
      assert.ok(html.includes("API Gateway Requests"), "Must incorporate title in accessible attributes")
      assert.ok(html.includes("plotcn-gradient-depth-area"), "Must have canonical plotcn class name")
    })

    it("should include off-screen structured data table for screen readers", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: sampleData,
          xKey: "date",
          series: seriesConfig,
        })
      )

      assert.ok(html.includes('class="sr-only"'), "Must contain sr-only wrapper")
      assert.ok(html.includes("<table"), "Must contain accessible HTML table")
      assert.ok(html.includes("12,400"), "Table must contain formatted observation values")
      assert.ok(html.includes("May 01"), "Table must contain domain coordinates")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: [],
          xKey: "date",
          series: seriesConfig,
        })
      )

      assert.ok(html.includes("No observations available"), "Must show truthful empty description")
      assert.ok(html.includes('role="status"'), "Must render status fallback")
    })

    it("should render truthful loading skeleton when loading=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: sampleData,
          xKey: "date",
          series: seriesConfig,
          loading: true,
          height: 280,
        })
      )

      assert.ok(html.includes("Loading gradient depth visualization..."), "Must display loading message")
      assert.ok(html.includes("280px"), "Must preserve configured height")
    })

    it("should render actionable error state when error is supplied", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: sampleData,
          xKey: "date",
          series: seriesConfig,
          error: "Failed to connect to request telemetry stream",
        })
      )

      assert.ok(html.includes("Gradient Depth Area Configuration Error"), "Must display error banner")
      assert.ok(html.includes("Failed to connect to request telemetry stream"), "Must show truthful description")
    })

    it("should render unavailable notice when unavailable=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(GradientDepthArea, {
          data: sampleData,
          xKey: "date",
          series: seriesConfig,
          unavailable: "Telemetry stream is currently unavailable.",
        })
      )

      assert.ok(html.includes("Telemetry stream is currently unavailable."), "Must display unavailable description")
    })
  })
})
