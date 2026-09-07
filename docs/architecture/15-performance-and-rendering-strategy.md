# 15. Performance & Rendering Strategy

Plotcn should be designed so that the **default path remains simple and fast**, while the architecture can scale toward dense and computationally expensive visualizations later without forcing every V1 chart to carry that complexity.

The governing principle is:

> **Use the simplest renderer and execution model that can preserve clarity, interaction quality, and performance for the actual visualization.**

Plotcn should not introduce Canvas, WebGL, Workers, downsampling, or virtualization merely because they are technically advanced. Each optimization should exist because a real chart/data-density problem requires it.

---

## 15.1 Rendering Strategy

Plotcn supports three rendering strategies over time:

| Renderer | Primary role | Recommended scope |
| -------- | ------------ | ----------------- |
| SVG | Default renderer for standard interactive charts and moderate data sizes | V1 default |
| Canvas | Dense scatter, dense time-series, heatmaps, very large mark counts, specialized D3 rendering | Later / selective |
| WebGL | Extremely large data, specialized GPU-oriented visualization, advanced spatial workloads | Long-term specialization |

The architectural hierarchy should be:

```text
Visualization requirement
        │
        ▼
Can SVG satisfy it well?
        │
   ┌────┴────┐
   │         │
  yes        no
   │         │
   ▼         ▼
  SVG      Is Canvas sufficient?
              │
         ┌────┴────┐
         │         │
        yes        no
         │         │
         ▼         ▼
      Canvas    Consider WebGL
```

The default should always be SVG unless profiling proves that a different renderer materially improves the experience.

---

## 15.2 SVG as the Default

SVG should remain the primary Plotcn renderer for:

```text
Line
Area
Bar
Pie
Donut
Radar
Radial
Scatter with moderate points
Composed charts
Most hierarchy views
Most financial charts
Most dashboard charts
Most interactive documentation previews
```

Reasons:

```text
native DOM semantics
easy CSS theming
accessible structure
simple event handling
excellent React integration
easy inspection/debugging
source readability
strong browser support
excellent shadcn/source-first compatibility
```

SVG aligns especially well with Plotcn's source-first philosophy because the installed source remains understandable.

---

## 15.3 SVG Mark Count Discipline

SVG should not be treated as infinitely scalable.

Performance risk grows when rendering:

```text
thousands of circles
thousands of rectangles
very dense paths
large node-link graphs
large heatmaps
extreme annotation counts
```

Before switching renderer, first ask whether the visualization itself should reduce visual complexity.

Potential strategies:

```text
fewer labels
fewer ticks
aggregate marks
downsample data
hide redundant points
use one path instead of thousands of marks
```

Rendering optimization should not preserve unnecessary visual noise.

---

## 15.4 One Path vs Many Marks

For time-series visualization, prefer:

```text
one SVG path
```

over:

```text
thousands of individual line-segment elements
```

when the semantics permit it.

Likewise:

```text
area series
→ one path

line series
→ one path
```

rather than element-per-segment rendering.

This dramatically reduces DOM complexity.

---

## 15.5 SVG Point Markers

Do not render a marker for every point by default on dense lines.

A line with:

```text
2,000 observations
```

does not necessarily need:

```text
2,000 circles
```

Prefer:

```text
line only
+
active point marker
+
optional sparse markers
```

unless all markers are meaningful.

---

## 15.6 Canvas Role

Canvas becomes appropriate when:

```text
mark count becomes large
DOM overhead dominates
dense scatter is required
high-frequency updates are required
heatmaps contain thousands of cells
SVG interaction becomes noticeably slow
```

Canvas should be introduced selectively.

Do not convert the entire chart system to Canvas.

---

## 15.7 Candidate Canvas Components

Likely future candidates:

```text
Dense Scatter
Large Bubble Plot
Heatmap
Correlation Matrix
Dense Timeline
High-frequency financial series
Large point clouds
Large geographic symbol layers
Dense streaming metrics
```

Not every D3 component needs Canvas.

---

## 15.8 Canvas Architecture

Recommended conceptual flow:

```text
Validated data
      ↓
chart-core calculations
      ↓
D3 scales/layout
      ↓
render-ready geometry
      ↓
Canvas drawing layer
      ↓
overlay interaction/a11y layer
```

Canvas should not become a separate data model.

The same domain, theme, state, and interaction semantics should remain.

---

## 15.9 Canvas Interaction Layer

Canvas does not provide DOM elements for each mark.

Therefore interaction should be architected separately:

```text
pointer position
      ↓
hit testing
      ↓
active datum
      ↓
Plotcn normalized interaction state
      ↓
tooltip / crosshair / accessibility
```

Possible hit-testing structures:

```text
binary search
quadtree
Delaunay
spatial index
scale inversion
custom geometry index
```

Use only what is justified.

---

## 15.10 Canvas Accessibility

Canvas must never mean:

```text
"the chart is now inaccessible"
```

The Plotcn accessibility shell still provides:

```text
title
description
summary
structured data alternative
keyboard interaction where meaningful
selection/focus semantics
```

The visual renderer and accessibility representation remain separate concerns.

---

## 15.11 Canvas DPI

Canvas should account for device pixel ratio.

Concept:

```text
CSS width
×
devicePixelRatio
=
backing buffer width
```

But do not blindly render at extreme DPR.

For very large Canvas surfaces, consider capping effective pixel ratio after benchmarking.

This is a performance-quality tradeoff.

---

## 15.12 Canvas Resize

On container resize:

```text
ResizeObserver
→ new CSS dimensions
→ update backing buffer
→ redraw
```

Do not update Canvas dimensions from global `window.resize` only.

Keep container-first architecture.

---

## 15.13 WebGL Role

WebGL should remain a long-term specialization.

Potential cases:

```text
hundreds of thousands of points
large network visualizations
dense geospatial layers
large streaming point clouds
advanced scientific visualization
GPU-based heatmaps
```

It is **not** required for V1.

---

## 15.14 Do Not Add WebGL Prematurely

Avoid adding:

```text
Three.js
PixiJS
regl
deck.gl
custom shader framework
```

