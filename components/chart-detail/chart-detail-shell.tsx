import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
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
import { BackToTop } from "./back-to-top"
import { ChartDetailToc, type TocItem } from "./chart-detail-toc"
import { ChartDetailMobileSidebar, ChartDetailSidebar } from "./chart-detail-sidebar"
import { charts } from "@/config/charts"
import { MDXRenderer } from "@/components/docs/mdx-components"
import { ChartColorProvider } from "./chart-color-context"

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
    const respMatch = raw.match(/\n##\s+Responsive(?:\s+Behavior)?/i)
    const a11yMatch = raw.match(/\n##\s+Accessibility(?:\s+&|\s+and)?(?:\s+Keyboard\s+Navigation)?/i)
    const safetyMatch = raw.match(/\n##\s+Data\s+Safety(?:\s+Guarantees?)?/i)

    const respIndex = respMatch && respMatch.index !== undefined ? respMatch.index : -1
    const a11yIndex = a11yMatch && a11yMatch.index !== undefined ? a11yMatch.index : -1
    const safetyIndex = safetyMatch && safetyMatch.index !== undefined ? safetyMatch.index : -1

    if (safetyIndex !== -1) {
      if (respIndex !== -1 && a11yIndex !== -1) {
        primaryMdx = raw.slice(0, respIndex).trim()
        responsiveMdx = raw.slice(respIndex, a11yIndex).trim()
        a11yMdx = raw.slice(a11yIndex, safetyIndex).trim()
        safetyMdx = raw.slice(safetyIndex).trim()
      } else if (a11yIndex !== -1) {
        primaryMdx = raw.slice(0, a11yIndex).trim()
        a11yMdx = raw.slice(a11yIndex, safetyIndex).trim()
        safetyMdx = raw.slice(safetyIndex).trim()
      } else {
        primaryMdx = raw.slice(0, safetyIndex).trim()
        safetyMdx = raw.slice(safetyIndex).trim()
      }
    } else if (respIndex !== -1 && a11yIndex !== -1) {
      primaryMdx = raw.slice(0, respIndex).trim()
      responsiveMdx = raw.slice(respIndex, a11yIndex).trim()
      a11yMdx = raw.slice(a11yIndex).trim()
    } else {
      primaryMdx = raw
    }
  }

  return (
    <ChartColorProvider registryName={chart.registryName}>
      <div className="chart-detail-layout">
        <ChartDetailSidebar current={chart} charts={charts} />
        {/* Main Documentation Column */}
        <article className="chart-detail-main min-w-0 space-y-14">
          <div className="chart-detail-mobile-controls flex flex-row items-center gap-2 w-full">
            <Link
              href="/charts"
              className="chart-detail-back-link inline-flex items-center justify-center size-9 min-h-[36px] max-h-[36px] rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors shadow-xs"
              aria-label="Back to charts gallery"
              title="Back to charts gallery"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
            </Link>
            <ChartDetailMobileSidebar current={chart} charts={charts} />
            <ChartDetailToc items={mdxData ? mdxTocItems : undefined} chart={chart} compact />
          </div>
          {/* 1. Header (Breadcrumb, Blueprint, Engine Branding, Metadata Rail, Install Console) */}
          <ComponentHeader chart={chart} doc={doc} />

          {/* 2. Compact Interactive Hero Preview */}
          <section id="section-preview" aria-label="Interactive Preview" className="space-y-4 scroll-mt-20">
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
            <div id="section-props-explorer" className="scroll-mt-20" data-toc-target="component-props">
              <span id="component-props" className="sr-only" aria-hidden="true" />
              <PropsExplorer
                propsList={doc.props}
                registryName={chart.registryName}
              />
            </div>

            {/* Examples & States Gallery */}
            <div id="section-examples" className="scroll-mt-20">
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
            <div id="section-responsive" className="scroll-mt-20" data-toc-target="responsive-behavior">
              <span id="responsive-behavior" className="sr-only" aria-hidden="true" />
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
            <div id="section-accessibility" className="scroll-mt-20" data-toc-target="accessibility-keyboard-navigation">
              <span id="accessibility-keyboard-navigation" className="sr-only" aria-hidden="true" />
              <AccessibilitySection accessibility={doc.accessibility} />
            </div>

            {/* Data Safety Guarantee MDX */}
            <div id="section-safety" className="scroll-mt-20" data-toc-target="data-safety-guarantee">
              <span id="data-safety-guarantee" className="sr-only" aria-hidden="true" />
              <span id="data-safety-guarantees" className="sr-only" aria-hidden="true" />
              {safetyMdx ? (
                <div className="prose-docs">
                  <MDXRenderer content={safetyMdx} slug={chart.slug} rawContent={mdxData.rawContent} />
                </div>
              ) : null}
            </div>

            {/* Source Anatomy & Code Viewer */}
            <div id="section-source" className="scroll-mt-20">
              <SourceAnatomy
                anatomy={doc.sourceAnatomy}
                sourceCode={sourceCode}
                highlightedSourceCode={highlightedSourceCode}
                componentPath={chart.componentPath}
              />
            </div>

            {/* Related Components */}
            <div id="section-related" className="scroll-mt-20">
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
      <aside className="chart-detail-rail">
        <ChartDetailToc items={mdxData ? mdxTocItems : undefined} chart={chart} />
      </aside>

      {/* Floating Back to Top for quick scrolling */}
      <BackToTop />
    </div>
    </ChartColorProvider>
  )
}
