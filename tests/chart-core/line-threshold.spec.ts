import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  normalizeThresholdData,
  validateThresholds,
  calculateThresholdDomain,
  type ThresholdBoundary,
  type ThresholdRegion,
  type ThresholdDefinition,
} from "../../registry/recharts/line-threshold"

describe("ThresholdLine Core Architecture, Normalization & Safe Domain Suite", () => {
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

  describe("normalizeThresholdData", () => {
    const sampleData = [
      { time: "00:00", latency: 142 },
      { time: "04:00", latency: 158 },
      { time: "08:00", latency: 245 },
    ]

    it("safely normalizes structured observations", () => {
      const normalized = normalizeThresholdData(sampleData, "time", "latency")
      assert.equal(normalized.length, 3)
      assert.equal(normalized[0].__x, "00:00")
      assert.equal(normalized[0].__value, 142)
      assert.equal(normalized[2].__x, "08:00")
      assert.equal(normalized[2].__value, 245)
    })

    it("preserves null under 'gap' policy without coercing to zero", () => {
      const gappyData = [
        { time: "T1", latency: 100 },
        { time: "T2", latency: null },
        { time: "T3", latency: undefined },
        { time: "T4", latency: 120 },
      ]
      const normalized = normalizeThresholdData(gappyData, "time", "latency", "gap")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, null)
      assert.equal(normalized[3].__value, 120)
    })

    it("treats NaN and Infinity as null", () => {
      const invalidData = [
        { time: "T1", latency: NaN },
        { time: "T2", latency: Infinity },
        { time: "T3", latency: 150 },
      ]
      const normalized = normalizeThresholdData(invalidData, "time", "latency", "gap")
      assert.equal(normalized[0].__value, null)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, 150)
    })

    it("supports 'carry' policy by carrying forward the last known finite level", () => {
      const carryData = [
        { time: "T1", latency: 100 },
        { time: "T2", latency: null },
        { time: "T3", latency: 150 },
      ]
      const normalized = normalizeThresholdData(carryData, "time", "latency", "carry")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, 100)
      assert.equal(normalized[2].__value, 150)
    })

    it("guarantees caller data immutability", () => {
      const original = [{ time: "00:00", latency: 50 }]
      const frozen = Object.freeze({ time: "00:00", latency: 50 })
      const normalized = normalizeThresholdData([frozen], "time", "latency")
      assert.equal(normalized[0].__value, 50)
      assert.deepEqual(original, [{ time: "00:00", latency: 50 }])
    })

    it("returns an empty array on invalid inputs", () => {
      assert.deepEqual(normalizeThresholdData([], "time", "latency"), [])
      assert.deepEqual(normalizeThresholdData(null as any, "time", "latency"), [])
    })
  })

  describe("validateThresholds", () => {
    it("preserves valid line boundaries and region bands", () => {
      const input: ThresholdDefinition[] = [
        { id: "sla", kind: "line", value: 300, label: "SLA Limit" },
        { id: "opt", kind: "region", from: 100, to: 200, label: "Optimal Band" },
      ]
      const validated = validateThresholds(input)
      assert.equal(validated.length, 2)
      assert.equal(validated[0].id, "sla")
      assert.equal(validated[1].id, "opt")
    })

    it("deduplicates duplicate threshold IDs", () => {
      const input: ThresholdDefinition[] = [
        { id: "limit", kind: "line", value: 100, label: "First" },
        { id: "limit", kind: "line", value: 200, label: "Duplicate" },
        { id: "other", kind: "line", value: 300, label: "Unique" },
      ]
      const validated = validateThresholds(input)
      assert.equal(validated.length, 2)
      assert.equal(validated[0].label, "First")
      assert.equal(validated[1].label, "Unique")
    })

    it("rejects line thresholds with non-finite values (NaN, Infinity)", () => {
      const input: ThresholdDefinition[] = [
        { id: "t1", kind: "line", value: NaN, label: "NaN limit" },
        { id: "t2", kind: "line", value: Infinity, label: "Inf limit" },
        { id: "t3", kind: "line", value: 250, label: "Valid limit" },
      ]
      const validated = validateThresholds(input)
      assert.equal(validated.length, 1)
      assert.equal(validated[0].id, "t3")
    })

    it("rejects region thresholds where from > to", () => {
      const input: ThresholdDefinition[] = [
        { id: "inv", kind: "region", from: 200, to: 100, label: "Inverted Region" },
        { id: "val", kind: "region", from: 100, to: 200, label: "Valid Region" },
      ]
      const validated = validateThresholds(input)
      assert.equal(validated.length, 1)
      assert.equal(validated[0].id, "val")
    })

    it("allows open-ended regions with only from or only to", () => {
      const input: ThresholdDefinition[] = [
        { id: "r1", kind: "region", from: 100, label: "Floor Region" },
        { id: "r2", kind: "region", to: 500, label: "Ceiling Region" },
      ]
      const validated = validateThresholds(input)
      assert.equal(validated.length, 2)
    })
  })

  describe("calculateThresholdDomain", () => {
    it("respects explicit caller numeric domain without modification", () => {
      const normalized = [{ __x: "T1", __value: 150, __raw: {} }]
      const thresholds: ThresholdDefinition[] = [{ id: "sla", kind: "line", value: 300, label: "SLA" }]
      const domain = calculateThresholdDomain(normalized, thresholds, [0, 500])
      assert.deepEqual(domain, [0, 500])
    })

    it("automatically expands domain to include thresholds higher than maximum observation", () => {
      // Data: 100 to 200, Threshold at 300
      const normalized = [
        { __x: "T1", __value: 100, __raw: {} },
        { __x: "T2", __value: 200, __raw: {} },
      ]
      const thresholds: ThresholdDefinition[] = [{ id: "sla", kind: "line", value: 300, label: "SLA" }]
      const [min, max] = calculateThresholdDomain(normalized, thresholds)
      assert.ok(min <= 100, `min (${min}) should be <= 100`)
      assert.ok(max >= 300, `max (${max}) should be >= 300 so threshold is not clipped`)
    })

    it("automatically expands domain to include thresholds lower than minimum observation", () => {
      // Data: 200 to 300, Threshold at 50
      const normalized = [
        { __x: "T1", __value: 200, __raw: {} },
        { __x: "T2", __value: 300, __raw: {} },
      ]
      const thresholds: ThresholdDefinition[] = [{ id: "floor", kind: "line", value: 50, label: "Floor" }]
      const [min, max] = calculateThresholdDomain(normalized, thresholds)
      assert.ok(min <= 50, `min (${min}) should be <= 50`)
      assert.ok(max >= 300, `max (${max}) should be >= 300`)
    })

    it("encompasses region from and to bounds in domain calculation", () => {
      const normalized = [{ __x: "T1", __value: 150, __raw: {} }]
      const thresholds: ThresholdDefinition[] = [
        { id: "opt", kind: "region", from: 50, to: 250, label: "Operating Range" },
      ]
      const [min, max] = calculateThresholdDomain(normalized, thresholds)
      assert.ok(min <= 50, `min (${min}) should encompass region from (50)`)
      assert.ok(max >= 250, `max (${max}) should encompass region to (250)`)
    })

    it("handles zero-span / constant datasets safely with padding", () => {
      const normalized = [
        { __x: "T1", __value: 100, __raw: {} },
        { __x: "T2", __value: 100, __raw: {} },
      ]
      const [min, max] = calculateThresholdDomain(normalized, [])
      assert.ok(min < 100, "min should be padded below 100")
      assert.ok(max > 100, "max should be padded above 100")
      assert.notEqual(min, max)
    })

    it("handles negative values and negative thresholds safely", () => {
      const normalized = [
        { __x: "T1", __value: -50, __raw: {} },
        { __x: "T2", __value: -20, __raw: {} },
      ]
      const thresholds: ThresholdDefinition[] = [
        { id: "limit", kind: "line", value: -80, label: "Lower Bound" },
      ]
      const [min, max] = calculateThresholdDomain(normalized, thresholds)
      assert.ok(min <= -80, `min (${min}) should be <= -80`)
      assert.ok(max >= -20, `max (${max}) should be >= -20`)
    })

    it("returns fallback [0, 100] when dataset and thresholds are empty", () => {
      const [min, max] = calculateThresholdDomain([], [])
      assert.deepEqual([min, max], [0, 100])
    })
  })
})
