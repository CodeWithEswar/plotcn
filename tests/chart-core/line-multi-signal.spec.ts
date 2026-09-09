import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  resolveMultiSignalSeries,
  normalizeMultiSignalData,
  calculateMultiSignalDomain,
  type MultiSignalSeries,
} from "../../registry/recharts/line-multi-signal"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("MultiSignalLine Core Architecture, Normalization, Safe Domain & Identity Model Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numeric values", () => {
      assert.equal(isFiniteNumber(120), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-45.8), true)
      assert.equal(isFiniteNumber(1e6), true)
    })

    it("returns false for non-finite values and non-numbers", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("120"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber({}), false)
    })
  })

  describe("resolveMultiSignalSeries & Deterministic Identity", () => {
    const rawSeries: MultiSignalSeries<any>[] = [
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "android", label: "Android" },
    ]

    it("resolves default palette tokens deterministically based on original index", () => {
      const resolved = resolveMultiSignalSeries(rawSeries)
      assert.equal(resolved.length, 3)

      assert.equal(resolved[0].key, "web")
      assert.equal(resolved[0].originalIndex, 0)
      assert.equal(resolved[0].color, "var(--chart-1, #3b82f6)")

      assert.equal(resolved[1].key, "ios")
      assert.equal(resolved[1].originalIndex, 1)
      assert.equal(resolved[1].color, "var(--chart-2, #10b981)")

      assert.equal(resolved[2].key, "android")
      assert.equal(resolved[2].originalIndex, 2)
      assert.equal(resolved[2].color, "var(--chart-3, #f59e0b)")
    })

    it("guarantees deterministic identity: hiding iOS NEVER reassigns Android's color token", () => {
      const allResolved = resolveMultiSignalSeries(rawSeries)
      // When user hides iOS, the remaining visible series are Web (0) and Android (2)
      const hiddenKeys = new Set(["ios"])
      const visibleResolved = allResolved.filter((s) => !hiddenKeys.has(s.key))

      assert.equal(visibleResolved.length, 2)
      assert.equal(visibleResolved[0].key, "web")
      assert.equal(visibleResolved[0].color, "var(--chart-1, #3b82f6)")

      // Crucial test: Android MUST KEEP --chart-3, NOT shift to --chart-2
      assert.equal(visibleResolved[1].key, "android")
      assert.equal(visibleResolved[1].originalIndex, 2)
      assert.equal(visibleResolved[1].color, "var(--chart-3, #f59e0b)")
    })

    it("respects explicit series color overrides", () => {
      const customSeries: MultiSignalSeries<any>[] = [
        { key: "web", label: "Web", color: "#2563eb" },
        { key: "ios", label: "iOS" }, // fallback to theme token --chart-2
        { key: "android", label: "Android", color: "#7c3aed" },
      ]
      const resolved = resolveMultiSignalSeries(customSeries)
      assert.equal(resolved[0].color, "#2563eb")
      assert.equal(resolved[1].color, "var(--chart-2, #10b981)")
      assert.equal(resolved[2].color, "#7c3aed")
    })

    it("supports custom strokeStyle per series", () => {
      const styledSeries: MultiSignalSeries<any>[] = [
        { key: "web", label: "Web", strokeStyle: "solid" },
        { key: "ios", label: "iOS", strokeStyle: "dashed" },
        { key: "android", label: "Android", strokeStyle: "dotted" },
      ]
      const resolved = resolveMultiSignalSeries(styledSeries)
      assert.equal(resolved[0].strokeStyle, "solid")
      assert.equal(resolved[1].strokeStyle, "dashed")
      assert.equal(resolved[2].strokeStyle, "dotted")
    })

    it("cycles tokens deterministically beyond 8 series without throwing", () => {
      const manySeries = Array.from({ length: 12 }, (_, i) => ({
        key: `s_${i}`,
        label: `Series ${i}`,
      }))
      const resolved = resolveMultiSignalSeries(manySeries)
      assert.equal(resolved.length, 12)
      assert.equal(resolved[8].color, "var(--chart-1, #3b82f6)")
      assert.equal(resolved[9].color, "var(--chart-2, #10b981)")
    })
  })

  describe("normalizeMultiSignalData & Independent Missing Values", () => {
    const seriesConfig: MultiSignalSeries<any>[] = [
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "android", label: "Android" },
    ]

    it("normalizes multi-series records preserving observations and raw references", () => {
      const sample = [
        { month: "Jan", web: 120, ios: 90, android: 100 },
        { month: "Feb", web: 136, ios: 105, android: 121 },
      ]
      const normalized = normalizeMultiSignalData(sample, "month", seriesConfig)
      assert.equal(normalized.length, 2)
      assert.equal(normalized[0].__x, "Jan")
      assert.equal(normalized[0].__index, 0)
      assert.equal(normalized[0].web, 120)
      assert.equal(normalized[0].ios, 90)
      assert.equal(normalized[0].android, 100)
    })

    it("handles missing data independently per series without null-to-zero coercion (null != 0)", () => {
      const gappyData = [
        { month: "Jan", web: 100, ios: 90, android: 95 },
        { month: "Feb", web: 110, ios: null, android: 103 },
        { month: "Mar", web: null, ios: 121, android: 115 },
        { month: "Apr", web: 130, ios: 128, android: undefined },
      ]
      const normalized = normalizeMultiSignalData(gappyData, "month", seriesConfig, "gap")

      // Feb: Web is 110, iOS is null, Android is 103
      assert.equal(normalized[1].web, 110)
      assert.equal(normalized[1].ios, null)
      assert.equal(normalized[1].android, 103)

      // Mar: Web is null, iOS is 121, Android is 115
      assert.equal(normalized[2].web, null)
      assert.equal(normalized[2].ios, 121)
      assert.equal(normalized[2].android, 115)

      // Apr: Android is undefined -> normalized to null
      assert.equal(normalized[3].android, null)
    })

    it("converts NaN and non-finite values to null per series", () => {
      const invalidData = [
        { month: "Jan", web: NaN, ios: Infinity, android: 100 },
      ]
      const normalized = normalizeMultiSignalData(invalidData, "month", seriesConfig, "gap")
      assert.equal(normalized[0].web, null)
      assert.equal(normalized[0].ios, null)
      assert.equal(normalized[0].android, 100)
    })

    it("supports 'carry' policy forward filling independent series", () => {
      const carryData = [
        { month: "Jan", web: 100, ios: 90 },
        { month: "Feb", web: null, ios: 95 },
      ]
      const normalized = normalizeMultiSignalData(carryData, "month", seriesConfig, "carry")
      assert.equal(normalized[0].web, 100)
      assert.equal(normalized[1].web, 100) // carried forward
      assert.equal(normalized[1].ios, 95)
    })

    it("guarantees caller data immutability", () => {
      const original = [{ month: "Jan", web: 100, ios: 90 }]
      const frozen = Object.freeze({ month: "Jan", web: 100, ios: 90 })
      const normalized = normalizeMultiSignalData([frozen], "month", seriesConfig)
      assert.equal(normalized[0].web, 100)
      assert.deepEqual(original, [{ month: "Jan", web: 100, ios: 90 }])
    })
  })

  describe("calculateMultiSignalDomain & Visible Series Policy", () => {
    const resolvedSeries = resolveMultiSignalSeries([
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "outlier", label: "Outlier" },
    ])

    const data = [
      { __x: "Jan", __index: 0, __raw: {}, web: 100, ios: 90, outlier: 1000 },
      { __x: "Feb", __index: 1, __raw: {}, web: 120, ios: 110, outlier: 1500 },
    ]

    it("calculates domain across all visible series when none are hidden", () => {
      const domain = calculateMultiSignalDomain(data, resolvedSeries)
      assert.ok(domain[0] <= 90)
      assert.ok(domain[1] >= 1500)
    })

    it("excludes hidden series from active Y domain so remaining signals become readable", () => {
      // Hide the outlier series
      const visibleOnly = resolvedSeries.filter((s) => s.key !== "outlier")
      const domain = calculateMultiSignalDomain(data, visibleOnly)
      // Max should now be around 120 + padding, NOT 1500!
      assert.ok(domain[0] <= 90)
      assert.ok(domain[1] < 200)
    })

    it("returns safe non-zero span for constant values", () => {
      const flatData = [
        { __x: "Jan", __index: 0, __raw: {}, web: 50, ios: 50 },
        { __x: "Feb", __index: 1, __raw: {}, web: 50, ios: 50 },
      ]
      const domain = calculateMultiSignalDomain(flatData, resolvedSeries.slice(0, 2))
      assert.notEqual(domain[0], domain[1])
      assert.ok(domain[0] < 50)
      assert.ok(domain[1] > 50)
    })

    it("safely handles negative and mixed values", () => {
      const negativeData = [
        { __x: "Jan", __index: 0, __raw: {}, web: -50, ios: -30 },
        { __x: "Feb", __index: 1, __raw: {}, web: 20, ios: 10 },
      ]
      const domain = calculateMultiSignalDomain(negativeData, resolvedSeries.slice(0, 2))
      assert.ok(domain[0] < -50)
      assert.ok(domain[1] > 20)
    })

    it("returns safe fallback when all series are hidden", () => {
      const domain = calculateMultiSignalDomain(data, [])
      assert.deepEqual(domain, [0, 100])
    })
  })

  describe("Declarative Color Roles Integration", () => {
    it("declares color roles for line-multi-signal", () => {
      const roles = getChartColorRoles("line-multi-signal")
      assert.ok(roles.length >= 3)
      const roleProps = roles.map((r) => r.propName)
      assert.ok(roleProps.includes("color_web"))
      assert.ok(roleProps.includes("color_ios"))
      assert.ok(roleProps.includes("color_android"))
    })
  })
})
