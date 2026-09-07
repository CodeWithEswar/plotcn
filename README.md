# Plotcn

<p align="center">
  <strong>Copy-paste React visualization components across Recharts, D3.js, and Google Charts.</strong><br />
  Full source code ownership. Pristine dark-mode defaults. Accessible by design.
</p>

<p align="center">
  <a href="https://github.com/CodeWithEswar/plotcn/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
  </a>
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16.3-black?logo=next.js" alt="Next.js 16" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19-61dafb?logo=react" alt="React 19" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css" alt="Tailwind CSS v4" />
  </a>
  <a href="https://ui.shadcn.com">
    <img src="https://img.shields.io/badge/shadcn%2Fui-Registry-000000" alt="shadcn Registry" />
  </a>
</p>

---

## Overview

Plotcn is an open-source React visualization collection designed for developers who demand full design control, rigorous accessibility, and pristine code quality.

Instead of installing an opaque third-party npm package that locks you into rigid styling abstractions, Plotcn distributes visualizations directly into your codebase through the **shadcn Registry**.

> **Browse component** → **Run CLI command** → **Component copied to your repo** → **You own every line**

---

## Three Engine Architecture

Plotcn components are built on top of three battle-tested rendering engines, chosen specifically for what they do best:

| Engine | Primary Scope | Rendering Model |
| --- | --- | --- |
| **Recharts** | Conventional dashboard, business analytics, Cartesian charts (Line, Bar, Area, Pie) | Declarative React SVG |
| **D3.js** | Custom mathematical geometry, scales, force-directed networks, hierarchical Voronoi | React DOM + SVG / Canvas |
| **Google Charts** | Core enterprise charts, timelines, Sankey flows, and statistical GeoChart choropleths | Client-side hosted runtime |

1. **Recharts Engine**: Declarative, responsive SVG visualizations built for standard Cartesian charts — line charts, area charts, bar graphs, and scatter plots.
2. **D3.js Engine**: Mathematical precision visualizations for specialized layouts — force-directed network graphs, Voronoi treemaps, heatmaps, and radial coordinate systems.
3. **Google Charts & GeoChart Engine**: Mature, battle-tested standard charts and statistical choropleth geographic mapping with resilient singleton script loading, dark glassmorphic tooltips, and responsive container resizing without requiring Google Maps Platform SDKs or API keys.

---

## Core Features

- **Source Code Ownership**: Visualizations are installed directly into your `@/components/charts` directory. You own every pixel and can tweak curves, legends, and tooltips freely.
- **Design System Harmony**: Components inherit semantic theme tokens (`--background`, `--foreground`, `--chart-1` through `--chart-5`, `--border`, `--muted`).
- **Dark Glassmorphic Aesthetics**: Custom-styled tooltips with backdrop blur, subtle zinc borders, and monospace data readouts.
- **Accessibility by Design**: Includes `role="region"`, `aria-label`, hidden screen-reader summaries, keyboard focus rings, and respect for `prefers-reduced-motion`.
- **Zero-Lag Documentation Engine**: Persistent layout, server-rendered Shiki syntax highlighting, and instant route transitions.

---

## Getting Started

### 1. Initialize shadcn/ui

If you haven't already, initialize shadcn/ui in your Next.js or React project:

```bash
npx shadcn@latest init
```

### 2. Add Visualizations

Add charts directly to your codebase using the CLI:

```bash
# Recharts components
npx shadcn@latest add @plotcn/line-chart
npx shadcn@latest add @plotcn/area-chart

# D3.js components
npx shadcn@latest add @plotcn/d3-network
npx shadcn@latest add @plotcn/d3-treemap

# Google Charts & GeoChart
npx shadcn@latest add @plotcn/google-line
npx shadcn@latest add @plotcn/google-bar
npx shadcn@latest add @plotcn/google-geochart
```

---

## Quick Example: Google GeoChart

```tsx
import { GoogleGeoChart } from "@/components/charts/google"

const userDistribution = [
  { country: "United States", users: 1240 },
  { country: "India", users: 980 },
  { country: "Germany", users: 430 },
  { country: "United Kingdom", users: 390 },
  { country: "Brazil", users: 320 },
  { country: "Japan", users: 290 },
]

export function GlobalDistribution() {
  return (
    <GoogleGeoChart
      data={userDistribution}
      regionKey="country"
      valueKey="users"
      region="world"
      height={380}
      title="Global Active Accounts"
      accessibility={{
        title: "Active accounts by country",
        description: "United States has the highest user base with 1,240 users, followed by India with 980.",
      }}
    />
  )
}
```

---

## Project Structure

| Directory | Description |
| --- | --- |
| `app/` | Next.js 16 App Router (Landing, Documentation routes, layout shells) |
| `components/charts/` | Visualization source (`google/`, `recharts/`, `d3/`, and `shared/` containers) |
| `components/docs/` | SVG flow diagrams, interactive explorers, TOC, MDX renderer |
| `components/landing/` | Hero, engine showcase, catalog grid, and interactive explorer |
| `components/site/` | Site header, command palette search, navigation, mobile drawer |
| `config/` | Documentation routes and navigation configuration |
| `content/docs/` | MDX documentation articles with zero ASCII diagrams |
| `lib/google-charts/` | Singleton script loader, package map, theme, and data adapters |
| `lib/docs.ts` | Cached document parser & TOC generator |
| `lib/shiki.ts` | Singleton Shiki syntax highlighter |

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build & TypeScript validation
npm run build
```

---

## License

Released under the [MIT License](LICENSE).
