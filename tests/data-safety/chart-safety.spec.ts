import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  isFiniteNumber,
  ensureFinite,
  assertFinite,
  validateDataset,
  safeExtent,
  calculateNumericDomain,
  partitionObservations,
} from "../../packages/chart-core/src/data"
import { resolveChartRuntimeState } from "../../packages/types/src/chart"

describe("Section 12: Loading, Empty, Error & Data Safety", () => {
  describe("12.22, 12.25 Empty vs Invalid Data", () => {
    it("should treat empty array [] as valid input (Section 12.25)", () => {
      const result = validateDataset([])
      assert.equal(result.valid, true)
      assert.equal(result.issues.length, 0)
      assert.deepEqual(result.data, [])
    })

    it("should reject non-array data sources", () => {
      const result = validateDataset(null as unknown as [])
      assert.equal(result.valid, false)
      assert.equal(result.issues[0].code, "NOT_AN_ARRAY")
    })

    it("should flag non-finite numbers (NaN, Infinity) as invalid (Section 12.22, 12.32)", () => {
      const data = [
        { month: "Jan", revenue: 100 },
        { month: "Feb", revenue: NaN },
        { month: "Mar", revenue: Infinity },
      ]

      const result = validateDataset(data, {
        valueAccessor: (d) => d.revenue,
        strict: true,
      })

      assert.equal(result.valid, false)
      assert.equal(result.issues.length, 2)
      assert.equal(result.issues[0].code, "NON_FINITE_VALUE")
      assert.equal(result.issues[0].index, 1)
      assert.equal(result.issues[1].code, "NON_FINITE_VALUE")
      assert.equal(result.issues[1].index, 2)
    })

    it("should support tolerant validation preserving valid observations (Section 12.26)", () => {
      const data = [
        { month: "Jan", revenue: 100 },
        { month: "Feb", revenue: NaN },
        { month: "Mar", revenue: 300 },
      ]

      const result = validateDataset(data, {
        valueAccessor: (d) => d.revenue,
        strict: false, // tolerant mode
      })

      assert.equal(result.valid, true)
      assert.equal(result.data.length, 2) // Jan & Mar preserved
      assert.equal(result.issues.length, 1) // Feb recorded in issues
    })

    it("should distinguish safeExtent empty from invalid datasets (Section 12.38)", () => {
      // Empty input
      const emptyResult = safeExtent([])
      assert.equal(emptyResult.status, "empty")

      // Invalid input (data exists, but contains no finite numbers)
      const invalidResult = safeExtent([NaN, Infinity, -Infinity])
      assert.equal(invalidResult.status, "invalid")
    })
  })

  describe("12.6, 12.7 Deterministic State Precedence", () => {
    it("should give explicit error highest precedence over loading and empty", () => {
      const state = resolveChartRuntimeState({
        error: new Error("Network timeout"),
        loading: true,
        dataLength: 0,
      })
      assert.equal(state, "error")
    })

    it("should give explicit unavailable precedence over loading and empty (Section 12.20)", () => {
      const state = resolveChartRuntimeState({
        unavailable: "Metric not retained",
        loading: true,
        dataLength: 0,
      })
      assert.equal(state, "unavailable")
    })

    it("should evaluate loading state when initial data is absent", () => {
      const state = resolveChartRuntimeState({
        loading: true,
        dataLength: 0,
        hasExistingData: false,
      })
      assert.equal(state, "loading")
    })

    it("should preserve ready state during background refresh (Section 12.7)", () => {
      const state = resolveChartRuntimeState({
        loading: true,
        dataLength: 10,
        hasExistingData: true, // Background refresh
      })
      assert.equal(state, "ready")
    })

    it("should evaluate invalid state when validation fails", () => {
      const state = resolveChartRuntimeState({
        validation: {
          valid: false,
          data: [],
          issues: [{ code: "NON_FINITE_VALUE", message: "NaN" }],
        },
        dataLength: 5,
      })
      assert.equal(state, "invalid")
    })

    it("should evaluate empty state when data length is 0", () => {
      const state = resolveChartRuntimeState({
        dataLength: 0,
      })
      assert.equal(state, "empty")
    })

    it("should evaluate ready state when valid data exists", () => {
      const state = resolveChartRuntimeState({
        dataLength: 12,
      })
      assert.equal(state, "ready")
    })
  })

  describe("12.39 - 12.44 Domain Safety & Zero-Span Expansion", () => {
    it("should safely expand a single positive value domain without zero span (Section 12.39)", () => {
      const extent = safeExtent([42], { zeroInclusive: true })
      assert.equal(extent.status, "valid")
      if (extent.status === "valid") {
        assert.equal(extent.domain[0], 0)
        assert.equal(extent.domain[1], 42 * 1.2)
        assert.ok(extent.domain[1] > extent.domain[0]) // Span > 0
      }
    })

    it("should safely expand a single negative value domain (Section 12.43)", () => {
      const extent = safeExtent([-50], { zeroInclusive: true })
      assert.equal(extent.status, "valid")
      if (extent.status === "valid") {
        assert.equal(extent.domain[0], -50 * 1.2)
        assert.equal(extent.domain[1], 0)
        assert.ok(extent.domain[1] > extent.domain[0])
      }
    })

    it("should treat all-zero data [0, 0, 0] as valid data, not empty (Section 12.41)", () => {
      const extent = safeExtent([0, 0, 0], { zeroInclusive: true })
      assert.equal(extent.status, "valid")
      if (extent.status === "valid") {
        assert.equal(extent.domain[0], 0)
        assert.equal(extent.domain[1], 1)
      }
    })

    it("should calculate domain for mixed positive and negative values preserving zero (Section 12.44)", () => {
      const domain = calculateNumericDomain(
        [{ v: -25 }, { v: 50 }],
        (d) => d.v,
        { zeroInclusive: true }
      )
      assert.ok(domain[0] <= -25)
      assert.ok(domain[1] >= 50)
      assert.ok(domain[0] <= 0 && domain[1] >= 0) // zero lies within domain
    })
  })

  describe("12.32 Finiteness Guards", () => {
    it("should identify valid finite numbers", () => {
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(42), true)
      assert.equal(isFiniteNumber(-12.345), true)
      assert.equal(isFiniteNumber(Number.MAX_SAFE_INTEGER), true)
    })

    it("should reject non-finite and non-numeric inputs (Section 12.32, 12.33)", () => {
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("42"), false) // does not coerce numeric string
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
    })

    it("should fallback safely with ensureFinite", () => {
      assert.equal(ensureFinite(42, 0), 42)
      assert.equal(ensureFinite(NaN, 100), 100)
      assert.equal(ensureFinite(Infinity, 0), 0)
    })

    it("should throw descriptive error on assertFinite", () => {
      assert.doesNotThrow(() => assertFinite(50, "metric"))
      assert.throws(() => assertFinite(NaN, "metric"), /Plotcn geometry guard/)
    })
  })

  describe("12.28 - 12.30 Missing Values & Immutability", () => {
    it("should distinguish null from zero in observation partitions", () => {
      const data = [
        { id: 1, val: 10 },
        { id: 2, val: 0 },    // valid zero
        { id: 3, val: null }, // missing
        { id: 4, val: undefined }, // missing
        { id: 5, val: NaN },  // invalid
      ]

      const partition = partitionObservations(data, (d) => d.val)

      assert.equal(partition.valid.length, 2) // id 1 and id 2 (zero is valid!)
      assert.equal(partition.missing.length, 2) // id 3 and id 4
      assert.equal(partition.invalid.length, 1) // id 5 (NaN)
    })

    it("should never mutate caller input data (Section 12.65)", () => {
      const rawData = Object.freeze([
        { x: "Jan", y: 20 },
        { x: "Feb", y: 10 },
      ])

      // Running validation, domain, and partitioning should not throw mutation errors
      assert.doesNotThrow(() => {
        validateDataset(rawData, { valueAccessor: (d) => d.y })
        calculateNumericDomain(rawData, (d) => d.y)
        partitionObservations(rawData, (d) => d.y)
      })
    })
  })

  describe("12.2, 12.188 Reference Behavior & State Precedence Verification", () => {
    it("should correctly prioritize error over background loading and empty data", () => {
      const state = resolveChartRuntimeState({
        loading: true,
        error: new Error("Network timeout"),
        unavailable: true,
        dataLength: 0,
        hasExistingData: true,
      })
      assert.equal(state, "error")
    })

    it("should correctly prioritize unavailable over loading and empty data", () => {
      const state = resolveChartRuntimeState({
        loading: true,
        unavailable: "Tier restricted",
        dataLength: 0,
      })
      assert.equal(state, "unavailable")
    })

    it("should transition through state precedence deterministically", () => {
      // 1. Initial loading
      assert.equal(
        resolveChartRuntimeState({ loading: true, dataLength: 0 }),
        "loading"
      )

      // 2. Background refresh: preserves existing data
      assert.equal(
        resolveChartRuntimeState({ loading: true, dataLength: 10, hasExistingData: true }),
        "ready"
      )

      // 3. Validation failure
      assert.equal(
        resolveChartRuntimeState({
          validation: { valid: false, data: [], issues: [{ code: "NAN", message: "NaN" }] },
          dataLength: 5,
        }),
        "invalid"
      )

      // 4. Empty data
      assert.equal(
        resolveChartRuntimeState({ dataLength: 0 }),
        "empty"
      )

      // 5. Valid ready state
      assert.equal(
        resolveChartRuntimeState({ dataLength: 5 }),
        "ready"
      )
    })
  })
})
