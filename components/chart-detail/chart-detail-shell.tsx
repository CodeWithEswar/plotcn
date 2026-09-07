import React from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import type { ChartDetailDoc } from "@/lib/charts/detail-docs/types"
import type { ChartMdxData } from "@/lib/charts/chart-mdx"
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
import { ChartDetailToc, type TocItem } from "./chart-detail-toc"
import { MDXRenderer } from "@/components/docs/mdx-components"

interface ChartDetailShellProps {
  chart: ChartMetadata
  doc: ChartDetailDoc
  sourceCode: string
  highlightedSourceCode?: string
  relatedCharts: readonly ChartMetadata[]
  mdxData?: ChartMdxData | null
}

const mdxTocItems: TocItem[] = [
  { id: "section-preview", label: "Live Preview", index: "01" },
  { id: "overview", label: "Overview", index: "02" },
  { id: "best-suited-for", label: "Best Suited For", index: "03" },
  { id: "installation", label: "Installation", index: "04" },
  { id: "data-contract", label: "Data Contract", index: "05" },
  { id: "component-props", label: "Component Props", index: "06" },
  { id: "section-props-explorer", label: "Prop Explorer", index: "07" },
  { id: "section-examples", label: "Examples & States", index: "08" },
  { id: "responsive-behavior", label: "Responsive", index: "09" },
  { id: "accessibility-keyboard-navigation", label: "Accessibility", index: "10" },
  { id: "data-safety-guarantee", label: "Data Safety", index: "11" },
  { id: "section-source", label: "Source Code", index: "12" },
  { id: "section-related", label: "Related Charts", index: "13" },
]

export async function ChartDetailShell({
  chart,
  doc,
  sourceCode,
  highlightedSourceCode,
  relatedCharts,
  mdxData,
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

  let primaryMdx = ""
  let responsiveMdx = ""
  let a11yMdx = ""
  let safetyMdx = ""

  if (mdxData?.rawContent) {
    const raw = mdxData.rawContent
    const respIndex = raw.indexOf("## Responsive Behavior")
    const a11yIndex = raw.indexOf("## Accessibility & Keyboard Navigation")
    const safetyIndex = raw.indexOf("## Data Safety Guarantee")

    if (respIndex !== -1 && a11yIndex !== -1 && safetyIndex !== -1) {
      primaryMdx = raw.slice(0, respIndex).trim()
      responsiveMdx = raw.slice(respIndex, a11yIndex).trim()
      a11yMdx = raw.slice(a11yIndex, safetyIndex).trim()
      safetyMdx = raw.slice(safetyIndex).trim()
    } else {
      primaryMdx = raw
    }
  }

  return (
    <div className="flex items-start gap-10 xl:gap-14 w-full">
      {/* Main Documentation Column */}
      <article className="min-w-0 flex-1 space-y-14">
        {/* 1. Header (Breadcrumb, Blueprint, Engine Branding, Metadata Rail, Install Console) */}
        <ComponentHeader chart={chart} doc={doc} />

        {/* 2. Compact Interactive Hero Preview */}
        <section id="section-preview" aria-label="Interactive Preview" className="space-y-4">
          <HeroPreviewWorkspace chart={chart} />
        </section>

        {mdxData?.rawContent ? (
          <>
            {/* Primary MDX Sections: Overview, Best Suited For, Installation, Data Contract, Component Props */}
            {primaryMdx && (
              <div className="prose-docs">
                <MDXRenderer content={primaryMdx} slug={chart.slug} rawContent={mdxData.rawContent} />
              </div>
            )}

            {/* Interactive Prop Explorer Lab */}
            <div id="section-props-explorer">
              <PropsExplorer
                propsList={doc.props}
                chartId={chart.id}
                sampleData={sampleData}
                registryName={chart.registryName}
              />
            </div>

            {/* Examples & States Gallery */}
            <div id="section-examples">
              <ExamplesGallery
                examples={doc.examples}
                registryName={chart.registryName}
              />
            </div>

            {/* Responsive Behavior MDX */}
            {responsiveMdx && (
              <div className="prose-docs">
                <MDXRenderer content={responsiveMdx} slug={chart.slug} rawContent={mdxData.rawContent} />
              </div>
            )}

            {/* Responsive Simulator Lab */}
            <div id="section-responsive">
              <ResponsiveSection
                overview={doc.responsive.overview}
                breakpoints={doc.responsive.breakpoints}
                registryName={chart.registryName}
              />
            </div>

            {/* Accessibility & Keyboard MDX */}
            {a11yMdx && (
              <div className="prose-docs">
                <MDXRenderer content={a11yMdx} slug={chart.slug} rawContent={mdxData.rawContent} />
              </div>
            )}

            {/* Accessibility Section Keyboard & ARIA overview */}
            <div id="section-accessibility">
              <AccessibilitySection accessibility={doc.accessibility} />
            </div>

            {/* Data Safety Guarantee MDX */}
            {safetyMdx && (
              <div className="prose-docs">
                <MDXRenderer content={safetyMdx} slug={chart.slug} rawContent={mdxData.rawContent} />
              </div>
            )}

            {/* Source Anatomy & Code Viewer */}
            <div id="section-source">
              <SourceAnatomy
                anatomy={doc.sourceAnatomy}
                sourceCode={sourceCode}
                highlightedSourceCode={highlightedSourceCode}
                componentPath={chart.componentPath}
              />
            </div>

            {/* Related Components */}
            <div id="section-related">
              <RelatedCharts
                relatedCharts={relatedCharts}
                currentChart={chart}
              />
            </div>
          </>
        ) : (
          <>
            {/* Fallback Non-MDX Layout for charts without MDX */}
            <QuickFacts facts={doc.quickFacts} />
            <UsageSection chart={chart} basicSnippet={basicUsageSnippet} />
            <DataFormatSection dataFormat={doc.dataFormat} />
            <div id="section-props-explorer">
              <PropsExplorer
                propsList={doc.props}
                chartId={chart.id}
                sampleData={sampleData}
                registryName={chart.registryName}
              />
            </div>
            <div id="section-examples">
              <ExamplesGallery
                examples={doc.examples}
                registryName={chart.registryName}
              />
            </div>
            <div id="section-responsive">
              <ResponsiveSection
                overview={doc.responsive.overview}
                breakpoints={doc.responsive.breakpoints}
                registryName={chart.registryName}
              />
            </div>
            <div id="section-accessibility">
              <AccessibilitySection accessibility={doc.accessibility} />
            </div>
            <div id="section-source">
              <SourceAnatomy
                anatomy={doc.sourceAnatomy}
                sourceCode={sourceCode}
                highlightedSourceCode={highlightedSourceCode}
                componentPath={chart.componentPath}
              />
            </div>
            <div id="section-related">
              <RelatedCharts
                relatedCharts={relatedCharts}
                currentChart={chart}
              />
            </div>
          </>
        )}
      </article>

      {/* Right Sticky Table of Contents (>= 1280px) */}
      <aside className="hidden xl:block w-[240px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar py-2">
        <ChartDetailToc items={mdxData ? mdxTocItems : undefined} />
      </aside>
    </div>
  )
}