to the base Plotcn dependency graph without a proven chart requirement.

WebGL adds:

```text
complexity
bundle weight
testing cost
accessibility challenges
shader/debugging complexity
renderer-specific lifecycle
```

The benefit must justify those costs.

---

## 15.15 Renderer Metadata

Each chart should expose renderer metadata:

```text
svg
canvas
google-runtime
webgl
```

Conceptually:

```ts
type ChartRenderer =
  | "svg"
  | "canvas"
  | "google-runtime"
  | "webgl"
```

Do not call Google Charts `"svg"` just because Google may internally generate SVG.

The renderer metadata should describe architectural ownership.

---

## 15.16 Renderer Selection Should Usually Not Be a Prop

Avoid a generic API such as:

```text
renderer="svg" | "canvas"
```

on every chart unless that chart truly supports interchangeable renderers.

A Canvas-optimized dense scatter may be a separate component or implementation variant.

This keeps source understandable.

---

## 15.17 Renderer Variants

If one visualization genuinely supports both renderers, use deliberate variants.

Example:

```text
Scatter
├── Scatter SVG
└── Scatter Canvas
```

or one chart with documented renderer behavior if API parity is proven.

Do not promise renderer interchangeability before it exists.

---

## 15.18 Rendering Strategy Summary

```text
SVG
→ default

Canvas
→ density/performance escape hatch

WebGL
→ specialized future path

Google Runtime
→ engine-owned rendering
```

This should remain explicit in architecture and documentation.

---

## 15.19 Next.js Rendering Model

Plotcn's website should remain primarily server-rendered.

Architecture:

```text
Server Components
├── docs prose
├── metadata
├── chart catalog
├── registry information
├── code examples
├── SEO
└── static documentation

Client Components
├── live chart preview
├── tooltip interaction
├── responsive preview lab
├── prop explorer
├── D3 interactive runtime
├── Google runtime
└── playground
```

Do not mark entire pages client-side because one chart is interactive.

---

## 15.20 Server-First Documentation

A component detail page should be able to server-render:

```text
title
description
engine metadata
installation
usage prose
prop documentation
source anatomy
related components
```

before the chart JavaScript loads.

This improves:

```text
startup
SEO
content stability
bundle size
readability
```

---

## 15.21 Narrow Client Islands

Prefer:

```text
ChartPreview
PropPreviewLab
CopyButton
PreviewToolbar
```

as client islands.

Avoid:

```text
ChartDetailPage.tsx
"use client"
```

for the entire route.

---

## 15.22 Hydration Budget

Interactive chart documentation may become expensive if every section hydrates immediately.

Prioritize hydration by importance:

```text
1. main preview
2. package/copy actions
3. immediately visible prop controls
4. near-viewport examples
5. deep examples later
```

Do not hydrate fifteen interactive mini-charts above the fold.

---

## 15.23 Lazy Interactive Documentation

Prop preview labs far below the fold can use:

```text
IntersectionObserver
dynamic import
collapsed sections
```

to avoid unnecessary startup work.

Static descriptions remain server-rendered.

---

## 15.24 Gallery Rendering Strategy

The `/charts` gallery must remain lightweight.

Do not initialize every real advanced visualization immediately.

Suggested model:

```text
Gallery card enters/approaches viewport
        ↓
is lightweight?
   ┌────┴────┐
   │         │
  yes        no
   │         │
   ▼         ▼
render      lazy import
directly       ↓
             initialize
```

---

## 15.25 Gallery Recharts

Lightweight Recharts previews may render directly.

But still avoid expensive features in cards:

```text
full animation loops
large tooltips
large datasets
many annotations
complex legends
```

Gallery previews should demonstrate visual identity, not every feature.

---

## 15.26 Gallery D3

Advanced D3 cards should not start:

```text
force simulations
zoom handlers
large hierarchy layouts
large geo calculations
```

when off screen.

Lazy initialize them near viewport.

---

## 15.27 Gallery Force Simulations

Never run one active force simulation for every force-graph card in a long gallery.

Prefer one of:

```text
static precomputed preview
simulation starts only near viewport
simulation runs briefly then settles/stops
```

Do not leave background simulations running indefinitely.

---

## 15.28 Page Visibility

Long-running visualizations should consider page visibility.

If the document becomes hidden:

```text
pause expensive animation/simulation
```

when practical.

Resume only where required.

Do not continue unnecessary work in background tabs.

---

## 15.29 Google Gallery

Google Charts must be the most conservative gallery engine.

Do not initialize ten Google charts simultaneously.

Preferred:

```text
metadata shell
→ near viewport
→ shared loader
→ chart initialization
```

Potentially limit concurrent Google initialization if profiling shows startup contention.

---

## 15.30 Shared Google Runtime

Use one shared deduplicated loader.

Never:

```text
preview 1 → inject script
preview 2 → inject script
preview 3 → inject script
```

The loader should maintain:

```text
idle
loading
ready
error
```

state and package loading.

---

## 15.31 Google Package Loading

Load only required packages:

```text
corechart
geochart
timeline
sankey
table
orgchart
```

as needed.

Do not request all Google packages globally.

---

## 15.32 D3 Module Discipline

Use focused imports.

Correct:

```text
d3-array
d3-scale
d3-shape
```

when needed.

Avoid:

```text
import * as d3 from "d3"
```

throughout Plotcn.

Each registry item should declare only required modules.

---

## 15.33 D3 Dependency Examples

Line:

```text
d3-array
d3-scale
d3-shape
```

Hierarchy:

```text
d3-hierarchy
```

Force:

```text
d3-force
```

Geo:

```text
d3-geo
```

Interaction:

```text
d3-zoom
d3-brush
```

only when actual functionality exists.

---

## 15.34 Avoid Cross-Engine Dependency Leakage

A Recharts-only chart must not import:

```text
D3
Google loader
```

A D3 chart must not require Recharts unless deliberately composed.

A Google chart must not pull the Recharts package just for shared styling.

---

## 15.35 Registry Performance

Source-first installation should preserve dependency isolation.

Example:

