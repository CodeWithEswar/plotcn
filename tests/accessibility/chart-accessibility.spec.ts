import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  generateFactualSummary,
  getNextDatumIndex,
  getPreviousDatumIndex,
  getNextSeriesIndex,
  getPreviousSeriesIndex,
  getFirstDatumIndex,
  getLastDatumIndex,
  mapKeyToNavigationAction,
  applyKeyboardAction,
  generateChartAriaIds,
  getChartRegionAriaProps,
  getDecorativeSvgProps,
  shouldAnnounceLiveEvent,
  DEFAULT_MAX_TABLE_ROWS,
} from "../../packages/chart-accessibility/src"
import type { KeyboardNavigationState } from "../../packages/chart-accessibility/src"

describe("Section 11: Accessibility Architecture", () => {
  describe("11.8 - 11.11 Factual Summary Generation", () => {
    it("should compute factual statistics from dataset", () => {
      const data = [
        { month: "Jan", revenue: 4200 },
        { month: "Feb", revenue: 5100 },
        { month: "Mar", revenue: 4800 },
        { month: "Apr", revenue: 6400 },
      ]

      const result = generateFactualSummary({
        data,
        valueKey: "revenue",
        labelKey: "month",
        seriesName: "Revenue",
      })

      assert.equal(result.stats.count, 4)
      assert.equal(result.stats.min.value, 4200)
      assert.equal(result.stats.min.label, "Jan")
      assert.equal(result.stats.max.value, 6400)
      assert.equal(result.stats.max.label, "Apr")
      assert.equal(result.stats.first.value, 4200)
      assert.equal(result.stats.first.label, "Jan")
      assert.equal(result.stats.last.value, 6400)
      assert.equal(result.stats.last.label, "Apr")
      assert.equal(result.stats.range, 2200)
      assert.equal(result.stats.netChange, 2200)
      assert.equal(result.stats.direction, "increasing")

      // Check conservative prose phrasing (Section 11.10)
      assert.ok(result.prose.includes("Revenue:"))
      assert.ok(result.prose.includes("increased from"))
      assert.ok(result.prose.includes("Highest value was"))
      assert.ok(result.prose.includes("lowest value was"))
    })

    it("should report decreasing trend correctly", () => {
      const data = [
        { step: "Start", cost: 950 },
        { step: "Mid", cost: 600 },
        { step: "End", cost: 320 },
      ]

      const result = generateFactualSummary({
        data,
        valueKey: "cost",
        labelKey: "step",
      })

      assert.equal(result.stats.direction, "decreasing")
      assert.equal(result.stats.netChange, -630)
      assert.ok(result.prose.includes("decreased from"))
    })

    it("should report flat trend correctly", () => {
      const data = [
        { label: "Q1", rate: 5 },
        { label: "Q2", rate: 5 },
      ]

      const result = generateFactualSummary({
        data,
        valueKey: "rate",
        labelKey: "label",
      })

      assert.equal(result.stats.direction, "flat")
      assert.equal(result.stats.netChange, 0)
      assert.ok(result.prose.includes("remained flat"))
    })

    it("should handle single observation dataset", () => {
      const data = [{ label: "Fixed", count: 12 }]
      const result = generateFactualSummary({
        data,
        valueKey: "count",
        labelKey: "label",
      })

      assert.equal(result.stats.count, 1)
      assert.ok(result.prose.includes("Single observation"))
    })

    it("should handle empty dataset gracefully", () => {
      const result = generateFactualSummary({
        data: [],
      })

      assert.equal(result.stats.count, 0)
      assert.ok(result.prose.includes("No data available"))
    })

    it("should allow custom summary string and callback override (Section 11.12)", () => {
      const data = [{ x: "A", y: 10 }, { x: "B", y: 20 }]

      const customStringResult = generateFactualSummary({
        data,
        valueKey: "y",
        labelKey: "x",
        customSummary: "Custom human insight.",
      })
      assert.equal(customStringResult.prose, "Custom human insight.")

      const customFnResult = generateFactualSummary({
        data,
        valueKey: "y",
        labelKey: "x",
        customSummary: (stats) => `Total count: ${stats.count}, peak: ${stats.max.value}`,
      })
      assert.equal(customFnResult.prose, "Total count: 2, peak: 20")
    })
  })

  describe("11.14 - 11.16 Screen Reader Table Policy", () => {
    it("should define safe default row cap to prevent DOM performance issues (Section 11.14)", () => {
      assert.equal(DEFAULT_MAX_TABLE_ROWS, 100)
    })
  })

  describe("11.17, 11.75 - 11.77 Pure Cartesian Keyboard Navigation", () => {
    it("should clamp at boundaries by default (Section 11.76)", () => {
      const total = 5

      // Left on index 0 remains 0 (clamped, no unexpected wrap)
      assert.equal(getPreviousDatumIndex(0, total, false), 0)

      // Right on last index (4) remains 4 (clamped)
      assert.equal(getNextDatumIndex(4, total, false), 4)
    })

    it("should support explicit wrapping when enabled", () => {
      const total = 5
      assert.equal(getPreviousDatumIndex(0, total, true), 4)
      assert.equal(getNextDatumIndex(4, total, true), 0)
    })

    it("should navigate series indices with boundary clamping (Section 11.19)", () => {
      const seriesCount = 3
      assert.equal(getPreviousSeriesIndex(0, seriesCount), 0)
      assert.equal(getNextSeriesIndex(0, seriesCount), 1)
      assert.equal(getNextSeriesIndex(1, seriesCount), 2)
      assert.equal(getNextSeriesIndex(2, seriesCount), 2) // clamped at end
    })

    it("should jump to first and last datum with Home and End (Section 11.77)", () => {
      const total = 100
      assert.equal(getFirstDatumIndex(), 0)
      assert.equal(getLastDatumIndex(total), 99)
    })

    it("should map keyboard keys to abstract navigation actions (Section 11.17)", () => {
      assert.equal(mapKeyToNavigationAction("ArrowLeft"), "PREV_DATUM")
      assert.equal(mapKeyToNavigationAction("ArrowRight"), "NEXT_DATUM")
      assert.equal(mapKeyToNavigationAction("ArrowUp"), "PREV_SERIES")
      assert.equal(mapKeyToNavigationAction("ArrowDown"), "NEXT_SERIES")
      assert.equal(mapKeyToNavigationAction("Home"), "FIRST_DATUM")
      assert.equal(mapKeyToNavigationAction("End"), "LAST_DATUM")
      assert.equal(mapKeyToNavigationAction("Enter"), "ACTIVATE")
      assert.equal(mapKeyToNavigationAction(" "), "ACTIVATE")
      assert.equal(mapKeyToNavigationAction("Escape"), "CLEAR")
      assert.equal(mapKeyToNavigationAction("Tab"), "NONE")
    })

    it("should apply state transitions correctly", () => {
      const initialState: KeyboardNavigationState = {
        datumIndex: 2,
        seriesIndex: 0,
        isLocked: false,
      }
      const config = { totalCount: 10, totalSeriesCount: 2 }

      const nextState = applyKeyboardAction("NEXT_DATUM", initialState, config)
      assert.equal(nextState.datumIndex, 3)

      const prevState = applyKeyboardAction("PREV_DATUM", nextState, config)
      assert.equal(prevState.datumIndex, 2)

      const homeState = applyKeyboardAction("FIRST_DATUM", prevState, config)
      assert.equal(homeState.datumIndex, 0)

      const endState = applyKeyboardAction("LAST_DATUM", homeState, config)
      assert.equal(endState.datumIndex, 9)

      const lockState = applyKeyboardAction("ACTIVATE", endState, config)
      assert.equal(lockState.isLocked, true)

      const clearState = applyKeyboardAction("CLEAR", lockState, config)
      assert.equal(clearState.isLocked, false)
    })
  })

  describe("11.7, 11.23, 11.41 ARIA Relationships & Helpers", () => {
    it("should generate stable, deterministic IDs without Math.random (Section 11.7)", () => {
      const ids1 = generateChartAriaIds("rev-1")
      const ids2 = generateChartAriaIds("rev-1")

      assert.deepEqual(ids1, ids2)
      assert.equal(ids1.titleId, "plotcn-chart-title-rev-1")
      assert.equal(ids1.descId, "plotcn-chart-desc-rev-1")
      assert.equal(ids1.summaryId, "plotcn-chart-summary-rev-1")
      assert.equal(ids1.tableId, "plotcn-chart-table-rev-1")
      assert.equal(ids1.instructionsId, "plotcn-chart-instructions-rev-1")
    })

    it("should construct semantic region props linked by IDs (Section 11.4, 11.5)", () => {
      const ids = generateChartAriaIds("demo")
      const regionProps = getChartRegionAriaProps({
        ids,
        hasDescription: true,
        hasSummary: true,
        isInteractive: true,
      })

      assert.equal(regionProps.role, "region")
      assert.equal(regionProps["aria-labelledby"], ids.titleId)
      assert.equal(regionProps["aria-describedby"], `${ids.descId} ${ids.summaryId}`)
      assert.equal(regionProps.tabIndex, 0) // Single composite entry point (Section 11.21)
    })

    it("should exclude decorative SVG elements from accessibility tree (Section 11.41)", () => {
      const decorative = getDecorativeSvgProps()
      assert.equal(decorative["aria-hidden"], "true")
      assert.equal(decorative.focusable, "false")
    })

    it("should filter live-region announcement spam (Section 11.31 - 11.33)", () => {
      // Allowed meaningful events:
      assert.equal(shouldAnnounceLiveEvent("filter"), true)
      assert.equal(shouldAnnounceLiveEvent("series-toggle"), true)
      assert.equal(shouldAnnounceLiveEvent("selection"), true)
      assert.equal(shouldAnnounceLiveEvent("error"), true)
      assert.equal(shouldAnnounceLiveEvent("sort"), true)

      // Filtered noisy events:
      assert.equal(shouldAnnounceLiveEvent("pointer-move"), false)
      assert.equal(shouldAnnounceLiveEvent("animation-frame"), false)
      assert.equal(shouldAnnounceLiveEvent("resize"), false)
      assert.equal(shouldAnnounceLiveEvent("data-refresh"), false)
    })
  })
})
