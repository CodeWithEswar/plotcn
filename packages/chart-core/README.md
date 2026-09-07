# @plotcn/chart-core

The `chart-core` package contains the **engine-independent mathematical and data-processing foundation** used across Plotcn.

```text
UI-library independent
React-light or React-free
renderer independent
framework independent
engine independent
deterministic
strictly typed
```

Its responsibility is to centralize common visualization-domain operations such as:
* dimensions
* margins
* bounds
* domains
* accessors
* series metadata
* data validation
* normalization
* coordinates
* small reusable geometry
* scale-related policies
* formatting

It does not know whether the final visualization is rendered by:
* Recharts
* D3.js
* Google Charts
* SVG
* Canvas

> **Central Principle**: `chart-core` calculates visualization information. Engine packages decide how that information is rendered.

---

## 4.3.1 Architectural Position

`chart-core` sits underneath the three visualization engines.

```text
                         Plotcn Charts
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼

      Recharts               D3.js          Google Charts
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼

                         chart-core
                              │
                     Pure TypeScript
```

### Correct Dependency Direction

```text
Recharts implementation ─┐
D3 implementation ───────┼──→ chart-core
Google adapter ──────────┘
```

**Never**:

```text
chart-core
   │
   ├──→ Recharts
   ├──→ React
   └──→ Google Charts
```

---

## 4.3.2 Core Package Rules

Architectural invariants enforced across `chart-core`:

```text
No React components
No React hooks
No "use client"
No Next.js APIs
No shadcn/ui
No Tailwind CSS
No Motion for React
No Recharts components
No Google Charts runtime access
No DOM manipulation
No window/document access
No ResizeObserver
No localStorage
No network requests
```

All functions are:
- **Pure & Deterministic**: Same data, dimensions, and configuration always return the identical result. No `Math.random()`, `Date.now()`, or mutable global state.
- **Side-Effect Free**: Does not log, fetch, load external scripts, or mutate memory.
- **Immutable**: Caller-provided datasets are never mutated (e.g. no in-place `.sort()`).
- **Universally Runnable**: Runs seamlessly in Node.js, modern browsers, Web Workers, and SSR runtimes without divergence.
- **Strict TypeScript**: 100% type-safe with zero `any` shortcuts.

---

## 4.3.3 Dimensions & Bounds

The dimensions layer deals purely with numeric layout calculations. It calculates dimensions; it does **not** measure the DOM.

```text
ResizeObserver
      ↓
chart-responsive (React)
      ↓
width / height
      ↓
chart-core
      ↓
inner dimensions
```

- `calculateInnerSize(dimensions, margins)`: Clamps `innerWidth` and `innerHeight` to `0` minimum so negative dimensions never propagate into layout math.
- `createMargins(partialMargins)` / `normalizeMargins()`: Canonical contract (`top`, `right`, `bottom`, `left`).
- `Bounds`: Geometric rectangle (`x`, `y`, `width`, `height`) representing drawable coordinate space (not a DOM `DOMRect`), reusable for plot areas, clipping, brush regions, and tooltip positioning.
- `calculateAspectRatioDimensions(aspectRatio, containerWidth, maxHeight)`: Pure aspect ratio layout derivation.

---

## 4.3.4 Data Layer, Accessors & Validation

Small reusable utilities rather than an unwieldy universal data model:
- Avoids forcing arbitrary shapes (e.g., `{ x, y, value }`) across disparate chart types like Sankey, Force Graph, and GeoChart.
- **Typed Accessors**: `propertyAccessor(key)` and `numericAccessor(key, fallback)` let consumers retain original property keys without internal renaming.
- **Series Definition**: `SeriesDefinition<TDatum>` provides engine-neutral metadata (`id`, `label`, `value`) without engine-specific styling properties leaking in.
- **Structured Validation**: Non-fatal results distinguishing valid empty datasets (`[]`) from invalid data (`NaN`, `Infinity`).

```ts
export type ValidationIssue = {
  code: string
  message: string
  index?: number
}

export type ValidationResult = {
  valid: boolean
  issues: readonly ValidationIssue[]
}
```

---

## 4.3.5 Domain Policy

`domain.ts` centralizes domain derivations according to configurable policies:

