import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import ReactDOMServer from "react-dom/server"
import {
  ComparisonArea,
  calculateSharedDomain,
  normalizeComparisonData,
} from "../../registry/recharts/area-comparison"

describe("Component 015: Comparison Area (area-comparison)", () => {
  const sampleData = [
    { month: "Jan", current: 125, previous: 110 },
    { month: "Feb", current: 142, previous: 120 },
    { month: "Mar", current: 138, previous: 135 },
    { month: "Apr", current: 165, previous: 140 },
    { month: "May", current: 158, previous: 162 },
    { month: "Jun", current: 184, previous: 155 },
  ] as const

  const seriesConfig = {
    primary: { key: "current" as const, label: "Current year" },
    reference: { key: "previous" as const, label: "Previous year" },
  }

  describe("Pure Domain & Safety Calculations", () => {
    it("should calculate a shared domain enclosing both primary and reference extremes", () => {
      const data = [
        { month: "Jan", current: 50, previous: 200 }, // reference contains max
        { month: "Feb", current: 180, previous: 90 },
      ]
      const domain = calculateSharedDomain(data, "current", "previous")
      assert.equal(domain[0], 0, "Non-negative data should baseline at 0")
      assert.ok(domain[1] >= 200, "Domain upper bound must enclose reference max (200)")
    })

    it("should calculate shared domain when primary contains maximum", () => {
      const data = [
        { month: "Jan", current: 350, previous: 120 }, // primary contains max
        { month: "Feb", current: 280, previous: 140 },
      ]
      const domain = calculateSharedDomain(data, "current", "previous")
      assert.equal(domain[0], 0)
      assert.ok(domain[1] >= 350, "Domain upper bound must enclose primary max (350)")
    })

    it("should handle negative and cross-zero datasets truthfully", () => {
      const data = [
        { month: "Jan", current: -30, previous: -10 },
        { month: "Feb", current: 40, previous: -5 },
      ]
      const domain = calculateSharedDomain(data, "current", "previous")
      assert.ok(domain[0] <= -30, "Domain minimum must enclose lowest negative value (-30)")
      assert.ok(domain[1] >= 40, "Domain maximum must enclose positive peak (40)")
    })

    it("should safely expand constant single-value datasets without zero-height division", () => {
      const data = [
        { month: "Jan", current: 100, previous: 100 },
        { month: "Feb", current: 100, previous: 100 },
      ]
      const domain = calculateSharedDomain(data, "current", "previous")
      assert.ok(domain[0] < 100, "Lower bound must expand below 100")
      assert.ok(domain[1] > 100, "Upper bound must expand above 100")
    })

    it("should fallback gracefully on empty datasets", () => {
      const domain = calculateSharedDomain([], "current", "previous")
      assert.deepEqual(domain, [0, 100])
    })

    it("should normalize data, sanitize non-finite values to null, and preserve caller immutability", () => {
      const dirty = [
        { month: "Jan", current: 100, previous: Number.NaN },
        { month: "Feb", current: Number.POSITIVE_INFINITY, previous: 80 },
        { month: "Mar", current: 0, previous: 0 },
      ]
      const clone = dirty.map((d) => ({ ...d }))
      const normalized = normalizeComparisonData(dirty, "month", "current", "previous")

      assert.equal(normalized[0].previous, null, "NaN must normalize to null")
      assert.equal(normalized[1].current, null, "Infinity must normalize to null")
      assert.equal(normalized[2].current, 0, "0 must be preserved as valid quantitative datum")
      assert.equal(normalized[2].previous, 0, "0 must be preserved as valid quantitative datum")
      assert.deepEqual(dirty, clone, "Original caller data array must not be mutated")
    })
  })

  describe("Rendering & Structural Hierarchy", () => {
    it("should render semantic figure container with accessibility attributes", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          title: "Revenue Comparison",
        })
      )

      assert.ok(html.includes("<figure"), "Must render root semantic figure")
      assert.ok(html.includes('aria-label="Revenue Comparison"'), "Must announce accessible title")
      assert.ok(html.includes('tabindex="0"'), "Must be keyboard focusable")
    })

    it("should include off-screen structured data table for screen readers", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          showDelta: true,
        })
      )

      assert.ok(html.includes('class="sr-only"'), "Must provide off-screen accessibility content")
      assert.ok(html.includes("<table"), "Must contain accessible table")
      assert.ok(html.includes("<th scope=\"col\">Current year</th>"), "Table must include primary header")
      assert.ok(html.includes("<th scope=\"col\">Previous year</th>"), "Table must include reference header")
      assert.ok(html.includes("<th scope=\"col\">Difference</th>"), "Table must include difference header")
    })

    it("should maintain structural non-color differentiation when colors are identical", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          primaryColor: "#71717a",
          referenceColor: "#71717a",
        })
      )

      assert.ok(html.includes("Current year"), "Primary label must render")
      assert.ok(html.includes("Previous year"), "Reference label must render")
      // Legend structural samples
      assert.ok(html.includes("border-dashed"), "Reference sample must encode dashed boundary")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: [],
          xKey: "month",
          series: seriesConfig,
        })
      )

      assert.ok(html.includes("No comparison observations recorded"), "Must display empty state message")
    })

    it("should render truthful loading skeleton when loading=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          loading: true,
          height: 280,
        })
      )

      assert.ok(html.includes("Loading comparison data..."), "Must display loading message")
      assert.ok(html.includes("280px"), "Must preserve configured height")
    })

    it("should render actionable error state when error is supplied", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          error: "Failed to fetch period benchmark data",
        })
      )

      assert.ok(html.includes("Comparison Area Configuration Error"), "Must display error banner")
      assert.ok(html.includes("Failed to fetch period benchmark data"), "Must show truthful description")
    })

    it("should render unavailable notice when unavailable=true", () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ComparisonArea, {
          data: sampleData,
          xKey: "month",
          series: seriesConfig,
          unavailable: "Prior year data tier restricted",
        })
      )

      assert.ok(html.includes("Prior year data tier restricted"), "Must display unavailable description")
    })
  })
})
