"use client"

import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartDetailDoc } from "@/lib/charts/detail-docs/types"
import { ComponentHeader } from "./component-header"
import { HeroPreviewWorkspace } from "./hero-preview-workspace"
import { QuickFacts } from "./quick-facts"
import { UsageSection } from "./usage-section"
import { DataFormatSection } from "./data-format-section"
import { PropsExplorer } from "./props-explorer"
import { ExamplesGallery } from "./examples-gallery"
import { ResponsiveSection } from "./responsive-section"
import { AccessibilitySection } from "./accessibility-section"
import { SourceAnatomy } from "./source-anatomy"
import { RelatedCharts } from "./related-charts"

interface ChartDetailShellProps {
  chart: ChartMetadata
  doc: ChartDetailDoc
  sourceCode: string
  highlightedSourceCode?: string
  relatedCharts: readonly ChartMetadata[]
}

export function ChartDetailShell({
  chart,
  doc,
  sourceCode,
  highlightedSourceCode,
  relatedCharts,
}: ChartDetailShellProps) {
  const sampleData = doc.dataFormat.exampleRows.length > 0
    ? doc.dataFormat.exampleRows
    : [
        { label: "Jan", value: 186 },
        { label: "Feb", value: 305 },
        { label: "Mar", value: 237 },
        { label: "Apr", value: 273 },
        { label: "May", value: 309 },
        { label: "Jun", value: 414 },
      ]

  const cleanComponentPath = chart.componentPath
    .replace(/\\/g, "/")
    .replace(/^registry\//, "components/charts/")
    .replace(/\.tsx$/, "")

  const basicUsageSnippet = `import { ${chart.exportName} } from "@/${cleanComponentPath}"

const data = ${JSON.stringify(sampleData.slice(0, 4), null, 2)}

export default function ChartDemo() {
  return (
    <div className="w-full max-w-xl h-80">
      <${chart.exportName} data={data} color="#10b981" />
    </div>
  )
}`

  return (
    <div className="max-w-5xl mx-auto w-full space-y-14">
      {/* 1. Header (Breadcrumb, Blueprint, Engine Branding, Metadata Rail, Install Console) */}
      <ComponentHeader chart={chart} doc={doc} />

      {/* 2. Compact Interactive Hero Preview */}
      <HeroPreviewWorkspace chart={chart} />

      {/* 3. Quick Facts Summary */}
      <QuickFacts facts={doc.quickFacts} />

      {/* 4. Usage Section */}
      <UsageSection chart={chart} basicSnippet={basicUsageSnippet} />

      {/* 5. Data Format Section */}
      <DataFormatSection dataFormat={doc.dataFormat} />

      {/* 6. Props Explorer & Prop Preview Lab */}
      <PropsExplorer
        propsList={doc.props}
        chartId={chart.id}
        sampleData={sampleData}
        registryName={chart.registryName}
      />

      {/* 7. Examples & States Gallery */}
      <ExamplesGallery
        examples={doc.examples}
        registryName={chart.registryName}
      />

      {/* 8. Responsive Behavior Lab */}
      <ResponsiveSection
        overview={doc.responsive.overview}
        breakpoints={doc.responsive.breakpoints}
        registryName={chart.registryName}
      />

      {/* 9. Accessibility Section */}
      <AccessibilitySection accessibility={doc.accessibility} />

      {/* 10. Source Anatomy & Inline Source Viewer */}
      <SourceAnatomy
        anatomy={doc.sourceAnatomy}
        sourceCode={sourceCode}
        highlightedSourceCode={highlightedSourceCode}
        componentPath={chart.componentPath}
      />

      {/* 11. Related Components & Ecosystem Navigation */}
      <RelatedCharts
        relatedCharts={relatedCharts}
        currentChart={chart}
      />
    </div>
  )
}
