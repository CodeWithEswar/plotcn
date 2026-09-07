# ADR 0002: D3 Calculates, React Renders

## Status
Accepted

## Context
D3.js provides both mathematical calculation tools (scales, geometries) and imperative DOM manipulation (`d3.select().append()`). Using imperative mutations inside React causes lifecycle conflicts and breaks React's virtual DOM reconciliation.

## Decision
In Plotcn, D3 is strictly used for mathematical calculations, scale transformations, and geometric path generators. React owns the component state, DOM reconciliation, and SVG elements.

## Consequences
- No `d3.select(...)` in React components.
- Seamless integration with React transitions and Server Components.
- Full compatibility with React accessibility conventions.