```text
install @plotcn/line-basic
→ Recharts dependency
→ small local Plotcn helpers
```

not:

```text
→ all D3 modules
→ Google runtime helpers
→ all chart families
```

---

## 15.36 Memoization Philosophy

Use memoization only when it prevents meaningful work.

Good candidates:

```text
large D3 scale/domain calculations
hierarchy layouts
force initialization
path generation
large data transformations
spatial indexes
expensive data grouping
```

Bad candidates:

```text
tiny arrays
constant labels
small className strings
every component automatically
```

---

## 15.37 Do Not Blanket `useMemo`

Avoid code like:

```text
everything
→ useMemo
```

just because the component is a chart.

Memoization has:

```text
complexity
dependency management
memory cost
debugging cost
```

Profile first.

---

## 15.38 React State Isolation

Separate:

```text
geometry/data state
interaction state
presentation state
```

Example:

```text
pointer move
→ tooltip state updates
```

should not force:

```text
full D3 hierarchy recalculation
```

---

## 15.39 Interaction Context

Keep interaction context narrow.

Potential:

```text
activeDatum
activeSeries
locked
pointerAnchor
```

Do not put:

```text
full dataset
scales
theme
geometry
all configuration
```

into one frequently-updating context.

---

## 15.40 Pointer Frequency

Pointer movement can fire extremely frequently.

If hit testing or state updates become expensive:

```text
requestAnimationFrame
```

may be used to coalesce work.

Do not prematurely throttle simple tooltip interactions.

---

## 15.41 Avoid React State for Every Frame

Animation frames should not necessarily call expensive global React state updates.

For complex animation, consider:

```text
single progress state
refs
renderer-local updates
```

while preserving React ownership of logical state.

Do not create:

```text
one state variable per animated mark
```

---

## 15.42 D3 Animation

For React-owned D3 SVG:

```text
old geometry
→ interpolate
→ one progress loop
→ render
```

Prefer this over dozens/hundreds of independent transitions.

Do not use `d3.select().transition()` as the default React integration model.

---

## 15.43 Recharts Animation

Use Recharts native animation when it serves the chart well.

Do not wrap each Recharts mark with Motion for React.

This would add unnecessary rendering layers.

---

## 15.44 Google Animation

Use Google-supported animation only where reliable.

Do not attempt DOM-level animation hacks against generated chart internals.

---

## 15.45 Motion for React

Use Motion primarily for:

```text
tooltip surface
legend UI
filter controls
preview width changes
layout transitions
install console interactions
```

not as the universal chart geometry engine.

---

## 15.46 Data Transformation Layer

Expensive transformations should generally occur:

```text
once per meaningful data/config change
```

not once per render.

Examples:

```text
grouping
binning
stacking
hierarchy creation
path generation
spatial index
```

---

## 15.47 One-Pass Data Work

Where useful, combine compatible passes.

Instead of:

```text
scan data for min
scan data for max
scan data for invalid
scan data for count
```

a single pass may derive:

```text
min
max
validCount
invalidCount
```

for large datasets.

Do not micro-optimize tiny arrays unnecessarily.

---

## 15.48 Referential Stability

Avoid recreating large configuration objects unnecessarily when they trigger engine redraws.

Google especially may redraw when options/data references change.

Memoize genuinely expensive or semantically stable transformations.

---

## 15.49 Callback Stability

Stable callbacks may matter for:

```text
third-party event subscription
ResizeObserver integration
Google event listeners
expensive interaction trees
```

Do not wrap every tiny click callback in `useCallback` without reason.

---

## 15.50 ResizeObserver Performance

Every chart should not trigger a cascade of redraws from insignificant size fluctuations.

Consider ignoring sub-pixel/noise changes where safe.

For expensive renderers:

```text
ResizeObserver
→ schedule with requestAnimationFrame
→ redraw once
```

---

## 15.51 Resize Loops

Avoid layouts where:

```text
chart renders
→ changes parent size
→ ResizeObserver fires
→ chart changes size
→ loop
```

Chart size should usually follow a stable external height/aspect contract.

---

## 15.52 Responsive Layout Cost

Responsive policies should compute cheaply.

Example:

```text
width
→ breakpoint
→ margins
→ ticks
→ legend policy
```

should not require expensive DOM measurements every frame.

---

## 15.53 Label Measurement

Exact text measurement can become expensive.

Prefer:

```text
heuristics
cached measurement
limited candidate ticks
```

before using exhaustive DOM measurement.

Only do precise measurement where overlapping labels actually require it.

---

## 15.54 Code Splitting

Use code splitting for:

```text
force graph
large hierarchy
advanced geo
financial advanced components
Google-specific pages
heavy Playground charts
```

Do not split every 2 KB helper into a separate chunk.

---

## 15.55 Dynamic Imports

Dynamic imports should preserve a stable visual shell.

Incorrect:

```text
nothing
→ large chart appears
→ layout jumps
```

Correct:

```text
reserved preview region
→ lightweight loading state
→ chart initializes
```

---

## 15.56 Route-Level Bundling

Target behavior:

```text
/docs/accessibility
→ no chart engine

/charts/recharts/line-basic
→ Recharts only

/charts/d3/force-atlas
→ relevant D3 modules only

/charts/google/google-core-line
→ Google loader only when preview runs
```

This should be verified in bundle output.

---

## 15.57 Homepage Performance

Do not regress the landing page.

The completed homepage should not load all chart engines merely because Plotcn supports them.

If homepage has charts, load only those required by visible sections.

---

## 15.58 Documentation Performance

Base docs navigation should remain fast regardless of chart catalog size.

Do not import the entire preview registry into the docs root layout.

Chart demos should be loaded only within pages that use them.

---

## 15.59 Detail Page Prop Previews

The redesigned component detail page may include many mini-previews.

Do not mount them all immediately.

Recommended:

```text
main preview
→ immediate

first visible prop labs
→ normal

lower prop labs
→ lazy near viewport

collapsed advanced labs
→ mount on expand
```

---

## 15.60 Prop Preview Independence

Changing one prop lab should not cause every other prop lab to rerender.

Keep local state local.

