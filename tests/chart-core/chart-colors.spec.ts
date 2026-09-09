import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  getChartColorRoles,
  isValidColor,
  calculateContrastRatio,
  resolveDisplayHex,
  THEME_CHART_TOKENS,
  CURATED_COLOR_GROUPS,
} from "../../lib/charts/chart-colors"

describe("Global Chart Color System Foundation", () => {
  describe("getChartColorRoles", () => {
    it("returns correct single role for Signal Line and Pulse Line", () => {
      const signalRoles = getChartColorRoles("line-signal")
      assert.equal(signalRoles.length, 1)
      assert.equal(signalRoles[0].propName, "color")
      assert.equal(signalRoles[0].id, "primary")

      const pulseRoles = getChartColorRoles("line-pulse")
      assert.equal(pulseRoles.length, 1)
      assert.equal(pulseRoles[0].propName, "color")
    })

    it("returns dual semantic roles for Twinline Compare", () => {
      const twinlineRoles = getChartColorRoles("line-twin-compare")
      assert.equal(twinlineRoles.length, 2)
      assert.equal(twinlineRoles[0].propName, "primaryColor")
      assert.equal(twinlineRoles[0].id, "primary")
      assert.equal(twinlineRoles[1].propName, "referenceColor")
      assert.equal(twinlineRoles[1].id, "reference")
    })

    it("returns dual semantic roles for Range Line", () => {
      const rangeRoles = getChartColorRoles("line-range")
      assert.equal(rangeRoles.length, 2)
      assert.equal(rangeRoles[0].propName, "color")
      assert.equal(rangeRoles[1].propName, "rangeColor")
      assert.equal(rangeRoles[1].id, "range")
    })

    it("returns single role for Step Signal", () => {
      const stepRoles = getChartColorRoles("line-step-signal")
      assert.equal(stepRoles.length, 1)
      assert.equal(stepRoles[0].propName, "color")
    })

    it("returns dual semantic roles for Milestone Line", () => {
      const milestoneRoles = getChartColorRoles("line-milestones")
      assert.equal(milestoneRoles.length, 2)
      assert.equal(milestoneRoles[0].propName, "color")
      assert.equal(milestoneRoles[1].propName, "milestoneColor")
      assert.equal(milestoneRoles[1].id, "milestone")
    })

    it("falls back gracefully for unknown charts", () => {
      const unknownRoles = getChartColorRoles("unknown-custom-chart")
      assert.equal(unknownRoles.length, 1)
      assert.equal(unknownRoles[0].propName, "color")
    })
  })

  describe("isValidColor", () => {
    it("validates valid hexadecimal color formats", () => {
      assert.equal(isValidColor("#fff"), true)
      assert.equal(isValidColor("#FFF"), true)
      assert.equal(isValidColor("#ffff"), true)
      assert.equal(isValidColor("#10b981"), true)
      assert.equal(isValidColor("#10B981"), true)
      assert.equal(isValidColor("#10b981ff"), true)
    })

    it("validates CSS variables and functional colors", () => {
      assert.equal(isValidColor("var(--chart-1)"), true)
      assert.equal(isValidColor("var(--brand-primary, #3b82f6)"), true)
      assert.equal(isValidColor("rgb(16, 185, 129)"), true)
      assert.equal(isValidColor("rgba(16, 185, 129, 0.5)"), true)
      assert.equal(isValidColor("hsl(217, 91%, 60%)"), true)
      assert.equal(isValidColor("oklch(0.7 0.18 150)"), true)
    })

    it("rejects invalid color strings", () => {
      assert.equal(isValidColor("#ggg"), false)
      assert.equal(isValidColor("#12"), false)
      assert.equal(isValidColor("random-text"), false)
      assert.equal(isValidColor(""), false)
      assert.equal(isValidColor(null as any), false)
      assert.equal(isValidColor(undefined as any), false)
    })
  })

  describe("calculateContrastRatio", () => {
    it("calculates high contrast for white on dark surface", () => {
      const ratio = calculateContrastRatio("#ffffff", "#09090b")
      assert.ok(ratio > 10, `Expected high contrast, got ${ratio}`)
    })

    it("calculates low contrast for dark gray on dark surface", () => {
      const ratio = calculateContrastRatio("#18181b", "#09090b")
      assert.ok(ratio < 2.5, `Expected low contrast, got ${ratio}`)
    })
  })

  describe("resolveDisplayHex", () => {
    it("preserves explicit hex colors", () => {
      assert.equal(resolveDisplayHex("#2563eb"), "#2563eb")
      assert.equal(resolveDisplayHex("#f43f5e"), "#f43f5e")
    })

    it("resolves standard theme tokens to representative colors", () => {
      const resolved1 = resolveDisplayHex("var(--chart-1)", "var(--chart-1)", true)
      assert.ok(resolved1.startsWith("#"))

      const resolved2 = resolveDisplayHex("var(--chart-2)", "var(--chart-2)", true)
      assert.ok(resolved2.startsWith("#"))
    })
  })

  describe("Theme Tokens & Palettes", () => {
    it("exposes 8 theme chart tokens", () => {
      assert.equal(THEME_CHART_TOKENS.length, 8)
      assert.equal(THEME_CHART_TOKENS[0].value, "var(--chart-1)")
      assert.equal(THEME_CHART_TOKENS[7].value, "var(--chart-8)")
    })

    it("exposes curated palette groups including monochrome and colorblind-safe", () => {
      assert.ok(CURATED_COLOR_GROUPS.length >= 3)
      const mono = CURATED_COLOR_GROUPS.find((g) => g.name === "Monochrome")
      assert.ok(mono && mono.presets.length >= 4)

      const cb = CURATED_COLOR_GROUPS.find((g) => g.name.includes("Colorblind"))
      assert.ok(cb && cb.presets.length >= 6)
    })
  })
})
