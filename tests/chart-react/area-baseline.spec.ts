import { describe, it } from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  BaselineArea,
  classifyAgainstBaseline,
  calculateBaselineAreaDomain,
  calculateBaselineGradientOffset,
  normalizeBaselineData,
} from "../../registry/recharts/area-baseline"

describe("Component 017: Baseline Area (area-baseline)", () => {
  const sampleData = [
    { day: "Day 01", utilization: 68 },
    { day: "Day 02", utilization: 72 },
    { day: "Day 03", utilization: 84 },
    { day: "Day 04", utilization: 89 },
    { day: "Day 05", utilization: 75 },
    { day: "Day 06", utilization: 61 },
  ]

  const series = {
    key: "utilization" as const,
    label: "Resource Utilization",
    valueFormatter: (v: number) => `${v}%`,
  }

  /* -------------------------------------------------------------------------- */
  /*  1. Mathematical Classification Logic                                     */
  /* -------------------------------------------------------------------------- */
  describe("Mathematical Classification Logic", () => {
    it("should classify values greater than baseline as above", () => {
      assert.strictEqual(classifyAgainstBaseline(85, 75), "above")
      assert.strictEqual(classifyAgainstBaseline(75.001, 75), "above")
    })

    it("should classify values less than baseline as below", () => {
      assert.strictEqual(classifyAgainstBaseline(65, 75), "below")
      assert.strictEqual(classifyAgainstBaseline(74.999, 75), "below")
    })

    it("should classify values equal to baseline as equal", () => {
      assert.strictEqual(classifyAgainstBaseline(75, 75), "equal")
      assert.strictEqual(classifyAgainstBaseline(0, 0), "equal")
      assert.strictEqual(classifyAgainstBaseline(-50, -50), "equal")
    })

    it("should classify positive raw values as below baseline when baseline is higher", () => {
      // 80 is positive, but baseline is 100 -> deviation is -20 -> below
      assert.strictEqual(classifyAgainstBaseline(80, 100), "below")
    })

    it("should classify negative raw values as above baseline when baseline is more negative", () => {
      // -80 is negative, but baseline is -100 -> deviation is +20 -> above
      assert.strictEqual(classifyAgainstBaseline(-80, -100), "above")
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  2. Domain Calculation & Safety                                            */
  /* -------------------------------------------------------------------------- */
  describe("Domain Calculation & Safety", () => {
    it("should enclose all observations AND the reference baseline in automatic domain", () => {
      const normalized = normalizeBaselineData(sampleData, "utilization")
      const [min, max] = calculateBaselineAreaDomain(normalized, 75)

      // Min value is 61, max is 89, baseline is 75
      assert.ok(min <= 61, `Domain min ${min} should be <= data min 61`)
      assert.ok(max >= 89, `Domain max ${max} should be >= data max 89`)
      assert.ok(min <= 75 && max >= 75, "Domain must enclose the baseline 75")
    })

    it("should enclose baseline even when all observations are above it", () => {
      const allAbove = normalizeBaselineData(
        [{ val: 120 }, { val: 130 }, { val: 140 }],
        "val"
      )
      const [min, max] = calculateBaselineAreaDomain(allAbove, 100)

      assert.ok(min <= 100, `Domain min ${min} must enclose baseline 100`)
      assert.ok(max >= 140, `Domain max ${max} must enclose data max 140`)
    })

    it("should enclose baseline even when all observations are below it", () => {
      const allBelow = normalizeBaselineData(
        [{ val: 40 }, { val: 50 }, { val: 60 }],
        "val"
      )
      const [min, max] = calculateBaselineAreaDomain(allBelow, 100)

      assert.ok(min <= 40, `Domain min ${min} must enclose data min 40`)
      assert.ok(max >= 100, `Domain max ${max} must enclose baseline 100`)
    })

    it("should handle negative baseline correctly", () => {
      const negData = normalizeBaselineData(
        [{ val: -30 }, { val: -10 }],
        "val"
      )
      const [min, max] = calculateBaselineAreaDomain(negData, -20)

      assert.ok(min <= -30, "Domain min must enclose -30")
      assert.ok(max >= -10, "Domain max must enclose -10")
    })

    it("should safely expand constant single-value datasets equal to baseline", () => {
      const constant = normalizeBaselineData(
        [{ val: 75 }, { val: 75 }, { val: 75 }],
        "val"
      )
      const [min, max] = calculateBaselineAreaDomain(constant, 75)

      assert.ok(min < 75, "Domain min should be padded below constant 75")
      assert.ok(max > 75, "Domain max should be padded above constant 75")
    })

    it("should respect explicit numeric domain bounds", () => {
      const normalized = normalizeBaselineData(sampleData, "utilization")
      const domain = calculateBaselineAreaDomain(normalized, 75, [50, 100])
      assert.deepStrictEqual(domain, [50, 100])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  3. Hard-Stop Gradient Offset Calculation                                  */
  /* -------------------------------------------------------------------------- */
  describe("Hard-Stop Gradient Offset Calculation", () => {
    it("should calculate exact offset when baseline is centered in data range", () => {
      // max = 100, min = 50, baseline = 75 -> offset = (100 - 75) / (100 - 50) = 25 / 50 = 0.5
      const offset = calculateBaselineGradientOffset(50, 100, 75)
      assert.strictEqual(offset, 0.5)
    })

    it("should clamp to 1.0 when baseline is at or below domain min (all above)", () => {
      // max = 150, min = 100, baseline = 100 -> offset = (150 - 100) / (150 - 100) = 1.0
      const offset = calculateBaselineGradientOffset(100, 150, 100)
      assert.strictEqual(offset, 1)
    })

    it("should clamp to 0.0 when baseline is at or above domain max (all below)", () => {
      // max = 100, min = 60, baseline = 100 -> offset = (100 - 100) / (100 - 60) = 0.0
      const offset = calculateBaselineGradientOffset(60, 100, 100)
      assert.strictEqual(offset, 0)
    })

    it("should handle non-finite edge cases gracefully", () => {
      assert.strictEqual(calculateBaselineGradientOffset(NaN, 100, 75), 0.5)
      assert.strictEqual(calculateBaselineGradientOffset(50, Infinity, 75), 0.5)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  4. Data Normalization & Immutability                                      */
  /* -------------------------------------------------------------------------- */
  describe("Data Normalization & Immutability", () => {
    it("should sanitize NaN and Infinity to null without crashing", () => {
      const messy = [
        { day: "D1", val: 50 },
        { day: "D2", val: NaN },
        { day: "D3", val: Infinity },
        { day: "D4", val: 65 },
      ]
      const normalized = normalizeBaselineData(messy, "val")
      assert.strictEqual(normalized[0]._normalizedValue, 50)
      assert.strictEqual(normalized[1]._normalizedValue, null)
      assert.strictEqual(normalized[2]._normalizedValue, null)
      assert.strictEqual(normalized[3]._normalizedValue, 65)
    })

    it("should preserve original caller data immutably", () => {
      const original = Object.freeze([
        Object.freeze({ day: "D1", val: 50 }),
        Object.freeze({ day: "D2", val: 60 }),
      ])
      const normalized = normalizeBaselineData(original, "val")
      assert.strictEqual(normalized.length, 2)
      assert.strictEqual(original[0].val, 50)
      assert.strictEqual((original[0] as any)._normalizedValue, undefined)
    })
  })

  /* -------------------------------------------------------------------------- */
  /*  5. Rendering & Accessibility Structure                                    */
  /* -------------------------------------------------------------------------- */
  describe("Rendering & Accessibility Structure", () => {
    it("should render semantic figure container with accessibility attributes", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: sampleData,
          xKey: "day",
          series: series,
          baseline: 75,
          title: "Server CPU Utilization",
        })
      )

      assert.ok(html.includes('<figure role="region"'), "Must contain root figure element")
      assert.ok(html.includes('aria-label="Server CPU Utilization"'), "Must carry accessible label")
      assert.ok(html.includes('tabindex="0"'), "Must be keyboard focusable")
    })

    it("should include off-screen structured HTML table with baseline & deviation columns", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: sampleData,
          xKey: "day",
          series: series,
          baseline: 75,
        })
      )

      assert.ok(html.includes('<div class="sr-only">'), "Must provide screen-reader-only container")
      assert.ok(html.includes("<th scope=\"col\">Reference Baseline</th>"), "Must list Reference Baseline header")
      assert.ok(html.includes("<th scope=\"col\">Deviation</th>"), "Must list Deviation header")
      assert.ok(html.includes("<th scope=\"col\">Position</th>"), "Must list Position header")
      // Check for factual deviation arithmetic (+14, -14)
      assert.ok(html.includes("<td>+14</td>"), "Must report +14 deviation for 89")
      assert.ok(html.includes("<td>-14</td>"), "Must report -14 deviation for 61")
      assert.ok(html.includes("<td>0</td>"), "Must report 0 deviation for exact baseline 75")
    })

    it("should render status legend when showLegend=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: sampleData,
          xKey: "day",
          series: series,
          baseline: 75,
          showLegend: true,
          aboveLabel: "Above SLA",
          belowLabel: "Below SLA",
          baselineLabel: "Reference Baseline",
        })
      )

      assert.ok(html.includes("Above SLA"), "Legend must show aboveLabel")
      assert.ok(html.includes("Below SLA"), "Legend must show belowLabel")
      assert.ok(html.includes("Reference Baseline (75)"), "Legend must show baselineLabel with value")
    })

    it("should render truthful empty state when data is empty", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: [],
          xKey: "day",
          series: series,
          baseline: 75,
        })
      )

      assert.ok(html.includes('role="status"'), "Empty state must have role status")
      assert.ok(html.includes("No observations available"), "Must render empty state message")
    })

    it("should render truthful loading skeleton when loading=true", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: sampleData,
          xKey: "day",
          series: series,
          baseline: 75,
          loading: true,
        })
      )

      assert.ok(html.includes('role="status"'), "Loading state must have role status")
      assert.ok(html.includes("Loading baseline observation records"), "Must render loading message")
    })

    it("should reject non-finite baseline with an explicit configuration error", () => {
      const html = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: sampleData,
          xKey: "day",
          series: series,
          baseline: NaN as any,
        })
      )

      assert.ok(html.includes('role="alert"'), "Must render error alert role")
      assert.ok(html.includes("Invalid baseline reference"), "Must display invalid baseline error title")
    })

    it("should render gapped data safely under missingValuePolicy gap and connect", () => {
      const gappedData = [
        { day: "Day 01", utilization: 68 },
        { day: "Day 03", utilization: 84 },
        { day: "Day 05", utilization: null },
        { day: "Day 07", utilization: 89 },
      ]

      const htmlGap = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: gappedData,
          xKey: "day",
          series: series,
          baseline: 75,
          missingValuePolicy: "gap",
        })
      )
      assert.ok(htmlGap.includes("recharts-responsive-container"), "Must render ResponsiveContainer for gap policy")
      assert.ok(htmlGap.includes("Unavailable"), "Must label missing observation as Unavailable in accessibility table")

      const htmlConnect = renderToStaticMarkup(
        React.createElement(BaselineArea, {
          data: gappedData,
          xKey: "day",
          series: series,
          baseline: 75,
          missingValuePolicy: "connect",
        })
      )
      assert.ok(htmlConnect.includes("recharts-responsive-container"), "Must render ResponsiveContainer for connect policy")
    })
  })
})