Do not create one giant detail-page prop-preview context unless justified.

---

## 15.61 Large Dataset Philosophy

The V1 goal is not:

```text
render millions of points
```

The V1 goal is:

```text
correct architecture
+
clear extension paths
```

Dense-data features can arrive incrementally.

---

## 15.62 Large-Data Roadmap

Future optimizations may include:

```text
downsampling
aggregation
Canvas
Web Workers
windowing
viewport clipping
spatial indexes
incremental rendering
streaming updates
```

These should be introduced when real components require them.

---

## 15.63 Time-Series Downsampling

For dense time-series, a future optimization can use:

```text
LTTB
```

or another tested sampling method.

Architecture:

```text
original validated data
        ↓
visible domain
        ↓
downsampling
        ↓
display data
        ↓
renderer
```

The original dataset must remain conceptually separate.

---

## 15.64 Downsampling Must Be Truthful

Downsampling should preserve:

```text
overall trend
important extrema where algorithm supports it
visual integrity
```

It must not silently alter values.

Document when rendering is sampled.

---

## 15.65 Tooltip and Downsampling

Decide explicitly whether tooltip interaction uses:

```text
sampled display data
```

or:

```text
original data
```

A high-quality time-series implementation may:

```text
render sampled geometry
+
query original data around pointer position
```

for precise inspection.

Do not let this happen accidentally.

---

## 15.66 Sampling Threshold

Do not downsample small datasets.

Apply only after measured thresholds.

The threshold can depend on:

```text
container width
data length
renderer
interaction requirements
```

Avoid one global magic number.

---

## 15.67 Pixel-Aware Sampling

A chart 600px wide cannot meaningfully show 100,000 independent X positions.

Future sampling can account for:

```text
data density relative to plot width
```

rather than raw row count alone.

---

## 15.68 Domain Aggregation

For massive datasets, future charts may aggregate:

```text
min/max
sum
average
count
percentile
```

into domain buckets.

This is especially useful for:

```text
monitoring
histograms
heatmaps
time-series overview
```

Aggregation semantics must be chart-specific.

---

## 15.69 Viewport Windowing

Large zoomable charts can eventually process/render only the visible domain.

```text
full dataset
      ↓
visible X domain
      ↓
windowed slice
      ↓
optional sampling
      ↓
renderer
```

This can drastically reduce runtime work.

---

## 15.70 Overscan

If viewport-based rendering is introduced, use modest overscan beyond the visible domain to avoid pop-in during pan/zoom.

Do not process the entire dataset when only 2% is visible.

---

## 15.71 Web Workers

Workers become useful for CPU-heavy transforms such as:

```text
large binning
large hierarchy transforms
large statistical calculations
large graph preprocessing
sampling
geospatial processing
```

Do not move ordinary chart work to Workers prematurely.

---

## 15.72 Worker Boundary

Good Worker boundary:

```text
serializable raw/normalized data
        ↓
pure calculation
        ↓
serializable geometry/summary
```

Bad Worker boundary:

```text
React elements
DOM nodes
Google runtime
browser UI state
```

Keep workers pure.

---

## 15.73 Worker Cancellation

Long computations should eventually support cancellation/versioning.

Example:

```text
dataset A transform running
user switches to dataset B
→ A result should not overwrite B
```

Latest request wins.

---

## 15.74 Transferable Objects

For very large numeric buffers, future Canvas/WebGL systems may use:

```text
TypedArray
ArrayBuffer
transferables
```

to reduce copying overhead between Worker and main thread.

This is advanced optimization, not V1 requirement.

---

## 15.75 Typed Arrays

Typed arrays may become useful for:

```text
dense coordinates
Canvas rendering
WebGL buffers
large numeric series
```

Do not force ordinary chart data APIs to use them.

Convert internally where beneficial.

---

## 15.76 Incremental Rendering

For extremely heavy Canvas/WebGL visualizations, future work may render in chunks.

Example:

```text
frame 1 → first batch
frame 2 → second batch
...
```

while showing progress.

Only for genuinely large workloads.

---

## 15.77 Streaming Data

Monitoring charts may eventually support streams.

Architecture should separate:

```text
incoming data
window policy
domain policy
renderer
interaction
```

Do not animate every new observation with long transitions.

High-frequency updates need short/direct rendering.

---

## 15.78 Streaming Window

Potential:

```text
last 5 minutes
last 1,000 points
visible time window
```

Store only necessary render window when appropriate.

The application may still own full history.

---

## 15.79 Streaming Batching

If data arrives many times per second, batch updates into animation frames or controlled intervals rather than React-rendering every message.

Do not lose important data semantics in the process.

---

## 15.80 Server Data Reduction

For very large datasets, application/backend aggregation may be more appropriate than browser optimization.

Plotcn should not pretend every performance problem belongs inside the chart.

Examples:

```text
SQL aggregation
API time buckets
server-side filtering
server-side pagination
```

may provide better architecture.

---

## 15.81 Performance Boundaries

Plotcn owns:

```text
visualization rendering efficiency
chart transforms
interaction efficiency
renderer selection
```

Application owns:

```text
API design
database queries
network payload size
domain aggregation
cache strategy
```

unless a block/example intentionally demonstrates those patterns.

---

## 15.82 Memory Discipline

Be careful with duplicated transformed datasets.

Avoid maintaining:

```text
raw data
normalized copy
sorted copy
filtered copy
sampled copy
geometry copy
```

for huge datasets unless all are needed.

Prefer references/views/derived caches where practical.

---

## 15.83 Cleanup

Every chart with subscriptions must clean up:

```text
ResizeObserver
Google event listeners
window/document listeners
timers
animation frames
force simulations
Workers
```

on unmount or dependency changes.

Memory leaks are performance bugs.

---

## 15.84 Force Simulation Cleanup

D3 force charts must:

```text
simulation.stop()
```

when the component unmounts or a new simulation supersedes it.

Do not leave simulation timers alive.

---

## 15.85 Google Cleanup

Google chart wrappers should remove registered events where necessary and release references on unmount.

Do not accumulate listeners on redraw.

---

## 15.86 Canvas Cleanup

