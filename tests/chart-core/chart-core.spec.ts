import { describe, it } from "node:test"
import assert from "node:assert/strict"

import {
  calculateInnerSize,
  createMargins,
  createBounds,
  calculateAspectRatioDimensions,
} from "../../packages/chart-core/src/dimensions"

import {
  validateData,
  calculateNumericDomain,
  createSeries,
  extractSeriesValues,
  propertyAccessor,
  numericAccessor,
  isFiniteNumber,
} from "../../packages/chart-core/src/data"

import {
  createLinearScale,
  createBandScale,
  createTimeScale,
  createLogScale,
  generateNumericTicks,
} from "../../packages/chart-core/src/scales"

import {
  createPoint,
  pointsEqual,
  clampPoint,
  cartesianToPolar,
  polarToCartesian,
} from "../../packages/chart-core/src/coordinates"

import {
  euclideanDistance,
  isPointInsideRect,
  isPointInsideBounds,
  rectIntersectsRect,
  lerp,
  inverseLerp,
  findNearestPoint,
} from "../../packages/chart-core/src/geometry"

import {
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatCurrency,
  formatDuration,
} from "../../packages/chart-core/src/formatting"

import {
  calculateExtent,
  calculateMin,
  calculateMax,
  calculateSum,
  calculateMean,
  calculateMedian,
} from "../../packages/chart-core/src/statistics"

describe("@plotcn/chart-core Dimensions", () => {
  it("should calculate inner dimensions and clamp at zero", () => {
    const res = calculateInnerSize({ width: 500, height: 300 }, { top: 20, right: 20, bottom: 30, left: 30 })
    assert.equal(res.innerWidth, 450)
    assert.equal(res.innerHeight, 250)
    assert.equal(res.width, 500)
    assert.equal(res.height, 300)

    // Clamping test with oversized margins
    const clamped = calculateInnerSize({ width: 40, height: 40 }, { top: 30, bottom: 30, left: 30, right: 30 })
    assert.equal(clamped.innerWidth, 0)
    assert.equal(clamped.innerHeight, 0)
  })

  it("should calculate aspect ratio dimensions", () => {
    const r1 = calculateAspectRatioDimensions(800, 16 / 9)
    assert.equal(r1.width, 800)
    assert.equal(r1.height, 450)

    const r2 = calculateAspectRatioDimensions(800, 16 / 9, 300)
    assert.equal(r2.height, 300)
  })
})

describe("@plotcn/chart-core Data & Validation", () => {
  it("should validate clean datasets and handle empty state as valid", () => {
    const emptyResult = validateData([])
    assert.equal(emptyResult.valid, true)
    assert.equal(emptyResult.issues.length, 0)

    const cleanData = [{ val: 10 }, { val: 20 }]
    const cleanResult = validateData(cleanData, (d) => d.val)
    assert.equal(cleanResult.valid, true)

    const invalidData = [{ val: 10 }, { val: NaN }, { val: Infinity }]
    const invalidResult = validateData(invalidData, (d) => d.val)
    assert.equal(invalidResult.valid, false)
    assert.equal(invalidResult.issues.length, 2)
  })

  it("should compute numeric domains with policies including manual override", () => {
    const data = [{ v: 10 }, { v: 50 }, { v: 20 }]
    const exact = calculateNumericDomain(data, (d) => d.v, { policy: "exact" })
    assert.deepEqual(exact, [10, 50])

    const includeZero = calculateNumericDomain(data, (d) => d.v, { policy: "include-zero" })
    assert.deepEqual(includeZero, [0, 50])

    const symmetric = calculateNumericDomain(data, (d) => d.v, { policy: "symmetric" })
    assert.deepEqual(symmetric, [-50, 50])

    const manual = calculateNumericDomain(data, (d) => d.v, { policy: "manual", manualDomain: [5, 95] })
    assert.deepEqual(manual, [5, 95])
  })

  it("should extract series values without mutating original data", () => {
    const original = [{ x: "A", y: 100 }, { x: "B", y: 200 }]
    const series = createSeries("s1", "Series 1", (d: { x: string; y: number }) => d.y)
    const values = extractSeriesValues(original, series)
    assert.deepEqual(values, [100, 200])
    assert.equal(original.length, 2)
  })
})

