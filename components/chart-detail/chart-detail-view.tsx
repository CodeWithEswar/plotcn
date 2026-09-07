import type { ChartMetadata } from "@/lib/charts/metadata"
import { getChartDetailDoc } from "@/lib/charts/detail-docs"
import { ChartDetailShell } from "./chart-detail-shell"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export interface ChartDetailViewProps {
  chart: ChartMetadata
  sourceCode: string
  highlightedSourceCode?: string
  relatedCharts: readonly ChartMetadata[]
}

export function ChartDetailView({
  chart,
  sourceCode,
  highlightedSourceCode,
  relatedCharts,
}: ChartDetailViewProps) {
  const doc = getChartDetailDoc(chart)

  return (
    <>
      <SiteHeader />
      <div className="charts-surface min-h-screen" data-theme="dark">
        <main id="main" tabIndex={-1} className="site-container-wide py-8 lg:py-12">
          <ChartDetailShell
            chart={chart}
            doc={doc}
            sourceCode={sourceCode}
            highlightedSourceCode={highlightedSourceCode}
            relatedCharts={relatedCharts}
          />
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
