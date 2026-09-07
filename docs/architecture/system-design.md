# Plotcn Internal System Design

This document details the engineering architecture of Plotcn for core contributors and package maintainers.

## Architectural Principles

1. **Source-First Distribution**: Plotcn distributes source code via the shadcn Registry rather than an immutable npm package.
2. **Three-Engine Isolation**: Recharts, D3.js, and Google Charts remain independent engine siblings under a shared product layer.
3. **Hosted Runtime Boundary**: Google Charts relies on an external runtime and is managed through a singleton loader with zero global side effects.
4. **Container-Driven Responsiveness**: Dimensions are governed by container `ResizeObserver`, not viewport width.
5. **Universal Accessibility**: Every visualization contract mandates semantic naming, live summaries, and data disclosure tables.
