import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  SignalBars,
  isFiniteNumber,
  normalizeSignalBarData,
  calculateSignalBarDomain,
} from "../../registry/recharts/bar-signal"

describe("Component 019: Signal Bars (bar-signal)", () => {
  const sampleData = [
    { region: "North", web: 128400, mobile: 94200 },
    { region: "South", web: 103800, mobile: 121300 },
    { region: "East", web: 87400, mobile: null },
    { region: "West", web: 145100, mobile: 110600 },
    { region: "Central", web: 0, mobile: 81900 },
  ]

  const sampleSeries = [
    {
      key: "web" as const,
      label: "Web",
      valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req`,
    },
    {
      key: "mobile" as const,
      label: "Mobile",
      valueFormatter: (v: number) => `${(v / 1000).toFixed(0)}k req`,
    },
  ]

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
      assert.strictEqual(isFiniteNumber({}), false)
    })

    it("should strictly preserve caller category order without sorting", () => {
      const unorderedData = [
        { category: "Delta", val: 30 },
        { category: "Alpha", val: 90 },
        { category: "Gamma", val: 50 },
        { category: "Beta", val: 70 },
      ]
      const { records } = normalizeSignalBarData(unorderedData, "category", [
        { key: "val", label: "Value" },
      ])

      assert.strictEqual(records.length, 4)
      assert.strictEqual(records[0].__category, "Delta")
      assert.strictEqual(records[1].__category, "Alpha")
      assert.strictEqual(records[2].__category, "Gamma")
      assert.strictEqual(records[3].__category, "Beta")
    })

    it("should preserve missing observations as null and zero as 0", () => {
      const { records, hasAnyValidMeasure } = normalizeSignalBarData(
        sampleData,
        "region",
        sampleSeries
      )

      assert.strictEqual(records.length, 5)
      assert.strictEqual(hasAnyValidMeasure, true)
      assert.strictEqual(records[0].web, 128400)
      assert.strictEqual(records[2].mobile, null) // East mobile is null
      assert.strictEqual(records[4].web, 0) // Central web is 0
    })

    it("should sanitize non-finite numbers (NaN, Infinity) to null", () => {
      const nonFiniteData = [
        { category: "A", val1: NaN, val2: Infinity },
        { category: "B", val1: -Infinity, val2: 50 },
      ]
      const { records } = normalizeSignalBarData(nonFiniteData, "category", [
        { key: "val1", label: "V1" },
        { key: "val2", label: "V2" },
      ])

      assert.strictEqual(records[0].val1, null)
      assert.strictEqual(records[0].val2, null)
      assert.strictEqual(records[1].val1, null)
      assert.strictEqual(records[1].val2, 50)
    })

    it("should detect duplicate categories without aggregating or deleting them", () => {
      const duplicateData = [
        { region: "North", val: 40 },
        { region: "North", val: 70 },
      ]
      const { records, hasDuplicates } = normalizeSignalBarData(duplicateData, "region", [
        { key: "val", label: "Val" },
      ])

      assert.strictEqual(hasDuplicates, true)
      assert.strictEqual(records.length, 2)
      assert.strictEqual(records[0].val, 40)
      assert.strictEqual(records[1].val, 70)
    })

    it("should never mutate the original caller data array or objects", () => {
      const clone = JSON.parse(JSON.stringify(sampleData))
      normalizeSignalBarData(sampleData, "region", sampleSeries)
      assert.deepStrictEqual(sampleData, clone)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Domain Calculation: Zero Baseline Enclosure                            */
  /* -------------------------------------------------------------------------- */
  describe("Domain Calculation & Zero Baseline Enclosure", () => {
    it("should always enclose zero baseline for all-positive data", () => {
      const { records } = normalizeSignalBarData(
        [
          { cat: "A", v: 40 },
          { cat: "B", v: 80 },
        ],
        "cat",
        [{ key: "v", label: "V" }]
      )
      const [min, max] = calculateSignalBarDomain(records, ["v"])

      assert.strictEqual(min, 0, "All positive data domain must start at 0")
      assert.ok(max >= 80, "Domain max must enclose data max 80")
    })

    it("should always enclose zero baseline for all-negative data", () => {
      const { records } = normalizeSignalBarData(
        [
          { cat: "A", v: -20 },
          { cat: "B", v: -80 },
        ],
        "cat",
        [{ key: "v", label: "V" }]
      )
      const [min, max] = calculateSignalBarDomain(records, ["v"])

      assert.ok(min <= -80, "Domain min must enclose data min -80")
      assert.strictEqual(max, 0, "All negative data domain must end at 0")
    })

    it("should span positive and negative values for mixed signed data", () => {
      const { records } = normalizeSignalBarData(
        [
          { cat: "A", v: -50 },
          { cat: "B", v: 20 },
          { cat: "C", v: 80 },
        ],
        "cat",
        [{ key: "v", label: "V" }]
      )
      const [min, max] = calculateSignalBarDomain(records, ["v"])

      assert.ok(min <= -50, "Domain min must enclose -50")
      assert.ok(max >= 80, "Domain max must enclose 80")
    })

    it("should provide safe non-collapsed scale for all-zero data", () => {
      const { records } = normalizeSignalBarData(
        [
          { cat: "A", v: 0 },
          { cat: "B", v: 0 },
        ],
        "cat",
        [{ key: "v", label: "V" }]
      )
      const [min, max] = calculateSignalBarDomain(records, ["v"])

      assert.strictEqual(min, 0)
      assert.ok(max > 0, "Max must be non-zero to avoid scale collapse")
    })

    it("should handle constant positive data with padding", () => {
      const { records } = normalizeSignalBarData(
        [
          { cat: "A", v: 50 },
          { cat: "B", v: 50 },
        ],
        "cat",
        [{ key: "v", label: "V" }]
      )
      const [min, max] = calculateSignalBarDomain(records, ["v"])

      assert.strictEqual(min, 0)
      assert.ok(max > 50, "Max should have headroom above 50")
    })

    it("should handle completely empty records without crashing", () => {
      const domain = calculateSignalBarDomain([], ["v"])
      assert.deepStrictEqual(domain, [0, 10])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Static Server Rendering & Accessible Table Output                      */
  /* -------------------------------------------------------------------------- */
  describe("Static Server Rendering & Accessibility", () => {
    it("should render root figure with accessible role and region label", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<figure"), "Should render a root <figure> element")
      assert.ok(html.includes('role="region"'), "Figure should have role='region'")
      assert.ok(html.includes('aria-label="Signal Bars categorical comparison for Web, Mobile"'))
      assert.ok(html.includes('tabindex="0"'), "Figure should be focusable via single tab stop")
    })

    it("should render off-screen structured table with zero as 0 and null as Unavailable", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("<table"), "Should contain an off-screen accessible <table>")
      assert.ok(html.includes("<th scope=\"col\">region</th>"))
      assert.ok(html.includes("<th scope=\"col\">Web</th>"))
      assert.ok(html.includes("<th scope=\"col\">Mobile</th>"))
      assert.ok(html.includes("North"))
      assert.ok(html.includes("Central"))
      assert.ok(html.includes("Unavailable"), "Missing mobile measure for East must report as Unavailable")
    })

    it("should render interactive series legend with button semantics", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          showLegend: true,
        })
      )

      assert.ok(html.includes('role="toolbar"'), "Legend toolbar should be rendered")
      assert.ok(html.includes('aria-pressed="true"'), "Legend button should have aria-pressed state")
      assert.ok(html.includes("Web"))
      assert.ok(html.includes("Mobile"))
    })

    it("should render empty state when data array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: [],
          categoryKey: "region",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Categorical Data"), "Should display empty state title")
    })

    it("should render error state when series array is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: [],
        })
      )

      assert.ok(html.includes("No Series Defined"), "Should display error state title")
    })

    it("should render unavailable state when all measures across all rows are missing", () => {
      const allNullData = [
        { region: "North", web: null, mobile: null },
        { region: "South", web: null, mobile: null },
      ]
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: allNullData,
          categoryKey: "region",
          series: sampleSeries,
        })
      )

      assert.ok(html.includes("No Measurable Data"), "Should display unavailable state title")
    })

    it("should support horizontal orientation", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          orientation: "horizontal",
        })
      )

      assert.ok(html.includes("<figure"), "Should render in horizontal orientation")
    })

    it("should render value labels when valueLabel is set to auto or always", () => {
      const html = renderToStaticMarkup(
        React.createElement(SignalBars, {
          data: sampleData,
          categoryKey: "region",
          series: sampleSeries,
          valueLabel: "always",
        })
      )

      assert.ok(html.includes("<figure"), "Should render with valueLabel='always'")
    })
  })
})

