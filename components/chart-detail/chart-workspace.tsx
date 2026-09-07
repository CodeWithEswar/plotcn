"use client"
import type { ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PreviewWorkspace } from "@/components/preview/preview-workspace"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import type { ChartMetadata } from "@/lib/charts/metadata"
export function ChartWorkspace({ chart, source, usage }: { chart: ChartMetadata; source: ReactNode; usage: ReactNode }) {
  return <Tabs defaultValue="preview" className="lens-detail-workspace"><div className="lens-detail-toolbar"><TabsList variant="line" aria-label="Chart workspace"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger></TabsList><span className="lens-eyebrow">CONTAINER LAB</span></div><TabsContent value="preview"><PreviewWorkspace title={chart.title} animate={chart.features.includes("animated")} inspector={({width}) => `${chart.engine} / ${chart.renderer} / ${width}px / Sample data`}>{({height,iteration,reducedMotion}) => <DynamicChartRenderer key={iteration} registryName={chart.registryName} height={height} motion={!reducedMotion}/>}</PreviewWorkspace></TabsContent><TabsContent value="code" className="lens-code-panel">{source}</TabsContent><TabsContent value="usage" className="lens-code-panel">{usage}</TabsContent></Tabs>
}
