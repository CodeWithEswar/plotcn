# ADR 0004: Container-Driven Responsiveness via ResizeObserver

## Status
Accepted

## Context
Visualizations frequently live in grid layouts, collapsible sidebars, dashboard cards, and modal drawers where the viewport width differs drastically from the chart's actual bounding box.

## Decision
Plotcn charts respond to container width measured via `ResizeObserver` instead of global `window.innerWidth`. Google Charts implements a 150ms debounced redraw schedule to avoid thrashing.

## Consequences
- Charts adapt correctly in any layout context.
- Margin, tick density, and label formatting adjust to container dimensions.
- Proper observer cleanup on unmount prevents memory leaks.