```text
data
 ↓
raw extent
 ↓
domain policy
 ↓
final domain
```

- `exact`: Exact data extent `[min, max]`.
- `include-zero`: Baseline zero inclusion (essential for bar and area charts).
- `padded`: Percentage-based padding without inverting boundaries.
- `symmetric`: Centered around zero (ideal for diffs, deltas, and financial profit/loss).
- `manual`: Direct user-specified override.

---

## 4.3.6 Scale Boundaries

> **Note on Scales**: The `scales/` folder is **optional at first**. Plotcn's core primarily standardizes **domain policy and shared calculations**, rather than reimplementing existing scale engines.

- **Recharts**: Consumes Plotcn domain policy → configures Recharts internals → Recharts draws SVG.
- **D3.js**: Consumes Plotcn domain policy → utilizes mature `d3-scale` directly → D3 computes paths.
- **Google Charts**: Consumes Plotcn domain policy → Google adapter transforms to `viewWindow`/options → Google runtime scale renders.

Core does not impose a single scale runtime across all three engines.

---

## 4.3.7 Coordinates & Geometry

Pure mathematical primitives:
- **Coordinates**: `cartesianToPolar`, `polarToCartesian`, `clampPoint`, `createPoint`.
- **Hit Testing**: `isPointInsideBounds(point, bounds)` and `findNearestPoint(target, items, toPoint, maxDistance)` provide renderer-independent spatial queries for tooltips and crosshairs.
- **Interpolation & Geometry**: `lerp(from, to, progress)`, `inverseLerp`, `euclideanDistance`, `manhattanDistance`, `isPointInsideCircle`, and `rectIntersectsRect`.

Specialized layout engines (force simulation, sunburst partitions, Sankey solvers, Voronoi tessellations) remain within D3 or their respective visualization packages.

---

## 4.3.8 Platform-Standard Formatting

Built around platform `Intl` standards with explicit configuration:
- `formatNumber(value, options, locale)`
- `formatCompactNumber(value, options, locale)`: `1.2k`, `3.4M`
- `formatPercentage(value, options, locale)`: Multiplied by 100 with localized percent formatting
- `formatCurrency(value, { currency, locale, ... })`: **Requires an explicit ISO currency** (never hardcodes USD or any global default)
- `formatDate(value, options, locale)`: Accepts `Date`, timestamp, or ISO string with consistent timezone policy
- `formatDuration(seconds, options)`: Human-friendly duration formatting

---

## 4.3.9 Integration Boundaries

| Boundary | What Belongs in `chart-core` | What Belongs Outside |
| :--- | :--- | :--- |
| **React** | None | Hooks (`useState`, `useMemo`), JSX, Context |
| **Responsive** | `calculateInnerSize`, `aspectRatio` | `ResizeObserver`, CSS container queries |
| **Theme** | Numeric calculations | `--chart-1`, dark mode, Tailwind classes, Google colors |
| **Motion** | `lerp`, progression math | Motion components, animation lifecycles, `requestAnimationFrame` |
| **Accessibility** | Min, max, trend, extent aggregations | ARIA attributes, semantic summary tables, focus management |
| **Registry** | Monorepo source | Small required helpers copied/distributed as editable source |

---

## 4.3.10 Core Extraction Rule

Before adding anything to `chart-core`, ask:
1. Is it used by more than one visualization family?
2. Is it independent of React?
3. Is it independent of Recharts?
4. Is it independent of D3 rendering?
5. Is it independent of Google Charts?
6. Is it renderer-independent?
7. Is it deterministic?
8. Does centralizing it make the codebase clearer?

If the answer to several is **no**, keep the logic beside the component that needs it.

---

## 4.3.11 Package Subpaths

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./dimensions": "./src/dimensions/index.ts",
    "./data": "./src/data/index.ts",
    "./scales": "./src/scales/index.ts",
    "./coordinates": "./src/coordinates/index.ts",
    "./geometry": "./src/geometry/index.ts",
    "./formatting": "./src/formatting/index.ts",
    "./statistics": "./src/statistics/index.ts",
    "./types": "./src/types/index.ts",
    "./errors": "./src/errors/index.ts"
  }
}
```
