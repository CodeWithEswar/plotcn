# @plotcn/registry

Plotcn's canonical source-distribution architecture, schemas, catalog generation, dependency resolution, and engine isolation validation.

> **Central Principle**: Registry ≠ runtime. The registry distributes source code into consumer applications; it does not become a required runtime package layer.

---

## 5.1 Architectural Overview

The registry is the primary installation contract between Plotcn and developer applications:

```text
Plotcn Source
      ↓
Typed Metadata
      ↓
Registry Builder & Schema Validation
      ↓
Public Static Endpoints (/r/*.json)
      ↓
shadcn CLI (npx shadcn@latest add @plotcn/line-basic)
      ↓
Developer Application (components/charts/...)
      ↓
Local Editable Source ("Copy, own, customize")
```

The consumer receives clean, local editable files:
```text
components/charts/
├── chart-container.tsx
├── chart-tooltip.tsx
└── animated-line.tsx
```
with direct npm dependencies (`recharts`, or `d3-scale`, `d3-shape`, etc.), without coupling to internal monorepo packages.

---

## 5.2 Package Modules (`packages/registry/src/`)

```text
packages/registry/src/
├── schema/
│   ├── registry.ts           # Official shadcn registry & item schemas
│   └── metadata.ts           # Internal typed metadata model (engine, features, difficulty, status)
│
├── catalog/
│   ├── collect.ts            # Filter, search, and aggregate catalog items
│   ├── normalize.ts          # Apply defaults and canonical fallbacks
│   └── sort.ts               # Deterministic sorting (recharts -> d3 -> google -> category -> name)
│
├── generation/
│   ├── build-registry.ts     # Generate root registry.json catalog
│   ├── build-item.ts         # Translate ChartMetadata to shadcn item schema (strips demo files)
│   └── write-output.ts       # Deterministic 2-space formatted JSON serializer
│
├── dependencies/
│   ├── graph.ts              # Directed graph mapping item names to registryDependencies
│   ├── resolve.ts            # Topological resolution of transitive registry dependencies
│   └── validate.ts           # Cycle detection and depth validation (max depth <= 3)
│
├── validation/
│   ├── validate-schema.ts    # Verify root registry schema fields
│   ├── validate-items.ts     # Verify unique names, allowed registry types, files arrays
│   ├── validate-files.ts     # Verify all declared files exist on disk
│   └── validate-engines.ts   # Enforce strict Recharts, D3, and Google isolation boundaries
│
├── urls/
│   ├── registry-url.ts       # Centralized /r/{name}.json URL resolution
│   └── install-command.ts    # Centralized CLI install & view commands across pnpm, npm, yarn, bun
│
└── index.ts                  # Curated root barrel export
```

---

## 5.3 Engine Isolation Rules

Section 5.40 & 5.41 define strict validation gates:

| Engine | Allowed Dependencies | Prohibited Dependencies |
| :--- | :--- | :--- |
| **Recharts** | `recharts`, shared Plotcn primitives | Google shared loader, D3 modules |
| **D3.js** | Modular D3 (`d3-array`, `d3-scale`, `d3-shape`, `d3-force`), `motion` | Full `d3` umbrella package, Recharts, Google loader |
| **Google Charts** | `google-chart-loader`, `google-chart-container` | `recharts`, D3 modules, Google Maps SDK |

---

## 5.4 Namespace & Public Delivery

- Documented Namespace: `@plotcn`
- Public Origin: `https://plotcn.vercel.app`
- Static Endpoint Pattern: `https://plotcn.vercel.app/r/{name}.json`
- Installation Command:
  ```bash
  pnpm dlx shadcn@latest add @plotcn/line-basic
  ```
- Inspect Before Install:
  ```bash
  pnpm dlx shadcn@latest view @plotcn/line-basic
  ```
