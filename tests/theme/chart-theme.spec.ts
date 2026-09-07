import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  defaultLightTokens,
  defaultDarkTokens,
  getSeriesColor,
  getSemanticStatusColor,
  defaultPalette,
  monochromePalette,
  monochromeStyles,
  colorblindSafePalette,
  colorblindSafeStyles,
  getPalette,
  resolveThemeSnapshot,
  getGoogleChartThemeOptions,
  rechartsTheme,
  getRechartsSeriesColor,
} from "../../packages/chart-theme/src"
import type { ChartThemeSnapshot } from "../../packages/chart-theme/src"

describe("Section 9: Theme & Visual Design System", () => {
  describe("9.1 - 9.8 Semantic Token Contract & Model", () => {
    it("should define all required semantic token keys in defaultLightTokens", () => {
      // Surface
      assert.ok(defaultLightTokens.background)
      assert.ok(defaultLightTokens.foreground)
      assert.ok(defaultLightTokens.mutedForeground)
      assert.ok(defaultLightTokens.border)

      // Structure
      assert.ok(defaultLightTokens.grid)
      assert.ok(defaultLightTokens.gridEmphasis)
      assert.ok(defaultLightTokens.axis)
      assert.ok(defaultLightTokens.axisEmphasis)
      assert.ok(defaultLightTokens.zeroLine)

      // Interaction
      assert.ok(defaultLightTokens.crosshair)
      assert.ok(defaultLightTokens.cursor)
      assert.ok(defaultLightTokens.selection)
      assert.ok(defaultLightTokens.focus)

      // Series
      assert.equal(defaultLightTokens.series.length, 8)

      // Semantic Status
      assert.ok(defaultLightTokens.positive)
      assert.ok(defaultLightTokens.negative)
      assert.ok(defaultLightTokens.warning)
      assert.ok(defaultLightTokens.neutral)

      // Tooltip
      assert.ok(defaultLightTokens.tooltipBackground)
      assert.ok(defaultLightTokens.tooltipForeground)
      assert.ok(defaultLightTokens.tooltipMuted)
      assert.ok(defaultLightTokens.tooltipBorder)

      // States
      assert.ok(defaultLightTokens.disabled)
      assert.ok(defaultLightTokens.hidden)
    })

    it("should define all required semantic token keys in defaultDarkTokens with appropriate dark-mode contrast", () => {
      assert.equal(defaultDarkTokens.series.length, 8)
      assert.notEqual(defaultDarkTokens.background, defaultLightTokens.background)
      assert.notEqual(defaultDarkTokens.foreground, defaultLightTokens.foreground)
      assert.notEqual(defaultDarkTokens.grid, defaultLightTokens.grid)
      assert.notEqual(defaultDarkTokens.tooltipBackground, defaultLightTokens.tooltipBackground)
    })

    it("should separate semantic status tokens from arbitrary series colors (Section 9.4)", () => {
      // Positive and negative have dedicated semantic roles
      assert.ok(defaultLightTokens.positive)
      assert.ok(defaultLightTokens.negative)
      assert.ok(defaultLightTokens.warning)
      assert.notEqual(defaultLightTokens.positive, defaultLightTokens.negative)
    })
  })

  describe("9.11 - 9.20 Curated Palettes & Accessibility Modes", () => {
    it("should provide curated default palette with 8 balanced categorical colors", () => {
      assert.equal(defaultPalette.name, "default")
      assert.equal(defaultPalette.series.length, 8)
      assert.ok(defaultPalette.positive)
      assert.ok(defaultPalette.negative)
    })

    it("should provide monochrome palette with non-color differentiation (Section 9.13)", () => {
      assert.equal(monochromePalette.name, "monochrome")
      assert.equal(monochromePalette.series.length, 8)

      // Monochrome styles use strokeWidth, dash pattern, and shapes rather than only hue
      assert.ok(monochromeStyles.length >= 5)
      const lineStyles = monochromeStyles.map((s) => s.lineStyle)
      assert.ok(lineStyles.includes("solid"))
      assert.ok(lineStyles.includes("dashed"))
      assert.ok(lineStyles.includes("dotted"))

      const shapes = monochromeStyles.map((s) => s.shape)
      assert.ok(shapes.includes("dot"))
      assert.ok(shapes.includes("square"))
    })

    it("should provide colorblind-safe palette using Okabe-Ito colors and multi-modal markers (Section 9.19, 9.20)", () => {
      assert.equal(colorblindSafePalette.series.length, 8)
      // Standard Okabe-Ito colors: Orange #E69F00, Sky Blue #56B4E9, Bluish Green #009E73
      assert.ok(colorblindSafePalette.series.includes("#E69F00"))
      assert.ok(colorblindSafePalette.series.includes("#56B4E9"))
      assert.ok(colorblindSafePalette.series.includes("#009E73"))

      // Marker shapes ensure distinguishability without relying on hue alone
      assert.ok(colorblindSafeStyles.length >= 8)
      const shapes = colorblindSafeStyles.map((s) => s.shape)
      assert.ok(shapes.includes("dot"))
      assert.ok(shapes.includes("square"))
      assert.ok(shapes.includes("diamond"))
      assert.ok(shapes.includes("triangle"))
    })

    it("should resolve palette presets safely falling back to default", () => {
      assert.equal(getPalette("default").name, "default")
      assert.equal(getPalette("monochrome").name, "monochrome")
      assert.equal(getPalette("colorblind-safe").label, "Colorblind Safe (Okabe-Ito)")
      assert.equal(getPalette("unknown-palette").name, "default")
    })
  })

  describe("9.25 - 9.29 Series Assignment & Semantic Roles", () => {
    it("should deterministically assign series colors with modulo cycling", () => {
      const palette = ["#111", "#222", "#333"]
      assert.equal(getSeriesColor(palette, 0), "#111")
      assert.equal(getSeriesColor(palette, 1), "#222")
      assert.equal(getSeriesColor(palette, 2), "#333")
      assert.equal(getSeriesColor(palette, 3), "#111") // Cycles back to index 0
      assert.equal(getSeriesColor(palette, 4), "#222")
    })

    it("should resolve semantic status colors from theme", () => {
      const theme: ChartThemeSnapshot = { ...defaultLightTokens }
      assert.equal(getSemanticStatusColor("positive", theme), theme.positive)
      assert.equal(getSemanticStatusColor("negative", theme), theme.negative)
      assert.equal(getSemanticStatusColor("warning", theme), theme.warning)
      assert.equal(getSemanticStatusColor("neutral", theme), theme.neutral)
    })
  })

  describe("9.55 - 9.63 Engine Theme Adapters", () => {
    it("should provide direct CSS variable references for Recharts & SVG (Section 9.56)", () => {
      assert.equal(rechartsTheme.series(0), "var(--chart-1)")
      assert.equal(rechartsTheme.series(1), "var(--chart-2)")
      assert.equal(rechartsTheme.series(7), "var(--chart-8)")
      assert.equal(rechartsTheme.series(8), "var(--chart-1)") // Modulo 8 cycling
      assert.equal(getRechartsSeriesColor(2), "var(--chart-3)")

      assert.equal(rechartsTheme.grid, "var(--chart-grid)")
      assert.equal(rechartsTheme.axis, "var(--chart-axis)")
      assert.equal(rechartsTheme.crosshair, "var(--chart-crosshair)")
      assert.equal(rechartsTheme.zeroLine, "var(--chart-zero-line)")
    })

    it("should map ChartThemeSnapshot to Google ChartOptions (Section 9.59)", () => {
      const snapshot: ChartThemeSnapshot = { ...defaultLightTokens }
      const options = getGoogleChartThemeOptions(snapshot)

      assert.deepEqual(options.colors, [...snapshot.series])
      assert.equal(options.hAxis?.textStyle?.color, snapshot.axis)
      assert.equal(options.hAxis?.gridlines?.color, snapshot.grid)
      assert.equal(options.hAxis?.baselineColor, snapshot.zeroLine)
      assert.equal(options.vAxis?.textStyle?.color, snapshot.axis)
      assert.equal(options.vAxis?.gridlines?.color, snapshot.grid)
      assert.equal(options.vAxis?.baselineColor, snapshot.zeroLine)
      assert.equal(options.legend?.textStyle?.color, snapshot.foreground)
      assert.equal(options.tooltip?.textStyle?.color, snapshot.tooltipForeground)
      assert.equal(options.tooltip?.isHtml, true)
    })

    it("should preserve custom overrides in Google ChartOptions", () => {
      const snapshot: ChartThemeSnapshot = { ...defaultDarkTokens }
      const options = getGoogleChartThemeOptions(snapshot, {
        legend: { position: "top" },
        hAxis: { title: "Months" },
      })

      assert.equal(options.legend?.position, "top")
      assert.equal(options.legend?.textStyle?.color, snapshot.foreground)
      assert.equal((options.hAxis as Record<string, unknown>)?.title, "Months")
      assert.equal(options.hAxis?.textStyle?.color, snapshot.axis)
    })

    it("should resolve theme snapshot cleanly in Node / SSR environment", () => {
      const lightSnapshot = resolveThemeSnapshot({ mode: "light" })
      assert.equal(lightSnapshot.background, defaultLightTokens.background)
      assert.equal(lightSnapshot.series.length, 8)

      const darkSnapshot = resolveThemeSnapshot({ mode: "dark" })
      assert.equal(darkSnapshot.background, defaultDarkTokens.background)

      const monochromeSnapshot = resolveThemeSnapshot({ palette: "monochrome" })
      assert.deepEqual(monochromeSnapshot.series, monochromePalette.series)
    })
  })
})