Cancel active animation frames and dispose renderer-specific resources where applicable.

---

## 15.87 WebGL Cleanup

Future WebGL components must explicitly release:

```text
buffers
textures
programs
framebuffers
```

where needed.

WebGL cleanup cannot be assumed from React unmount alone.

---

## 15.88 Cache Strategy

Cache only deterministic expensive derived work.

Examples:

```text
parsed GeoJSON
large layout result
symbol geometry
static path generation
```

Do not create global caches with unclear lifetime.

---

## 15.89 Module-Level Cache Caution

Module-level caches can persist across:

```text
users
requests
tests
SSR
```

depending environment.

Use them deliberately.

For server environments, avoid cross-request data contamination.

---

## 15.90 Server Cache

Static documentation metadata and code highlighting may use framework/server caching safely.

Interactive chart runtime state should remain client-local.

---

## 15.91 Code Highlighting

Shiki/code highlighting should execute server-side and be cached where possible.

Do not ship browser Shiki to every chart detail page.

---

## 15.92 Registry Metadata Loading

Chart metadata should be static/server-imported where possible.

Do not fetch registry JSON over HTTP from the same application just to render chart metadata.

Use canonical source data during build/server rendering.

---

## 15.93 Registry Build Performance

Registry generation can happen during build/CI.

Do not make runtime page rendering regenerate registry items.

---

## 15.94 Gallery Search

Filtering/searching chart metadata should remain local and cheap.

There is no need for server queries for a catalog of ~100–200 metadata entries.

---

## 15.95 100+ Component Catalog

As Plotcn exceeds 100 components:

```text
do not import every preview implementation into one eager index
```

Separate:

```text
metadata registry
```

from:

```text
preview module registry
```

Metadata can load eagerly; heavy implementation modules should load selectively.

---

## 15.96 Preview Registry Architecture

Concept:

```text
chart metadata
→ static lightweight object

preview mapping
→ dynamic import keyed by chart ID
```

This prevents catalog size from directly becoming bundle size.

---

## 15.97 Do Not Store Components in JSON Metadata

Keep metadata serializable.

Do not place React component functions directly into canonical metadata if it prevents server/static use.

Use a separate typed preview map.

---

## 15.98 Bundle Analysis

Add an explicit bundle-analysis workflow.

Review:

```text
framework bundle
Recharts chunks
D3 chunks
Google loader code
Playground
advanced chart routes
```

Do this periodically, not only after performance problems become severe.

---

## 15.99 Bundle Regression Budget

Consider CI warnings/budgets for major route regressions after the baseline stabilizes.

Do not fail builds on arbitrary tiny changes at first.

Focus on significant accidental regressions such as:

```text
D3 entire package pulled into Recharts route
Google runtime loader imported globally
Playground bundled into every page
```

---

## 15.100 Performance Measurement

Measure:

```text
bundle size
initial JavaScript
interaction responsiveness
render duration
memory
long tasks
layout shift
```

where relevant.

Do not optimize from intuition alone.

---

## 15.101 Browser Profiling

Use browser Performance/React profiling for representative cases.

Examples:

```text
large line chart
dense scatter
force graph
Google detail page
100-card gallery
Playground
dashboard block
```

---

## 15.102 React Profiler

Use React Profiler to detect:

```text
unnecessary rerenders
context churn
prop instability
expensive component renders
```

Do not blindly wrap every component in `React.memo`.

---

## 15.103 `React.memo`

Use it when:

```text
component is expensive
props remain stable
parent rerenders frequently
measurement shows benefit
```

Not as a universal rule.

---

## 15.104 Expensive Child Isolation

For example:

```text
Tooltip state changes
```

should not rerender:

```text
large static heatmap geometry
```

if architecture can isolate it cleanly.

---

## 15.105 Virtualization

Viewport/window virtualization may eventually help:

```text
large table alternatives
very long chart galleries
many miniature previews
large timeline rows
```

Do not add virtualization libraries to `/charts` unless real performance requires them.

A 100–150 component gallery with lazy previews may remain perfectly manageable without full virtualization.

---

## 15.106 Gallery Pagination

Do not add pagination simply because there are 100+ charts.

Engine-first grouping and lazy previews may be more discoverable.

Use dedicated engine/category pages if the collection becomes large.

---

## 15.107 Image Previews

For extremely heavy charts, a static generated preview image may be acceptable in gallery context if:

```text
the detail page has a real live chart
the preview is clearly representative
it does not misrepresent functionality
```

But prefer real lightweight preview where practical.

---

## 15.108 Precomputed Geometry

Some gallery previews can use precomputed geometry to avoid heavy runtime calculations.

Example:

```text
force network preview
→ precomputed node positions
```

while detail page shows real force behavior.

Document/keep this internal.

---

## 15.109 Force Preview Recommendation

For `/charts` cards:

```text
force graph
→ static settled graph
```

For detail:

```text
force graph
→ actual simulation
```

This is a good example of context-specific rendering strategy.

---

## 15.110 Hierarchy Preview

Hierarchy layouts can be calculated once from tiny fixtures.

Do not recompute unnecessarily on pointer hover.

---

## 15.111 Maps/Geo

Large geographic path data should be:

```text
cached
lazy-loaded
or simplified
```

depending component.

Do not include world GeoJSON in every app route.

---

## 15.112 GeoJSON Strategy

Potential future:

```text
chart-specific map data
→ dynamic import
```

instead of one giant global geographic package.

---

## 15.113 Path Simplification

High-resolution geography may need simplified topology for browser rendering.

This should be prepared as build-time/static assets when possible rather than simplified repeatedly at runtime.

---

## 15.114 Financial Charts

Candlestick/volume charts may have many marks.

For normal dashboard windows:

```text
SVG
```

can remain adequate.

For very long histories:

```text
windowing
sampling
Canvas
```

may become appropriate later.

---

## 15.115 Heatmaps

Heatmaps are one of the strongest Canvas candidates.

Rule of thumb:

```text
small matrix
→ SVG

large matrix
→ Canvas candidate
```

Do not establish arbitrary fixed thresholds without profiling.

