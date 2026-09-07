# @plotcn/chart-responsive

Container-driven responsiveness, semantic breakpoints, adaptive tick management, and interaction policies for Plotcn visualizations.

> **Plotcn responds to the visualization container first and the browser viewport second.**

---

## Architecture

```text
Chart container
      ↓
ResizeObserver
      ↓
raw width / height
      ↓
responsive policy
      ↓
chart dimensions
      ↓
engine renderer
```

## Features

- **Container-Driven Dimensions**: Layout adapts based on the container element via `ResizeObserver`, not viewport `window.innerWidth`.
- **Semantic Breakpoints**:
  - `xs`: `< 360px`
  - `sm`: `< 480px`
  - `md`: `< 720px`
  - `lg`: `< 960px`
  - `xl`: `>= 960px`
- **Compact Mode**: Recomposes information (smaller margins, thinned ticks, collapsible legend, larger hit targets) rather than simply scaling down.
- **Automatic Tick Manager**: Spatially distributes candidate ticks, calculates collision bounds based on character heuristics, and preserves semantic endpoints (`preserve-start`, `preserve-end`, `preserve-both`, `auto`).
- **Interaction Adaptation**: Coarse pointers receive generous hit targets (32px), scrub/tap tooltips, and safe `touch-action` without page scroll hijacking.
- **SSR Hydration Safety**: Guarantees stable initial renders without layout jumps. Zero-size containers recover cleanly when mounted or revealed.
- **Canvas DPR Capping**: Prevents memory exhaustion on high-density mobile displays.
