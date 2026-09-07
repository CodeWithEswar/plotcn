# ADR 0003: Singleton Google Charts Loader & Package Isolation

## Status
Accepted

## Context
Google Charts uses an external browser-loaded script (`https://www.gstatic.com/charts/loader.js`). Uncoordinated loading creates duplicate `<script>` tags, race conditions, and unnecessary network overhead.

## Decision
Plotcn routes all Google Chart components through a single, resilient loader located at `@/lib/google-charts/loader.ts`. The loader enforces script deduplication, promise caching, strictly typed state transitions (`idle` -> `loading` -> `ready` | `error`), and loads packages on demand.

## Consequences
- No duplicate script injections.
- Safe SSR behavior with skeleton fallbacks during hydration.
- Packages (e.g. `geochart`, `corechart`) load only when the corresponding chart mounts.
