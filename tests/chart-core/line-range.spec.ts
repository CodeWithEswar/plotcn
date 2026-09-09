import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  normalizeRangeLineData,
  calculateRangeDomain,
} from "../../registry/recharts/line-range"

describe("RangeLine Data Normalization & Domain Calculations", () => {
  const sampleData = [
    { period: "Q1", forecast: 100, lower: 80, upper: 120 },
    { period: "Q2", forecast: 140, lower: 110, upper: 160 },
    { period: "Q3", forecast: 160, lower: 130, upper: 190 },
  ]

  describe("normalizeRangeLineData", () => {
    it("normalizes valid central values and lower/upper intervals", () => {
      const normalized = normalizeRangeLineData(sampleData, "period", "forecast", "lower", "upper")
      assert.equal(normalized.length, 3)
      assert.equal(normalized[0].__x, "Q1")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[0].__lower, 80)
      assert.equal(normalized[0].__upper, 120)
      assert.deepEqual(normalized[0].__range, [80, 120])
    })

    it("preserves outliers where the central value is outside [lower, upper]", () => {
      const outlierData = [
        { period: "Day 1", actual: 250, minSLA: 50, maxSLA: 200 }, // Outlier above
        { period: "Day 2", actual: 30, minSLA: 50, maxSLA: 200 },  // Outlier below
      ]
      const normalized = normalizeRangeLineData(outlierData, "period", "actual", "minSLA", "maxSLA")
      assert.equal(normalized[0].__value, 250)
      assert.deepEqual(normalized[0].__range, [50, 200])
      assert.equal(normalized[1].__value, 30)
      assert.deepEqual(normalized[1].__range, [50, 200])
    })

    it("drops invalid inverted interval (lower > upper) without crashing or mutating", () => {
      const invertedData = [
        { period: "Jan", val: 50, low: 100, high: 40 }, // Inverted!
      ]
      const normalized = normalizeRangeLineData(invertedData, "period", "val", "low", "high")
      assert.equal(normalized[0].__value, 50)
      assert.equal(normalized[0].__lower, null)
      assert.equal(normalized[0].__upper, null)
      assert.equal(normalized[0].__range, null)
    })

    it("handles partial missing bounds safely", () => {
      const partialData = [
        { period: "A", val: 50, low: 30, high: null },
        { period: "B", val: 60, low: null, high: 80 },
        { period: "C", val: null, low: 40, high: 90 },
      ]
      const normalized = normalizeRangeLineData(partialData, "period", "val", "low", "high")
      // A: missing upper -> range is null
      assert.equal(normalized[0].__range, null)
      assert.equal(normalized[0].__value, 50)
      // B: missing lower -> range is null
      assert.equal(normalized[1].__range, null)
      assert.equal(normalized[1].__value, 60)
      // C: missing central value -> valid range remains
      assert.equal(normalized[2].__value, null)
      assert.deepEqual(normalized[2].__range, [40, 90])
    })

    it("never mutates the caller's input array or objects", () => {
      const original = [
        { period: "T1", forecast: 100, lower: 80, upper: 120 },
      ]
      const frozenOriginal = JSON.parse(JSON.stringify(original))
      normalizeRangeLineData(original, "period", "forecast", "lower", "upper")
      assert.deepEqual(original, frozenOriginal)
    })
  })

  describe("calculateRangeDomain", () => {
    it("computes honest shared domain covering both central values and interval limits", () => {
      const normalized = normalizeRangeLineData(sampleData, "period", "forecast", "lower", "upper")
      const [domainMin, domainMax] = calculateRangeDomain(normalized, "auto")
      assert.ok(domainMin <= 80, `Expected domainMin <= 80, got ${domainMin}`)
      assert.ok(domainMax >= 190, `Expected domainMax >= 190, got ${domainMax}`)
    })

    it("honors explicit numeric domain overrides", () => {
      const normalized = normalizeRangeLineData(sampleData, "period", "forecast", "lower", "upper")
      const domain = calculateRangeDomain(normalized, [0, 500])
      assert.deepEqual(domain, [0, 500])
    })

    it("handles empty data gracefully with fallback domain", () => {
      const domain = calculateRangeDomain([], "auto")
      assert.deepEqual(domain, [0, 100])
    })
  })
})
