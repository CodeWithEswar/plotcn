import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  resolveStackFlowSeries,
  normalizeStackFlowData,
  calculateStackFlowDomain,
  type StackFlowSeries,
  type NormalizedStackFlowRow,
} from "../../registry/recharts/area-stack-flow"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("StackFlowArea Core Architecture, Additive Math, Normalization & Safe Domain Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numbers including zero", () => {
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

  describe("resolveStackFlowSeries & Deterministic Identity", () => {
    const rawSeries: StackFlowSeries<any>[] = [
      { key: "web", label: "Web Requests" },
      { key: "ios", label: "iOS App" },
      { key: "android", label: "Android App" },
    ]

    it("assigns semantic chart tokens deterministically by original array index", () => {
      const resolved = resolveStackFlowSeries(rawSeries)
      assert.equal(resolved.length, 3)

      assert.equal(resolved[0].key, "web")
      assert.equal(resolved[0].originalIndex, 0)
      assert.equal(resolved[0].color, "var(--chart-1)")

      assert.equal(resolved[1].key, "ios")
      assert.equal(resolved[1].originalIndex, 1)
      assert.equal(resolved[1].color, "var(--chart-2)")

      assert.equal(resolved[2].key, "android")
      assert.equal(resolved[2].originalIndex, 2)
      assert.equal(resolved[2].color, "var(--chart-3)")
    })

    it("guarantees deterministic identity: hiding iOS NEVER reassigns Android's color token", () => {
      const allResolved = resolveStackFlowSeries(rawSeries)
      // When iOS is toggled off, remaining visible series are Web (0) and Android (2)
      const hiddenKeys = new Set(["ios"])
      const visibleResolved = allResolved.filter((s) => !hiddenKeys.has(s.key))

      assert.equal(visibleResolved.length, 2)
      assert.equal(visibleResolved[0].key, "web")
      assert.equal(visibleResolved[0].color, "var(--chart-1)")

      // Crucial test: Android MUST KEEP var(--chart-3), NOT shift to var(--chart-2)
      assert.equal(visibleResolved[1].key, "android")
      assert.equal(visibleResolved[1].originalIndex, 2)
      assert.equal(visibleResolved[1].color, "var(--chart-3)")
    })

    it("respects explicit series color overrides", () => {
      const customSeries: StackFlowSeries<any>[] = [
        { key: "web", label: "Web", color: "#2563eb" },
        { key: "ios", label: "iOS" },
        { key: "android", label: "Android", color: "#7c3aed" },
      ]
      const resolved = resolveStackFlowSeries(customSeries)
      assert.equal(resolved[0].color, "#2563eb")
      assert.equal(resolved[1].color, "var(--chart-2)")
      assert.equal(resolved[2].color, "#7c3aed")
    })

    it("cycles tokens deterministically beyond 8 series without error", () => {
      const manySeries = Array.from({ length: 10 }, (_, i) => ({
        key: `layer_${i}`,
        label: `Layer ${i}`,
      }))
      const resolved = resolveStackFlowSeries(manySeries)
      assert.equal(resolved[8].color, "var(--chart-1)")
      assert.equal(resolved[9].color, "var(--chart-2)")
    })
  })

  describe("normalizeStackFlowData — Additive Semantics & Truthful Policy", () => {
    const series = resolveStackFlowSeries<any>([
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "android", label: "Android" },
    ])
    const allVisible = new Set(["web", "ios", "android"])

    it("correctly calculates additive stack totals for valid positive data", () => {
      const data = [
        { month: "Jan", web: 100, ios: 80, android: 90 },
        { month: "Feb", web: 120, ios: 110, android: 130 },
      ]
      const res = normalizeStackFlowData(data, "month", series, allVisible, "gap")
      assert.equal(res.hasNegativeValues, false)
      assert.equal(res.rows.length, 2)

      // Jan: 100 + 80 + 90 = 270
      assert.equal(res.rows[0].__total, 270)
      assert.equal(res.rows[0].__isComplete, true)
      assert.equal(res.rows[0].__abs_web, 100)
      assert.equal(res.rows[0].__abs_ios, 80)
      assert.equal(res.rows[0].__abs_android, 90)

      // Feb: 120 + 110 + 130 = 360
      assert.equal(res.rows[1].__total, 360)
      assert.equal(res.rows[1].__isComplete, true)
    })

    it("truthfully excludes hidden series from stack total", () => {
      const data = [{ month: "Jan", web: 100, ios: 80, android: 90 }]
      // iOS is hidden
      const visibleWithoutIos = new Set(["web", "android"])
      const res = normalizeStackFlowData(data, "month", series, visibleWithoutIos, "gap")

      // Total of visible series: 100 + 90 = 190
      assert.equal(res.rows[0].__total, 190)
      assert.equal(res.rows[0].__isComplete, true)
    })

    it("rejects negative values and flags them without silent clamping", () => {
      const invalidData = [
        { month: "Jan", web: 100, ios: -20, android: 90 },
      ]
      const res = normalizeStackFlowData(invalidData, "month", series, allVisible, "gap")
      assert.equal(res.hasNegativeValues, true)
      assert.match(res.negativeErrorDetails!, /requires non-negative additive contributions/)
      assert.match(res.negativeErrorDetails!, /-20/)
      assert.equal(res.rows.length, 0)
    })

    it("preserves zero as a valid contribution distinct from missing (0 != null)", () => {
      const dataWithZero = [
        { month: "Jan", web: 100, ios: 0, android: 90 },
      ]
      const res = normalizeStackFlowData(dataWithZero, "month", series, allVisible, "gap")
      assert.equal(res.hasNegativeValues, false)
      assert.equal(res.rows[0].__isComplete, true)
      assert.equal(res.rows[0].__values.ios, 0)
      assert.equal(res.rows[0].__total, 190) // 100 + 0 + 90 = 190, complete!
    })

    it("under default 'gap' policy: marks incomplete stack and does not report fake total", () => {
      const dataWithNull = [
        { month: "Jan", web: 100, ios: null, android: 90 },
      ]
      const res = normalizeStackFlowData(dataWithNull, "month", series, allVisible, "gap")
      assert.equal(res.hasNegativeValues, false)
      assert.equal(res.rows[0].__isComplete, false)
      assert.equal(res.rows[0].__values.ios, null)
      assert.equal(res.rows[0].__abs_ios, null)
      // Total MUST be null to prevent misleading partial total reporting
      assert.equal(res.rows[0].__total, null)
    })

    it("under opt-in 'zero' policy: coerces null to 0 and treats stack as complete", () => {
      const dataWithNull = [
        { month: "Jan", web: 100, ios: null, android: 90 },
      ]
      const res = normalizeStackFlowData(dataWithNull, "month", series, allVisible, "zero")
      assert.equal(res.hasNegativeValues, false)
      assert.equal(res.rows[0].__isComplete, true)
      assert.equal(res.rows[0].__values.ios, 0)
      assert.equal(res.rows[0].__abs_ios, 0)
      assert.equal(res.rows[0].__total, 190)
    })

    it("caller data array and objects are never mutated", () => {
      const rawData = Object.freeze([
        Object.freeze({ month: "Jan", web: 100, ios: 80, android: 90 }),
      ])
      const res = normalizeStackFlowData(rawData, "month", series, allVisible, "gap")
      assert.equal(res.rows.length, 1)
      assert.equal(rawData[0].web, 100)
    })
  })

  describe("normalizeStackFlowData — Percent Mode & Zero-Total Protection", () => {
    const series = resolveStackFlowSeries<any>([
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "android", label: "Android" },
    ])
    const allVisible = new Set(["web", "ios", "android"])

    it("computes normalized percentages summing to 100%", () => {
      const data = [
        { month: "Jan", web: 50, ios: 30, android: 20 },
      ]
      const res = normalizeStackFlowData(data, "month", series, allVisible, "gap")
      const row = res.rows[0]
      assert.equal(row.__total, 100)
      assert.equal(row.__pct_web, 50)
      assert.equal(row.__pct_ios, 30)
      assert.equal(row.__pct_android, 20)
      assert.equal((row.__pct_web! + row.__pct_ios! + row.__pct_android!), 100)
    })

    it("safely handles zero-total observation (0+0+0=0) without NaN or divide-by-zero", () => {
      const zeroData = [
        { month: "Jan", web: 0, ios: 0, android: 0 },
      ]
      const res = normalizeStackFlowData(zeroData, "month", series, allVisible, "gap")
      const row = res.rows[0]
      assert.equal(row.__total, 0)
      assert.equal(row.__pct_web, 0)
      assert.equal(row.__pct_ios, 0)
      assert.equal(row.__pct_android, 0)
      assert.equal(Number.isNaN(row.__pct_web), false)
      assert.equal(Number.isNaN(row.__pct_ios), false)
      assert.equal(Number.isNaN(row.__pct_android), false)
    })
  })

  describe("calculateStackFlowDomain", () => {
    const dummyRows: NormalizedStackFlowRow[] = [
      {
        __x: "Jan",
        __index: 0,
        __raw: {},
        __values: {},
        __percentValues: {},
        __total: 100,
        __isComplete: true,
      },
      {
        __x: "Feb",
        __index: 1,
        __raw: {},
        __values: {},
        __percentValues: {},
        __total: 200,
        __isComplete: true,
      },
    ]

    it("returns strictly [0, 100] in percent mode", () => {
      const domain = calculateStackFlowDomain(dummyRows, "percent")
      assert.deepEqual(domain, [0, 100])
    })

    it("anchors at 0 and adds safe padding in absolute mode", () => {
      const domain = calculateStackFlowDomain(dummyRows, "absolute")
      assert.equal(domain[0], 0)
      // Max total is 200, padded with ceil(200 * 1.08) = 216
      assert.equal(domain[1], 216)
    })

    it("respects explicit numeric domain in absolute mode", () => {
      const domain = calculateStackFlowDomain(dummyRows, "absolute", [0, 500])
      assert.deepEqual(domain, [0, 500])
    })

    it("handles empty rows safely", () => {
      const domain = calculateStackFlowDomain([], "absolute")
      assert.deepEqual(domain, [0, 100])
    })
  })

  describe("Color Roles Registration", () => {
    it("returns registered roles for area-stack-flow", () => {
      const roles = getChartColorRoles("area-stack-flow")
      assert.ok(roles.length >= 3)
      const roleIds = roles.map((r) => r.id)
      assert.ok(roleIds.includes("web"))
      assert.ok(roleIds.includes("ios"))
      assert.ok(roleIds.includes("android"))
      assert.ok(roleIds.includes("selection"))
    })

    it("returns registered roles for recharts-area-stack-flow", () => {
      const roles = getChartColorRoles("recharts-area-stack-flow")
      assert.ok(roles.length >= 3)
      const roleIds = roles.map((r) => r.id)
      assert.ok(roleIds.includes("web"))
      assert.ok(roleIds.includes("ios"))
      assert.ok(roleIds.includes("android"))
      assert.ok(roleIds.includes("selection"))
    })
  })
})
