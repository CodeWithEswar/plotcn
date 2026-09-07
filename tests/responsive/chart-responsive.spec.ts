import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  chartBreakpoints,
  resolveBreakpoint,
  isCompact,
  resolveResponsiveMargins,
  estimateLabelWidth,
  calculateTargetTickCount,
  resolveAdaptiveTicks,
  resolveCategoricalTicks,
  resolveResponsiveLegend,
  truncateResponsiveLabel,
  getRecommendedLabelLength,
  resolveAnnotationDensity,
  resolveInteractionPolicy,
  resolveEffectiveDpr,
  detectPointerCapabilities,
  detectReducedMotion,
  shouldUpdateSize,
  normalizeDimensions,
} from "../../packages/chart-responsive/src"

describe("Section 7: Responsive Breakpoints & Dimensions", () => {
  it("should map container widths to semantic chart breakpoints", () => {
    assert.equal(resolveBreakpoint(320), "xs")
    assert.equal(resolveBreakpoint(359), "xs")
    assert.equal(resolveBreakpoint(360), "sm")
    assert.equal(resolveBreakpoint(479), "sm")
    assert.equal(resolveBreakpoint(480), "md")
    assert.equal(resolveBreakpoint(719), "md")
    assert.equal(resolveBreakpoint(720), "lg")
    assert.equal(resolveBreakpoint(959), "lg")
    assert.equal(resolveBreakpoint(960), "xl")
    assert.equal(resolveBreakpoint(1440), "xl")
  })

  it("should determine compact mode based on width or breakpoint", () => {
    assert.equal(isCompact("xs"), true)
    assert.equal(isCompact("sm"), true)
    assert.equal(isCompact("md"), false)
    assert.equal(isCompact("lg"), false)
    assert.equal(isCompact("xl"), false)

    assert.equal(isCompact(320), true)
    assert.equal(isCompact(479), true)
    assert.equal(isCompact(480), false)
    assert.equal(isCompact(1024), false)
  })

  it("should ignore subpixel jitter below threshold to prevent resize thrashing", () => {
    const current = { width: 500, height: 300 }
    // Delta 0.2px is below default 0.5px threshold
    assert.equal(shouldUpdateSize(current, { width: 500.2, height: 300 }), false)
    assert.equal(shouldUpdateSize(current, { width: 500, height: 300.25 }), false)

    // Delta >= 0.5px is accepted
    assert.equal(shouldUpdateSize(current, { width: 500.5, height: 300 }), true)
    assert.equal(shouldUpdateSize(current, { width: 500, height: 301 }), true)
  })

  it("should normalize dimensions and prevent negative or NaN values", () => {
    const norm1 = normalizeDimensions(-50, 100)
    assert.equal(norm1.width, 0)
    assert.equal(norm1.height, 100)

    const norm2 = normalizeDimensions(NaN, Infinity)
    assert.equal(norm2.width, 0)
    assert.equal(norm2.height, 0)
  })
})

describe("Section 7: Adaptive Margins Policy", () => {
  it("should compute compact margins without clipping tick labels", () => {
    const compactMargins = resolveResponsiveMargins({
      breakpoint: "xs",
      isCompact: true,
    })

    // Must preserve minimum left margin (>= 28px) so numbers are not cut off
    assert.ok(compactMargins.left >= 28, "Left margin must be >= 28px")
    assert.ok(compactMargins.top >= 8)
    assert.ok(compactMargins.bottom >= 20)
  })

  it("should expand margins when axis titles or legends are present", () => {
    const base = resolveResponsiveMargins({ breakpoint: "md" })
    const withTitles = resolveResponsiveMargins({
      breakpoint: "md",
      hasYAxisTitle: true,
      hasXAxisTitle: true,
    })

    assert.ok(withTitles.left > base.left, "Left margin should increase for Y axis title")
    assert.ok(withTitles.bottom > base.bottom, "Bottom margin should increase for X axis title")

    const withLegend = resolveResponsiveMargins({
      breakpoint: "md",
      hasLegend: true,
      legendPosition: "bottom",
    })
    assert.ok(withLegend.bottom > base.bottom, "Bottom margin should increase for bottom legend")
  })
})

