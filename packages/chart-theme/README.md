# @plotcn/chart-theme

Plotcn's single semantic visualization theme system across Recharts, D3.js, and Google Charts.

> **One visual language, multiple rendering engines.**

## Architecture

```text
Application theme (Light / Dark / System)
      ↓
Plotcn semantic chart tokens
      ↓
┌─────────────┬─────────────┬─────────────┐
▼             ▼             ▼
Recharts      D3.js         Google Charts
adapter       adapter       adapter
```

## Token Groups

1. **Surface Tokens**: `--chart-background`, `--chart-foreground`, `--chart-muted-foreground`, `--chart-border`
2. **Structural Tokens**: `--chart-grid`, `--chart-grid-emphasis`, `--chart-axis`, `--chart-axis-emphasis`, `--chart-zero-line`
3. **Interaction Tokens**: `--chart-crosshair`, `--chart-cursor`, `--chart-selection`, `--chart-focus`
4. **Series Tokens**: `--chart-1` through `--chart-8`
5. **Semantic Status Tokens**: `--chart-positive`, `--chart-negative`, `--chart-warning`, `--chart-neutral`
6. **Tooltip Tokens**: `--chart-tooltip-background`, `--chart-tooltip-foreground`, `--chart-tooltip-muted`, `--chart-tooltip-border`
7. **State Tokens**: `--chart-disabled`, `--chart-hidden`

## Engine Theme Adapters

- **Recharts & D3 SVG**: Directly consumes CSS variables (`var(--chart-1)`, `var(--chart-grid)`) for zero-overhead theme switching.
- **Canvas & Google Charts**: Consumes `ChartThemeSnapshot` via `resolveThemeSnapshot()` with in-memory caching to avoid layout thrashing during render loops.
- **Google Charts Adapter**: `getGoogleChartThemeOptions(snapshot, overrides)` maps semantic tokens directly to Google `ChartOptions`.

## Initial Curated Palettes

- **Default**: Emerald, Sky, Violet, Amber, Rose, Indigo, Teal, Orange.
- **Monochrome**: Precise zinc grayscale with luminance, opacity, stroke weights, and dash patterns.
- **Colorblind Safe**: Scientifically validated Okabe-Ito / Wong palette combined with distinct stroke patterns and marker shapes.
