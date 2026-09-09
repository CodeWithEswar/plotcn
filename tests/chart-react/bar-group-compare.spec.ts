import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import {
  GroupCompareBars,
  normalizeGroupCompareData,
  calculateGroupCompareDomain,
  isFiniteNumber,
  type GroupCompareBarSeries,
} from "../../registry/recharts/bar-group-compare"

describe("Component 021: Group Compare Bars (bar-group-compare)", () => {
  type QuarterRecord = {
    quarter: string
    current: number | null
    previous: number | null
  }

  const sampleSeries: readonly GroupCompareBarSeries<QuarterRecord>[] = [
    { key: "current", label: "Current Year", color: "#3b82f6" },
    { key: "previous", label: "Previous Year", color: "#10b981" },
  ]

  const sampleData: QuarterRecord[] = [
    { quarter: "Q1", current: 184, previous: 163 },
    { quarter: "Q2", current: 216, previous: 191 },
    { quarter: "Q3", current: 228, previous: 207 },
    { quarter: "Q4", current: 252, previous: 236 },
  ]

  describe("Algorithmic Helpers: Finite & Normalization", () => {
    it("should correctly identify finite numbers", () => {
      assert.equal(isFiniteNumber(100), true)
      assert.equal(isFiniteNumber(0), true)
      assert.equal(isFiniteNumber(-42), true)
      assert.equal(isFiniteNumber(null), false)
      assert.equal(isFiniteNumber(undefined), false)
      assert.equal(isFiniteNumber(NaN), false)
      assert.equal(isFiniteNumber(Infinity), false)
      assert.equal(isFiniteNumber(-Infinity), false)
      assert.equal(isFiniteNumber("100"), false)
    })

    it("should strictly preserve caller category order without automatic sorting", () => {
      const unorderedData: QuarterRecord[] = [
        { quarter: "Q3", current: 228, previous: 207 },
        { quarter: "Q1", current: 184, previous: 163 },
        { quarter: "Q4", current: 252, previous: 236 },
        { quarter: "Q2", current: 216, previous: 191 },
      ]

      const { records } = normalizeGroupCompareData(
        unorderedData,
        "quarter",
        sampleSeries,
        ["current", "previous"]
      )

      assert.equal(records.length, 4)
      assert.equal(records[0].__category, "Q3")
      assert.equal(records[1].__category, "Q1")
      assert.equal(records[2].__category, "Q4")
      assert.equal(records[3].__category, "Q2")
    })

    it("should preserve configured series order strictly", () => {
      const threeSeries: readonly GroupCompareBarSeries<{
        month: string
        web: number | null
        mobile: number | null
        partner: number | null
      }>[] = [
        { key: "web", label: "Web" },
        { key: "mobile", label: "Mobile" },
        { key: "partner", label: "Partner" },
      ]

      const data = [{ month: "Jan", web: 10, mobile: 50, partner: 5 }]

      const { records } = normalizeGroupCompareData(data, "month", threeSeries, [
        "web",
        "mobile",
        "partner",
      ])

      // Keys must remain mapped without dynamic reordering
      assert.equal(records[0].web, 10)
      assert.equal(records[0].mobile, 50)
      assert.equal(records[0].partner, 5)
    })
  })

  describe("Zero-Inclusive Shared Domain Calculation", () => {
    it("should anchor at zero and add padding for all-positive data", () => {
      const [min, max] = calculateGroupCompareDomain(20, 100)
      assert.equal(min, 0)
      assert.ok(max >= 100)
    })

    it("should anchor at zero and add negative padding for all-negative data", () => {
      const [min, max] = calculateGroupCompareDomain(-80, -10)
      assert.ok(min <= -80)
      assert.equal(max, 0)
    })

    it("should span both negative and positive ranges for mixed-sign data", () => {
      const [min, max] = calculateGroupCompareDomain(-40, 120)
      assert.ok(min <= -40)
      assert.ok(max >= 120)
    })

    it("should support explicit domain overrides", () => {
      const [min, max] = calculateGroupCompareDomain(10, 50, [0, 200])
      assert.equal(min, 0)
      assert.equal(max, 200)
    })

    it("should provide safe fallback when min and max are both zero", () => {
      const [min, max] = calculateGroupCompareDomain(0, 0)
      assert.equal(min, 0)
      assert.equal(max, 10)
    })
  })

  describe("Zero Values vs Missing Values & Slot Reservation", () => {
    it("should treat zero as a valid numeric measure", () => {
      const dataWithZero: QuarterRecord[] = [{ quarter: "Q1", current: 0, previous: 150 }]
      const { records, hasAnyValidMeasure } = normalizeGroupCompareData(
        dataWithZero,
        "quarter",
        sampleSeries,
        ["current", "previous"]
      )

      assert.equal(hasAnyValidMeasure, true)
      assert.equal(records[0].current, 0)
      assert.equal(records[0].previous, 150)
    })

    it("should sanitize non-finite values to null without throwing", () => {
      const dataWithNulls: QuarterRecord[] = [
        { quarter: "Q1", current: 184, previous: null },
        { quarter: "Q2", current: NaN as unknown as number, previous: 191 },
        { quarter: "Q3", current: Infinity as unknown as number, previous: 207 },
      ]

      const { records } = normalizeGroupCompareData(
        dataWithNulls,
        "quarter",
        sampleSeries,
        ["current", "previous"]
      )

      assert.equal(records[0].current, 184)
      assert.equal(records[0].previous, null)
      assert.equal(records[1].current, null)
      assert.equal(records[1].previous, 191)
      assert.equal(records[2].current, null)
      assert.equal(records[2].previous, 207)
    })

    it("should preserve slot reservation for missing series without shifting keys", () => {
      const data: QuarterRecord[] = [
        { quarter: "Q1", current: 100, previous: 80 },
        { quarter: "Q2", current: 120, previous: null }, // previous is missing
      ]

      const { records } = normalizeGroupCompareData(
        data,
        "quarter",
        sampleSeries,
        ["current", "previous"]
      )

      // Q2 current remains in "current" field, previous is null (slot reserved)
      assert.equal(records[1].current, 120)
      assert.equal(records[1].previous, null)
      assert.equal(Object.prototype.hasOwnProperty.call(records[1], "current"), true)
      assert.equal(Object.prototype.hasOwnProperty.call(records[1], "previous"), true)
    })
  })

  describe("Negative & Mixed-Sign Handling", () => {
    it("should accurately track minimum observed negative values", () => {
      const mixedData: QuarterRecord[] = [
        { quarter: "Q1", current: 40, previous: -15 },
        { quarter: "Q2", current: -35, previous: 50 },
      ]

      const { minObserved, maxObserved } = normalizeGroupCompareData(
        mixedData,
        "quarter",
        sampleSeries,
        ["current", "previous"]
      )

      assert.equal(minObserved, -35)
      assert.equal(maxObserved, 50)
    })
  })

  describe("Static Markup & Accessibility HTML Table Rendering", () => {
    it("should render root figure with region role and tabIndex={0}", () => {
      const html = renderToStaticMarkup(
        React.createElement(GroupCompareBars<QuarterRecord>, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<figure"))
      assert.ok(html.includes('role="region"'))
      assert.ok(html.includes('tabindex="0"'))
    })

    it("should render offscreen accessible HTML table with category and peer columns", () => {
      const html = renderToStaticMarkup(
        React.createElement(GroupCompareBars<QuarterRecord>, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<table"))
      assert.ok(html.includes('<th scope="col">Category</th>'))
      assert.ok(html.includes('<th scope="col">Current Year</th>'))
      assert.ok(html.includes('<th scope="col">Previous Year</th>'))
      assert.ok(html.includes("Q1"))
      assert.ok(html.includes("Q2"))
      assert.ok(html.includes("184"))
      assert.ok(html.includes("163"))
    })

    it("should render interactive series legend with configured peer labels", () => {
      const html = renderToStaticMarkup(
        React.createElement(GroupCompareBars<QuarterRecord>, {
          data: sampleData,
          categoryKey: "quarter",
          series: sampleSeries,
          showLegend: true,
        })
      )

      assert.ok(html.includes('role="toolbar"'))
      assert.ok(html.includes("Current Year"))
      assert.ok(html.includes("Previous Year"))
    })

    it("should render empty state cleanly when dataset is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(GroupCompareBars<QuarterRecord>, {
          data: [],
          categoryKey: "quarter",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Categorical Data"))
    })

    it("should render error state cleanly when series array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(GroupCompareBars<QuarterRecord>, {
          data: sampleData,
          categoryKey: "quarter",
          series: [],
        })
      )

      assert.ok(html.includes("No Peer Series Defined"))
    })
  })
})
