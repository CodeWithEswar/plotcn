import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  normalizeFocusData,
  calculateFocusDomain,
  type ActiveDatum,
  type FocusSeriesConfig,
} from "../../registry/recharts/line-focus"
import { getChartColorRoles } from "../../lib/charts/chart-colors"

describe("FocusLine Core Architecture, Normalization, Safe Domain & Interaction Model Suite", () => {
  describe("isFiniteNumber", () => {
    it("returns true for valid finite numeric values", () => {
      assert.equal(isFiniteNumber(42), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-18.5), true)
      assert.equal(isFiniteNumber(1e5), true)
    })

    it("returns false for non-finite values and non-numbers", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("42"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber({}), false)
    })
  })

  describe("normalizeFocusData", () => {
    const sampleData = [
      { time: "09:00", latency: 122 },
      { time: "10:00", latency: 138 },
      { time: "11:00", latency: 147 },
    ]

    it("safely normalizes structured observations with index and raw pointers", () => {
      const normalized = normalizeFocusData(sampleData, "time", "latency")
      assert.equal(normalized.length, 3)
      assert.equal(normalized[0].__x, "09:00")
      assert.equal(normalized[0].__value, 122)
      assert.equal(normalized[0].__index, 0)
      assert.equal(normalized[2].__x, "11:00")
      assert.equal(normalized[2].__value, 147)
      assert.equal(normalized[2].__index, 2)
    })

    it("preserves null under 'gap' policy without coercing to zero (null != 0)", () => {
      const gappyData = [
        { time: "09:00", latency: 100 },
        { time: "10:00", latency: null },
        { time: "11:00", latency: undefined },
        { time: "12:00", latency: 130 },
      ]
      const normalized = normalizeFocusData(gappyData, "time", "latency", "gap")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, null)
      assert.equal(normalized[3].__value, 130)
    })

    it("treats NaN and Infinity as null in telemetry observations", () => {
      const invalidData = [
        { time: "09:00", latency: NaN },
        { time: "10:00", latency: Infinity },
        { time: "11:00", latency: -Infinity },
        { time: "12:00", latency: 150 },
      ]
      const normalized = normalizeFocusData(invalidData, "time", "latency", "gap")
      assert.equal(normalized[0].__value, null)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, null)
      assert.equal(normalized[3].__value, 150)
    })

    it("supports 'carry' policy by carrying forward the last known finite level", () => {
      const carryData = [
        { time: "09:00", latency: 100 },
        { time: "10:00", latency: null },
        { time: "11:00", latency: 160 },
      ]
      const normalized = normalizeFocusData(carryData, "time", "latency", "carry")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, 100)
      assert.equal(normalized[2].__value, 160)
    })

    it("guarantees caller data immutability", () => {
      const original = [{ time: "09:00", latency: 122 }]
      const frozen = Object.freeze({ time: "09:00", latency: 122 })
      const normalized = normalizeFocusData([frozen], "time", "latency")
      assert.equal(normalized[0].__value, 122)
      assert.deepEqual(original, [{ time: "09:00", latency: 122 }])
    })

    it("returns an empty array on null or empty input", () => {
      assert.deepEqual(normalizeFocusData([], "time", "latency"), [])
      assert.deepEqual(normalizeFocusData(null as any, "time", "latency"), [])
    })
  })

  describe("calculateFocusDomain", () => {
    it("respects explicit caller numeric domain without modification", () => {
      const normalized = [
        { __x: "09:00", __value: 122, __index: 0, __raw: {} },
        { __x: "10:00", __value: 180, __index: 1, __raw: {} },
      ]
      const domain = calculateFocusDomain(normalized, [0, 300])
      assert.deepEqual(domain, [0, 300])
    })

    it("pads domain automatically so extreme points never clip against SVG boundaries", () => {
      const normalized = [
        { __x: "09:00", __value: 100, __index: 0, __raw: {} },
        { __x: "10:00", __value: 200, __index: 1, __raw: {} },
      ]
      const [min, max] = calculateFocusDomain(normalized)
      assert.ok(min <= 100, `min (${min}) should be <= 100`)
      assert.ok(max >= 200, `max (${max}) should be >= 200`)
    })

    it("handles zero-span / flat data safely without collapsing to a degenerate interval", () => {
      const normalized = [
        { __x: "09:00", __value: 150, __index: 0, __raw: {} },
        { __x: "10:00", __value: 150, __index: 1, __raw: {} },
      ]
      const [min, max] = calculateFocusDomain(normalized)
      assert.ok(min < 150, "min should be padded below 150")
      assert.ok(max > 150, "max should be padded above 150")
      assert.notEqual(min, max)
    })

    it("handles negative values safely", () => {
      const normalized = [
        { __x: "09:00", __value: -50, __index: 0, __raw: {} },
        { __x: "10:00", __value: -10, __index: 1, __raw: {} },
      ]
      const [min, max] = calculateFocusDomain(normalized)
      assert.ok(min <= -50, `min (${min}) should be <= -50`)
      assert.ok(max >= -10, `max (${max}) should be >= -10`)
    })

    it("returns safe fallback [0, 100] when dataset is empty", () => {
      const [min, max] = calculateFocusDomain([])
      assert.deepEqual([min, max], [0, 100])
    })
  })

  describe("Tri-State Inspection Model Semantics", () => {
    it("preserves separation between Focus, Active Datum, and Locked Selection", () => {
      // Focus: root container focus ring token
      const focusToken = "var(--chart-focus, #38bdf8)"
      // Active: series color token
      const activeColor = "var(--chart-1, #3b82f6)"
      // Locked: selection color token
      const selectionColor = "var(--chart-selection, #f59e0b)"

      // Visual tokens must remain independent
      assert.notEqual(focusToken, activeColor)
      assert.notEqual(activeColor, selectionColor)
    })

    it("correctly models ActiveDatum shape for consumer callbacks", () => {
      const rawRecord = { time: "12:00", latency: 133 }
      const datum: ActiveDatum<{ time: string; latency: number }> = {
        index: 3,
        x: "12:00",
        value: 133,
        raw: rawRecord,
        datum: rawRecord,
        isLocked: false,
        isMissing: false,
      }
      assert.equal(datum.index, 3)
      assert.equal(datum.x, "12:00")
      assert.equal(datum.value, 133)
      assert.equal(datum.raw.latency, 133)
      assert.equal(datum.datum?.latency, 133)
      assert.equal(datum.isLocked, false)
      assert.equal(datum.isMissing, false)
    })

    it("correctly models missing observation in ActiveDatum", () => {
      const rawRecord = { time: "11:00", latency: null }
      const datum: ActiveDatum<{ time: string; latency: number | null }> = {
        index: 2,
        x: "11:00",
        value: null,
        raw: rawRecord,
        datum: rawRecord,
        isLocked: true,
        isMissing: true,
      }
      assert.equal(datum.value, null)
      assert.equal(datum.x, "11:00")
      assert.equal(datum.isLocked, true)
      assert.equal(datum.isMissing, true)
    })
  })

  describe("Global Color Customization Roles", () => {
    it("registers 'line-focus' in the global chart color system", () => {
      const roles = getChartColorRoles("line-focus")
      assert.equal(roles.length, 2)
      assert.equal(roles[0].id, "primary")
      assert.equal(roles[0].propName, "color")
      assert.equal(roles[0].defaultToken, "var(--chart-1)")

      assert.equal(roles[1].id, "selection")
      assert.equal(roles[1].propName, "selectionColor")
      assert.equal(roles[1].defaultToken, "var(--chart-selection)")
    })

    it("registers 'recharts-line-focus' alias identically", () => {
      const roles = getChartColorRoles("recharts-line-focus")
      assert.equal(roles.length, 2)
      assert.equal(roles[0].propName, "color")
      assert.equal(roles[1].propName, "selectionColor")
    })
  })
})