---

## 15.116 Scatter

Scatter rendering strategy can be density-driven.

Concept:

```text
small/moderate points
→ SVG

large points
→ Canvas
```

Interaction model should remain consistent where practical.

---

## 15.117 Network

Network performance depends on:

```text
node count
edge count
simulation cost
label count
hit testing
```

Not just renderer.

Switching SVG to Canvas does not solve expensive force calculation by itself.

---

## 15.118 Worker + Canvas Network Future

A future dense network could use:

```text
Worker
→ force/layout calculation

Canvas/WebGL
→ rendering

React
→ controls/state/accessibility
```

But this is clearly advanced scope.

---

## 15.119 Performance Metadata

Do not add fake labels like:

```text
Fast
Ultra fast
60 FPS
```

to chart cards.

If useful, metadata can eventually expose:

```text
recommendedDataSize
renderer
```

but only after real thresholds are defined.

---

## 15.120 Component Docs Performance Notes

Each component detail page may include a small Performance section when relevant.

Example:

```text
Renderer
SVG

Recommended use
Small to moderate time-series

For dense streams
Consider future Canvas variant / downsampling
```

Do not pretend precise maximum point counts apply universally.

---

## 15.121 Avoid Magic Limits

Avoid documentation such as:

```text
Maximum 5,000 points
```

unless benchmarked under defined conditions.

Performance depends on:

```text
browser
device
interaction
series count
mark count
labels
renderer
```

Use qualitative guidance until measured.

---

## 15.122 Mobile Performance

Mobile devices may have significantly less CPU/GPU/memory.

Responsive behavior can reduce:

```text
tick count
annotations
legend complexity
animations
```

not merely visual clutter.

This is both UX and performance optimization.

---

## 15.123 Coarse Pointer Optimization

Touch/mobile may not need expensive hover hit-testing running continuously.

Interaction strategy can activate hit testing on:

```text
tap
scrub
drag
```

rather than pointer hover.

---

## 15.124 Reduced Motion and Performance

Reduced-motion users also benefit from less animation work.

When reduced motion is active:

```text
disable large enter transitions
skip geometry interpolation
avoid long force settling where possible
```

This improves both accessibility and runtime cost.

---

## 15.125 Offscreen Animation

Never animate charts indefinitely while they are off screen unless the visualization genuinely represents live state that must continue.

Prefer:

```text
pause
stop
or
do not initialize
```

---

## 15.126 IntersectionObserver

Use IntersectionObserver for:

```text
heavy gallery previews
deep documentation examples
Google charts
expensive force charts
```

Do not use it on every trivial text section.

---

## 15.127 Prefetching

Next.js route prefetch should remain available.

Do not disable prefetch globally because some chart detail pages are heavy.

Instead split heavy interactive modules so route metadata/content can load quickly.

---

## 15.128 Initial Route Content

A detail route should render useful content before visualization runtime initialization:

```text
title
description
install
usage
metadata
```

This creates perceived speed even for heavier Google/D3 charts.

---

## 15.129 Error Performance

If a heavy renderer fails:

```text
stop retries/loops
cleanup resources
show local error
```

Do not repeatedly reinitialize in a failure loop.

---

## 15.130 Retry

Retry should only recreate required resources.

Example Google:

```text
loader already ready
+
chart draw failed
→ retry draw
```

not necessarily:

```text
inject loader again
```

---

## 15.131 Performance and Data Safety

Never skip validation entirely just for speed.

Instead optimize validation:

```text
single pass
typed boundaries
validate once per data change
```

Correctness remains mandatory.

---

## 15.132 Performance and Accessibility

Do not remove:

```text
accessible summary
keyboard support
structured data alternative
```

merely to gain rendering speed.

Optimize visual geometry separately.

---

## 15.133 Performance and Theme

Theme changes should not recompute geometry when only color tokens change.

For SVG:

```text
CSS variables
→ recolor without geometry rebuild
```

For Canvas/Google:

```text
theme snapshot changes
→ redraw
```

but reuse data/layout where possible.

---

## 15.134 Theme Switch Without Animation Replay

Changing light/dark should not replay expensive geometry entry animations.

Theme is visual state, not a new dataset.

---

## 15.135 Legend Toggling

Legend visibility changes should recompute only what is required.

If domain policy is stable:

```text
hide series
→ no domain calculation needed
```

If dynamic domain:

```text
visible series changed
→ domain recalculation
```

Make policy explicit.

---

## 15.136 Zoom

Zoomable charts should avoid transforming the full dataset repeatedly if only visible domain changes.

Future dense charts can:

```text
compute visible slice
→ sample
→ render
```

---

## 15.137 Brush

Brush interaction should update lightweight selection state during drag.

Expensive downstream analytics can update:

```text
on drag end
```

or throttled if real-time feedback is needed.

---

## 15.138 Tooltips

Tooltip movement should not regenerate:

```text
scales
paths
layout
```

Tooltips derive from existing geometry/data.

This is a key performance invariant.

---

## 15.139 Crosshair

Crosshair should be a lightweight overlay.

Do not make every pointer move rerender the entire visualization tree.

---

## 15.140 Canvas Overlay Strategy

For Canvas charts:

```text
Canvas
→ dense marks

HTML/SVG overlay
→ tooltip/crosshair/focus
```

can provide a clean separation.

---

## 15.141 WebGL Overlay Strategy

Future WebGL charts can similarly use:

```text
WebGL
→ marks

DOM/SVG
→ UI overlays
```

where practical.

---

## 15.142 Data Structures

Choose algorithms based on interaction.

Examples:

```text
sorted time-series
→ binary search / bisector

scatter
→ quadtree / Delaunay

bar
→ direct band lookup

heatmap
→ row/column index

network
→ spatial index if required
```

Do not use one generic nearest-point algorithm everywhere.

---

## 15.143 Algorithmic Complexity

For advanced charts, consider complexity explicitly.

Examples:

```text
nearest search
O(log n) preferred where possible

naive scan
O(n) may still be fine for small data
```

Do not overengineer small charts with complex spatial structures.

---