describe("Section 7: Automatic Tick Manager", () => {
  it("should estimate label width using fast character heuristics and cache", () => {
    const cache = new Map<string, number>()
    const w1 = estimateLabelWidth("Jan 2026", 12, cache)
    assert.ok(w1 >= 40 && w1 <= 100)
    assert.ok(cache.has("Jan 2026"))

    // Second call hits cache
    const w2 = estimateLabelWidth("Jan 2026", 12, cache)
    assert.equal(w1, w2)
  })

  it("should calculate target tick count based on plot length and label footprint", () => {
    // 300px plot length / (48px label + 16px gap = 64px) ≈ 4 ticks
    const count300 = calculateTargetTickCount(300, 48, 16)
    assert.equal(count300, 4)

    // 800px plot length / 64px ≈ 12 ticks
    const count800 = calculateTargetTickCount(800, 48, 16)
    assert.equal(count800, 12)

    // Clamps at zero for zero or negative plot length
    assert.equal(calculateTargetTickCount(0), 0)
    assert.equal(calculateTargetTickCount(-50), 0)
  })

  it("should detect tick collisions and preserve endpoints under preserve-both strategy", () => {
    // 10 candidate ticks positioned closely on a 300px axis
    const ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const resolved = resolveAdaptiveTicks({
      ticks,
      plotLength: 300,
      getPosition: (v) => (v / 100) * 300,
      formatLabel: (v) => `₹${v}K`,
      minGap: 16,
      strategy: "preserve-both",
    })

    // Must preserve first (0) and last (100)
    assert.equal(resolved[0].value, 0)
    assert.equal(resolved[resolved.length - 1].value, 100)

    // Colliding middle ticks must have been thinned out
    assert.ok(resolved.length < ticks.length, "Should thin overlapping ticks")

    // Verify no adjacent ticks collide
    for (let i = 0; i < resolved.length - 1; i++) {
      const t1 = resolved[i]
      const t2 = resolved[i + 1]
      assert.ok(t2.position > t1.position)
    }
  })

  it("should thin categorical axis labels without removing data points", () => {
    // 24 months of categorical bar data
    const months = Array.from({ length: 24 }, (_, i) => `Month ${i + 1}`)
    const result = resolveCategoricalTicks(months, 400, (m) => m, 50)

    // All 24 data marks MUST remain present
    assert.equal(result.length, 24)

    // Only a subset of labels should show tick text to prevent overlap
    const visibleTicks = result.filter((r) => r.showTick)
    assert.ok(visibleTicks.length < 24)
    assert.ok(visibleTicks.length >= 4)
    // First month should be visible
    assert.equal(result[0].showTick, true)
  })
})

describe("Section 7: Legend Adaptation Policy", () => {
  it("should hide legend for single series charts by default", () => {
    const single = resolveResponsiveLegend({
      seriesCount: 1,
      containerWidth: 600,
    })
    assert.equal(single.mode, "hidden")

    const forced = resolveResponsiveLegend({
      seriesCount: 1,
      containerWidth: 600,
      showSingleSeriesLegend: true,
    })
    assert.equal(forced.mode, "bottom")
  })

  it("should make multi-series legends scrollable and collapsible on compact screens", () => {
    const compact = resolveResponsiveLegend({
      seriesCount: 6,
      containerWidth: 360,
      isCompact: true,
    })
    assert.equal(compact.mode, "bottom")
    assert.equal(compact.scrollable, true)
    assert.equal(compact.collapsible, true)
  })

  it("should support side legend on spacious desktop screens with few series", () => {
    const desktop = resolveResponsiveLegend({
      seriesCount: 4,
      containerWidth: 1024,
      preferredPosition: "right",
    })
    assert.equal(desktop.mode, "side")
  })
})

