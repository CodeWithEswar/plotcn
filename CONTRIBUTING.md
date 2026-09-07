# Contributing to Plotcn

Thank you for contributing to Plotcn! Plotcn is a source-first visualization collection for React spanning Recharts, D3.js, and Google Charts, distributed via the shadcn Registry.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CodeWithEswar/plotcn.git
   cd plotcn
   ```

2. **Install dependencies**:
   ```bash
   npm install # or pnpm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Validate & Build the Registry**:
   ```bash
   npm run registry:validate
   npm run registry:build
   ```

---

## Repository Architecture

- **`registry/`**: Canonical component source distributed to users.
  - `registry/shared/`: Engine-independent primitives (ChartContainer, states, accessibility, theme).
  - `registry/recharts/`: Declarative React Cartesian charts.
  - `registry/d3/`: Mathematical D3 coordinate and geometry visualizations.
  - `registry/google/`: Hosted runtime wrappers, singleton loader, and GeoChart choropleths.
- **`registry.json`**: Root canonical registry catalog enumerated for the shadcn CLI.
- **`public/r/`**: Generated production JSON manifests served to users at `https://plotcn.vercel.app/r/{name}.json`.
- **`content/docs/`**: MDX documentation with publication-grade SVG flow diagrams (zero ASCII text codeblocks).

---

## Engine Guidelines

### 1. Creating a Recharts Component
- Keep API simple: `<LineBasic data={data} />`.
- Inherit semantic tokens (`--chart-1` through `--chart-5`, `--muted`, `--border`).
- Wrap inside `ChartContainer` for responsive container sizing.

### 2. Creating a D3.js Component
- **D3 computes; React renders**: Do not use `d3.select(...)` for DOM mutation.
- Use modular micro-packages (`d3-shape`, `d3-scale`, `d3-force`, `d3-array`).
- Default to vector SVG. Use Canvas only when density demands it.

### 3. Creating a Google Charts Component
- Must use the shared singleton loader at `google-chart-loader.ts`.
- Fetch packages on demand (e.g. `corechart`, `geochart`).
- Provide fallback loading and error states via `GoogleChartContainer`.
- Provide accessible screen-reader alternative tables.

---

## Pull Request Checklist

- [ ] `npm run registry:validate` passes with 0 errors.
- [ ] `npx tsc --noEmit` passes with 0 type errors.
- [ ] No raw ASCII text tree diagrams inside markdown or docs (use SVG flow components).
- [ ] Component source is clean, readable, and self-contained.
- [ ] New items are registered in root `registry.json`.
