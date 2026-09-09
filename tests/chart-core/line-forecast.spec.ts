import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  normalizeForecastData,
  calculateForecastDomain,
  type ForecastLineSeries,
} from "../../registry/recharts/line-forecast"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("ForecastLine Core Architecture, Epistemic Normalization, Safe Domain & Color Roles Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numeric values", () => {
      assert.equal(isFiniteNumber(120), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-45.8), true)
      assert.equal(isFiniteNumber(1e6), true)
    })

    it("returns false for non-finite numbers, strings, and nullish values", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("120"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber({}), false)
      assert.equal(isFiniteNumber([]), false)
    })
  })

  describe("normalizeForecastData & Epistemic Separation", () => {
    type SampleDatum = {
      [key: string]: unknown
      month: string
      actual: number | null
      forecast: number | null
      lower?: number | null
      upper?: number | null
    }

    const seriesConfig: ForecastLineSeries<SampleDatum> = {
      actualKey: "actual",
      forecastKey: "forecast",
      lowerKey: "lower",
      upperKey: "upper",
      actualLabel: "Actual",
      forecastLabel: "Forecast",
      confidenceLabel: "Forecast Range",
    }

    it("normalizes observation records while preserving observed vs predicted roles", () => {
      const data: SampleDatum[] = [
        { month: "Jan", actual: 82, forecast: null },
        { month: "Feb", actual: 91, forecast: null },
        { month: "Mar", actual: 104, forecast: 104, lower: 104, upper: 104 },
        { month: "Apr", actual: null, forecast: 112, lower: 103, upper: 121 },
      ]

      const normalized = normalizeForecastData(data, "month", seriesConfig)
      assert.equal(normalized.length, 4)

      // Jan: Historical only
      assert.equal(normalized[0].__x, "Jan")
      assert.equal(normalized[0].__actual, 82)
      assert.equal(normalized[0].__forecast, null)
      assert.equal(normalized[0].__range, null)
      assert.equal(normalized[0].__isBridge, false)

      // Mar: Shared transition bridge point
      assert.equal(normalized[2].__x, "Mar")
      assert.equal(normalized[2].__actual, 104)
      assert.equal(normalized[2].__forecast, 104)
      assert.equal(normalized[2].__isBridge, true)
      assert.deepEqual(normalized[2].__range, [104, 104])

      // Apr: Forecast phase with valid confidence interval
      assert.equal(normalized[3].__x, "Apr")
      assert.equal(normalized[3].__actual, null)
      assert.equal(normalized[3].__forecast, 112)
      assert.equal(normalized[3].__isBridge, false)
      assert.equal(normalized[3].__isForecastPhase, true)
      assert.deepEqual(normalized[3].__range, [103, 121])
    })

    it("never coerces missing values to zero (null != 0)", () => {
      const gappyData: SampleDatum[] = [
        { month: "Jan", actual: null, forecast: null, lower: null, upper: null },
        { month: "Feb", actual: 0, forecast: null },
      ]

      const normalized = normalizeForecastData(gappyData, "month", seriesConfig)
      assert.equal(normalized[0].__actual, null)
      assert.equal(normalized[0].__forecast, null)
      assert.notEqual(normalized[0].__actual, 0)

      // Genuine zero must remain 0
      assert.equal(normalized[1].__actual, 0)
    })

    it("handles discontinuous separation (gap between actual and forecast) without fabricating a bridge", () => {
      const gapData: SampleDatum[] = [
        { month: "Jan", actual: 80, forecast: null },
        { month: "Feb", actual: 90, forecast: null },
        // Notice: No shared Mar bridge!
        { month: "Apr", actual: null, forecast: 110, lower: 100, upper: 120 },
      ]

      const normalized = normalizeForecastData(gapData, "month", seriesConfig)
      assert.equal(normalized.length, 3)
      assert.equal(normalized[0].__isBridge, false)
      assert.equal(normalized[1].__isBridge, false)
      assert.equal(normalized[2].__isBridge, false)
      assert.equal(normalized[1].__forecast, null)
      assert.equal(normalized[2].__actual, null)
    })

    it("safely invalidates confidence bounds if lower > upper (never silently swaps)", () => {
      const invalidBoundData: SampleDatum[] = [
        { month: "Apr", actual: null, forecast: 112, lower: 130, upper: 105 }, // lower (130) > upper (105)
      ]

      const normalized = normalizeForecastData(invalidBoundData, "month", seriesConfig)
      assert.equal(normalized[0].__forecast, 112)
      // Range MUST be null; lower and upper must not be swapped to make it valid!
      assert.equal(normalized[0].__range, null)
      assert.equal(normalized[0].__lower, 130)
      assert.equal(normalized[0].__upper, 105)
    })

    it("safely handles missing one-sided confidence bounds (missing lower or missing upper)", () => {
      const halfBoundData: SampleDatum[] = [
        { month: "May", actual: null, forecast: 120, lower: 110, upper: null },
        { month: "Jun", actual: null, forecast: 130, lower: null, upper: 140 },
      ]

      const normalized = normalizeForecastData(halfBoundData, "month", seriesConfig)
      assert.equal(normalized[0].__range, null)
      assert.equal(normalized[1].__range, null)
    })

    it("supports 'carry' policy forward filling independent series", () => {
      const carryData: SampleDatum[] = [
        { month: "Jan", actual: 100, forecast: null },
        { month: "Feb", actual: null, forecast: null },
        { month: "Mar", actual: null, forecast: 120 },
        { month: "Apr", actual: null, forecast: null },
      ]

      const normalized = normalizeForecastData(carryData, "month", seriesConfig, "carry")
      assert.equal(normalized[0].__actual, 100)
      assert.equal(normalized[1].__actual, 100) // carried forward
      assert.equal(normalized[2].__forecast, 120)
      assert.equal(normalized[3].__forecast, 120) // carried forward
    })

    it("guarantees caller data immutability", () => {
      const rawDatum = Object.freeze({
        month: "Jan",
        actual: 100,
        forecast: null,
        lower: null,
        upper: null,
      })
      const normalized = normalizeForecastData([rawDatum], "month", seriesConfig)
      assert.equal(normalized[0].__actual, 100)
      assert.equal(rawDatum.actual, 100)
    })
  })

  describe("calculateForecastDomain & Uncertainty Safeguarding", () => {
    it("encloses actual, forecast, and confidence bounds in Cartesian Y domain", () => {
      const data = [
        {
          __x: "Jan",
          __index: 0,
          __raw: {},
          __actual: 80,
          __forecast: null,
          __lower: null,
          __upper: null,
          __range: null,
          __isBridge: false,
          __isForecastPhase: false,
        },
        {
          __x: "Feb",
          __index: 1,
          __raw: {},
          __actual: null,
          __forecast: 110,
          __lower: 95,
          __upper: 140, // upper bound exceeds forecast max (110)
          __range: [95, 140] as [number, number],
          __isBridge: false,
          __isForecastPhase: true,
        },
      ]

      const domain = calculateForecastDomain(data)
      assert.ok(domain[0] <= 80, `Domain min ${domain[0]} must be <= min actual 80`)
      assert.ok(domain[1] >= 140, `Domain max ${domain[1]} must be >= max upper bound 140`)
    })

    it("excludes confidence bounds from domain if confidence role is hidden", () => {
      const data = [
        {
          __x: "Jan",
          __index: 0,
          __raw: {},
          __actual: 50,
          __forecast: null,
          __lower: null,
          __upper: null,
          __range: null,
          __isBridge: false,
          __isForecastPhase: false,
        },
        {
          __x: "Feb",
          __index: 1,
          __raw: {},
          __actual: null,
          __forecast: 60,
          __lower: 20,
          __upper: 500, // extreme confidence bound
          __range: [20, 500] as [number, number],
          __isBridge: false,
          __isForecastPhase: true,
        },
      ]

      // When confidence role is toggled off
      const domain = calculateForecastDomain(data, "auto", {
        actual: true,
        forecast: true,
        confidence: false,
      })
      // Max must scale to forecast (60), NOT the hidden upper bound (500)
      assert.ok(domain[1] < 100, `Domain max ${domain[1]} must not scale to hidden bound 500`)
    })

    it("returns safe non-zero span for constant values to avoid degenerate axis", () => {
      const flatData = [
        {
          __x: "Jan",
          __index: 0,
          __raw: {},
          __actual: 100,
          __forecast: null,
          __lower: null,
          __upper: null,
          __range: null,
          __isBridge: false,
          __isForecastPhase: false,
        },
      ]

      const domain = calculateForecastDomain(flatData)
      assert.notEqual(domain[0], domain[1])
      assert.ok(domain[0] < 100)
      assert.ok(domain[1] > 100)
    })

    it("safely handles negative and zero values", () => {
      const mixedData = [
        {
          __x: "Jan",
          __index: 0,
          __raw: {},
          __actual: -20,
          __forecast: null,
          __lower: null,
          __upper: null,
          __range: null,
          __isBridge: false,
          __isForecastPhase: false,
        },
        {
          __x: "Feb",
          __index: 1,
          __raw: {},
          __actual: null,
          __forecast: 15,
          __lower: -30,
          __upper: 25,
          __range: [-30, 25] as [number, number],
          __isBridge: false,
          __isForecastPhase: true,
        },
      ]

      const domain = calculateForecastDomain(mixedData)
      assert.ok(domain[0] <= -30)
      assert.ok(domain[1] >= 25)
    })

    it("respects explicit numeric domain override", () => {
      const data = [
        {
          __x: "Jan",
          __index: 0,
          __raw: {},
          __actual: 100,
          __forecast: null,
          __lower: null,
          __upper: null,
          __range: null,
          __isBridge: false,
          __isForecastPhase: false,
        },
      ]

      const domain = calculateForecastDomain(data, [0, 200])
      assert.deepEqual(domain, [0, 200])
    })

    it("returns fallback [0, 100] for empty data", () => {
      const domain = calculateForecastDomain([])
      assert.deepEqual(domain, [0, 100])
    })
  })

  describe("Declarative Color Roles Integration", () => {
    it("declares actual, forecast, confidence, and selection color roles for line-forecast", () => {
      const roles = getChartColorRoles("line-forecast")
      assert.equal(roles.length, 4)

      const actualRole = roles.find((r) => r.id === "actual")
      assert.ok(actualRole)
      assert.equal(actualRole.propName, "actualColor")
      assert.equal(actualRole.defaultToken, "var(--chart-1)")

      const forecastRole = roles.find((r) => r.id === "forecast")
      assert.ok(forecastRole)
      assert.equal(forecastRole.propName, "forecastColor")
      assert.equal(forecastRole.defaultToken, "var(--chart-2)")

      const confidenceRole = roles.find((r) => r.id === "confidence")
      assert.ok(confidenceRole)
      assert.equal(confidenceRole.propName, "confidenceColor")

      const selectionRole = roles.find((r) => r.id === "selection")
      assert.ok(selectionRole)
      assert.equal(selectionRole.propName, "selectionColor")
    })

    it("also resolves matching color roles for recharts-line-forecast alias", () => {
      const roles = getChartColorRoles("recharts-line-forecast")
      assert.equal(roles.length, 4)
      assert.equal(roles[0].propName, "actualColor")
      assert.equal(roles[1].propName, "forecastColor")
      assert.equal(roles[2].propName, "confidenceColor")
      assert.equal(roles[3].propName, "selectionColor")
    })
  })
})
