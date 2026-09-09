import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  normalizeStepSignalData,
  calculateStepDomain,
  calculateStepTransitions,
  isFiniteNumber,
} from "../../registry/recharts/line-step-signal"

describe("StepSignal Data Normalization, Domain & Transition Calculations", () => {
  const sampleRateData = [
    { period: "Jan 01", limit: 10000 },
    { period: "Feb 01", limit: 10000 }, // Repeated value (no transition)
    { period: "Mar 01", limit: 15000 }, // Transition (+5000)
    { period: "Apr 15", limit: 12000 }, // Transition (-3000)
    { period: "May 01", limit: 12000 }, // Repeated value
    { period: "Jun 01", limit: 20000 }, // Transition (+8000)
  ]

  describe("isFiniteNumber", () => {
    it("validates finite numbers correctly", () => {
      assert.equal(isFiniteNumber(100), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-45.5), true)
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("100"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
    })
  })

  describe("normalizeStepSignalData", () => {
    it("normalizes valid observations and identifies state transitions", () => {
      const normalized = normalizeStepSignalData(sampleRateData, "period", "limit", "gap")
      assert.equal(normalized.length, 6)

      // Point 0: Jan 01, 10000
      assert.equal(normalized[0].__x, "Jan 01")
      assert.equal(normalized[0].__value, 10000)
      assert.equal(normalized[0].__isTransition, false)

      // Point 1: Feb 01, 10000 (unchanged)
      assert.equal(normalized[1].__value, 10000)
      assert.equal(normalized[1].__isTransition, false)

      // Point 2: Mar 01, 15000 (transition)
      assert.equal(normalized[2].__value, 15000)
      assert.equal(normalized[2].__isTransition, true)
      assert.equal(normalized[2].__previousValue, 10000)
      assert.equal(normalized[2].__delta, 5000)

      // Point 3: Apr 15, 12000 (transition downwards)
      assert.equal(normalized[3].__value, 12000)
      assert.equal(normalized[3].__isTransition, true)
      assert.equal(normalized[3].__previousValue, 15000)
      assert.equal(normalized[3].__delta, -3000)
    })

    it("handles missing observations truthfully under 'gap' policy", () => {
      const gapData = [
        { period: "Jan", val: 100 },
        { period: "Feb", val: null },
        { period: "Mar", val: 150 },
      ]
      const normalized = normalizeStepSignalData(gapData, "period", "val", "gap")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[1].__isCarried, false)
      assert.equal(normalized[2].__value, 150)
      // Because Feb was a gap, Mar does not directly transition from Feb
      assert.equal(normalized[2].__isCarried, false)
    })

    it("persists previous state under 'carry' policy", () => {
      const carryData = [
        { period: "Jan", val: 100 },
        { period: "Feb", val: null }, // Should carry 100
        { period: "Mar", val: 150 },
      ]
      const normalized = normalizeStepSignalData(carryData, "period", "val", "carry")
      assert.equal(normalized[0].__value, 100)
      assert.equal(normalized[1].__value, 100)
      assert.equal(normalized[1].__isCarried, true)
      assert.equal(normalized[1].__isTransition, false)
      assert.equal(normalized[2].__value, 150)
      assert.equal(normalized[2].__isCarried, false)
    })

    it("safely treats NaN and Infinity as null", () => {
      const invalidData = [
        { period: "T1", val: NaN },
        { period: "T2", val: Infinity },
        { period: "T3", val: 200 },
      ]
      const normalized = normalizeStepSignalData(invalidData, "period", "val", "gap")
      assert.equal(normalized[0].__value, null)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, 200)
    })

    it("never mutates the caller's input data", () => {
      const original = [
        { period: "Jan 01", limit: 10000 },
        { period: "Feb 01", limit: 15000 },
      ]
      const copy = JSON.parse(JSON.stringify(original))
      normalizeStepSignalData(original, "period", "limit", "gap")
      assert.deepEqual(original, copy)
    })
  })

  describe("calculateStepTransitions", () => {
    it("correctly computes transition counts, initial, and final values", () => {
      const normalized = normalizeStepSignalData(sampleRateData, "period", "limit", "gap")
      const summary = calculateStepTransitions(normalized)
      // 10000 -> 10000 (0), 10000 -> 15000 (1), 15000 -> 12000 (2), 12000 -> 12000 (2), 12000 -> 20000 (3)
      assert.equal(summary.transitionCount, 3)
      assert.equal(summary.initialValue, 10000)
      assert.equal(summary.finalValue, 20000)
    })

    it("returns zero transitions for constant state data", () => {
      const constantData = [
        { period: "Day 1", val: 50 },
        { period: "Day 2", val: 50 },
        { period: "Day 3", val: 50 },
      ]
      const normalized = normalizeStepSignalData(constantData, "period", "val", "gap")
      const summary = calculateStepTransitions(normalized)
      assert.equal(summary.transitionCount, 0)
      assert.equal(summary.initialValue, 50)
      assert.equal(summary.finalValue, 50)
    })

    it("handles empty observations gracefully", () => {
      const summary = calculateStepTransitions([])
      assert.equal(summary.transitionCount, 0)
      assert.equal(summary.initialValue, null)
      assert.equal(summary.finalValue, null)
    })
  })

  describe("calculateStepDomain", () => {
    it("computes honest padded domain covering all levels", () => {
      const normalized = normalizeStepSignalData(sampleRateData, "period", "limit", "gap")
      const [dMin, dMax] = calculateStepDomain(normalized, "auto")
      assert.ok(dMin <= 10000, `Expected dMin <= 10000, got ${dMin}`)
      assert.ok(dMax >= 20000, `Expected dMax >= 20000, got ${dMax}`)
    })

    it("safely expands constant level without collapsing", () => {
      const constantData = [
        { period: "A", val: 100 },
        { period: "B", val: 100 },
      ]
      const normalized = normalizeStepSignalData(constantData, "period", "val", "gap")
      const [dMin, dMax] = calculateStepDomain(normalized, "auto")
      assert.ok(dMin < 100, `Expected dMin < 100, got ${dMin}`)
      assert.ok(dMax > 100, `Expected dMax > 100, got ${dMax}`)
    })

    it("handles all-zero constant levels safely", () => {
      const zeroData = [
        { period: "A", val: 0 },
        { period: "B", val: 0 },
      ]
      const normalized = normalizeStepSignalData(zeroData, "period", "val", "gap")
      const [dMin, dMax] = calculateStepDomain(normalized, "auto")
      assert.deepEqual([dMin, dMax], [-10, 10])
    })

    it("accommodates negative levels accurately", () => {
      const negData = [
        { period: "A", val: -50 },
        { period: "B", val: -20 },
        { period: "C", val: 30 },
      ]
      const normalized = normalizeStepSignalData(negData, "period", "val", "gap")
      const [dMin, dMax] = calculateStepDomain(normalized, "auto")
      assert.ok(dMin <= -50)
      assert.ok(dMax >= 30)
    })

    it("encloses referenceLines in the computed domain", () => {
      const data = [{ period: "A", val: 50 }]
      const normalized = normalizeStepSignalData(data, "period", "val", "gap")
      const [dMin, dMax] = calculateStepDomain(normalized, "auto", [{ value: 120, label: "Quota" }])
      assert.ok(dMax >= 120, `Expected dMax >= 120, got ${dMax}`)
    })

    it("honors explicit numeric domain overrides", () => {
      const normalized = normalizeStepSignalData(sampleRateData, "period", "limit", "gap")
      const domain = calculateStepDomain(normalized, [0, 50000])
      assert.deepEqual(domain, [0, 50000])
    })
  })
})
