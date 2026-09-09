import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  resolvePercentStreamSeries,
  normalizePercentStreamData,
  type PercentStreamSeries,
  type NormalizedPercentStreamRow,
} from "../../registry/recharts/area-percent-stream"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("PercentStreamArea Core Architecture, Normalization & Safety Suite", () => {
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

  describe("resolvePercentStreamSeries & Deterministic Identity", () => {
    const rawSeries: PercentStreamSeries<any>[] = [
      { key: "web", label: "Web Platform" },
      { key: "ios", label: "iOS App" },
      { key: "android", label: "Android App" },
    ]

    it("assigns semantic chart tokens deterministically by canonical array index", () => {
      const resolved = resolvePercentStreamSeries(rawSeries)
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

    it("preserves explicit custom color overrides over default palette tokens", () => {
      const customSeries: PercentStreamSeries<any>[] = [
        { key: "web", label: "Web", color: "#2563eb" },
        { key: "ios", label: "iOS" },
        { key: "android", label: "Android", color: "#f59e0b" },
      ]
      const resolved = resolvePercentStreamSeries(customSeries)

      assert.equal(resolved[0].color, "#2563eb")
      assert.equal(resolved[1].color, "var(--chart-2)")
      assert.equal(resolved[2].color, "#f59e0b")
    })

    it("guarantees deterministic identity: hiding iOS NEVER reassigns Android's color token", () => {
      const allResolved = resolvePercentStreamSeries(rawSeries)
      const visibleKeys = new Set(["web", "android"])
      const visibleResolved = allResolved.filter((s) => visibleKeys.has(s.key))

      assert.equal(visibleResolved.length, 2)
      assert.equal(visibleResolved[0].key, "web")
      assert.equal(visibleResolved[0].color, "var(--chart-1)")
      assert.equal(visibleResolved[1].key, "android")
      assert.equal(visibleResolved[1].color, "var(--chart-3)")
    })
  })

  describe("normalizePercentStreamData & 100% Normalized Math", () => {
    const rawSeries: PercentStreamSeries<any>[] = [
      { key: "web", label: "Web" },
      { key: "ios", label: "iOS" },
      { key: "android", label: "Android" },
    ]
    const resolvedSeries = resolvePercentStreamSeries(rawSeries)
    const allVisible = new Set(["web", "ios", "android"])

    it("correctly derives proportional 0–100% shares from raw additive quantities", () => {
      const data = [{ month: "Jan", web: 500, ios: 300, android: 200 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      assert.equal(result.hasNegativeValues, false)
      assert.equal(result.rows.length, 1)

      const row = result.rows[0]
      assert.equal(row.__visibleRawTotal, 1000)
      assert.equal(row.__state, "valid")

      // 500/1000 = 50%, 300/1000 = 30%, 200/1000 = 20%
      assert.equal(row.__shares["web"], 50)
      assert.equal(row.__shares["ios"], 30)
      assert.equal(row.__shares["android"], 20)

      // Recharts flattened area keys
      assert.equal(row["__share_web"], 50)
      assert.equal(row["__share_ios"], 30)
      assert.equal(row["__share_android"], 20)
    })

    it("guarantees geometry sum strictly equals 100% across floating point precision", () => {
      const data = [{ month: "Jan", web: 1, ios: 1, android: 1 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      const row = result.rows[0]
      const sum = row.__shares["web"]! + row.__shares["ios"]! + row.__shares["android"]!
      assert.ok(Math.abs(sum - 100) < 1e-6, `Sum was ${sum}, expected ~100`)
    })

    it("proves magnitude invariance: 1,000 total vs 10,000 total produce identical geometry", () => {
      const data = [
        { month: "Jan", web: 500, ios: 300, android: 200 },
        { month: "Feb", web: 5000, ios: 3000, android: 2000 },
      ]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      const rowJan = result.rows[0]
      const rowFeb = result.rows[1]

      // Jan raw total is 1,000; Feb raw total is 10,000
      assert.equal(rowJan.__visibleRawTotal, 1000)
      assert.equal(rowFeb.__visibleRawTotal, 10000)

      // Both normalize to identical shares
      assert.equal(rowJan.__shares["web"], 50)
      assert.equal(rowFeb.__shares["web"], 50)
      assert.equal(rowJan.__shares["ios"], 30)
      assert.equal(rowFeb.__shares["ios"], 30)
      assert.equal(rowJan.__shares["android"], 20)
      assert.equal(rowFeb.__shares["android"], 20)
    })

    it("truthfully handles known zero contributors (0 != null)", () => {
      const data = [{ month: "Jan", web: 80, ios: 20, android: 0 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      const row = result.rows[0]
      assert.equal(row.__state, "valid")
      assert.equal(row.__visibleRawTotal, 100)
      assert.equal(row.__shares["web"], 80)
      assert.equal(row.__shares["ios"], 20)
      assert.equal(row.__shares["android"], 0)
    })

    it("safely handles zero total (0/0/0) without NaN or Infinity", () => {
      const data = [{ month: "Jan", web: 0, ios: 0, android: 0 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      const row = result.rows[0]
      assert.equal(row.__state, "zero-total")
      assert.equal(row.__visibleRawTotal, 0)

      // Shares are 0, avoiding NaN or Infinity
      assert.equal(row.__shares["web"], 0)
      assert.equal(row.__shares["ios"], 0)
      assert.equal(row.__shares["android"], 0)
      assert.equal(Number.isNaN(row.__shares["web"]), false)
    })

    it("enforces default 'gap' missing policy: incomplete composition never normalizes partial subtotals", () => {
      const data = [{ month: "Jan", web: 80, ios: null, android: 20 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible, "gap")

      const row = result.rows[0]
      assert.equal(row.__state, "incomplete")
      assert.equal(row.__visibleRawTotal, null)

      // Shares are null so geometry breaks honestly
      assert.equal(row.__shares["web"], null)
      assert.equal(row.__shares["ios"], null)
      assert.equal(row.__shares["android"], null)

      // Raw values are preserved
      assert.equal(row.__rawValues["web"], 80)
      assert.equal(row.__rawValues["ios"], null)
      assert.equal(row.__rawValues["android"], 20)
    })

    it("supports explicit 'zero' missing policy when configured", () => {
      const data = [{ month: "Jan", web: 80, ios: null, android: 20 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible, "zero")

      const row = result.rows[0]
      assert.equal(row.__state, "valid")
      assert.equal(row.__visibleRawTotal, 100)
      assert.equal(row.__shares["web"], 80)
      assert.equal(row.__shares["ios"], 0)
      assert.equal(row.__shares["android"], 20)
    })

    it("rejects negative values in V1 with explicit error details without silent clamping", () => {
      const data = [{ month: "Jan", web: 80, ios: -10, android: 30 }]
      const result = normalizePercentStreamData(data, "month", resolvedSeries, allVisible)

      assert.equal(result.hasNegativeValues, true)
      assert.equal(result.rows.length, 0)
      assert.ok(result.negativeErrorDetails?.includes("negative value (-10)"))
      assert.ok(result.negativeErrorDetails?.includes('"iOS"'))
    })

    it("implements Model A: Visible-Series Re-Normalization when series is hidden", () => {
      // 50 + 30 + 20 = 100
      const data = [{ month: "Jan", web: 50, ios: 30, android: 20 }]

      // Hide Android -> Visible total = 50 + 30 = 80
      const visibleWithoutAndroid = new Set(["web", "ios"])
      const result = normalizePercentStreamData(data, "month", resolvedSeries, visibleWithoutAndroid)

      const row = result.rows[0]
      assert.equal(row.__visibleRawTotal, 80)

      // 50 / 80 = 62.5%, 30 / 80 = 37.5% -> Sum = 100%
      assert.equal(row.__shares["web"], 62.5)
      assert.equal(row.__shares["ios"], 37.5)
      assert.equal(row.__shares["android"], null)
    })

    it("normalizes a single remaining visible series to 100% truthfully", () => {
      const data = [{ month: "Jan", web: 50, ios: 30, android: 20 }]
      const onlyWeb = new Set(["web"])
      const result = normalizePercentStreamData(data, "month", resolvedSeries, onlyWeb)

      const row = result.rows[0]
      assert.equal(row.__visibleRawTotal, 50)
      assert.equal(row.__shares["web"], 100)
      assert.equal(row.__shares["ios"], null)
      assert.equal(row.__shares["android"], null)
    })

    it("safely handles all series hidden without crashing", () => {
      const data = [{ month: "Jan", web: 50, ios: 30, android: 20 }]
      const noneVisible = new Set<string>()
      const result = normalizePercentStreamData(data, "month", resolvedSeries, noneVisible)

      const row = result.rows[0]
      assert.equal(row.__shares["web"], null)
      assert.equal(row.__shares["ios"], null)
      assert.equal(row.__shares["android"], null)
    })

    it("preserves caller data immutability: input arrays and objects are never modified", () => {
      const originalRecord = Object.freeze({ month: "Jan", web: 500, ios: 300, android: 200 })
      const originalData = Object.freeze([originalRecord])

      const result = normalizePercentStreamData(
        originalData as any,
        "month",
        resolvedSeries,
        allVisible
      )

      assert.equal(result.rows.length, 1)
      assert.equal((originalRecord as any)["__shares"], undefined)
      assert.equal((originalRecord as any)["__share_web"], undefined)
    })
  })

  describe("Color Roles Registration in lib/charts/chart-colors", () => {
    it("returns color roles for 'area-percent-stream' and 'recharts-area-percent-stream'", () => {
      const roles1 = getChartColorRoles("area-percent-stream")
      const roles2 = getChartColorRoles("recharts-area-percent-stream")

      assert.equal(roles1.length, 4)
      assert.equal(roles2.length, 4)

      const roleIds1 = roles1.map((r) => r.id)
      assert.deepEqual(roleIds1, ["web", "ios", "android", "selection"])

      const roleIds2 = roles2.map((r) => r.id)
      assert.deepEqual(roleIds2, ["web", "ios", "android", "selection"])
    })
  })
})
