# @plotcn/chart-accessibility

> **"Every important insight and interaction available visually should have an understandable non-visual or non-pointer equivalent."**

Plotcn treats accessibility as a **first-class visualization architecture concern**, not as post-processing ARIA markup.

## Core Features

- **Factual Summaries**: Conservative, insight-driven summaries of data without unsupported business conclusions.
- **Screen Reader Tables**: Semantic HTML `<table>` disclosure with typed column descriptors and dataset size protection.
- **Pure Keyboard Navigation**: Clamped Cartesian navigation (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`).
- **Stable Semantic ARIA IDs**: Predictable, hydration-safe ID associations for headings, descriptions, and regions.
- **Decorative SVG Protection**: Hides non-semantic gridlines, masks, and decorative paths from assistive technology trees.
- **Restrained Live Announcements**: Eliminates live-region noise during continuous resize, mouse moves, and animations.
