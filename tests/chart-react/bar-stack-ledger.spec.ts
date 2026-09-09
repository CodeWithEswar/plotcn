import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  StackLedgerBars,
  isFiniteNumber,
  normalizeStackLedgerData,
  calculateStackLedgerDomain,
  STACK_ID,
} from "../../registry/recharts/bar-stack-ledger"

describe("Component 022: Stack Ledger Bars (bar-stack-ledger)", () => {
  const sampleData = [
    { quarter: "Q1", compute: 48, storage: 31, network: 21 },
    { quarter: "Q2", compute: 54, storage: 35, network: 24 },
    { quarter: "Q3", compute: 51, storage: null, network: 26 }, // missing storage
    { quarter: "Q4", compute: 62, storage: 48, network: 31 },
    { quarter: "Q5", compute: 40, storage: 0, network: 20 }, // zero storage
  ]

  const sampleSeries = [
    { key: "compute" as const, label: "Compute", color: "var(--chart-1)" },
    { key: "storage" as const, label: "Storage", color: "var(--chart-2)" },
    { key: "network" as const, label: "Network", color: "var(--chart-3)" },
  ]

  const allSeriesKeys = ["compute", "storage", "network"]

  /* -------------------------------------------------------------------------- */
  /*  1. Algorithmic Helpers: Finite & Normalization                            */
  /* -------------------------------------------------------------------------- */
  describe("Algorithmic Helpers: Finite & Normalization", () => {
    it("should correctly identify finite numbers", () => {
      assert.strictEqual(isFiniteNumber(100), true)
      assert.strictEqual(isFiniteNumber(0), true)
      assert.strictEqual(isFiniteNumber(-42.5), true)
      assert.strictEqual(isFiniteNumber(3.14159), true)
      assert.strictEqual(isFiniteNumber(NaN), false)
      assert.strictEqual(isFiniteNumber(Infinity), false)
      assert.strictEqual(isFiniteNumber(-Infinity), false)
      assert.strictEqual(isFiniteNumber(null), false)
      assert.strictEqual(isFiniteNumber(undefined), false)
      assert.strictEqual(isFiniteNumber("100"), false)
    })

    it("should strictly preserve caller category order without automatic sorting", () => {
      const unorderedData = [
        { quarter: "March", compute: 30, storage: 20 },
        { quarter: "January", compute: 90, storage: 10 },
        { quarter: "April", compute: 50, storage: 40 },
        { quarter: "February", compute: 70, storage: 30 },
      ]
      const { records } = normalizeStackLedgerData(
        unorderedData,
        "quarter",
        [
          { key: "compute", label: "Compute" },
          { key: "storage", label: "Storage" },
        ],
        ["compute", "storage"]
      )

      assert.strictEqual(records.length, 4)
      assert.strictEqual(records[0].__category, "March")
      assert.strictEqual(records[1].__category, "January")
      assert.strictEqual(records[2].__category, "April")
      assert.strictEqual(records[3].__category, "February")
    })

    it("should preserve contributor series order strictly regardless of magnitude", () => {
      const fluctuatingData = [
        { quarter: "Q1", compute: 50, storage: 30, network: 20 },
        { quarter: "Q2", compute: 20, storage: 60, network: 30 },
        { quarter: "Q3", compute: 35, storage: 25, network: 40 },
      ]
      const { records } = normalizeStackLedgerData(
        fluctuatingData,
        "quarter",
        sampleSeries,
        allSeriesKeys
      )

      assert.strictEqual(records.length, 3)
      // Check Q2 where storage (60) is larger than compute (20)
      assert.strictEqual(records[1].compute, 20)
      assert.strictEqual(records[1].storage, 60)
      assert.strictEqual(records[1].network, 30)
      assert.strictEqual(records[1].__totals.visible, 110)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. V1 Sign Model & Non-Negative Contract                                  */
  /* -------------------------------------------------------------------------- */
  describe("V1 Sign Model & Non-Negative Contract", () => {
    it("should detect negative values, mark category incomplete, and invalidate totals without clamping", () => {
      const negativeData = [
        { quarter: "Q1", compute: 40, storage: -10, network: 20 },
        { quarter: "Q2", compute: 50, storage: 30, network: 20 },
      ]
      const { records, hasAnyNegative } = normalizeStackLedgerData(
        negativeData,
        "quarter",
        sampleSeries,
        allSeriesKeys
      )

      assert.strictEqual(hasAnyNegative, true)
      assert.strictEqual(records[0].__hasNegative, true)
      assert.strictEqual(records[0].__complete, false)
      assert.strictEqual(records[0].__totals.visible, null)
      assert.strictEqual(records[0].__totals.all, null)

      // Q2 is completely valid
      assert.strictEqual(records[1].__hasNegative, false)
      assert.strictEqual(records[1].__complete, true)
      assert.strictEqual(records[1].__totals.visible, 100)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Zero Values vs Missing Values Policy                                   */
  /* -------------------------------------------------------------------------- */
  describe("Zero Values vs Missing Values Policy", () => {
    it("should treat 0 as a valid observation preserving category completeness and total", () => {
      const zeroData = [
        { quarter: "Q1", compute: 40, storage: 0, network: 20 },
      ]
      const { records } = normalizeStackLedgerData(
        zeroData,
        "quarter",
        sampleSeries,
        allSeriesKeys,
        "incomplete"
      )

      assert.strictEqual(records[0].__complete, true)
      assert.strictEqual(records[0].storage, 0)
      assert.strictEqual(records[0].__totals.visible, 60)
    })

    it("should invalidate total and omit stack geometry under default 'incomplete' policy when contributor is missing", () => {
      const { records } = normalizeStackLedgerData(
        sampleData,
        "quarter",
        sampleSeries,
        allSeriesKeys,
        "incomplete"
      )

      // Q3 has null storage
      const q3 = records[2]
      assert.strictEqual(q3.__category, "Q3")
      assert.strictEqual(q3.__complete, false)
      assert.strictEqual(q3.__totals.visible, null)
      assert.strictEqual(q3.__totals.all, null)
      // Geometry values are zeroed to omit partial misleading bar
      assert.strictEqual(q3.compute, 0)
      assert.strictEqual(q3.storage, 0)
      assert.strictEqual(q3.network, 0)
    })

    it("should coerce missing values to 0 and compute valid total when missingValuePolicy='zero'", () => {
      const { records } = normalizeStackLedgerData(
        sampleData,
        "quarter",
        sampleSeries,
        allSeriesKeys,
        "zero"
      )

      // Q3 with null storage under "zero" policy
      const q3 = records[2]
      assert.strictEqual(q3.__complete, true)
      assert.strictEqual(q3.storage, 0)
      // 51 + 0 + 26 = 77
      assert.strictEqual(q3.__totals.visible, 77)
    })

    it("should sanitize non-finite values (NaN, Infinity) safely", () => {
      const nonFiniteData = [
        { quarter: "Q1", compute: NaN, storage: Infinity, network: 20 },
      ]
      const { records } = normalizeStackLedgerData(
        nonFiniteData,
        "quarter",
        sampleSeries,
        allSeriesKeys,
        "incomplete"
      )

      assert.strictEqual(records[0].__complete, false)
      assert.strictEqual(records[0].__totals.visible, null)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Total Calculation & Visible Totals on Series Toggling                  */
  /* -------------------------------------------------------------------------- */
  describe("Total Calculation & Visible Totals on Series Toggling", () => {
    it("should compute exact category totals for complete records", () => {
      const completeData = [
        { quarter: "Q1", compute: 48, storage: 31, network: 21 }, // sum = 100
        { quarter: "Q2", compute: 54, storage: 35, network: 24 }, // sum = 113
      ]
      const { records } = normalizeStackLedgerData(
        completeData,
        "quarter",
        sampleSeries,
        allSeriesKeys
      )

      assert.strictEqual(records[0].__totals.visible, 100)
      assert.strictEqual(records[1].__totals.visible, 113)
    })

    it("should recompute visible total excluding hidden series", () => {
      const completeData = [
        { quarter: "Q1", compute: 50, storage: 30, network: 20 }, // total = 100
      ]
      // Exclude "network" from visible series keys
      const { records } = normalizeStackLedgerData(
        completeData,
        "quarter",
        sampleSeries,
        ["compute", "storage"]
      )

      // Visible sum is 50 + 30 = 80
      assert.strictEqual(records[0].__totals.visible, 80)
      // All sum is 100
      assert.strictEqual(records[0].__totals.all, 100)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  5. Quantitative Domain Calculation                                        */
  /* -------------------------------------------------------------------------- */
  describe("Quantitative Domain Calculation", () => {
    it("should anchor domain at zero and enclose maximum visible total with padding", () => {
      const completeData = [
        { quarter: "Q1", compute: 40, storage: 30, network: 30 }, // 100
        { quarter: "Q2", compute: 50, storage: 40, network: 45 }, // 135
      ]
      const { records } = normalizeStackLedgerData(
        completeData,
        "quarter",
        sampleSeries,
        allSeriesKeys
      )

      const domain = calculateStackLedgerDomain(records)
      assert.strictEqual(domain[0], 0)
      assert.strictEqual(domain[1] >= 135, true)
      assert.strictEqual(domain[1], Math.ceil(135 * 1.08))
    })

    it("should support custom domain overrides", () => {
      const { records } = normalizeStackLedgerData(
        sampleData,
        "quarter",
        sampleSeries,
        allSeriesKeys
      )

      const explicitDomain = calculateStackLedgerDomain(records, [0, 200])
      assert.deepStrictEqual(explicitDomain, [0, 200])

      const funcDomain = calculateStackLedgerDomain(records, ([min, max]) => [min, max + 50])
      assert.strictEqual(funcDomain[0], 0)
      assert.strictEqual(funcDomain[1] > 100, true)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  6. Static Markup & Accessibility HTML Table Rendering                     */
  /* -------------------------------------------------------------------------- */
  describe("Static Markup & Accessibility HTML Table Rendering", () => {
    it("should render root figure with region role and tabIndex={0}", () => {
      const html = renderToStaticMarkup(
        React.createElement(StackLedgerBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          layout: "vertical",
        })
      )

      assert.strictEqual(html.includes('role="region"'), true)
      assert.strictEqual(html.includes('tabindex="0"'), true)
      assert.strictEqual(html.includes("plotcn-bar-stack-ledger"), true)
      assert.strictEqual(html.includes("sr-only"), true)
    })

    it("should render offscreen accessible HTML table with category, contributors, and totals", () => {
      const html = renderToStaticMarkup(
        React.createElement(StackLedgerBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.strictEqual(html.includes("<table>"), true)
      assert.strictEqual(html.includes('<th scope="col">quarter</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Compute</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Storage</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Network</th>'), true)
      assert.strictEqual(html.includes('<th scope="col">Total</th>'), true)
      // East/Q3 with null storage should have Unavailable
      assert.strictEqual(html.includes("Unavailable"), true)
    })

    it("should render interactive series legend with configured contributor labels", () => {
      const html = renderToStaticMarkup(
        React.createElement(StackLedgerBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          showLegend: true,
        })
      )

      assert.strictEqual(html.includes('role="toolbar"'), true)
      assert.strictEqual(html.includes("Compute"), true)
      assert.strictEqual(html.includes("Storage"), true)
      assert.strictEqual(html.includes("Network"), true)
    })

    it("should render empty state cleanly when dataset is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(StackLedgerBars, {
          data: [],
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.strictEqual(html.includes("No Categorical Data"), true)
    })

    it("should render error state cleanly when series array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(StackLedgerBars, {
          data: sampleData,
          categoryKey: "quarter",
          series: [],
        })
      )

      assert.strictEqual(html.includes("No Additive Series Defined"), true)
    })

    it("should declare constant STACK_ID as 'ledger'", () => {
      assert.strictEqual(STACK_ID, "ledger")
    })
  })
})
