import type { ReactNode } from "react"
import type { ChartEngine, ChartCategory, ChartRenderer, ChartStatus } from "../metadata"

export type PropCategory = "core" | "visual" | "interaction" | "a11y" | "advanced"

export interface PropOption {
  value: any
  label: string
  description?: string
}

export interface PropDoc {
  name: string
  type: string
  default: string
  required: boolean
  category: PropCategory
  description: string
  bestFor?: string
  avoid?: string
  values?: readonly string[]
  previewable?: boolean
  controlType?: "segmented" | "switch" | "select" | "color"
  controlOptions?: readonly PropOption[]
}

export interface QuickFacts {
  bestFor: string
  dataModel: string
  interaction: string
  responsive: string
  animation: string
  runtime?: string
}

export interface DataFieldDoc {
  field: string
  type: string
  required: boolean
  description: string
}

export interface DataFormatDoc {
  summary: string
  fields: readonly DataFieldDoc[]
  nullPolicy: string
  orderingPolicy: string
  exampleRows: readonly Record<string, any>[]
}

export interface ExampleVariantDoc {
  id: string
  title: string
  description: string
  snippet: string
  props: Record<string, any>
}

export interface ResponsiveBreakpointDoc {
  name: string
  width: string
  behavior: string
}

export interface KeyboardShortcutDoc {
  key: string
  action: string
}

export interface AccessibilityDoc {
  role: string
  summary: string
  screenReader: string
  keyboardShortcuts: readonly KeyboardShortcutDoc[]
  colorIndependence: string
  reducedMotion: string
}

export interface SourceAnatomyNode {
  name: string
  role: string
  description: string
  children?: readonly SourceAnatomyNode[]
}

export interface SourceAnatomyDoc {
  tree: SourceAnatomyNode
  sourceFiles: readonly { path: string; description: string }[]
  registryDependencies: readonly string[]
  npmDependencies: readonly string[]
}

export interface ChartDetailDoc {
  chartId: string
  engine: ChartEngine
  category: ChartCategory
  renderer: ChartRenderer
  status: ChartStatus
  blueprint: string
  quickFacts: QuickFacts
  dataFormat: DataFormatDoc
  props: readonly PropDoc[]
  examples: readonly ExampleVariantDoc[]
  responsive: {
    overview: string
    breakpoints: readonly ResponsiveBreakpointDoc[]
  }
  animation: {
    overview: string
    duration: string
    refreshable: boolean
  }
  interaction: {
    tooltip: string
    crosshair?: string
    legend?: string
  }
  accessibility: AccessibilityDoc
  sourceAnatomy: SourceAnatomyDoc
}