## 15.144 Data Sorting

If algorithms require sorted data:

```text
sort once
```

not on every pointer move.

Never mutate caller data.

---

## 15.145 Layout Stability

Reserve chart height before initialization.

This prevents:

```text
CLS
content jumping
TOC jumping
scroll position changes
```

especially for lazy charts.

---

## 15.146 Font Loading

Charts should inherit the site font.

Do not load separate chart fonts.

This reduces bundle/network cost and keeps visual consistency.

---

## 15.147 Icons

Use Hugeicons from the existing package.

Do not import entire icon libraries through barrel patterns if tree-shaking is poor.

Follow the package's recommended optimized imports where possible.

---

## 15.148 Brand Assets

Package-manager/engine logos should use lightweight assets.

Avoid shipping giant raster files for small icons.

SVG brand assets are appropriate where permitted.

---

## 15.149 Third-Party Dependencies

Before adding a dependency for performance, ask:

```text
Can platform APIs solve it?
Can existing D3 modules solve it?
Can a small local utility solve it?
```

Avoid accumulating:

```text
virtualization library
worker library
canvas scene graph
animation library
spatial-index package
```

unless each solves a demonstrated need.

---

## 15.150 V1 Performance Targets

V1 should focus on:

```text
server-first docs
narrow client boundaries
SVG-first rendering
modular D3
Google lazy loader
lazy heavy previews
no offscreen force simulations
stable chart dimensions
localized interaction state
clean resource cleanup
bundle inspection
```

This is enough to create a strong foundation.

---

## 15.151 V1 Non-Goals

V1 does **not** need:

```text
WebGL
Worker-backed charts
automatic LTTB everywhere
universal downsampling
GPU acceleration
million-point claims
universal virtualization
renderer switching API
custom scheduler
```

Do not delay core product quality for these.

---

## 15.152 Phase 2 Performance Work

After V1 proves the architecture:

```text
Canvas scatter
Canvas heatmap
dense time-series sampling
viewport domain rendering
selected Worker transforms
```

can be introduced.

---

## 15.153 Phase 3 Performance Work

Later:

```text
streaming optimizations
more Worker-based transforms
hybrid Canvas/SVG layers
large network specialization
large geospatial optimization
```

---

## 15.154 Long-Term Specialization

Only after strong evidence:

```text
WebGL point cloud
WebGL network
GPU heatmap
GPU geospatial rendering
```

should enter the roadmap.

These should remain specialized components.

---

## 15.155 Performance Testing Matrix

Representative tests should include:

```text
Recharts line
Recharts multi-series
D3 animated line
D3 scatter
D3 force
D3 hierarchy
Google line
Google GeoChart
Charts gallery
Chart detail prop explorer
Playground
Dashboard block
```

---

## 15.156 Dataset Test Sizes

For performance testing, use several representative sizes.

Conceptually:

```text
small
medium
large
stress
```

Do not hardcode universal product limits from these tests.

They are benchmarks, not API contracts.

---

## 15.157 Gallery Stress Test

Test `/charts` with the expected long-term metadata scale:

```text
100+
150+
```

components.

Verify:

```text
metadata search remains instant
scroll remains smooth
offscreen heavy charts remain inactive
bundle does not contain all preview modules
```

---

## 15.158 Detail Page Stress Test

Test a detail page with:

```text
20+ documented props
10+ examples
multiple mini previews
```

and ensure lazy strategy keeps startup reasonable.

---

## 15.159 Playground Stress Test

Test rapid changes to:

```text
curve
theme
axes
dimensions
data
```

Ensure:

```text
no stale transitions
no memory leak
no expensive unrelated rerenders
```

---

## 15.160 Dashboard Block Stress Test

Multiple charts on one screen should not create:

```text
excessive ResizeObserver churn
global tooltip state
unnecessary engine loads
```

Each chart should remain isolated.

---

## 15.161 Performance Tooling

Use available tooling such as:

```text
Next.js build output
bundle analyzer
React Profiler
Chrome Performance
Chrome Memory
Lighthouse where useful
```

Lighthouse alone is not enough for chart performance.

---

## 15.162 Performance Documentation

Create a developer guide eventually:

```text
/docs/performance
```

covering:

```text
renderer choice
data size guidance
sampling
memoization
responsive cost
D3 modules
Google runtime
large-data roadmap
```

Do not promise unsupported optimizations.

---

## 15.163 Consumer Guidance

Installed components should remain editable.

If a user has extreme performance requirements, documentation can explain:

```text
remove point markers
reduce annotations
preaggregate data
switch to Canvas variant if available
use a dedicated dense chart
```

rather than adding hundreds of performance props.

---

## 15.164 Performance Props

Avoid generic props such as:

```text
performanceMode
fastMode
turbo
optimize
```

They are vague.

Use specific capabilities:

```text
sample
renderer
showDots
visibleDomain
```

only where real and clearly defined.

---

## 15.165 Automatic Optimization

Automatic behavior is acceptable only when deterministic and understandable.

For example:

```text
hide point markers when chart becomes compact
```

can be part of responsive policy.

But silently downsampling data without documentation is not appropriate.

---

## 15.166 Observability

Plotcn should not send performance telemetry.

No:

```text
analytics
runtime measurements
user chart data
```

should leave the application by default.

Consumers own monitoring.

---

## 15.167 Performance Callbacks

Do not add:

```text
onRenderTime
onPerformanceMetric
```

to every chart.

Only add diagnostic APIs if real use cases emerge.

---

## 15.168 Production Logging

Avoid console performance logs in production.

Development diagnostics may exist behind explicit dev-only behavior.

---

## 15.169 Build-Time Optimization

Potential build-time tasks include:

```text
registry generation
code highlighting
static metadata
Geo asset optimization
preview asset generation
```

Use build time to reduce browser work where it makes sense.

---

## 15.170 SSR Constraints

SVG chart runtime may still need the client for measured responsive width.

The server should render a stable shell rather than guessing browser dimensions.

Do not calculate layout from user-agent device assumptions.

---

## 15.171 Zero-Width Handling

Hidden/unmeasured containers may report zero dimensions temporarily.

