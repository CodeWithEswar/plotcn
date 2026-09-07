import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, KeyboardIcon, AccessibilityIcon } from "@hugeicons/core-free-icons"

export interface ChartA11yProps {
  features?: string[]
}

export function ChartA11y({ features = [] }: ChartA11yProps) {
  const items = [
    {
      icon: AccessibilityIcon,
      title: "Screen Reader Summary",
      description:
        "Every chart includes structured HTML elements (or hidden text summaries) announcing the visualization title, overall trend, min/max range, and series count to assistive devices.",
    },
    {
      icon: ViewIcon,
      title: "Data Table Disclosure",
      description:
        "An accessible tabular representation of the raw underlying dataset can be toggled or read by screen readers using standard table navigation shortcuts.",
    },
    {
      icon: KeyboardIcon,
      title: "Keyboard & Focus Traversal",
      description:
        "Tooltips and interactive legends respect keyboard focus rings and prevent trapping focus within SVG or canvas viewports.",
    },
  ]

  return (
    <div className="flex flex-col mb-8">
      <h2 className="text-xl font-semibold text-foreground tracking-tight mb-3">Accessibility & Inclusive Design</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col p-4 rounded-xl border border-border/70 bg-card text-card-foreground"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <HugeiconsIcon icon={item.icon} size={16} className="text-emerald-500" />
              <h3 className="text-xs font-semibold text-foreground tracking-tight">{item.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