describe("@plotcn/chart-core Scales & Math", () => {
  it("should create linear scale with invert and clamp", () => {
    const scale = createLinearScale([0, 100], [0, 500], true)
    assert.equal(scale(50), 250)
    assert.equal(scale(0), 0)
    assert.equal(scale(100), 500)
    assert.equal(scale(150), 500) // clamped
    assert.equal(scale.invert(250), 50)
  })

  it("should create band scale for categorical bars", () => {
    const band = createBandScale(["A", "B", "C"], [0, 300], 0.1)
    assert.ok(band.bandwidth > 0)
    assert.ok(band.step > band.bandwidth)
    assert.equal(band("A"), 0)
  })

  it("should generate clean numeric ticks", () => {
    const ticks = generateNumericTicks([0, 100], 5)
    assert.ok(ticks.length >= 4)
    assert.equal(ticks[0], 0)
    assert.equal(ticks[ticks.length - 1], 100)
  })
})

describe("@plotcn/chart-core Coordinates & Geometry", () => {
  it("should calculate distances and point containment with isPointInsideBounds", () => {
    const p1 = createPoint(0, 0)
    const p2 = createPoint(3, 4)
    assert.equal(euclideanDistance(p1, p2), 5)

    const bounds = createBounds(0, 0, 100, 100)
    assert.equal(isPointInsideRect(p2, bounds), true)
    assert.equal(isPointInsideBounds(p2, bounds), true)
    assert.equal(isPointInsideBounds(createPoint(150, 50), bounds), false)
  })

  it("should convert between Cartesian and Polar coordinates", () => {
    const cart = createPoint(10, 0)
    const polar = cartesianToPolar(cart)
    assert.equal(polar.radius, 10)
    assert.equal(polar.angle, 0)

    const backToCart = polarToCartesian(polar)
    assert.ok(pointsEqual(cart, backToCart))
  })

  it("should find nearest point in a dataset", () => {
    const items = [
      { id: "A", x: 10, y: 10 },
      { id: "B", x: 50, y: 50 },
      { id: "C", x: 90, y: 90 },
    ]
    const nearest = findNearestPoint(createPoint(48, 52), items, (d) => createPoint(d.x, d.y))
    assert.ok(nearest)
    assert.equal(nearest.item.id, "B")
  })
})

describe("@plotcn/chart-core Formatting & Statistics", () => {
  it("should format numbers, compact notation, percentages, and currencies with explicit options", () => {
    assert.equal(formatCompactNumber(1500), "1.5K")
    assert.equal(formatCompactNumber(2500000), "2.5M")
    assert.equal(formatPercentage(0.45, 0), "45%")
    assert.equal(formatCurrency(120, "USD"), "$120.00")
    assert.ok(formatCurrency(42500, { currency: "INR", locale: "en-IN" }).includes("42,500"))
    assert.equal(formatDuration(150), "2m 30s")
  })

  it("should compute statistical aggregations", () => {
    const data = [{ v: 10 }, { v: 20 }, { v: 30 }, { v: 40 }]
    const accessor = (d: { v: number }) => d.v

    assert.equal(calculateMin(data, accessor), 10)
    assert.equal(calculateMax(data, accessor), 40)
    assert.equal(calculateSum(data, accessor), 100)
    assert.equal(calculateMean(data, accessor), 25)
    assert.equal(calculateMedian(data, accessor), 25)

    const oddData = [{ v: 10 }, { v: 20 }, { v: 50 }]
    assert.equal(calculateMedian(oddData, accessor), 20)
  })
})