Do not run expensive layout or draw calls until dimensions are meaningful.

Recover when ResizeObserver reports usable size.

---

## 15.172 Suspense

Use Suspense where it genuinely improves lazy interactive module loading.

Do not wrap every small chart in multiple nested Suspense boundaries.

---

## 15.173 Error Boundaries

Heavy dynamically-loaded visualizations should have local error boundaries.

This improves both resilience and performance recovery.

---

## 15.174 Concurrency

Do not initialize dozens of expensive components concurrently without need.

For Google and heavy D3 galleries, viewport-based activation naturally reduces concurrent work.

---

## 15.175 Idle Work

Noncritical preload/calculation may use idle time only if proven beneficial.

Do not rely on `requestIdleCallback` as a foundational architecture because support/timing can vary.

---

## 15.176 Browser Compatibility

Performance optimizations should preserve target-browser compatibility.

Do not choose an advanced browser API without fallback if Plotcn claims broader support.

---

## 15.177 Worker Compatibility

If Workers are added later, ensure bundler/Next.js integration works in fresh consumer apps.

Registry-installed code is the real compatibility target.

---

## 15.178 Canvas Consumer Install

A future Canvas component must still install cleanly through shadcn Registry and not depend on internal Plotcn runtime packages.

---

## 15.179 WebGL Consumer Install

Same rule for WebGL.

If specialized dependencies are required, registry metadata must declare them explicitly.

---

## 15.180 Tree-Shaking

Do not assume tree-shaking automatically solves all dependency issues.

Inspect production output.

Especially verify:

```text
D3
icons
utility packages
code-highlighting packages
```

---

## 15.181 Barrel Exports

Be careful with very large barrel modules such as:

```text
charts/index.ts
```

that import every chart implementation eagerly.

Use metadata exports and implementation imports separately.

---

## 15.182 Chart Catalog Import Strategy

Good:

```text
charts metadata
→ one lightweight index

individual implementation
→ direct/dynamic import
```

Bad:

```text
all chart implementations
→ one index
→ imported by /charts
```

---

## 15.183 Component Registry Metadata

Registry build can reference source file paths without causing runtime imports.

Do not couple metadata generation to browser code.

---

## 15.184 Performance and Source-First Simplicity

The installed component should remain readable.

Do not optimize to the point that `line-basic` becomes:

```text
scheduler
worker proxy
binary data cache
render abstraction
```

for a 12-point dashboard line.

Use advanced architecture only in advanced components.

---

## 15.185 Progressive Performance Complexity

The source should follow:

```text
simple chart
→ simple source

moderate chart
→ moderate optimization

dense chart
→ specialized rendering

extreme chart
→ specialized component
```

This is crucial.

---

## 15.186 Performance Invariants

Plotcn should preserve:

```text
01. SVG is the default renderer.

02. Canvas is introduced only when density/performance justifies it.

03. WebGL is specialized future scope.

04. Documentation remains server-first.

05. Interactive charts remain narrow client islands.

06. Gallery previews do not initialize heavy offscreen work.

07. D3 imports remain modular.

08. Google runtime is lazy and deduplicated.

09. Tooltip state does not regenerate geometry.

10. Theme changes do not recompute geometry unnecessarily.

11. Resize handling is container-driven and scheduled sensibly.

12. Expensive transforms run once per meaningful input change.

13. Memoization is evidence-driven, not blanket.

14. Large-data downsampling remains separate from source data.

15. Canvas/WebGL do not weaken accessibility contracts.

16. Force simulations are stopped when unused.

17. All observers/listeners/frames/workers are cleaned up.

18. 100+ component metadata does not imply 100+ preview bundles.

19. Detail-page prop labs can lazy mount.

20. Performance optimization must preserve source readability.
```

---

## 15.187 Recommended Implementation Phases

### Phase 1 — V1 Foundation

Implement:

```text
SVG-first charts
server-first docs
narrow client islands
container ResizeObserver
lazy D3/Google previews
modular D3
Google loader dedupe
resource cleanup
bundle analysis
```

---

### Phase 2 — Dense Rendering

Add when proven:

```text
Canvas scatter
Canvas heatmap
dense time-series sampling
viewport domain rendering
selected Worker transforms
```

---

### Phase 3 — Background Computation

Add:

```text
Workers for selected heavy transforms
large hierarchy processing
large statistical transforms
geo preprocessing
```

---

### Phase 4 — Specialized GPU Rendering

Only if needed:

```text
WebGL scatter
large graph rendering
GPU heatmap
specialized geospatial layers
```

---

## 15.188 Definition of Done for V1

V1 performance architecture is complete when:

```text
docs pages remain server-first

/charts metadata loads without all chart implementations

offscreen force charts do not run

Google runtime is not globally loaded

D3 modules remain chart-specific

chart detail pages do not eagerly mount every prop preview

tooltip/crosshair interaction remains localized

ResizeObserver cleanup works

animations cancel correctly

theme changes do not replay expensive transitions

all representative registry items install without unrelated dependencies

production bundle has been inspected
```

---

## 15.189 Final Architecture

```text
                           APPLICATION
                               │
                               ▼
                         VALIDATED DATA
                               │
                               ▼
                        CHART CALCULATION
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼

            SVG              Canvas        Google Runtime
         default             dense          engine-owned
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                      PLOTCN EXPERIENCE
                 theme / states / interaction
                    responsiveness / a11y
                               │
                               ▼
                        USER APPLICATION
```

Large-data evolution:

```text
Data
 │
 ▼
Validation
 │
 ▼
Visible domain
 │
 ├───────────────┐
 ▼               ▼
Small/normal    Dense
 │               │
 ▼               ▼
Direct render   Sampling / aggregation
                 │
                 ▼
           Worker if required
                 │
                 ▼
          Canvas / WebGL
```

The governing principle is:

> **Plotcn should be fast because it avoids unnecessary work, not because every chart is forced through a complex optimization framework.**

And the long-term principle is:

> **Start with SVG and readable source, then introduce sampling, Canvas, Workers, and WebGL only where real data density proves they are necessary.**
