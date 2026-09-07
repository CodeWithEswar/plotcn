import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { ChartHeader } from "./chart-header"
import { ChartPreview } from "./chart-preview"
import { ChartInstall } from "./chart-install"
import { ChartActions } from "./chart-actions"
import { ChartCode } from "./chart-code"
import { ChartApi } from "./chart-api"
import { ChartA11y } from "./chart-a11y"
import { ChartRelated } from "./chart-related"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export interface ChartDetailViewProps {
  chart: ChartMetadata
  sourceCode: string
  relatedCharts: readonly ChartMetadata[]
}

export function ChartDetailView({ chart, sourceCode, relatedCharts }: ChartDetailViewProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <ChartHeader chart={chart} />

        {/* Live Preview */}
        <ChartPreview registryName={chart.registryName} title={chart.title} />

        {/* Install Command */}
        <ChartInstall registryName={chart.registryName} />

        {/* Action Links */}
        <ChartActions registryName={chart.registryName} componentPath={chart.componentPath} />

        {/* Source Code Viewer */}
        <ChartCode
          sourceCode={sourceCode}
          usageSnippet={chart.snippet}
          dataShape={chart.dataShape}
          componentPath={chart.componentPath}
        />

        {/* API Reference */}
        <ChartApi />

        {/* Accessibility Features */}
        <ChartA11y features={chart.features as string[]} />

        {/* Related Charts */}
        <ChartRelated relatedCharts={relatedCharts} />
      </main>

      <SiteFooter />
    </div>
  )
}
