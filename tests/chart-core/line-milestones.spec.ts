import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  normalizeMilestoneData,
  normalizeMilestones,
  groupMilestonesByX,
  resolveMilestoneCollisions,
  calculateMilestoneDomain,
  calculateMilestoneSummary,
  isFiniteNumber,
  type Milestone,
} from "../../registry/recharts/line-milestones"

describe("MilestoneLine Data Normalization, Grouping, Collision & Domain Calculations", () => {
  const sampleObservations = [
    { date: "Jan", users: 45000 },
    { date: "Feb", users: 52000 },
    { date: "Mar", users: 58000 },
    { date: "Apr", users: 63000 },
    { date: "May", users: 78000 },
    { date: "Jun", users: 84000 },
    { date: "Jul", users: 95000 },
  ]

  const validDomainSet = new Set(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"])
  const validDomainKeys = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

  describe("isFiniteNumber", () => {
    it("validates finite numbers accurately", () => {
      assert.equal(isFiniteNumber(100), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-42.5), true)
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("45000"), false)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
    })
  })

  describe("normalizeMilestoneData", () => {
    it("normalizes observation records safely", () => {
      const normalized = normalizeMilestoneData(sampleObservations, "date", "users")
      assert.equal(normalized.length, 7)
      assert.equal(normalized[0].__x, "Jan")
      assert.equal(normalized[0].__value, 45000)
      assert.equal(normalized[6].__x, "Jul")
      assert.equal(normalized[6].__value, 95000)
    })

    it("handles missing metric values truthfully without coercing to zero", () => {
      const missingData = [
        { date: "Jan", users: 100 },
        { date: "Feb", users: null },
        { date: "Mar", users: undefined },
        { date: "Apr", users: 150 },
      ]
      const normalized = normalizeMilestoneData(missingData, "date", "users")
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, null)
      assert.equal(normalized[3].__value, 150)
    })

    it("safely treats NaN and Infinity as null", () => {
      const invalidData = [
        { date: "T1", users: NaN },
        { date: "T2", users: Infinity },
        { date: "T3", users: 200 },
      ]
      const normalized = normalizeMilestoneData(invalidData, "date", "users")
      assert.equal(normalized[0].__value, null)
      assert.equal(normalized[1].__value, null)
      assert.equal(normalized[2].__value, 200)
    })

    it("never mutates caller observation records", () => {
      const original = [{ date: "Jan", users: 50 }]
      const frozen = Object.freeze({ date: "Jan", users: 50 })
      const normalized = normalizeMilestoneData([frozen], "date", "users")
      assert.equal(normalized[0].__value, 50)
      assert.deepEqual(original, [{ date: "Jan", users: 50 }])
    })
  })

  describe("normalizeMilestones", () => {
    it("validates and preserves valid milestones", () => {
      const milestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Pricing v2", description: "Updated tiers" },
        { id: "m2", x: "May", label: "Mobile app", description: "App launch" },
      ]
      const result = normalizeMilestones(milestones, validDomainSet)
      assert.equal(result.length, 2)
      assert.equal(result[0].id, "m1")
      assert.equal(result[1].id, "m2")
    })

    it("omits out-of-domain milestones without clamping to chart border", () => {
      const milestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Pricing v2" },
        { id: "m-invalid", x: "Dec", label: "Future launch" }, // "Dec" is not in validDomainSet
      ]
      const result = normalizeMilestones(milestones, validDomainSet)
      assert.equal(result.length, 1)
      assert.equal(result[0].id, "m1")
      // Dec was completely omitted, not clamped to "Jul"
      assert.equal(result.some((m) => m.id === "m-invalid"), false)
    })

    it("filters out milestones missing stable IDs", () => {
      const invalidMilestones = [
        { id: "", x: "Feb", label: "No ID" },
        { id: "valid-1", x: "Mar", label: "Valid" },
        { x: "Apr", label: "Missing ID prop" } as any,
      ]
      const result = normalizeMilestones(invalidMilestones, validDomainSet)
      assert.equal(result.length, 1)
      assert.equal(result[0].id, "valid-1")
    })

    it("deduplicates duplicate IDs gracefully", () => {
      const dupMilestones: Milestone[] = [
        { id: "launch", x: "Feb", label: "First launch" },
        { id: "launch", x: "Mar", label: "Duplicate ID" },
      ]
      const result = normalizeMilestones(dupMilestones, validDomainSet)
      assert.equal(result.length, 1)
      assert.equal(result[0].label, "First launch")
    })

    it("never mutates caller milestone array or objects", () => {
      const original: readonly Milestone[] = Object.freeze([
        Object.freeze({ id: "m1", x: "Feb", label: "Pricing v2" }),
      ])
      const result = normalizeMilestones(original, validDomainSet)
      assert.equal(result.length, 1)
      assert.notEqual(result[0], original[0]) // Cloned safely
    })
  })

  describe("groupMilestonesByX", () => {
    it("groups single milestones into distinct groups", () => {
      const milestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Pricing v2" },
        { id: "m2", x: "May", label: "Mobile app" },
      ]
      const groups = groupMilestonesByX(milestones)
      assert.equal(groups.length, 2)
      assert.equal(groups[0].count, 1)
      assert.equal(groups[0].primaryMilestone.label, "Pricing v2")
      assert.equal(groups[1].count, 1)
      assert.equal(groups[1].primaryMilestone.label, "Mobile app")
    })

    it("groups multiple milestones sharing the same X coordinate", () => {
      const sameXMilestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Pricing v2", description: "Pricing update" },
        { id: "m2", x: "Feb", label: "Feature flag rollout", description: "Rollout" },
        { id: "m3", x: "May", label: "Mobile launch" },
      ]
      const groups = groupMilestonesByX(sameXMilestones)
      assert.equal(groups.length, 2)

      // Feb group should have count = 2
      const febGroup = groups.find((g) => g.x === "Feb")
      assert.ok(febGroup)
      assert.equal(febGroup.count, 2)
      assert.equal(febGroup.milestones.length, 2)
      assert.equal(febGroup.primaryMilestone.id, "m1")
      assert.equal(febGroup.milestones[1].id, "m2")

      // May group should have count = 1
      const mayGroup = groups.find((g) => g.x === "May")
      assert.ok(mayGroup)
      assert.equal(mayGroup.count, 1)
    })
  })

  describe("resolveMilestoneCollisions", () => {
    it("keeps labels visible when horizontal space is ample", () => {
      const milestones: Milestone[] = [
        { id: "m1", x: "Jan", label: "Start" },
        { id: "m2", x: "Jul", label: "End" },
      ]
      const groups = groupMilestonesByX(milestones)
      const resolved = resolveMilestoneCollisions(groups, validDomainKeys, 1000)

      assert.equal(resolved.length, 2)
      assert.equal(resolved[0].showLabel, true)
      assert.equal(resolved[1].showLabel, true)
    })

    it("collapses dense text labels on narrow container while preserving marker items", () => {
      const denseMilestones: Milestone[] = [
        { id: "m1", x: "Jan", label: "Event 1" },
        { id: "m2", x: "Feb", label: "Event 2" },
        { id: "m3", x: "Mar", label: "Event 3" },
        { id: "m4", x: "Apr", label: "Event 4" },
      ]
      const groups = groupMilestonesByX(denseMilestones)
      // Container width 320px (mobile): should preserve all 4 groups but collapse middle text labels
      const resolved = resolveMilestoneCollisions(groups, validDomainKeys, 320)

      assert.equal(resolved.length, 4) // All markers preserved!
      const visibleCount = resolved.filter((r) => r.showLabel).length
      assert.ok(visibleCount < 4, "Dense text labels collapsed to avoid overlap on mobile")
    })

    it("annotates grouped milestones with count in displayLabel", () => {
      const sameXMilestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Launch" },
        { id: "m2", x: "Feb", label: "Pricing" },
      ]
      const groups = groupMilestonesByX(sameXMilestones)
      const resolved = resolveMilestoneCollisions(groups, validDomainKeys, 800)

      assert.equal(resolved.length, 1)
      assert.equal(resolved[0].displayLabel, "Launch (+1)")
    })
  })

  describe("calculateMilestoneDomain", () => {
    it("expands normal values with reasonable padding", () => {
      const data = [
        { __x: "Jan", __value: 100, __raw: {} },
        { __x: "Feb", __value: 200, __raw: {} },
      ]
      const [min, max] = calculateMilestoneDomain(data)
      assert.ok(min <= 100)
      assert.ok(max >= 200)
    })

    it("expands constant single-level datasets without collapsing", () => {
      const constantData = [
        { __x: "Jan", __value: 50, __raw: {} },
        { __x: "Feb", __value: 50, __raw: {} },
      ]
      const [min, max] = calculateMilestoneDomain(constantData)
      assert.ok(min < 50)
      assert.ok(max > 50)
    })

    it("handles all-zero and empty data safely", () => {
      const [min, max] = calculateMilestoneDomain([])
      assert.equal(min, 0)
      assert.equal(max, 100)
    })

    it("honors explicit numeric domain overrides", () => {
      const data = [{ __x: "Jan", __value: 50, __raw: {} }]
      const [min, max] = calculateMilestoneDomain(data, [0, 500])
      assert.equal(min, 0)
      assert.equal(max, 500)
    })
  })

  describe("calculateMilestoneSummary", () => {
    it("reports factual summary without inferring causality", () => {
      const milestones: Milestone[] = [
        { id: "m1", x: "Feb", label: "Pricing v2" },
        { id: "m2", x: "May", label: "Mobile app" },
      ]
      const summary = calculateMilestoneSummary(7, milestones, "Active users")

      assert.ok(summary.includes("7 observations"))
      assert.ok(summary.includes("2 annotated milestone events"))
      assert.ok(summary.includes('"Pricing v2" at Feb'))
      assert.ok(summary.includes('"Mobile app" at May'))
      assert.ok(summary.includes("do not infer causality"))
    })

    it("handles zero milestones gracefully", () => {
      const summary = calculateMilestoneSummary(5, [], "Active users")
      assert.ok(summary.includes("no milestone events annotated"))
    })
  })
})
