import { describe, it } from "node:test"
import assert from "node:assert"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  BulletBars,
  isFiniteNumber,
  computeTargetDelta,
  classifyTargetPosition,
  resolveBulletDomain,
} from "../../registry/recharts/bar-bullet"

describe("Component 025: Bullet Bars (bar-bullet)", () => {
  const sampleData = [
    { service: "Auth API", actual: 99.95, target: 99.90 },
    { service: "Search API", actual: 99.82, target: 99.90 },
    { service: "Checkout API", actual: 99.90, target: 99.90 },
    { service: "Profiles API", actual: null, target: 99.90 },
    { service: "Notifications API", actual: 99.88, target: null },
  ]

  const sampleSeries = {
    valueKey: "actual" as const,
    targetKey: "target" as const,
    label: "Availability",
    valueFormatter: (v: number) => `${v.toFixed(2)}%`,
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

    it("should accurately derive delta = actual - target when actual < target", () => {
      const delta = computeTargetDelta(80, 100)
      assert.strictEqual(delta, -20)
      assert.strictEqual(classifyTargetPosition(80, 100), "below")
    })

    it("should accurately derive delta = actual - target when actual > target", () => {
      const delta = computeTargetDelta(120, 100)
      assert.strictEqual(delta, 20)
      assert.strictEqual(classifyTargetPosition(120, 100), "above")
    })

    it("should accurately derive delta = 0 when actual === target", () => {
      const delta = computeTargetDelta(100, 100)
      assert.strictEqual(delta, 0)
      assert.strictEqual(classifyTargetPosition(100, 100), "equal")
    })

    it("should handle zero target safely without division by zero errors", () => {
      const delta = computeTargetDelta(4, 0)
      assert.strictEqual(delta, 4)
      assert.strictEqual(classifyTargetPosition(4, 0), "above")
    })

    it("should handle zero actual safely", () => {
      const delta = computeTargetDelta(0, 10)
      assert.strictEqual(delta, -10)
      assert.strictEqual(classifyTargetPosition(0, 10), "below")
    })

    it("should return null delta and unavailable position when actual is missing", () => {
      assert.strictEqual(computeTargetDelta(null, 100), null)
      assert.strictEqual(classifyTargetPosition(null, 100), "unavailable")
    })

    it("should return null delta and unavailable position when target is missing", () => {
      assert.strictEqual(computeTargetDelta(80, null), null)
      assert.strictEqual(classifyTargetPosition(80, null), "unavailable")
    })

    it("should return null delta and unavailable position when both are missing or non-finite", () => {
      assert.strictEqual(computeTargetDelta(null, null), null)
      assert.strictEqual(classifyTargetPosition(null, null), "unavailable")
      assert.strictEqual(computeTargetDelta(NaN, 100), null)
      assert.strictEqual(classifyTargetPosition(100, Infinity), "unavailable")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Shared Quantitative Domain Resolution                                  */
  /* -------------------------------------------------------------------------- */
  describe("Shared Quantitative Domain Resolution", () => {
    it("should always include zero baseline in the domain", () => {
      const domain = resolveBulletDomain([80, 95], [100, 100])
      assert.strictEqual(domain[0] <= 0, true)
      assert.strictEqual(domain[1] >= 100, true)
    })

    it("should encompass all finite actual and target values", () => {
      const domain = resolveBulletDomain([10, 20], [50, 80])
      assert.strictEqual(domain[0] <= 0, true)
      assert.strictEqual(domain[1] >= 80, true)
    })

    it("should include qualitative range boundaries when provided", () => {
      const domain = resolveBulletDomain([50], [80], [{ to: 120 }])
      assert.strictEqual(domain[1] >= 120, true)
    })

    it("should handle signed/negative values appropriately", () => {
      const domain = resolveBulletDomain([-20, 10], [-10, 30])
      assert.strictEqual(domain[0] <= -20, true)
      assert.strictEqual(domain[1] >= 30, true)
    })

    it("should handle constant single-value datasets safely without division by zero", () => {
      const domain = resolveBulletDomain([100], [100])
      assert.strictEqual(domain[0] <= 0, true)
      assert.strictEqual(domain[1] > 100, true)
    })

    it("should return fallback [0, 100] when dataset is empty or all-null", () => {
      const domain = resolveBulletDomain([null, null], [null, null])
      assert.deepStrictEqual(domain, [0, 100])
    })

    it("should respect explicit custom domain when provided", () => {
      const domain = resolveBulletDomain([10, 20], [30, 40], undefined, [0, 200])
      assert.deepStrictEqual(domain, [0, 200])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Static Server Rendering & Accessible Structure                         */
  /* -------------------------------------------------------------------------- */
  describe("Static Rendering & Accessible Structure", () => {
    it("should render semantic figure with region role and title", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes('role="region"'))
      assert.ok(html.includes("Bullet Bars"))
    })

    it("should render offscreen accessible table with structured columns", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<caption>Bullet Bars — Operational Scorecard — Structured Scorecard</caption>"))
      assert.ok(html.includes('<th scope="col">Category</th>'))
      assert.ok(html.includes('<th scope="col">Availability</th>'))
      assert.ok(html.includes('<th scope="col">Target</th>'))
      assert.ok(html.includes('<th scope="col">Delta</th>'))
      assert.ok(html.includes('<th scope="col">Position</th>'))

      // Categorical rows present
      assert.ok(html.includes("Auth API"))
      assert.ok(html.includes("Search API"))
      assert.ok(html.includes("Checkout API"))

      // Factual positional status
      assert.ok(html.includes("Above target"))
      assert.ok(html.includes("Below target"))
      assert.ok(html.includes("On target"))
      assert.ok(html.includes("Unavailable"))
    })

    it("should render factual screen reader summary count", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("above target"))
      assert.ok(html.includes("below target"))
      assert.ok(html.includes("on target"))
      assert.ok(html.includes("with incomplete values"))
    })

    it("should render truthful structural legend when showLegend=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
          showLegend: true,
        })
      )

      assert.ok(html.includes("Availability"))
      assert.ok(html.includes("Target"))
    })

    it("should render truthful empty state when observations array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: [],
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No operational records"))
    })

    it("should render truthful loading state when loading=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: sampleData,
          categoryKey: "service",
          series: sampleSeries,
          loading: true,
        })
      )

      assert.ok(html.includes("Loading operational scorecard..."))
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Missing & Non-finite Data Safety                                       */
  /* -------------------------------------------------------------------------- */
  describe("Missing & Incomplete Data Handling", () => {
    it("should handle missing actual with target visible and unavailable delta", () => {
      const singleMissing = [{ service: "Test Service", actual: null, target: 100 }]
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: singleMissing,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("Test Service"))
      assert.ok(html.includes("Unavailable")) // for actual
      assert.ok(html.includes("100")) // for target
    })

    it("should handle missing target with actual visible and unavailable delta", () => {
      const singleMissingTarget = [{ service: "Test Service", actual: 80, target: null }]
      const html = renderToStaticMarkup(
        React.createElement(BulletBars, {
          data: singleMissingTarget,
          categoryKey: "service",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("Test Service"))
      assert.ok(html.includes("80.00%")) // for actual
      assert.ok(html.includes("Unavailable")) // for target
    })

    it("should safely handle non-finite values (NaN, Infinity) without throwing", () => {
      const nonFinites = [
        { service: "NaN Test", actual: NaN, target: 100 },
        { service: "Infinity Test", actual: 50, target: Infinity },
      ]

      assert.doesNotThrow(() => {
        renderToStaticMarkup(
          React.createElement(BulletBars, {
            data: nonFinites,
            categoryKey: "service",
            series: sampleSeries,
          })
        )
      })
    })
  })
})
