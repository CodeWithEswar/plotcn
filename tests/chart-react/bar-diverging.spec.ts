import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  DivergingBars,
  isFiniteNumber,
  computeDeviation,
  classifyAgainstBaseline,
  resolveSymmetricDomain,
} from "../../registry/recharts/bar-diverging"

describe("Component 024: Diverging Bars (bar-diverging)", () => {
  const sampleData = [
    { region: "North", variance: 18 },
    { region: "South", variance: -12 },
    { region: "East", variance: 31 },
    { region: "West", variance: -24 },
    { region: "Central", variance: 0 },
  ]

  const sampleSeries = {
    key: "variance" as const,
    label: "Variance from Plan",
    valueFormatter: (v: number) => `${v}%`,
  }

  /* -------------------------------------------------------------------------- */
  /*  1. Mathematical Deviation & Finite Numbers                                */
  /* -------------------------------------------------------------------------- */
  describe("Mathematical Deviation: value - baseline", () => {
    it("should correctly validate finite numbers and reject non-finites", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("42"), false)
    })

    it("should accurately derive deviation around zero baseline (Section 142)", () => {
      assert.strictEqual(computeDeviation(-20, 0), -20)
      assert.strictEqual(computeDeviation(0, 0), 0)
      assert.strictEqual(computeDeviation(30, 0), 30)

      assert.strictEqual(classifyAgainstBaseline(-20, 0), "below")
      assert.strictEqual(classifyAgainstBaseline(0, 0), "equal")
      assert.strictEqual(classifyAgainstBaseline(30, 0), "above")
    })

    it("should accurately derive deviation around non-zero baseline = 100 (Section 143)", () => {
      const baseline = 100
      assert.strictEqual(computeDeviation(80, baseline), -20)
      assert.strictEqual(computeDeviation(100, baseline), 0)
      assert.strictEqual(computeDeviation(130, baseline), 30)

      assert.strictEqual(classifyAgainstBaseline(80, baseline), "below")
      assert.strictEqual(classifyAgainstBaseline(100, baseline), "equal")
      assert.strictEqual(classifyAgainstBaseline(130, baseline), "above")
    })

    it("should accurately derive deviation around negative baseline = -100 (Section 144)", () => {
      const baseline = -100
      assert.strictEqual(computeDeviation(-120, baseline), -20)
      assert.strictEqual(computeDeviation(-100, baseline), 0)
      assert.strictEqual(computeDeviation(-80, baseline), 20)

      assert.strictEqual(classifyAgainstBaseline(-120, baseline), "below")
      assert.strictEqual(classifyAgainstBaseline(-100, baseline), "equal")
      assert.strictEqual(classifyAgainstBaseline(-80, baseline), "above")
    })

    it("should classify strictly by deviation, independent of raw value sign (Section 145)", () => {
      // Raw value +80 is positive, but below baseline 100
      assert.strictEqual(classifyAgainstBaseline(80, 100), "below")

      // Raw value -80 is negative, but above baseline -100
      assert.strictEqual(classifyAgainstBaseline(-80, -100), "above")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Symmetrical Quantitative Domain Resolution                             */
  /* -------------------------------------------------------------------------- */
  describe("Symmetric Domain Resolution (Section 146-149)", () => {
    it("should produce symmetric bounds [-max, +max] around zero for asymmetric inputs", () => {
      const deviations = [-20, 80]
      const domain = resolveSymmetricDomain(deviations)

      assert.strictEqual(domain[0] < 0, true)
      assert.strictEqual(domain[1] > 0, true)
      assert.strictEqual(Math.abs(domain[0]), domain[1])
      assert.strictEqual(domain[1] >= 80, true)
    })

    it("should preserve negative side, zero reference, and positive side for all-above data (Section 147)", () => {
      const deviations = [10, 20, 30]
      const domain = resolveSymmetricDomain(deviations)

      assert.strictEqual(domain[0] < 0, true)
      assert.strictEqual(domain[1] > 0, true)
      assert.strictEqual(domain[0], -domain[1])
      assert.strictEqual(domain[1] >= 30, true)
    })

    it("should preserve positive side, zero reference, and negative side for all-below data (Section 148)", () => {
      const deviations = [-10, -20, -30]
      const domain = resolveSymmetricDomain(deviations)

      assert.strictEqual(domain[0] < 0, true)
      assert.strictEqual(domain[1] > 0, true)
      assert.strictEqual(domain[0], -domain[1])
      assert.strictEqual(domain[1] >= 30, true)
    })

    it("should handle all-zero deviation data with safe finite symmetrical bounds (Section 149)", () => {
      const deviations = [0, 0, 0]
      const domain = resolveSymmetricDomain(deviations)

      assert.deepStrictEqual(domain, [-1, 1])
    })

    it("should handle empty or all-null deviations safely", () => {
      const domain = resolveSymmetricDomain([null, null])
      assert.deepStrictEqual(domain, [-10, 10])
    })

    it("should respect explicit custom domain when supplied", () => {
      const domain = resolveSymmetricDomain([-20, 80], [-50, 120])
      assert.deepStrictEqual(domain, [-50, 120])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Static Server Rendering & Structure                                    */
  /* -------------------------------------------------------------------------- */
  describe("Static Rendering & Accessible Structure", () => {
    it("should render semantic figure with region role and title", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: 0,
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes('role="region"'))
      assert.ok(html.includes("Diverging Bars"))
    })

    it("should render offscreen accessible table with category, raw value, baseline, deviation, and position", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: 0,
        })
      )

      assert.ok(html.includes("<caption>Diverging Bars — Structured Observations</caption>"))
      assert.ok(html.includes('<th scope="col">Category</th>'))
      assert.ok(html.includes('<th scope="col">Raw Value</th>'))
      assert.ok(html.includes('<th scope="col">Reference Baseline</th>'))
      assert.ok(html.includes('<th scope="col">Deviation</th>'))
      assert.ok(html.includes('<th scope="col">Position</th>'))

      // Values present in table
      assert.ok(html.includes("North"))
      assert.ok(html.includes("South"))
      assert.ok(html.includes("Above reference"))
      assert.ok(html.includes("Below reference"))
      assert.ok(html.includes("On reference"))
    })

    it("should render factual accessibility narrative count", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: 0,
        })
      )

      // Sample data: North (+18), South (-12), East (+31), West (-24), Central (0)
      // 2 above, 2 below, 1 on reference
      assert.ok(html.includes("2 above reference"))
      assert.ok(html.includes("2 below reference"))
      assert.ok(html.includes("1 on reference"))
    })

    it("should render truthful directional legend when showLegend=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          showLegend: true,
          baseline: 250,
          baselineLabel: "Target SLA",
        })
      )

      assert.ok(html.includes("Above reference"))
      assert.ok(html.includes("Below reference"))
      assert.ok(html.includes("Target SLA · 250"))
    })

    it("should reject non-finite baseline with an explicit configuration error", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: NaN,
        })
      )

      assert.ok(html.includes("Invalid baseline reference"))
    })

    it("should render truthful empty state when observations array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: [],
          categoryKey: "region",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No observations provided"))
    })

    it("should render truthful loading state when loading=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          loading: true,
        })
      )

      assert.ok(html.includes("Loading diverging bars..."))
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Missing & Non-finite Value Safety                                      */
  /* -------------------------------------------------------------------------- */
  describe("Missing & Non-finite Data Safety (Section 150-151)", () => {
    it("should mark null or undefined values as unavailable without coercing to zero", () => {
      const mixedData = [
        { region: "North", variance: 20 },
        { region: "South", variance: null },
        { region: "East", variance: -15 },
      ]

      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: mixedData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: 0,
        })
      )

      assert.ok(html.includes("South"))
      assert.ok(html.includes("Unavailable"))
      assert.ok(html.includes("1 unavailable"))
    })

    it("should treat non-finite values (NaN, Infinity) as unavailable without crashing", () => {
      const invalidData = [
        { region: "North", variance: 20 },
        { region: "South", variance: NaN },
        { region: "East", variance: Infinity },
      ]

      const html = renderToStaticMarkup(
        React.createElement(DivergingBars, {
          data: invalidData,
          categoryKey: "region",
          series: sampleSeries,
          baseline: 0,
        })
      )

      assert.ok(html.includes("2 unavailable"))
    })
  })
})