describe("Section 7: Label Truncation & Priority", () => {
  it("should truncate long labels while preserving full original value for tooltips", () => {
    const truncated = truncateResponsiveLabel("Customer Acquisition Cost", 12)
    assert.equal(truncated.isTruncated, true)
    assert.equal(truncated.display, "Customer Ac…")
    assert.equal(truncated.original, "Customer Acquisition Cost")

    const short = truncateResponsiveLabel("Revenue", 12)
    assert.equal(short.isTruncated, false)
    assert.equal(short.display, "Revenue")
  })

  it("should provide recommended label lengths per breakpoint", () => {
    assert.equal(getRecommendedLabelLength("xs"), 8)
    assert.equal(getRecommendedLabelLength("sm"), 12)
    assert.equal(getRecommendedLabelLength("md"), 18)
    assert.equal(getRecommendedLabelLength("lg"), 24)
    assert.equal(getRecommendedLabelLength("xl"), 36)
  })
})

describe("Section 7: Annotation Density Policy", () => {
  it("should scale annotation density from minimal on xs to full on xl", () => {
    assert.equal(resolveAnnotationDensity("xs"), "minimal")
    assert.equal(resolveAnnotationDensity("sm"), "standard")
    assert.equal(resolveAnnotationDensity("md"), "standard")
    assert.equal(resolveAnnotationDensity("lg"), "full")
    assert.equal(resolveAnnotationDensity("xl"), "full")
  })
})

describe("Section 7: Interaction & Touch Policy", () => {
  it("should enlarge hit targets and enable scrub tooltips for coarse pointers", () => {
    const touchPolicy = resolveInteractionPolicy({
      containerWidth: 380,
      pointer: "coarse",
      hover: false,
    })

    assert.equal(touchPolicy.minimumHitTarget, 32, "Coarse pointer must have >= 32px hit target")
    assert.equal(touchPolicy.hoverTooltip, false)
    assert.equal(touchPolicy.tapTooltip, true)
    assert.equal(touchPolicy.scrubTooltip, true)
    // Must NOT hijack page scrolling
    assert.equal(touchPolicy.touchAction, "auto")
    assert.equal(touchPolicy.allowsPageScroll, true)
  })

  it("should use precision hit targets and hover tooltips for fine pointers", () => {
    const mousePolicy = resolveInteractionPolicy({
      containerWidth: 960,
      pointer: "fine",
      hover: true,
    })

    assert.equal(mousePolicy.minimumHitTarget, 14)
    assert.equal(mousePolicy.hoverTooltip, true)
    assert.equal(mousePolicy.scrubTooltip, false)
  })

  it("should apply pan-y when horizontal zoom or brush is enabled to allow vertical scrolling", () => {
    const zoomPolicy = resolveInteractionPolicy({
      containerWidth: 600,
      pointer: "coarse",
      enableZoom: true,
    })

    assert.equal(zoomPolicy.touchAction, "pan-y")
    assert.equal(zoomPolicy.allowsPageScroll, true)
  })
})

describe("Section 7: Environment Detection & Canvas DPR Capping", () => {
  it("should cap device pixel ratio to prevent canvas memory explosion", () => {
    // Cap at default 2
    assert.equal(resolveEffectiveDpr(2, 3), 2)
    assert.equal(resolveEffectiveDpr(2, 4), 2)
    assert.equal(resolveEffectiveDpr(2, 1), 1)
    assert.equal(resolveEffectiveDpr(2, 1.5), 1.5)

    // Custom cap
    assert.equal(resolveEffectiveDpr(1.5, 3), 1.5)
  })

  it("should execute environment detection safely in Node/SSR environment", () => {
    const pointer = detectPointerCapabilities()
    assert.ok(pointer.pointer === "fine" || pointer.pointer === "coarse")
    assert.equal(typeof pointer.hover, "boolean")

    const motion = detectReducedMotion()
    assert.equal(typeof motion, "boolean")
  })
})
