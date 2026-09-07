# @plotcn/chart-motion

> **"Motion should explain change, not compete with the data."**

Plotcn treats animation as a **visual communication layer**, not decoration and not part of the chart engine itself.

## Architecture

```text
                   DATA / STATE CHANGE
                          │
                          ▼
                    Motion policy
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼

        UI Motion     Geometry       Engine-native
     Motion React   interpolation      behavior
             │            │             │
             ▼            ▼             ▼

       tooltip /      path / arc       Recharts /
       legend /       coordinates       Google
       presence
```

## Presets

- `draw`: Stroke dasharray/dashoffset line entrance
- `grow`: Semantic baseline bar expansion
- `sweep`: Angular radial arc progression
- `reveal`: Directional clipping/masking
- `morph`: Compatible path shape interpolation
- `stagger`: Controlled mark delay (capped at 150ms total)
- `fade`: Universal fallback for mismatched topologies or large datasets
- `none`: Instant rendering

## Invariants

1. Motion explains change; it does not decorate every chart.
2. Charts remain fully understandable without animation.
3. No bouncy springs on quantitative metrics (revenue, percentages, counts).
4. Continuous resize directly redraws without animation lag.
5. Reduced motion is consistently honored across all engines.
6. Animations are interruptible ("latest state wins"); no animation backlogs.
