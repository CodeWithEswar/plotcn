import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  normalizeRangeAreaData,
  calculateRangeAreaDomain,
  type RangeAreaSeries,
} from "../../registry/recharts/area-range"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("RangeArea Core Architecture, Normalization & Safety Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numbers including zero and negatives", () => {
      assert.equal(isFiniteNumber(22), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-15.4), true)
      assert.equal(isFiniteNumber(1e5), true)
    })

    it("returns false for non-finite values and non-numbers", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("22"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber({}), false)
    })
  })

  describe("normalizeRangeAreaData & Interval Validation", () => {
    const series: RangeAreaSeries<any> = {
      lowerKey: "min",
      upperKey: "max",
      valueKey: "median",
      label: "Latency Range",
      lowerLabel: "Min",
      upperLabel: "Max",
      valueLabel: "Median",
    }

    it("correctly normalizes valid interval bounds with centerline", () => {
      const data = [{ time: "10:00", min: 18, max: 26, median: 22 }]
      const result = normalizeRangeAreaData(data, "time", series)

      assert.equal(result.rows.length, 1)
      const row = result.rows[0]
      assert.equal(row.__x, "10:00")
      assert.equal(row.__lower, 18)
      assert.equal(row.__upper, 26)
      assert.equal(row.__value, 22)
      assert.deepEqual(row.__range, [18, 26])
      assert.equal(row.__rangeState, "valid")
      assert.equal(row.__valueState, "valid")
      assert.equal(result.hasInvalidIntervals, false)
    })

    it("treats equal bounds (lower === upper) as valid zero-width intervals without artificial expansion", () => {
      const data = [{ time: "10:00", min: 20, max: 20, median: 20 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.equal(row.__rangeState, "zero-width")
      assert.deepEqual(row.__range, [20, 20])
      assert.equal(result.hasInvalidIntervals, false)
    })

    it("never silently swaps inverted bounds (lower > upper); treats interval as invalid and omits band", () => {
      const data = [{ time: "10:00", min: 28, max: 19, median: 23 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      // Must NOT swap to [19, 28]!
      assert.equal(row.__range, null)
      assert.equal(row.__rangeState, "invalid")
      assert.equal(row.__value, 23)
      assert.equal(row.__valueState, "valid")
      assert.equal(result.hasInvalidIntervals, true)
      assert.ok(result.invalidDetails?.includes("exceeds upper"))
    })

    it("truthfully gaps the band when lower bound is missing without substituting zero or domain min", () => {
      const data = [{ time: "10:00", min: null, max: 26, median: 22 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.equal(row.__lower, null)
      assert.equal(row.__upper, 26)
      assert.equal(row.__range, null)
      assert.equal(row.__rangeState, "missing")
      // Centerline remains independent
      assert.equal(row.__value, 22)
      assert.equal(row.__valueState, "valid")
    })

    it("truthfully gaps the band when upper bound is missing", () => {
      const data = [{ time: "10:00", min: 18, max: null, median: 22 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.equal(row.__upper, null)
      assert.equal(row.__range, null)
      assert.equal(row.__rangeState, "missing")
      assert.equal(row.__value, 22)
    })

    it("preserves range envelope when centerline is missing", () => {
      const data = [{ time: "10:00", min: 18, max: 26, median: null }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.deepEqual(row.__range, [18, 26])
      assert.equal(row.__rangeState, "valid")
      assert.equal(row.__value, null)
      assert.equal(row.__valueState, "missing")
    })

    it("supports range-only series configuration without valueKey (no fake midpoint derived)", () => {
      const rangeOnlySeries: RangeAreaSeries<any> = {
        lowerKey: "min",
        upperKey: "max",
        label: "Tolerance Band",
      }
      const data = [{ time: "10:00", min: 18, max: 26 }]
      const result = normalizeRangeAreaData(data, "time", rangeOnlySeries)

      const row = result.rows[0]
      assert.deepEqual(row.__range, [18, 26])
      assert.equal(row.__value, null)
      assert.equal(row.__valueState, "missing")
    })

    it("naturally supports negative-only intervals without forcing zero baseline", () => {
      const data = [{ time: "10:00", min: -12, max: -4, median: -7 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.deepEqual(row.__range, [-12, -4])
      assert.equal(row.__rangeState, "valid")
      assert.equal(row.__value, -7)
    })

    it("naturally supports cross-zero intervals", () => {
      const data = [{ time: "10:00", min: -5, max: 15, median: 4 }]
      const result = normalizeRangeAreaData(data, "time", series)

      const row = result.rows[0]
      assert.deepEqual(row.__range, [-5, 15])
      assert.equal(row.__rangeState, "valid")
    })

    it("never mutates input caller data records", () => {
      const originalDatum = Object.freeze({ time: "10:00", min: 18, max: 26, median: 22 })
      const data = Object.freeze([originalDatum])

      const result = normalizeRangeAreaData(data, "time", series)
      assert.equal(result.rows.length, 1)
      assert.equal(originalDatum.min, 18)
      assert.equal(originalDatum.max, 26)
    })
  })

  describe("calculateRangeAreaDomain", () => {
    it("computes an auto domain enclosing both bounds and centerline", () => {
      const rows: any[] = [
        { __lower: 10, __upper: 25, __value: 18 },
        { __lower: 15, __upper: 40, __value: 30 },
      ]
      const [domainMin, domainMax] = calculateRangeAreaDomain(rows)

      // Min must be <= 10 and max must be >= 40 with padding
      assert.ok(domainMin <= 10)
      assert.ok(domainMax >= 40)
    })

    it("never clamps or clips centerline if centerline falls outside range envelope", () => {
      const rows: any[] = [
        { __lower: 10, __upper: 25, __value: 60 }, // Centerline spike outside tolerance
      ]
      const [domainMin, domainMax] = calculateRangeAreaDomain(rows)

      assert.ok(domainMin <= 10)
      assert.ok(domainMax >= 60)
    })

    it("handles constant bounds safely with non-zero span", () => {
      const rows: any[] = [
        { __lower: 20, __upper: 20, __value: 20 },
      ]
      const [domainMin, domainMax] = calculateRangeAreaDomain(rows)

      assert.ok(domainMin < 20)
      assert.ok(domainMax > 20)
      assert.ok(Number.isFinite(domainMin))
      assert.ok(Number.isFinite(domainMax))
    })

    it("respects explicit domain overrides", () => {
      const rows: any[] = [
        { __lower: 10, __upper: 25, __value: 18 },
      ]
      const domain = calculateRangeAreaDomain(rows, [0, 100])
      assert.deepEqual(domain, [0, 100])
    })
  })

  describe("Color Roles Integration", () => {
    it("declares range envelope, centerline, and selection roles for area-range", () => {
      const roles1 = getChartColorRoles("area-range")
      const roles2 = getChartColorRoles("recharts-area-range")

      assert.equal(roles1.length, 3)
      assert.equal(roles2.length, 3)

      const roleIds = roles1.map((r) => r.id)
      assert.ok(roleIds.includes("range"))
      assert.ok(roleIds.includes("value"))
      assert.ok(roleIds.includes("selection"))
    })
  })
})
