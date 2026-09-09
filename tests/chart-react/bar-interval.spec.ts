import { describe, it } from "node:test"
import assert from "node:assert"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  IntervalBars,
  isFiniteNumber,
  validateIntervalBounds,
  computeIntervalSpan,
  resolveIntervalDomain,
  formatIntervalTime,
} from "../../registry/recharts/bar-interval"

describe("Component 027: Interval Bars (bar-interval)", () => {
  const sampleData = [
    { service: "Authentication", start: 9.0, end: 10.5 },
    { service: "Payments API", start: 10.0, end: 12.25 },
    { service: "Search Indexer", start: 11.0, end: 11.0 }, // Zero-width milestone
    { service: "Data Pipeline", start: 13.0, end: 16.5 },
    { service: "Invalid Range", start: 15.0, end: 12.0 }, // start > end
    { service: "Missing Bound", start: 14.0, end: null },  // null bound
  ]

  const sampleSeries = {
    startKey: "start" as const,
    endKey: "end" as const,
    label: "Execution Window",
    boundFormatter: (v: number) => `${v}:00`,
    spanFormatter: (s: number) => `${s}h`,
  }

  /* -------------------------------------------------------------------------- */
  /*  1. Mathematical Bounds & Validity Contract                               */
  /* -------------------------------------------------------------------------- */
  describe("Mathematical Bounds & Validity Contract", () => {
    it("should accurately validate finite numbers and reject non-finites", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42.5), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("100"), false)
    })

    it("should validate standard intervals where start < end", () => {
      const validation = validateIntervalBounds(9.0, 10.5)
      assert.strictEqual(validation.valid, true)
      assert.strictEqual(validation.isZeroWidth, false)
      assert.strictEqual(validation.reason, undefined)
    })

    it("should validate zero-width intervals where start === end", () => {
      const validation = validateIntervalBounds(11.0, 11.0)
      assert.strictEqual(validation.valid, true)
      assert.strictEqual(validation.isZeroWidth, true)
    })

    it("should strictly reject inverted bounds where start > end WITHOUT silently swapping", () => {
      const validation = validateIntervalBounds(15.0, 12.0)
      assert.strictEqual(validation.valid, false)
      assert.strictEqual(validation.reason, "inverted")
    })

    it("should reject missing or non-finite start or end bounds", () => {
      const vNullEnd = validateIntervalBounds(10.0, null)
      assert.strictEqual(vNullEnd.valid, false)
      assert.strictEqual(vNullEnd.reason, "missing")

      const vNullStart = validateIntervalBounds(null, 15.0)
      assert.strictEqual(vNullStart.valid, false)
      assert.strictEqual(vNullStart.reason, "missing")

      const vNaN = validateIntervalBounds(NaN, 15.0)
      assert.strictEqual(vNaN.valid, false)
    })

    it("should correctly calculate span = end - start", () => {
      assert.strictEqual(computeIntervalSpan(9.0, 10.5), 1.5)
      assert.strictEqual(computeIntervalSpan(11.0, 11.0), 0)
      assert.strictEqual(computeIntervalSpan(15.0, 12.0), null) // Inverted
      assert.strictEqual(computeIntervalSpan(10.0, null), null) // Missing
    })

    it("should accurately compute spans crossing zero", () => {
      // [-5, 5] -> span = 10
      assert.strictEqual(computeIntervalSpan(-5, 5), 10)
      // [-10, -2] -> span = 8
      assert.strictEqual(computeIntervalSpan(-10, -2), 8)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Floating Domain Resolution                                             */
  /* -------------------------------------------------------------------------- */
  describe("Floating Range Domain Resolution", () => {
    it("should resolve domain from observed bounds without forcing zero", () => {
      const starts = [100, 110]
      const ends = [120, 150]
      const domain = resolveIntervalDomain(starts, ends, "auto")
      // Domain should bound around [100, 150] with subtle padding, NOT include 0
      assert.ok(domain[0] <= 100)
      assert.ok(domain[0] > 0, "Domain minimum should not artificially snap to 0")
      assert.ok(domain[1] >= 150)
    })

    it("should respect explicit caller-provided domains", () => {
      const domain = resolveIntervalDomain([], [], [50, 200])
      assert.deepStrictEqual(domain, [50, 200])
    })

    it("should provide a safe default domain when no valid bounds exist", () => {
      const domain = resolveIntervalDomain([], [], "auto")
      assert.deepStrictEqual(domain, [0, 1])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Temporal Formatter Helpers                                             */
  /* -------------------------------------------------------------------------- */
  describe("Temporal and Numeric Formatting Helpers", () => {
    it("formats ISO timestamps into concise time strings", () => {
      const formatted = formatIntervalTime("2026-09-09T14:30:00Z")
      assert.ok(typeof formatted === "string" && formatted.length > 0)
    })

    it("formats epoch numbers gracefully", () => {
      const formatted = formatIntervalTime(1773000000000)
      assert.ok(typeof formatted === "string")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Immutability Guarantees                                                */
  /* -------------------------------------------------------------------------- */
  describe("Immutability Guarantees", () => {
    it("should preserve caller input data without mutation", () => {
      const input = [
        { service: "Auth", start: 10, end: 12 },
        { service: "DB", start: 11, end: 15 },
      ]
      const inputCopy = JSON.parse(JSON.stringify(input))

      renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: input,
          categoryKey: "service",
          series: {
            startKey: "start",
            endKey: "end",
            label: "Test",
          },
        })
      )

      assert.deepStrictEqual(input, inputCopy)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  5. Static Server-Side Rendering (SSR) & Accessibility                    */
  /* -------------------------------------------------------------------------- */
  describe("Static Rendering & Semantic Accessibility", () => {
    it("should render semantic figure container with accessibility attributes", () => {
      const html = renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
          title: "Service Execution Intervals",
          description: "Execution time spans for core services.",
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes('role="region"'))
      assert.ok(html.includes("Service Execution Intervals"))
      assert.ok(html.includes("Execution time spans for core services."))
      assert.ok(html.includes("plotcn-interval-chart"))
    })

    it("should report truthful summary counts in screen reader text", () => {
      const html = renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      // 6 total items: 3 valid spans (Auth, Payments, Pipeline), 1 zero-width (Search), 1 inverted, 1 missing
      assert.ok(html.includes("Showing 6 intervals"))
      assert.ok(html.includes("4 active intervals"))
      assert.ok(html.includes("1 zero-width markers"))
      assert.ok(html.includes("2 invalid or missing"))
    })

    it("should render empty state when empty array is provided", () => {
      const html = renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: [],
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No interval data available"))
    })

    it("should support horizontal and vertical orientations without error", () => {
      const horizontalHtml = renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
          orientation: "horizontal",
        })
      )
      assert.ok(horizontalHtml.includes("<figure"))

      const verticalHtml = renderToStaticMarkup(
        React.createElement(IntervalBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
          orientation: "vertical",
        })
      )
      assert.ok(verticalHtml.includes("<figure"))
    })
  })
})
