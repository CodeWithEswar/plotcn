import { describe, it } from "node:test"
import assert from "node:assert"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  InteractiveBars,
  isFiniteNumber,
  resolveInteractiveBarDomain,
  defaultFormatValue,
  interactiveReducer,
  initialInteractiveState,
  type InteractiveBarState,
} from "../../registry/recharts/bar-interactive"

describe("Component 028: Interactive Bars (bar-interactive)", () => {
  const sampleData = [
    { quarter: "Q1", product: 82, services: 54, enterprise: 38 },
    { quarter: "Q2", product: 96, services: 61, enterprise: 44 },
    { quarter: "Q3", product: 88, services: 67, enterprise: 52 },
    { quarter: "Q4", product: 104, services: 72, enterprise: 58 },
  ]

  const sampleSeries = [
    { key: "product" as const, label: "Product", valueFormatter: (v: number) => `$${v}M` },
    { key: "services" as const, label: "Services", valueFormatter: (v: number) => `$${v}M` },
    { key: "enterprise" as const, label: "Enterprise", valueFormatter: (v: number) => `$${v}M` },
  ]

  /* -------------------------------------------------------------------------- */
  /*  1. Mathematical Domain & Helpers                                          */
  /* -------------------------------------------------------------------------- */
  describe("Mathematical Domain & Helpers", () => {
    it("should accurately validate finite numbers and reject non-finites", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42.5), true)
      assert.strictEqual(isFiniteNumber(0.001), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("100"), false)
    })

    it("should resolve domain truthfully including zero baseline for magnitude bars", () => {
      const domain = resolveInteractiveBarDomain(sampleData, ["product", "services", "enterprise"])
      // Minimum is 0 (truthful baseline), maximum is 104 + headroom padding
      assert.strictEqual(domain[0], 0)
      assert.ok(domain[1] > 104, "Max should include headroom padding above 104")
    })

    it("should support signed domains when negative values exist", () => {
      const signedData = [
        { quarter: "Q1", product: -25, services: 40 },
        { quarter: "Q2", product: 30, services: -15 },
      ]
      const domain = resolveInteractiveBarDomain(signedData, ["product", "services"])
      assert.ok(domain[0] < -25, "Domain min should extend below -25")
      assert.ok(domain[1] > 40, "Domain max should extend above 40")
    })

    it("should respect explicit domain override when provided", () => {
      const explicitDomain: [number, number] = [0, 200]
      const domain = resolveInteractiveBarDomain(sampleData, ["product"], explicitDomain)
      assert.deepStrictEqual(domain, [0, 200])
    })

    it("should handle all zero values with safe default domain", () => {
      const zeroData = [
        { quarter: "Q1", product: 0 },
        { quarter: "Q2", product: 0 },
      ]
      const domain = resolveInteractiveBarDomain(zeroData, ["product"])
      assert.deepStrictEqual(domain, [0, 10])
    })

    it("should format values accurately with defaultFormatValue", () => {
      assert.strictEqual(defaultFormatValue(100), "100")
      assert.strictEqual(defaultFormatValue(0), "0")
      assert.strictEqual(defaultFormatValue(1234.56), "1,234.56")
      assert.strictEqual(defaultFormatValue(NaN), "—")
      assert.strictEqual(defaultFormatValue(Infinity), "—")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Interactive Reducer State Machine Transitions                          */
  /* -------------------------------------------------------------------------- */
  describe("Interactive State Machine Reducer", () => {
    it("should initialize with idle state", () => {
      assert.strictEqual(initialInteractiveState.activeCategoryIndex, null)
      assert.strictEqual(initialInteractiveState.activeSeriesKey, null)
      assert.strictEqual(initialInteractiveState.lockedCategoryIndex, null)
      assert.strictEqual(initialInteractiveState.lockedSeriesKey, null)
      assert.strictEqual(initialInteractiveState.inputMode, null)
    })

    it("should transition from idle to pointer hover", () => {
      const state = interactiveReducer(initialInteractiveState, {
        type: "POINTER_HOVER",
        index: 1,
        seriesKey: "services",
      })

      assert.strictEqual(state.activeCategoryIndex, 1)
      assert.strictEqual(state.activeSeriesKey, "services")
      assert.strictEqual(state.lockedCategoryIndex, null)
      assert.strictEqual(state.inputMode, "pointer")
    })

    it("should clear transient active state on pointer leave when not locked", () => {
      const hoveredState: InteractiveBarState = {
        activeCategoryIndex: 1,
        activeSeriesKey: "services",
        lockedCategoryIndex: null,
        lockedSeriesKey: null,
        inputMode: "pointer",
      }

      const state = interactiveReducer(hoveredState, { type: "POINTER_LEAVE" })
      assert.strictEqual(state.activeCategoryIndex, null)
      assert.strictEqual(state.activeSeriesKey, null)
      assert.strictEqual(state.inputMode, null)
    })

    it("should lock a category on click or tap (TOGGLE_LOCK)", () => {
      const state = interactiveReducer(initialInteractiveState, {
        type: "TOGGLE_LOCK",
        index: 2,
        seriesKey: "enterprise",
        inputMode: "touch",
      })

      assert.strictEqual(state.lockedCategoryIndex, 2)
      assert.strictEqual(state.lockedSeriesKey, "enterprise")
      assert.strictEqual(state.activeCategoryIndex, 2)
      assert.strictEqual(state.inputMode, "touch")
    })

    it("should preserve locked category on pointer leave", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 2,
        activeSeriesKey: "enterprise",
        lockedCategoryIndex: 2,
        lockedSeriesKey: "enterprise",
        inputMode: "touch",
      }

      const state = interactiveReducer(lockedState, { type: "POINTER_LEAVE" })
      assert.strictEqual(state.lockedCategoryIndex, 2)
      assert.strictEqual(state.lockedSeriesKey, "enterprise")
      assert.strictEqual(state.activeSeriesKey, null)
    })

    it("should allow pointer hover over bars while locked without losing locked category", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 1,
        activeSeriesKey: null,
        lockedCategoryIndex: 1,
        lockedSeriesKey: null,
        inputMode: "pointer",
      }

      // Hover over category 3 does not steal locked category 1
      const state = interactiveReducer(lockedState, {
        type: "POINTER_HOVER",
        index: 3,
        seriesKey: "product",
      })

      assert.strictEqual(state.lockedCategoryIndex, 1)
      assert.strictEqual(state.activeSeriesKey, "product")
    })

    it("should toggle unlock when clicking the currently locked category", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 1,
        activeSeriesKey: null,
        lockedCategoryIndex: 1,
        lockedSeriesKey: null,
        inputMode: "pointer",
      }

      const state = interactiveReducer(lockedState, {
        type: "TOGGLE_LOCK",
        index: 1,
        inputMode: "pointer",
      })

      assert.strictEqual(state.lockedCategoryIndex, null)
      assert.strictEqual(state.lockedSeriesKey, null)
      assert.strictEqual(state.activeCategoryIndex, 1)
    })

    it("should move lock to a new category when clicking another category", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 1,
        activeSeriesKey: null,
        lockedCategoryIndex: 1,
        lockedSeriesKey: null,
        inputMode: "pointer",
      }

      const state = interactiveReducer(lockedState, {
        type: "TOGGLE_LOCK",
        index: 3,
        seriesKey: "enterprise",
        inputMode: "pointer",
      })

      assert.strictEqual(state.lockedCategoryIndex, 3)
      assert.strictEqual(state.lockedSeriesKey, "enterprise")
      assert.strictEqual(state.activeCategoryIndex, 3)
    })

    it("should handle explicit UNLOCK (e.g. Escape key)", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 2,
        activeSeriesKey: "services",
        lockedCategoryIndex: 2,
        lockedSeriesKey: "services",
        inputMode: "keyboard",
      }

      const state = interactiveReducer(lockedState, { type: "UNLOCK" })
      assert.strictEqual(state.lockedCategoryIndex, null)
      assert.strictEqual(state.lockedSeriesKey, null)
      assert.strictEqual(state.activeCategoryIndex, 2)
    })

    it("should navigate categories via KEYBOARD_NAV and maintain lock state if already locked", () => {
      const lockedState: InteractiveBarState = {
        activeCategoryIndex: 1,
        activeSeriesKey: null,
        lockedCategoryIndex: 1,
        lockedSeriesKey: null,
        inputMode: "keyboard",
      }

      const state = interactiveReducer(lockedState, { type: "KEYBOARD_NAV", index: 2 })
      assert.strictEqual(state.activeCategoryIndex, 2)
      assert.strictEqual(state.lockedCategoryIndex, 2)
      assert.strictEqual(state.inputMode, "keyboard")
    })

    it("should navigate categories via KEYBOARD_NAV when unlocked", () => {
      const state = interactiveReducer(initialInteractiveState, { type: "KEYBOARD_NAV", index: 0 })
      assert.strictEqual(state.activeCategoryIndex, 0)
      assert.strictEqual(state.lockedCategoryIndex, null)
      assert.strictEqual(state.inputMode, "keyboard")
    })

    it("should reset state to initial on RESET action", () => {
      const dirtyState: InteractiveBarState = {
        activeCategoryIndex: 2,
        activeSeriesKey: "product",
        lockedCategoryIndex: 2,
        lockedSeriesKey: "product",
        inputMode: "touch",
      }

      const state = interactiveReducer(dirtyState, { type: "RESET" })
      assert.deepStrictEqual(state, initialInteractiveState)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Static SSR & Accessibility Verification                                */
  /* -------------------------------------------------------------------------- */
  describe("Static SSR Rendering & Semantic Accessibility", () => {
    it("should render semantic figure[role='region'] with tabIndex=0", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          title: "Quarterly Revenue Mix",
        })
      )

      assert.ok(html.includes('role="region"'), "Figure must have role='region'")
      assert.ok(html.includes('tabindex="0"'), "Figure must have tabIndex=0 for single-tab-stop traversal")
      assert.ok(html.includes('aria-label="Quarterly Revenue Mix"'), "Must have accessible label")
      assert.ok(html.includes('aria-live="polite"'), "Must contain polite live region for sparse announcements")
    })

    it("should render accessible structured fallback table with truthful values", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<table>"), "Must contain structured fallback table")
      assert.ok(html.includes("<th scope=\"col\">quarter</th>"), "Table must contain category column header")
      assert.ok(html.includes("<th scope=\"col\">Product</th>"), "Table must contain series headers")
      assert.ok(html.includes("<th scope=\"row\">Q1</th>"), "Table must contain category row headers")
      assert.ok(html.includes("$82M"), "Table must contain formatted series values")
    })

    it("should handle zero values truthfully in table and without crashing", () => {
      const zeroData = [
        { quarter: "Q1", product: 0, services: 10, enterprise: 0.001 },
      ]

      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: zeroData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("$0M"), "Table must truthfully show 0 value formatted")
      assert.ok(html.includes("Q1"), "Row header Q1 must exist")
    })

    it("should report missing or non-finite values as 'Unavailable'", () => {
      const missingData = [
        { quarter: "Q1", product: 40, services: null, enterprise: 20 },
        { quarter: "Q2", product: NaN, services: 50, enterprise: undefined },
      ]

      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: missingData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("Unavailable"), "Missing values must be disclosed as Unavailable")
    })

    it("should render horizontal layout without errors", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          layout: "horizontal",
        })
      )

      assert.ok(html.includes("plotcn-interactive-bars"), "Chart root should render")
      assert.ok(html.includes("Up and Down"), "Screen reader summary should mention Up and Down for horizontal layout")
    })

    it("should render loading state when loading=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          loading: true,
        })
      )

      assert.ok(html.includes("Loading") || html.includes("animate-pulse") || html.includes("role=\"status\""), "Loading state must render")
      assert.ok(!html.includes("<table"), "Table should not render in loading state")
    })

    it("should render empty state when data is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: [],
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Data Available"), "Empty state must render when dataset is empty")
    })

    it("should render unavailable state when all values are null or non-finite", () => {
      const unavailableData = [
        { quarter: "Q1", product: null, services: null, enterprise: null },
        { quarter: "Q2", product: NaN, services: null, enterprise: undefined },
      ]

      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: unavailableData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Numeric Observations"), "Unavailable state must render when no finite observations exist")
    })

    it("should render interactive legend when showLegend=true and interactiveLegend=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(InteractiveBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          showLegend: true,
          interactiveLegend: true,
        })
      )

      assert.ok(html.includes("Series Legend"), "Legend container must render")
      assert.ok(html.includes("Toggle Product series"), "Legend buttons must have accessible toggle labels")
    })
  })
})
