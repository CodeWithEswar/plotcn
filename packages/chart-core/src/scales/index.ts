/**
 * @fileoverview Lightweight, optional scale utilities.
 *
 * NOTE ON SCALE BOUNDARIES:
 * Plotcn intentionally avoids recreating d3-scale or building a universal scale engine.
 * - Recharts manages its own internal scale implementations.
 * - D3 visualizations consume mature `d3-scale` modules directly where advanced behavior is required.
 * - Google Charts owns its runtime scale and viewWindow configuration.
 *
 * The utilities exported here provide pure mathematical mappings and tick policies
 * for lightweight or headless use cases without replacing engine-specific scale engines.
 */

export * from "./linear"
export * from "./band"
export * from "./time"
export * from "./log"
export * from "./ordinal"
export * from "./ticks"
