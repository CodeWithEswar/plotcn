# ADR 0005: Engine Dependency Isolation

## Status
Accepted

## Context
Cross-engine contamination creates heavy bundle bloat (e.g. installing a simple line chart pulling in D3 math or Google runtime loaders).

## Decision
Plotcn strictly enforces engine isolation. Installing a Recharts component installs only Recharts dependencies. Installing a D3 component installs modular micro-packages. Installing a Google component installs only Plotcn Google helpers.

## Consequences
- Zero cross-engine dependency leakage.
- Clean, minimal node_modules in consumer applications.
- High developer confidence in bundle size and security.
