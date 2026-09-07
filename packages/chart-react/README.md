# @plotcn/chart-react

Small, reusable React primitives for Plotcn-owned visualization composition, without attempting to replace Recharts, D3.js, or Google Charts with a new universal rendering engine.

> **Central Principle**: `chart-react` provides React composition primitives around Plotcn charts; it does not become a fourth visualization engine.

---

## 4.4.1 Architectural Position

The React primitive package sits above `chart-core` and below engine-specific components where its abstractions provide clear value.

```text
                         Plotcn Charts
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼

         Recharts            D3.js        Google Charts
             │                │                │
             └──────────── optional ───────────┘
                              │
                              ▼

                         chart-react
                              │
                              ▼
                          chart-core
```

`chart-react` is **optional** for engines:
* **D3.js SVG Visualizations**: Strongly benefit from `chart-react` primitives (`Plot`, `XAxis`, `YAxis`, `Line`, `Crosshair`, `Tooltip`).
* **Custom Plotcn SVG Charts**: Use primitives for standard composition.
* **Recharts**: Selectively consumes outer container, accessibility shell, loading/empty states, and theme tokens without wrapping Recharts' own internal SVG primitives.
* **Google Charts**: Uses only the outer root, accessible title/description, and summary shell because the Google runtime owns its drawing target.

---

## 4.4.2 Dependency Invariants

Allowed:
* `react`
* `@plotcn/chart-core`

Forbidden:
* No Next.js APIs or routing
* No shadcn/ui components (chart tooltips are dedicated primitives)
* No Tailwind-specific components
* No Recharts components
* No Google Charts runtime access
* No heavy D3 rendering packages (D3 calculations happen in caller/D3 layer)
* No `motion/react` by default (standard SVG/React)

---

## 4.4.3 Subpath Modules & Architecture

```text
packages/chart-react/
├── src/
│   ├── root/           # ChartRoot, ChartProvider, ChartContext, ChartSurface
│   ├── cartesian/      # Plot, XAxis, YAxis, Grid, Line, Area, Bar, ScatterPoint
│   ├── polar/          # PolarPlot, RadialAxis, AngularAxis, RadialGrid
│   ├── interaction/    # InteractionProvider, ChartTooltip, Crosshair, Cursor, HitArea, ChartSelection
│   ├── legend/         # Legend, LegendItem, LegendList
│   ├── annotations/    # ReferenceLine, ReferenceBand, ReferencePoint, Annotation
│   ├── accessibility/  # ChartTitle, ChartDescription, ChartSummary (sr-only data table)
│   ├── types/          # ChartContextValue, PointerPosition, InteractionContextValue
│   └── index.ts        # Root curated barrel export
```

### Subpath Exports Configured in `package.json`
- `@plotcn/chart-react`
- `@plotcn/chart-react/root`
- `@plotcn/chart-react/cartesian`
- `@plotcn/chart-react/polar`
- `@plotcn/chart-react/interaction`
- `@plotcn/chart-react/legend`
- `@plotcn/chart-react/annotations`
- `@plotcn/chart-react/accessibility`
- `@plotcn/chart-react/types`

---

## 4.4.4 Server / Client Boundary

- **Server-Compatible Primitives**: Static and semantic components (`ChartTitle`, `ChartDescription`, `ChartSummary`, `Line`, `Area`, `Bar`, `Grid`, `XAxis`, `YAxis`, `ReferenceLine`) emit standard SVG/HTML markup without `"use client"`.
- **Narrow Client Boundaries**: Interactive components requiring React state and pointer tracking (`InteractionProvider`, `ChartTooltip`, `ChartSelection`) declare `"use client"` locally.

---

## 4.4.5 Primitive API Philosophy

Primitives accept **render-ready information** rather than data processing configs:

```tsx
// Good: Pure rendering primitive
<Line path={path} />
<Bar geometry={barGeometry} />
<XAxis ticks={ticks} />
<Crosshair x={activeX} y={activeY} />

// Avoid: Turning a primitive into a chart engine
<Line data={data} xScaleConfig={...} animation={...} />
```

---

## 4.4.6 Composition Example

```tsx
import {
  ChartRoot,
  ChartSurface,
  Plot,
  Grid,
  XAxis,
  YAxis,
  Line,
  Crosshair,
  Legend,
  ChartTooltip,
} from "@plotcn/chart-react"

export function MyD3LineChart({ data, width, height, linePath, xTicks, yTicks, activePoint }) {
  return (
    <ChartRoot width={width} height={height}>
      <ChartSurface>
        <Plot>
          <Grid yTicks={yTicks} />
          <XAxis ticks={xTicks} />
          <YAxis ticks={yTicks} />
          <Line path={linePath} className="stroke-chart-1" />
          <Crosshair x={activePoint?.x} y={activePoint?.y} />
        </Plot>
      </ChartSurface>
      <Legend items={[{ id: "s1", label: "Revenue" }]} />
      <ChartTooltip active={Boolean(activePoint)} x={activePoint?.x} y={activePoint?.y}>
        {activePoint?.value}
      </ChartTooltip>
    </ChartRoot>
  )
}
```

---

## 4.4.7 Source-First Registry Boundary

Inside the Plotcn monorepo, `@plotcn/chart-react` serves as an internal composition suite.

For external consumers installing via `shadcn add` / `npx plotcn add`, required primitives are distributed as **clean, editable source code** (e.g. `components/charts/shared/chart-root.tsx`, `components/charts/shared/chart-tooltip.tsx`), preserving the core Plotcn principle: **inspect, own, and customize**.
