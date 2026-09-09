import { describe, it } from "node:test"
import assert from "node:assert"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  VarianceBars,
  isFiniteNumber,
  computeVariance,
  classifyVarianceDirection,
  classifyVariancePosition,
  resolveVarianceDomain,
  defaultFormatVariance,
} from "../../registry/recharts/bar-variance"

describe("Component 026: Variance Bars (bar-variance)", () => {
  const sampleData = [
    { segment: "Enterprise", actual: 124, plan: 110 },
    { segment: "Mid-market", actual: 92, plan: 100 },
    { segment: "SMB", actual: 74, plan: 74 },
    { segment: "Public Sector", actual: null, plan: 72 },
    { segment: "Partners", actual: 81, plan: null },
  ]

  const sampleSeries = {
    actualKey: "actual" as const,
    planKey: "plan" as const,
    label: "Revenue Variance",
    valueFormatter: (v: number) => `$${v}M`,
    varianceFormatter: (v: number) => `${v > 0 ? "+" : ""}$${v}M`,
  }

  /* -------------------------------------------------------------------------- */
  /*  1. Arithmetic Delta & Positional Classification                           */
  /* -------------------------------------------------------------------------- */
  describe("Mathematical Delta & Factual Classification", () => {
    it("should accurately validate finite numbers and reject non-finites", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("100"), false)
    })

    it("should accurately derive variance = actual - plan when actual > plan", () => {
      const variance = computeVariance(120, 100)
      assert.strictEqual(variance, 20)
      assert.strictEqual(classifyVarianceDirection(variance), "positive")
      assert.strictEqual(classifyVariancePosition(variance), "above")
    })

    it("should accurately derive variance = actual - plan when actual < plan", () => {
      const variance = computeVariance(80, 100)
      assert.strictEqual(variance, -20)
      assert.strictEqual(classifyVarianceDirection(variance), "negative")
      assert.strictEqual(classifyVariancePosition(variance), "below")
    })

    it("should accurately derive variance = 0 when actual === plan", () => {
      const variance = computeVariance(100, 100)
      assert.strictEqual(variance, 0)
      assert.strictEqual(classifyVarianceDirection(variance), "zero")
      assert.strictEqual(classifyVariancePosition(variance), "equal")
    })

    it("should correctly calculate variance for signed/negative inputs", () => {
      // (-80) - (-100) = +20
      const posVariance = computeVariance(-80, -100)
      assert.strictEqual(posVariance, 20)
      assert.strictEqual(classifyVarianceDirection(posVariance), "positive")
      assert.strictEqual(classifyVariancePosition(posVariance), "above")

      // (-120) - (-100) = -20
      const negVariance = computeVariance(-120, -100)
      assert.strictEqual(negVariance, -20)
      assert.strictEqual(classifyVarianceDirection(negVariance), "negative")
      assert.strictEqual(classifyVariancePosition(negVariance), "below")
    })

    it("should handle zero plan safely", () => {
      const variance = computeVariance(20, 0)
      assert.strictEqual(variance, 20)
      assert.strictEqual(classifyVarianceDirection(variance), "positive")
    })

    it("should handle zero actual safely", () => {
      const variance = computeVariance(0, 20)
      assert.strictEqual(variance, -20)
      assert.strictEqual(classifyVarianceDirection(variance), "negative")
    })

    it("should handle both values zero safely", () => {
      const variance = computeVariance(0, 0)
      assert.strictEqual(variance, 0)
      assert.strictEqual(classifyVarianceDirection(variance), "zero")
      assert.strictEqual(classifyVariancePosition(variance), "equal")
    })

    it("should return null variance and unavailable position when actual is missing", () => {
      assert.strictEqual(computeVariance(null, 100), null)
      assert.strictEqual(classifyVarianceDirection(null), "unavailable")
      assert.strictEqual(classifyVariancePosition(null), "unavailable")
    })

    it("should return null variance and unavailable position when plan is missing", () => {
      assert.strictEqual(computeVariance(80, null), null)
      assert.strictEqual(classifyVarianceDirection(null), "unavailable")
      assert.strictEqual(classifyVariancePosition(null), "unavailable")
    })

    it("should return null variance when either value is non-finite", () => {
      assert.strictEqual(computeVariance(NaN, 100), null)
      assert.strictEqual(computeVariance(100, Infinity), null)
      assert.strictEqual(computeVariance(-Infinity, -100), null)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Domain Resolution (Policy B)                                           */
  /* -------------------------------------------------------------------------- */
  describe("Domain Resolution (Policy B)", () => {
    it("should create a symmetric zero-centered domain when both positive and negative variances exist", () => {
      const domain = resolveVarianceDomain([-20, 80])
      assert.strictEqual(domain[0] < 0, true)
      assert.strictEqual(domain[1] > 0, true)
      assert.strictEqual(Math.abs(domain[0]), domain[1], "Domain must be strictly symmetric around zero")
      assert.strictEqual(domain[1] >= 80, true)
    })

    it("should ensure equal absolute variances produce identical extent in symmetric domain", () => {
      const domain = resolveVarianceDomain([-40, 40])
      assert.strictEqual(Math.abs(domain[0]), domain[1])
      assert.strictEqual(domain[1] >= 40, true)
    })

    it("should create a [0, safeMax] domain when variances are all positive", () => {
      const domain = resolveVarianceDomain([10, 20, 50])
      assert.strictEqual(domain[0], 0, "Lower bound must start at zero")
      assert.strictEqual(domain[1] >= 50, true)
    })

    it("should create a [safeMin, 0] domain when variances are all negative", () => {
      const domain = resolveVarianceDomain([-50, -20, -10])
      assert.strictEqual(domain[1], 0, "Upper bound must end at zero")
      assert.strictEqual(domain[0] <= -50, true)
    })

    it("should return [-1, 1] when all variances are zero", () => {
      const domain = resolveVarianceDomain([0, 0, 0])
      assert.strictEqual(domain[0], -1)
      assert.strictEqual(domain[1], 1)
    })

    it("should return fallback [-10, 10] when no valid variances exist", () => {
      const domain = resolveVarianceDomain([])
      assert.deepStrictEqual(domain, [-10, 10])
    })

    it("should enforce inclusion of zero even when custom domain is passed", () => {
      const domain = resolveVarianceDomain([20, 30], [10, 50])
      assert.strictEqual(domain[0], 0, "Explicit domain must be normalized to include zero")
      assert.strictEqual(domain[1], 50)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Formatting                                                             */
  /* -------------------------------------------------------------------------- */
  describe("Signed Variance Formatting", () => {
    it("should format positive variance with explicit plus sign", () => {
      assert.strictEqual(defaultFormatVariance(20), "+20")
      assert.strictEqual(defaultFormatVariance(1500), "+1,500")
    })

    it("should format negative variance with unicode minus sign", () => {
      assert.strictEqual(defaultFormatVariance(-20), "\u221220")
      assert.strictEqual(defaultFormatVariance(-1500), "\u22121,500")
    })

    it("should format zero variance without plus or minus sign", () => {
      assert.strictEqual(defaultFormatVariance(0), "0")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Static Rendering & Accessible Structure                                */
  /* -------------------------------------------------------------------------- */
  describe("Static Rendering & Accessible Structure", () => {
    it("should render semantic figure with region role and title", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
          title: "Quarterly Variance",
        })
      )

      assert.strictEqual(html.includes('role="region"'), true)
      assert.strictEqual(html.includes('aria-label="Quarterly Variance"'), true)
      assert.strictEqual(html.includes("plotcn-variance-chart"), true)
    })

    it("should render offscreen accessible table with structured columns", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.strictEqual(html.includes("<table"), true)
      assert.strictEqual(html.includes('<th scope="col">Category</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Actual</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Plan</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Variance</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Position</th>'), true)
    })

    it("should render factual screen reader summary counts", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.strictEqual(html.includes("Showing 5 categories"), true)
      assert.strictEqual(html.includes("1 above plan"), true)
      assert.strictEqual(html.includes("1 below plan"), true)
      assert.strictEqual(html.includes("1 on plan"), true)
      assert.strictEqual(html.includes("2 unavailable"), true)
    })

    it("should render structural legend when showLegend=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
          showLegend: true,
        })
      )

      assert.strictEqual(html.includes('aria-label="Directional Legend"'), true)
      assert.strictEqual(html.includes("Above Plan"), true)
      assert.strictEqual(html.includes("Below Plan"), true)
      assert.strictEqual(html.includes("Equal (Zero variance)"), true)
    })

    it("should render loading state when loading=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
          loading: true,
        })
      )

      assert.strictEqual(html.includes('role="status"'), true)
      assert.strictEqual(html.includes("Loading visualization"), true)
    })

    it("should render empty state when data array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: [],
          categoryKey: "segment",
          series: sampleSeries,
        })
      )

      assert.strictEqual(html.includes("No variance data available"), true)
    })

    it("should support horizontal orientation without throwing", () => {
      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: sampleData,
          categoryKey: "segment",
          series: sampleSeries,
          orientation: "horizontal",
        })
      )

      assert.strictEqual(html.includes("plotcn-variance-chart"), true)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  5. Data Safety & Immutability                                             */
  /* -------------------------------------------------------------------------- */
  describe("Data Safety & Immutability", () => {
    it("should never mutate the input data array or datum objects", () => {
      const frozenData = Object.freeze([
        Object.freeze({ segment: "A", actual: 100, plan: 90 }),
        Object.freeze({ segment: "B", actual: 80, plan: 90 }),
      ])

      assert.doesNotThrow(() => {
        renderToStaticMarkup(
          React.createElement(VarianceBars, {
            data: frozenData,
            categoryKey: "segment",
            series: {
              actualKey: "actual",
              planKey: "plan",
              label: "Immutable Test",
            },
          })
        )
      })
    })

    it("should preserve original caller category order without automatic ranking", () => {
      const orderedData = [
        { segment: "Gamma", actual: 150, plan: 100 }, // +50
        { segment: "Alpha", actual: 80, plan: 100 },  // -20
        { segment: "Beta", actual: 120, plan: 100 },  // +20
      ]

      const html = renderToStaticMarkup(
        React.createElement(VarianceBars, {
          data: orderedData,
          categoryKey: "segment",
          series: {
            actualKey: "actual",
            planKey: "plan",
            label: "Order Test",
          },
        })
      )

      const gammaIdx = html.indexOf("Gamma")
      const alphaIdx = html.indexOf("Alpha")
      const betaIdx = html.indexOf("Beta")

      assert.strictEqual(gammaIdx < alphaIdx, true, "Gamma must appear before Alpha")
      assert.strictEqual(alphaIdx < betaIdx, true, "Alpha must appear before Beta")
    })
  })
})
