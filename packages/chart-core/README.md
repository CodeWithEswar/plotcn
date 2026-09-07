# @plotcn/chart-core

Pure visualization-domain mathematics, data validation, geometry, and formatting utilities for Plotcn.

## Architecture & Principles

`@plotcn/chart-core` sits strictly below every visualization engine.

```text
                         Plotcn Components
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
          Recharts             D3.js          Google Charts
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                          chart-core
                                │
                  Pure visualization logic
```

### Core Design Rules
1. **Zero React Dependencies**: No components, no hooks, no JSX.
2. **Zero DOM Dependencies**: No `window`, `document`, `ResizeObserver`, or DOM queries.
3. **Engine-Neutral**: No Recharts, D3-rendering, or Google runtime types.
4. **Deterministic & Pure**: Given identical inputs, functions always return identical outputs without side effects.
5. **Strict TypeScript**: 100% strict type safety, zero `any` usage.
6. **Immutable Operations**: Never mutates caller data or options.

## Subpath Modules

- `@plotcn/chart-core/dimensions`: `calculateInnerSize`, `createMargins`, `normalizeMargins`, `createBounds`, `calculateAspectRatioDimensions`.
- `@plotcn/chart-core/data`: `validateData`, `calculateNumericDomain`, `createSeries`, `extractSeriesValues`, `propertyAccessor`, `numericAccessor`, `isFiniteNumber`.
- `@plotcn/chart-core/scales`: `createLinearScale`, `createBandScale`, `createTimeScale`, `createLogScale`, `createOrdinalScale`, `generateNumericTicks`.
- `@plotcn/chart-core/coordinates`: `createPoint`, `pointsEqual`, `clampPoint`, `cartesianToPolar`, `polarToCartesian`.
- `@plotcn/chart-core/geometry`: `euclideanDistance`, `isPointInsideRect`, `rectIntersectsRect`, `isPointInsideCircle`, `lerp`, `inverseLerp`, `findNearestPoint`.
- `@plotcn/chart-core/formatting`: `formatNumber`, `formatCompactNumber`, `formatPercentage`, `formatCurrency`, `formatDate`, `formatDuration`.
- `@plotcn/chart-core/statistics`: `calculateExtent`, `calculateMin`, `calculateMax`, `calculateSum`, `calculateMean`, `calculateMedian`.
- `@plotcn/chart-core/types`: Dimensions, data contracts, and domain types.
- `@plotcn/chart-core/errors`: `ChartDataError`.
