import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  normalizePrismAreaData,
  calculatePrismAreaDomain,
  type PrismAreaSeries,
} from "../../registry/recharts/area-prism"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("PrismArea Core Architecture, Normalization, Baseline & Color Roles Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numeric values", () => {
      assert.equal(isFiniteNumber(12400), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-45.8), true)
      assert.equal(isFiniteNumber(1e6), true)
    })

    it("returns false for non-finite values, strings, and nullish inputs", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("12400"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber({}), false)
      assert.equal(isFiniteNumber([]), false)
    })
  })

  describe("normalizePrismAreaData & Missing Value Semantics", () => {
    type SampleDatum = {
      [key: string]: unknown
      date: string
      requests: number | null
    }

    const seriesConfig: PrismAreaSeries<SampleDatum> = {
      key: "requests",
      label: "API Requests",
    }

    it("normalizes observation records preserving coordinates and values", () => {
      const data: SampleDatum[] = [
        { date: "May 01", requests: 12400 },
        { date: "May 02", requests: 14800 },
      ]

      const normalized = normalizePrismAreaData(data, "date", seriesConfig)
      assert.equal(normalized.length, 2)
      assert.equal(normalized[0].__x, "May 01")
      assert.equal(normalized[0].__value, 12400)
      assert.equal(normalized[1].__x, "May 02")
      assert.equal(normalized[1].__value, 14800)
    })

    it("preserves missing observations as null without coercing to zero (null != 0)", () => {
      const gappyData: SampleDatum[] = [
        { date: "May 01", requests: 100 },
        { date: "May 02", requests: null },
        { date: "May 03", requests: undefined as any },
      ]

      const normalized = normalizePrismAreaData(gappyData, "date", seriesConfig, "gap")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, null)
      assert.notEqual(normalized[1].__value, 0)
      assert.equal(normalized[2].__value, null)
    })

    it("preserves genuine zero observations as 0 without treating them as falsy/missing", () => {
      const zeroData: SampleDatum[] = [
        { date: "May 01", requests: 0 },
        { date: "May 02", requests: 50 },
      ]

      const normalized = normalizePrismAreaData(zeroData, "date", seriesConfig)
      assert.equal(normalized[0].__value, 0)
      assert.notEqual(normalized[0].__value, null)
    })

    it("normalizes NaN and non-finite values to null", () => {
      const invalidData: SampleDatum[] = [
        { date: "May 01", requests: NaN },
        { date: "May 02", requests: Infinity },
        { date: "May 03", requests: 200 },
      ]

      const normalized = normalizePrismAreaData(invalidData, "date", seriesConfig)
      assert.equal(normalized[0].__value, null)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, 200)
    })

    it("supports forward carry policy when requested", () => {
      const carryData: SampleDatum[] = [
        { date: "May 01", requests: 120 },
        { date: "May 02", requests: null },
        { date: "May 03", requests: null },
      ]

      const normalized = normalizePrismAreaData(carryData, "date", seriesConfig, "carry")
      assert.equal(normalized[0].__value, 120)
      assert.equal(normalized[1].__value, 120) // carried forward
      assert.equal(normalized[2].__value, 120) // carried forward
    })

    it("guarantees caller data immutability", () => {
      const frozen = Object.freeze({ date: "May 01", requests: 500 })
      const normalized = normalizePrismAreaData([frozen], "date", seriesConfig)
      assert.equal(normalized[0].__value, 500)
      assert.equal(frozen.requests, 500)
    })
  })

  describe("calculatePrismAreaDomain & Baseline Semantics", () => {
    it("guarantees zero baseline is enclosed in the domain even when data is far above zero", () => {
      const highData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: 92 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 95 },
        { __x: "May 03", __index: 2, __raw: {}, __value: 104 },
      ]

      // When baseline is zero, min domain MUST be <= 0 to prevent artificial magnitude exaggeration
      const domain = calculatePrismAreaDomain(highData, "zero")
      assert.ok(domain[0] <= 0, `Domain min ${domain[0]} must include 0 for baseline="zero"`)
      assert.ok(domain[1] >= 104, `Domain max ${domain[1]} must enclose data max 104`)
    })

    it("does not force zero when baseline='domain-min', allowing tight focus on variation", () => {
      const highData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: 92 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 104 },
      ]

      const domain = calculatePrismAreaDomain(highData, "domain-min")
      // Domain min should be around 92 - pad (~91), NOT 0!
      assert.ok(domain[0] > 80, `Domain min ${domain[0]} should be close to 92 for baseline="domain-min"`)
      assert.ok(domain[1] >= 104)
    })

    it("encloses explicit numeric baseline (e.g. target=100) in the domain", () => {
      const belowTargetData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: 40 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 65 },
      ]

      const domain = calculatePrismAreaDomain(belowTargetData, 100)
      assert.ok(domain[0] <= 40)
      assert.ok(domain[1] >= 100, `Domain max ${domain[1]} must safely enclose target baseline 100`)
    })

    it("safely handles negative-only and mixed-sign values with zero baseline", () => {
      const mixedData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: -50 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 30 },
      ]

      const domain = calculatePrismAreaDomain(mixedData, "zero")
      assert.ok(domain[0] <= -50)
      assert.ok(domain[1] >= 30)
      assert.ok(domain[0] <= 0 && domain[1] >= 0)
    })

    it("returns safe non-zero span for constant values", () => {
      const constantData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: 100 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 100 },
      ]

      const domain = calculatePrismAreaDomain(constantData, "domain-min")
      assert.notEqual(domain[0], domain[1])
      assert.ok(domain[0] < 100)
      assert.ok(domain[1] > 100)
    })

    it("safely handles all-zero data without division by zero or NaN span", () => {
      const zeroData = [
        { __x: "May 01", __index: 0, __raw: {}, __value: 0 },
        { __x: "May 02", __index: 1, __raw: {}, __value: 0 },
      ]

      const domain = calculatePrismAreaDomain(zeroData, "zero")
      assert.notEqual(domain[0], domain[1])
      assert.equal(domain[0], -10)
      assert.equal(domain[1], 10)
    })

    it("respects explicit numeric domain override", () => {
      const data = [{ __x: "May 01", __index: 0, __raw: {}, __value: 50 }]
      const domain = calculatePrismAreaDomain(data, "zero", [0, 500])
      assert.deepEqual(domain, [0, 500])
    })

    it("returns fallback [0, 100] for empty data", () => {
      assert.deepEqual(calculatePrismAreaDomain([], "zero"), [0, 100])
    })
  })

  describe("Declarative Color Roles Integration", () => {
    it("declares stroke, fill, and selection color roles for area-prism", () => {
      const roles = getChartColorRoles("area-prism")
      assert.equal(roles.length, 3)

      const strokeRole = roles.find((r) => r.id === "stroke")
      assert.ok(strokeRole)
      assert.equal(strokeRole.propName, "color")
      assert.equal(strokeRole.defaultToken, "var(--chart-1)")

      const fillRole = roles.find((r) => r.id === "fill")
      assert.ok(fillRole)
      assert.equal(fillRole.propName, "fillColor")
      assert.equal(fillRole.defaultToken, "var(--chart-1)")

      const selectionRole = roles.find((r) => r.id === "selection")
      assert.ok(selectionRole)
      assert.equal(selectionRole.propName, "selectionColor")
      assert.equal(selectionRole.defaultToken, "var(--chart-selection)")
    })

    it("also resolves matching color roles for recharts-area-prism alias", () => {
      const roles = getChartColorRoles("recharts-area-prism")
      assert.equal(roles.length, 3)
      assert.equal(roles[0].propName, "color")
      assert.equal(roles[1].propName, "fillColor")
      assert.equal(roles[2].propName, "selectionColor")
    })
  })
})
