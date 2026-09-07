import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  presetDefinitions,
  chartMotionDuration,
  chartMotionEasing,
  resolveReducedMotionFallback,
  resolveMotionPolicy,
  getDefaultPresetsForFamily,
  calculateDrawStroke,
  calculateRevealClipPath,
  interpolateSweepAngle,
  interpolateBarFromBaseline,
  calculateStaggerDelay,
  MAX_STAGGER_TOTAL_DELAY,
  MAX_STAGGER_ITEM_COUNT,
  interpolateNumber,
  interpolatePoint,
  interpolatePoints,
  interpolateDomain,
  interpolatePath,
  parseSvgPath,
  arePathsCompatible,
  interpolateArc,
  interpolateArcList,
} from "../../packages/chart-motion/src"
import type { ArcGeometry } from "../../packages/chart-motion/src"

describe("Section 10: Motion & Animation Architecture", () => {
  describe("10.6, 10.90 - 10.94 Semantic Presets & Timing Tokens", () => {
    it("should define all standard semantic presets with duration, easing, and fallback", () => {
      const presets = ["none", "fade", "grow", "draw", "reveal", "sweep", "morph"] as const

      for (const name of presets) {
        const def = presetDefinitions[name]
        assert.ok(def, `Preset ${name} should exist in presetDefinitions`)
        assert.equal(def.name, name)
        assert.ok(typeof def.duration === "number" && def.duration >= 0)
        assert.ok(Array.isArray(def.easing))
        assert.ok(def.reducedMotionFallback === "none" || def.reducedMotionFallback === "fade")
        assert.ok(def.description.length > 0)
      }
    })

    it("should provide curated duration tokens adhering to visualization standards", () => {
      assert.equal(chartMotionDuration.micro, 0.14)
      assert.equal(chartMotionDuration.tooltip, 0.16)
      assert.equal(chartMotionDuration.fast, 0.18)
      assert.equal(chartMotionDuration.normal, 0.3)
      assert.equal(chartMotionDuration.slow, 0.45)
      assert.equal(chartMotionDuration.complex, 0.5)

      // Micro < tooltip < fast < normal < slow < complex
      assert.ok(chartMotionDuration.micro < chartMotionDuration.tooltip)
      assert.ok(chartMotionDuration.tooltip < chartMotionDuration.fast)
      assert.ok(chartMotionDuration.fast < chartMotionDuration.normal)
      assert.ok(chartMotionDuration.normal < chartMotionDuration.slow)
      assert.ok(chartMotionDuration.slow < chartMotionDuration.complex)
    })

    it("should provide restrained easing curves and avoid bouncy springs on metrics (Section 10.15)", () => {
      assert.deepEqual(chartMotionEasing.enter, [0.16, 1, 0.3, 1])
      assert.deepEqual(chartMotionEasing.update, [0.4, 0, 0.2, 1])
      assert.deepEqual(chartMotionEasing.exit, [0.4, 0, 1, 1])
      assert.deepEqual(chartMotionEasing.linear, [0, 0, 1, 1])

      // Easing control points should not overshoot above 1.0 (no bouncy elastic springs)
      for (const key of ["enter", "update", "exit", "linear"] as const) {
        const curve = chartMotionEasing[key]
        assert.ok(curve[1] <= 1.0, `${key} easing should not overshoot upper bound`)
        assert.ok(curve[3] <= 1.0, `${key} easing should not overshoot upper bound`)
      }
    })
  })

  describe("10.57 - 10.63 Reduced Motion Policy & Fallbacks", () => {
    it("should map spatial and entrance presets to 'none' under reduced motion (Section 10.58)", () => {
      assert.equal(resolveReducedMotionFallback("draw"), "none")
      assert.equal(resolveReducedMotionFallback("grow"), "none")
      assert.equal(resolveReducedMotionFallback("sweep"), "none")
      assert.equal(resolveReducedMotionFallback("reveal"), "none")
      assert.equal(resolveReducedMotionFallback("morph"), "none")
      assert.equal(resolveReducedMotionFallback("none"), "none")
    })

    it("should permit subtle opacity fade under reduced motion (Section 10.58)", () => {
      assert.equal(resolveReducedMotionFallback("fade"), "fade")
    })

    it("should calculate immediate final stroke-dashoffset under reduced motion", () => {
      const strokeNormal = calculateDrawStroke(500, 0.5, false)
      assert.equal(strokeNormal.strokeDashoffset, 250)

      const strokeReduced = calculateDrawStroke(500, 0.5, true)
      assert.equal(strokeReduced.strokeDashoffset, 0)
    })

    it("should calculate immediate target angle for sweep under reduced motion", () => {
      const angleNormal = interpolateSweepAngle(0, Math.PI, 0.5, false)
      assert.equal(angleNormal, Math.PI * 0.5)

      const angleReduced = interpolateSweepAngle(0, Math.PI, 0.5, true)
      assert.equal(angleReduced, Math.PI)
    })

    it("should calculate immediate clip-path for reveal under reduced motion", () => {
      const clipNormal = calculateRevealClipPath(0.5, "left-to-right", false)
      assert.equal(clipNormal, "inset(0% 50% 0% 0%)")

      const clipReduced = calculateRevealClipPath(0.5, "left-to-right", true)
      assert.equal(clipReduced, "inset(0% 0% 0% 0%)")
    })
  })

  describe("10.1, 10.8, 10.35 Motion Policy Resolution", () => {
    it("should provide chart-specific default presets (Section 10.8)", () => {
      const lineDefaults = getDefaultPresetsForFamily("line")
      assert.equal(lineDefaults.enter, "draw")
      assert.equal(lineDefaults.update, "morph")

      const barDefaults = getDefaultPresetsForFamily("bar")
      assert.equal(barDefaults.enter, "grow")
      assert.equal(barDefaults.update, "grow")

      const pieDefaults = getDefaultPresetsForFamily("pie")
      assert.equal(pieDefaults.enter, "sweep")
      assert.equal(pieDefaults.update, "sweep")

      const areaDefaults = getDefaultPresetsForFamily("area")
      assert.equal(areaDefaults.enter, "reveal")
      assert.equal(areaDefaults.update, "morph")

      const networkDefaults = getDefaultPresetsForFamily("network")
      assert.equal(networkDefaults.enter, "fade")
      assert.equal(networkDefaults.update, "none") // D3 force owns physics
    })

    it("should resolve default policy for line charts", () => {
      const policy = resolveMotionPolicy(undefined, "line", { reducedMotion: false })
      assert.equal(policy.enabled, true)
      assert.equal(policy.enter, "draw")
      assert.equal(policy.update, "morph")
      assert.equal(policy.exit, "fade")
      assert.equal(policy.duration, chartMotionDuration.normal)
    })

    it("should support string shorthand API (Section 10.5)", () => {
      const policy = resolveMotionPolicy("grow", undefined, { reducedMotion: false })
      assert.equal(policy.enter, "grow")
      assert.equal(policy.update, "grow")
    })

    it("should support boolean false to disable motion", () => {
      const policy = resolveMotionPolicy(false, "line")
      assert.equal(policy.enabled, false)
      assert.equal(policy.enter, "none")
      assert.equal(policy.duration, 0)
    })

    it("should bypass animations during continuous resize events (Section 10.35)", () => {
      const policy = resolveMotionPolicy(undefined, "line", {
        isContinuousResize: true,
        reducedMotion: false,
      })
      assert.equal(policy.enabled, false)
      assert.equal(policy.duration, 0)
      assert.equal(policy.enter, "none")
      assert.equal(policy.update, "none")
    })

    it("should clamp duration during streaming updates (Section 10.70)", () => {
      const policy = resolveMotionPolicy({ duration: 0.8 }, "line", {
        isStreaming: true,
        reducedMotion: false,
      })
      assert.ok(policy.duration <= chartMotionDuration.micro)
    })

    it("should resolve reduced-motion fallback policy (Section 10.58)", () => {
      const policy = resolveMotionPolicy(undefined, "line", { reducedMotion: true })
      assert.equal(policy.reducedMotion, true)
      assert.equal(policy.enter, "none") // draw -> none
      assert.equal(policy.update, "none") // morph -> none
    })
  })

  describe("10.37, 10.38 Stagger Preset & Duration Capping", () => {
    it("should cap total stagger duration so it never exceeds 150ms", () => {
      const count = 10
      const delayLast = calculateStaggerDelay(count - 1, count)
      assert.ok(delayLast <= MAX_STAGGER_TOTAL_DELAY)
      assert.ok(delayLast > 0)
    })

    it("should disable stagger for large element counts (Section 10.37)", () => {
      const largeCount = 100
      const delay = calculateStaggerDelay(5, largeCount)
      assert.equal(delay, 0)
    })

    it("should disable stagger under reduced motion (Section 10.58)", () => {
      const delay = calculateStaggerDelay(3, 8, { reducedMotion: true })
      assert.equal(delay, 0)
    })
  })

  describe("10.26, 10.27 Bar Semantic Baseline Growth", () => {
    it("should expand vertical bar upwards from baseline for positive values", () => {
      const baselineY = 200
      const target = { x: 50, y: 100, width: 30, height: 100 }
      const midpoint = interpolateBarFromBaseline(target, baselineY, 0.5)

      assert.equal(midpoint.x, 50)
      assert.equal(midpoint.width, 30)
      assert.equal(midpoint.height, 50) // 100 * 0.5
      assert.equal(midpoint.y, 150) // 200 - 50
    })

    it("should expand vertical bar downwards from baseline for negative values (Section 10.27)", () => {
      const baselineY = 200
      const target = { x: 50, y: 260, width: 30, height: 60 } // negative value below baseline
      const midpoint = interpolateBarFromBaseline(target, baselineY, 0.5)

      assert.equal(midpoint.x, 50)
      assert.equal(midpoint.width, 30)
      assert.equal(midpoint.height, 30) // 60 * 0.5
      assert.equal(midpoint.y, baselineY) // starts at baseline
    })
  })

  describe("10.51, 10.32 Interpolation Primitives", () => {
    it("should interpolate numeric values with bounds clamping", () => {
      assert.equal(interpolateNumber(10, 20, 0), 10)
      assert.equal(interpolateNumber(10, 20, 0.5), 15)
      assert.equal(interpolateNumber(10, 20, 1), 20)
      assert.equal(interpolateNumber(10, 20, -0.5), 10) // clamped
      assert.equal(interpolateNumber(10, 20, 1.5), 20) // clamped
    })

    it("should interpolate 2D coordinates", () => {
      const p = interpolatePoint([0, 100], [50, 200], 0.5)
      assert.deepEqual(p, [25, 150])
    })

    it("should interpolate coordinate arrays with matching topology", () => {
      const ptsA: [number, number][] = [[0, 0], [10, 10], [20, 20]]
      const ptsB: [number, number][] = [[0, 10], [10, 30], [20, 40]]
      const mid = interpolatePoints(ptsA, ptsB, 0.5)

      assert.deepEqual(mid, [[0, 5], [10, 20], [20, 30]])
    })

    it("should interpolate numeric domains for coordinated axis transitions (Section 10.32)", () => {
      const domainA: [number, number] = [0, 100]
      const domainB: [number, number] = [50, 200]
      const mid = interpolateDomain(domainA, domainB, 0.5)

      assert.deepEqual(mid, [25, 150])
    })
  })

  describe("10.21 - 10.23 Path Morphing & Semantic Fallbacks", () => {
    it("should parse SVG path commands and numeric parameters", () => {
      const d = "M 10 20 L 30 40 C 50 60 70 80 90 100 Z"
      const cmds = parseSvgPath(d)

      assert.equal(cmds.length, 4)
      assert.equal(cmds[0].command, "M")
      assert.deepEqual(cmds[0].params, [10, 20])
      assert.equal(cmds[1].command, "L")
      assert.deepEqual(cmds[1].params, [30, 40])
      assert.equal(cmds[2].command, "C")
      assert.deepEqual(cmds[2].params, [50, 60, 70, 80, 90, 100])
      assert.equal(cmds[3].command, "Z")
      assert.deepEqual(cmds[3].params, [])
    })

    it("should verify compatible topologies between paths with matching command structure", () => {
      const pathA = "M 0 100 L 50 200 L 100 150"
      const pathB = "M 0 120 L 50 180 L 100 170"

      const cmdsA = parseSvgPath(pathA)
      const cmdsB = parseSvgPath(pathB)
      assert.equal(arePathsCompatible(cmdsA, cmdsB), true)
    })

    it("should smoothly interpolate compatible SVG path coordinates at midpoint", () => {
      const pathA = "M 0 100 L 100 200"
      const pathB = "M 0 200 L 100 300"

      const result = interpolatePath(pathA, pathB, 0.5)
      assert.equal(result.isCompatible, true)
      assert.equal(result.fallbackApplied, false)
      assert.equal(result.path, "M 0 150 L 100 250")
    })

    it("should apply safe semantic fallback when topologies mismatch (Section 10.22, 10.23)", () => {
      const pathA = "M 0 100 L 100 200" // 2 commands
      const pathB = "M 0 100 L 50 150 L 100 200 L 150 250" // 4 commands

      const resultEarly = interpolatePath(pathA, pathB, 0.3)
      assert.equal(resultEarly.isCompatible, false)
      assert.equal(resultEarly.fallbackApplied, true)
      assert.equal(resultEarly.path, pathA) // Before midpoint, holds pathA

      const resultLate = interpolatePath(pathA, pathB, 0.7)
      assert.equal(resultLate.isCompatible, false)
      assert.equal(resultLate.fallbackApplied, true)
      assert.equal(resultLate.path, pathB) // After midpoint, switches to pathB
    })
  })

  describe("10.24, 10.25 Arc Motion & Stable Segment Identity", () => {
    it("should interpolate startAngle, endAngle, and radii between arc geometries", () => {
      const arcA: ArcGeometry = {
        id: "slice-1",
        startAngle: 0,
        endAngle: Math.PI * 0.5,
        innerRadius: 40,
        outerRadius: 80,
      }
      const arcB: ArcGeometry = {
        id: "slice-1",
        startAngle: 0,
        endAngle: Math.PI,
        innerRadius: 50,
        outerRadius: 100,
      }

      const mid = interpolateArc(arcA, arcB, 0.5)
      assert.equal(mid.id, "slice-1")
      assert.equal(mid.startAngle, 0)
      assert.equal(mid.endAngle, Math.PI * 0.75)
      assert.equal(mid.innerRadius, 45)
      assert.equal(mid.outerRadius, 90)
    })

    it("should correlate arc segments by stable segment.id, not array index (Section 10.25)", () => {
      // Order of slices reorders between updates:
      const currentList: ArcGeometry[] = [
        { id: "alpha", startAngle: 0, endAngle: 1.5, innerRadius: 50, outerRadius: 100 },
        { id: "beta", startAngle: 1.5, endAngle: 3.0, innerRadius: 50, outerRadius: 100 },
      ]
      const targetList: ArcGeometry[] = [
        { id: "beta", startAngle: 0, endAngle: 2.0, innerRadius: 50, outerRadius: 100 }, // moved to index 0
        { id: "alpha", startAngle: 2.0, endAngle: 3.5, innerRadius: 50, outerRadius: 100 }, // moved to index 1
      ]

      const midList = interpolateArcList(currentList, targetList, 0.5)

      // First item in target is 'beta' -> should interpolate from beta's old values, NOT alpha!
      const betaMid = midList[0]
      assert.equal(betaMid.id, "beta")
      assert.equal(betaMid.startAngle, 0.75) // (1.5 + 0) * 0.5 = 0.75
      assert.equal(betaMid.endAngle, 2.5) // (3.0 + 2.0) * 0.5 = 2.5

      // Second item in target is 'alpha' -> should interpolate from alpha's old values
      const alphaMid = midList[1]
      assert.equal(alphaMid.id, "alpha")
      assert.equal(alphaMid.startAngle, 1.0) // (0 + 2.0) * 0.5 = 1.0
      assert.equal(alphaMid.endAngle, 2.5) // (1.5 + 3.5) * 0.5 = 2.5
    })

    it("should expand entering segment from its own startAngle", () => {
      const currentList: ArcGeometry[] = [
        { id: "existing", startAngle: 0, endAngle: 1.0, innerRadius: 50, outerRadius: 100 },
      ]
      const targetList: ArcGeometry[] = [
        { id: "existing", startAngle: 0, endAngle: 1.0, innerRadius: 50, outerRadius: 100 },
        { id: "new-slice", startAngle: 1.0, endAngle: 2.0, innerRadius: 50, outerRadius: 100 },
      ]

      const midList = interpolateArcList(currentList, targetList, 0.5)
      const newSliceMid = midList[1]

      assert.equal(newSliceMid.id, "new-slice")
      assert.equal(newSliceMid.startAngle, 1.0)
      assert.equal(newSliceMid.endAngle, 1.5) // Expands from 1.0 towards 2.0
    })
  })
})
