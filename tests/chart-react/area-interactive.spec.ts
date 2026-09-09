import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  InteractiveArea,
  isFiniteNumber,
  normalizeInteractiveData,
  calculateInteractiveAreaDomain,
  resolveNearestIndex,
} from "../../registry/recharts/area-interactive"

describe("Component 018: Interactive Area (area-interactive)", () => {
  const sampleData = [
    { date: "May 01", requests: 12400 },
    { date: "May 04", requests: 14200 },
    { date: "May 08", requests: 11900 },
    { date: "May 12", requests: null },
    { date: "May 16", requests: 18500 },
    { date: "May 20", requests: 0 },
  ]

  const series = {
    key: "requests" as const,
    label: "API Requests",
    valueFormatter: (v: number) => `${v.toLocaleString()} req/s`,
  }

  /* -------------------------------------------------------------------------- */
  /*  1. Algorithmic Helpers: Finite & Normalization                            */
  /* -------------------------------------------------------------------------- */
  describe("Algorithmic Helpers: Finite & Normalization", () => {
    it("should correctly identify finite numbers", () => {
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

    it("should preserve missing observations as null under gap policy", () => {
      const normalized = normalizeInteractiveData(sampleData, "date", "requests", "gap")
      assert.strictEqual(normalized.length, 6)
      assert.strictEqual(normalized[0].__value, 12400)
      assert.strictEqual(normalized[3].__value, null) // May 12 is null
      assert.strictEqual(normalized[5].__value, 0) // zero is valid
    })

    it("should carry last known value under carry policy", () => {
      const normalized = normalizeInteractiveData(sampleData, "date", "requests", "carry")
      assert.strictEqual(normalized[3].__value, 11900) // carries May 08 value
    })

    it("should not mutate the original caller data array or objects", () => {
      const clone = JSON.parse(JSON.stringify(sampleData))
      normalizeInteractiveData(sampleData, "date", "requests", "gap")
      assert.deepStrictEqual(sampleData, clone)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Domain Calculation & Extrema                                           */
  /* -------------------------------------------------------------------------- */
  describe("Domain Calculation & Extrema", () => {
    it("should enclose valid values and zero baseline by default", () => {
      const normalized = normalizeInteractiveData(sampleData, "date", "requests")
      const [min, max] = calculateInteractiveAreaDomain(normalized, "auto", "zero")

      assert.ok(min <= 0, `Domain min ${min} must enclose baseline 0`)
      assert.ok(max >= 18500, `Domain max ${max} must enclose data max 18500`)
    })

    it("should respect explicit domain", () => {
      const normalized = normalizeInteractiveData(sampleData, "date", "requests")
      const domain = calculateInteractiveAreaDomain(normalized, [5000, 25000])
      assert.deepStrictEqual(domain, [5000, 25000])
    })

    it("should handle empty datasets without collapsing", () => {
      const domain = calculateInteractiveAreaDomain([])
      assert.deepStrictEqual(domain, [0, 100])
    })

    it("should handle constant datasets without dividing by zero", () => {
      const constantData = normalizeInteractiveData(
        [{ x: "1", v: 100 }, { x: "2", v: 100 }],
        "x",
        "v"
      )
      const [min, max] = calculateInteractiveAreaDomain(constantData, "auto", "domain-min")
      assert.ok(min < 100, "Min should be padded below 100")
      assert.ok(max > 100, "Max should be padded above 100")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Nearest-X Resolution & Tie-Breaking                                    */
  /* -------------------------------------------------------------------------- */
  describe("Nearest-X Resolution & Tie-Breaking", () => {
    const xPositions = [10, 30, 50]

    it("should return boundary indexes for coordinates outside range", () => {
      assert.strictEqual(resolveNearestIndex(5, xPositions), 0)
      assert.strictEqual(resolveNearestIndex(9, xPositions), 0)
      assert.strictEqual(resolveNearestIndex(10, xPositions), 0)
      assert.strictEqual(resolveNearestIndex(50, xPositions), 2)
      assert.strictEqual(resolveNearestIndex(65, xPositions), 2)
    })

    it("should select closer observation when strictly closer", () => {
      // Between 10 and 30: midpoint is 20
      assert.strictEqual(resolveNearestIndex(19, xPositions), 0)
      assert.strictEqual(resolveNearestIndex(21, xPositions), 1)
      assert.strictEqual(resolveNearestIndex(30, xPositions), 1)

      // Between 30 and 50: midpoint is 40
      assert.strictEqual(resolveNearestIndex(39, xPositions), 1)
      assert.strictEqual(resolveNearestIndex(41, xPositions), 2)
    })

    it("should deterministically tie-break to the earlier index at exact midpoint", () => {
      // Exact midpoint between 10 and 30 is 20 -> must pick index 0
      assert.strictEqual(resolveNearestIndex(20, xPositions), 0)

      // Exact midpoint between 30 and 50 is 40 -> must pick index 1
      assert.strictEqual(resolveNearestIndex(40, xPositions), 1)
    })

    it("should handle single item arrays safely", () => {
      assert.strictEqual(resolveNearestIndex(100, [42]), 0)
    })

    it("should handle empty arrays safely", () => {
      assert.strictEqual(resolveNearestIndex(100, []), -1)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Static Markup & Accessibility                                          */
  /* -------------------------------------------------------------------------- */
  describe("Static Markup & Accessibility", () => {
    it("should render a focusable figure with tabIndex={0} and pan-y touch-action", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveArea, {
          data: sampleData,
          xKey: "date",
          series,
        })
      )

      assert.ok(html.includes("<figure"), "Should render figure element")
      assert.ok(html.includes('tabindex="0"'), "Should be keyboard focusable")
      assert.ok(html.includes("touch-action:pan-y"), "Should preserve vertical page scroll")
      assert.ok(html.includes("role=\"region\""), "Should have region role")
    })

    it("should render off-screen data table for screen readers", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveArea, {
          data: sampleData,
          xKey: "date",
          series,
        })
      )

      assert.ok(html.includes("<table"), "Should contain accessible table")
      assert.ok(html.includes("May 01"), "Should list domain dates")
      assert.ok(html.includes("12400"), "Should list values")
      assert.ok(html.includes("Unavailable"), "Should mark missing values as Unavailable")
    })

    it("should render loading state when loading={true}", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveArea, {
          data: sampleData,
          xKey: "date",
          series,
          loading: true,
        })
      )

      assert.ok(html.includes("Loading interactive area"), "Should display loading indicator")
    })

    it("should render empty state when data is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveArea, {
          data: [],
          xKey: "date",
          series,
        })
      )

      assert.ok(html.includes("No data available"), "Should display empty state")
    })

    it("should render error state when error is provided", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveArea, {
          data: sampleData,
          xKey: "date",
          series,
          error: new Error("Network timeout during inspection sync"),
        })
      )

      assert.ok(html.includes("Unable to load interactive area"), "Should display error state")
      assert.ok(html.includes("Network timeout"), "Should display error message")
    })
  })
})
