import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  PercentStackBars,
  isFiniteNumber,
  resolvePercentStackSeries,
  normalizePercentStackData,
} from "../../registry/recharts/bar-percent-stack"

describe("Component 023: Percent Stack Bars (bar-percent-stack)", () => {
  const sampleData = [
    { segment: "Startup", monthly: 620, annual: 310, multiYear: 70 },
    { segment: "Growth", monthly: 840, annual: 920, multiYear: 240 },
    { segment: "Enterprise", monthly: 90, annual: 215, multiYear: 195 },
  ]

  const sampleSeries = [
    { key: "monthly" as const, label: "Monthly", color: "var(--chart-1)" },
    { key: "annual" as const, label: "Annual", color: "var(--chart-2)" },
    { key: "multiYear" as const, label: "Multi-year", color: "var(--chart-3)" },
  ]

  /* -------------------------------------------------------------------------- */
  /*  1. Algorithmic Helpers & Finite Numbers                                   */
  /* -------------------------------------------------------------------------- */
  describe("Algorithmic Helpers: Finite Numbers", () => {
    it("should correctly identify finite numbers", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42.5), true)
      assert.strictEqual(isFiniteNumber(3.14159), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("100"), false)
      assert.strictEqual(isFiniteNumber({}), false)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Pure Normalization: Math & Shares                                      */
  /* -------------------------------------------------------------------------- */
  describe("Pure Normalization: Math & Shares", () => {
    it("should accurately compute 100% normalized shares for clean positive data (50/30/20)", () => {
      const data = [{ category: "Test", a: 50, b: 30, c: 20 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows, hasNegativeValues } = normalizePercentStackData(
        data,
        "category",
        resolved,
        visibleKeys
      )

      assert.strictEqual(hasNegativeValues, false)
      assert.strictEqual(rows.length, 1)
      assert.strictEqual(rows[0].__state, "valid")
      assert.strictEqual(rows[0].__visibleRawTotal, 100)
      assert.strictEqual(rows[0].__shares.a, 50)
      assert.strictEqual(rows[0].__shares.b, 30)
      assert.strictEqual(rows[0].__shares.c, 20)
      assert.strictEqual(
        (rows[0].__shares.a ?? 0) + (rows[0].__shares.b ?? 0) + (rows[0].__shares.c ?? 0),
        100
      )
    })

    it("should produce identical normalized geometry for unequal totals with identical proportions", () => {
      const data = [
        { tier: "Small", a: 50, b: 30, c: 20 }, // Total = 100
        { tier: "Large", a: 5000, b: 3000, c: 2000 }, // Total = 10000 (100x larger)
      ]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows } = normalizePercentStackData(data, "tier", resolved, visibleKeys)

      assert.strictEqual(rows.length, 2)
      // Small tier
      assert.strictEqual(rows[0].__visibleRawTotal, 100)
      assert.strictEqual(rows[0].__shares.a, 50)
      assert.strictEqual(rows[0].__shares.b, 30)
      assert.strictEqual(rows[0].__shares.c, 20)

      // Large tier: identical shares despite 100x magnitude difference
      assert.strictEqual(rows[1].__visibleRawTotal, 10000)
      assert.strictEqual(rows[1].__shares.a, 50)
      assert.strictEqual(rows[1].__shares.b, 30)
      assert.strictEqual(rows[1].__shares.c, 20)

      // Recharts bar keys match normalized shares exactly
      assert.strictEqual(rows[0].a, rows[1].a)
      assert.strictEqual(rows[0].b, rows[1].b)
      assert.strictEqual(rows[0].c, rows[1].c)
    })

    it("should compute accurate non-integer shares (1/1/1) totaling 100%", () => {
      const data = [{ category: "Equal", x: 1, y: 1, z: 1 }]
      const resolved = resolvePercentStackSeries([
        { key: "x", label: "X" },
        { key: "y", label: "Y" },
        { key: "z", label: "Z" },
      ])
      const visibleKeys = new Set(["x", "y", "z"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      const expected = (1 / 3) * 100
      assert.ok(Math.abs((rows[0].__shares.x ?? 0) - expected) < 1e-10)
      assert.ok(Math.abs((rows[0].__shares.y ?? 0) - expected) < 1e-10)
      assert.ok(Math.abs((rows[0].__shares.z ?? 0) - expected) < 1e-10)

      const totalShare =
        (rows[0].__shares.x ?? 0) + (rows[0].__shares.y ?? 0) + (rows[0].__shares.z ?? 0)
      assert.ok(Math.abs(totalShare - 100) < 1e-10)
    })

    it("should never mutate caller input data (immutable data contract)", () => {
      const original = Object.freeze([
        Object.freeze({ segment: "A", monthly: 60, annual: 40 }),
        Object.freeze({ segment: "B", monthly: 30, annual: 70 }),
      ])

      const resolved = resolvePercentStackSeries([
        { key: "monthly", label: "Monthly" },
        { key: "annual", label: "Annual" },
      ])
      const visibleKeys = new Set(["monthly", "annual"])

      // Should not throw mutation error on frozen objects
      assert.doesNotThrow(() => {
        normalizePercentStackData(original, "segment", resolved, visibleKeys)
      })

      // Keys on original objects must not have leaked internal normalization properties
      assert.strictEqual("__shares" in original[0], false)
      assert.strictEqual("__visibleRawTotal" in original[0], false)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Zero Contributor & Zero Total Semantics                                */
  /* -------------------------------------------------------------------------- */
  describe("Zero Contributor & Zero Total Semantics", () => {
    it("should allow a single contributor to be 0 within a positive category total", () => {
      const data = [{ category: "Mixed", a: 70, b: 0, c: 30 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      assert.strictEqual(rows[0].__state, "valid")
      assert.strictEqual(rows[0].__visibleRawTotal, 100)
      assert.strictEqual(rows[0].__shares.a, 70)
      assert.strictEqual(rows[0].__shares.b, 0)
      assert.strictEqual(rows[0].__shares.c, 30)
      assert.strictEqual(rows[0].b, 0) // zero visual thickness for Recharts
    })

    it("should never invent equal shares (33.33%) for all-zero categories", () => {
      const data = [{ category: "EmptyAll", a: 0, b: 0, c: 0 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      assert.strictEqual(rows[0].__state, "zero-total")
      assert.strictEqual(rows[0].__visibleRawTotal, 0)

      // Must not invent equal 33.3% shares
      assert.notStrictEqual(rows[0].__shares.a, 33.333333333333336)
      assert.notStrictEqual(rows[0].__shares.a, 33.3)
      assert.notStrictEqual(rows[0].__shares.b, 33.3)
      assert.notStrictEqual(rows[0].__shares.c, 33.3)

      // Must not produce NaN or Infinity
      assert.strictEqual(Number.isNaN(rows[0].__shares.a), false)
      assert.strictEqual(Number.isFinite(rows[0].__shares.a), true)

      // Recharts bar render values should be 0 to suppress visual geometry
      assert.strictEqual(rows[0].a, 0)
      assert.strictEqual(rows[0].b, 0)
      assert.strictEqual(rows[0].c, 0)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Missing Values & Missing Policy                                        */
  /* -------------------------------------------------------------------------- */
  describe("Missing Values & Missing Policy", () => {
    it("should mark category incomplete under default 'incomplete' policy when contributor is missing", () => {
      const data = [{ category: "MissingOne", a: 50, b: null, c: 50 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows } = normalizePercentStackData(
        data,
        "category",
        resolved,
        visibleKeys,
        "incomplete"
      )

      assert.strictEqual(rows[0].__state, "incomplete")
      assert.strictEqual(rows[0].__visibleRawTotal, null)
      assert.strictEqual(rows[0].__shares.a, null)
      assert.strictEqual(rows[0].__shares.b, null)
      assert.strictEqual(rows[0].__shares.c, null)

      // Must not render fake 50% / 50% bar
      assert.strictEqual(rows[0].a, 0)
      assert.strictEqual(rows[0].c, 0)
    })

    it("should coerce missing to zero when explicitly opted-in with missingValuePolicy='zero'", () => {
      const data = [{ category: "MissingOne", a: 50, b: null, c: 50 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const { rows } = normalizePercentStackData(
        data,
        "category",
        resolved,
        visibleKeys,
        "zero"
      )

      assert.strictEqual(rows[0].__state, "valid")
      assert.strictEqual(rows[0].__visibleRawTotal, 100)
      assert.strictEqual(rows[0].__shares.a, 50)
      assert.strictEqual(rows[0].__shares.b, 0)
      assert.strictEqual(rows[0].__shares.c, 50)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  5. V1 Sign Model & Non-Negative Contract                                  */
  /* -------------------------------------------------------------------------- */
  describe("V1 Sign Model & Non-Negative Contract", () => {
    it("should strictly reject negative numbers without clamping or abs-transforming", () => {
      const negativeData = [{ category: "Negative", a: 50, b: -20, c: 70 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a", "b", "c"])

      const result = normalizePercentStackData(negativeData, "category", resolved, visibleKeys)

      assert.strictEqual(result.hasNegativeValues, true)
      assert.strictEqual(result.rows.length, 0)
      assert.ok(result.negativeErrorDetails?.includes("Found negative value (-20)"))
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  6. Legend Renormalization & Denominator Semantics                         */
  /* -------------------------------------------------------------------------- */
  describe("Legend Renormalization & Denominator Semantics", () => {
    it("should renormalize remaining visible series to 100% when one series is hidden", () => {
      const data = [{ category: "Q1", a: 50, b: 30, c: 20 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])

      // Hide series 'c'
      const visibleKeys = new Set(["a", "b"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      // Denominator changes from 100 to (50 + 30) = 80
      assert.strictEqual(rows[0].__visibleRawTotal, 80)
      // New shares: 50 / 80 = 62.5%, 30 / 80 = 37.5%
      assert.strictEqual(rows[0].__shares.a, 62.5)
      assert.strictEqual(rows[0].__shares.b, 37.5)
      assert.strictEqual(rows[0].__shares.c, null)
      assert.strictEqual((rows[0].__shares.a ?? 0) + (rows[0].__shares.b ?? 0), 100)
    })

    it("should preserve series assigned colors without reassigning when another series hides", () => {
      const seriesConfig = [
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ]
      const resolvedBefore = resolvePercentStackSeries(seriesConfig)
      assert.strictEqual(resolvedBefore[0].color, "var(--chart-1)")
      assert.strictEqual(resolvedBefore[1].color, "var(--chart-2)")
      assert.strictEqual(resolvedBefore[2].color, "var(--chart-3)")

      // Even if 'b' is hidden, 'a' remains chart-1 and 'c' remains chart-3
      const visibleKeys = new Set(["a", "c"])
      const visibleSeries = resolvedBefore.filter((s) => visibleKeys.has(s.key))
      assert.strictEqual(visibleSeries[0].color, "var(--chart-1)")
      assert.strictEqual(visibleSeries[1].color, "var(--chart-3)")
    })

    it("should allocate 100% to a single visible positive contributor", () => {
      const data = [{ category: "Solo", a: 50, b: 30, c: 20 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      assert.strictEqual(rows[0].__visibleRawTotal, 50)
      assert.strictEqual(rows[0].__shares.a, 100)
    })

    it("should render zero-total unavailable when the only visible contributor is 0", () => {
      const data = [{ category: "SoloZero", a: 0, b: 30, c: 20 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
        { key: "c", label: "C" },
      ])
      const visibleKeys = new Set(["a"])

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      assert.strictEqual(rows[0].__state, "zero-total")
      assert.strictEqual(rows[0].__visibleRawTotal, 0)
      assert.notStrictEqual(rows[0].__shares.a, 100)
    })

    it("should handle all series hidden gracefully without crashing", () => {
      const data = [{ category: "AllHidden", a: 50, b: 30 }]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
      ])
      const visibleKeys = new Set<string>()

      const { rows } = normalizePercentStackData(data, "category", resolved, visibleKeys)

      assert.strictEqual(rows[0].__state, "zero-total")
      assert.strictEqual(rows[0].__visibleRawTotal, 0)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  7. Category & Stack Order Stability                                       */
  /* -------------------------------------------------------------------------- */
  describe("Category & Stack Order Stability", () => {
    it("should preserve input category order strictly", () => {
      const unorderedData = [
        { quarter: "Q3", a: 20, b: 80 },
        { quarter: "Q1", a: 90, b: 10 },
        { quarter: "Q4", a: 50, b: 50 },
        { quarter: "Q2", a: 40, b: 60 },
      ]
      const resolved = resolvePercentStackSeries([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
      ])
      const visibleKeys = new Set(["a", "b"])

      const { rows } = normalizePercentStackData(unorderedData, "quarter", resolved, visibleKeys)

      assert.strictEqual(rows[0].__category, "Q3")
      assert.strictEqual(rows[1].__category, "Q1")
      assert.strictEqual(rows[2].__category, "Q4")
      assert.strictEqual(rows[3].__category, "Q2")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  8. React Static Markup & Accessibility Rendering                          */
  /* -------------------------------------------------------------------------- */
  describe("React Static Markup & Accessibility Rendering", () => {
    it("should render semantic figure with role='region' and tabIndex={0}", () => {
      const html = renderToStaticMarkup(
        React.createElement(PercentStackBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes('role="region"'))
      assert.ok(html.includes('tabindex="0"'))
      assert.ok(html.includes('aria-label="100% Normalized Percent Stack Bars"'))
    })

    it("should render offscreen structured HTML table for screen readers", () => {
      const html = renderToStaticMarkup(
        React.createElement(PercentStackBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<table"))
      assert.ok(html.includes("<caption>100% Normalized Categorical Composition Data</caption>"))
      assert.ok(html.includes("Startup"))
      assert.ok(html.includes("Growth"))
      assert.ok(html.includes("Enterprise"))
      assert.ok(html.includes("Visible Raw Total"))
      assert.ok(html.includes("Status"))
    })

    it("should render error state when negative values are provided", () => {
      const negativeData = [
        { segment: "Startup", monthly: 600, annual: -200, multiYear: 100 },
      ]
      const html = renderToStaticMarkup(
        React.createElement(PercentStackBars, {
          data: negativeData,
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("Negative Values Unsupported"))
      assert.ok(html.includes("Found negative value (-200)"))
    })

    it("should render empty state when data is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(PercentStackBars, {
          data: [],
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Composition Data"))
    })

    it("should support horizontal layout orientation without crashing", () => {
      const html = renderToStaticMarkup(
        React.createElement(PercentStackBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
          layout: "horizontal",
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes("Startup"))
    })
  })
})
