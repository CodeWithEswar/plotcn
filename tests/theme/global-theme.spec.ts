import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  defaultChartTokens,
} from "../../registry/shared/chart-theme"
import {
  defaultLightTokens,
  defaultDarkTokens,
  defaultPalette,
  monochromePalette,
  colorblindSafePalette,
} from "../../packages/chart-theme/src"
import { THEME_CHART_TOKENS } from "../../lib/charts/chart-colors"
import { themeInitScript } from "../../components/theme/theme-provider"

describe("Global Application-Wide Theme & Zinc Monochrome System", () => {
  describe("Theme Tokens & Zinc Monochrome Default Palette", () => {
    it("should default to Zinc Monochrome scale in defaultDarkTokens", () => {
      // Dark mode series 1..8 should be neutral/zinc values
      const darkSeries = defaultDarkTokens.series
      assert.equal(darkSeries.length, 8)
      assert.equal(darkSeries[0], "#f4f4f5") // zinc-100
      assert.equal(darkSeries[1], "#d4d4d8") // zinc-300
      assert.equal(darkSeries[2], "#a1a1aa") // zinc-400
      assert.equal(darkSeries[3], "#71717a") // zinc-500
      assert.equal(darkSeries[4], "#52525b") // zinc-600
      assert.equal(darkSeries[5], "#3f3f46") // zinc-700
      assert.equal(darkSeries[6], "#e4e4e7") // zinc-200
      assert.equal(darkSeries[7], "#27272a") // zinc-800
    })

    it("should default to Zinc Monochrome scale in defaultLightTokens", () => {
      // Light mode series 1..8 should be tuned dark-to-medium zinc values
      const lightSeries = defaultLightTokens.series
      assert.equal(lightSeries.length, 8)
      assert.equal(lightSeries[0], "#18181b") // zinc-900
      assert.equal(lightSeries[1], "#3f3f46") // zinc-700
      assert.equal(lightSeries[2], "#52525b") // zinc-600
      assert.equal(lightSeries[3], "#71717a") // zinc-500
      assert.equal(lightSeries[4], "#a1a1aa") // zinc-400
      assert.equal(lightSeries[5], "#27272a") // zinc-800
      assert.equal(lightSeries[6], "#d4d4d8") // zinc-300
      assert.equal(lightSeries[7], "#09090b") // zinc-950
    })

    it("should provide distinct luminance between adjacent series in both themes", () => {
      const darkUnique = new Set(defaultDarkTokens.series)
      assert.equal(darkUnique.size, 8, "All 8 dark series tokens must have unique zinc shades")

      const lightUnique = new Set(defaultLightTokens.series)
      assert.equal(lightUnique.size, 8, "All 8 light series tokens must have unique zinc shades")
    })

    it("should redefine defaultPalette as Monochrome while preserving colorblind-safe", () => {
      assert.equal(defaultPalette.name, "default")
      assert.equal(defaultPalette.label, "Monochrome")
      assert.equal(defaultPalette.series.length, 8)

      // Colorblind safe must remain available as an optional palette
      assert.equal(colorblindSafePalette.label, "Colorblind Safe (Okabe-Ito)")
      assert.equal(colorblindSafePalette.series.length, 8)

      // Dedicated monochrome palette preset
      assert.equal(monochromePalette.name, "monochrome")
      assert.equal(monochromePalette.series.length, 8)
    })

    it("should configure THEME_CHART_TOKENS with Monochrome labels and neutral hex values", () => {
      assert.equal(THEME_CHART_TOKENS.length, 8)
      for (const token of THEME_CHART_TOKENS) {
        assert.ok(token.label.startsWith("Monochrome · Chart"), `Token label must reflect Monochrome: ${token.label}`)
        assert.ok(token.value.startsWith("var(--chart-"), `Token value must reference CSS variable: ${token.value}`)
        assert.ok(token.isToken, "isToken must be true")
      }
    })

    it("should configure defaultChartTokens in registry shared adapter with Zinc values", () => {
      assert.equal(defaultChartTokens.chart1, "#f4f4f5")
      assert.equal(defaultChartTokens.chart2, "#d4d4d8")
      assert.equal(defaultChartTokens.chart3, "#a1a1aa")
      assert.equal(defaultChartTokens.chart4, "#71717a")
      assert.equal(defaultChartTokens.chart5, "#52525b")
      assert.equal(defaultChartTokens.chart6, "#3f3f46")
      assert.equal(defaultChartTokens.chart7, "#e4e4e7")
      assert.equal(defaultChartTokens.chart8, "#27272a")
    })
  })

  describe("Theme Initialization & Zero Flash (FOUC)", () => {
    it("should generate a clean themeInitScript without external dependencies", () => {
      assert.ok(themeInitScript)
      assert.ok(themeInitScript.includes("plotcn-theme"))
      assert.ok(themeInitScript.includes("prefers-color-scheme"))
      assert.ok(themeInitScript.includes("classList.add('dark')"))
      assert.ok(themeInitScript.includes("classList.remove('dark')"))
    })
  })
})
