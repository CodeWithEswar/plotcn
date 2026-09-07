import { Suspense } from "react"
import fs from "node:fs"
import type { Metadata } from "next"
import { getChartById } from "@/config/charts"
import { playgroundIds } from "@/lib/playground/model"
import { PlaygroundShell } from "@/components/playground/playground-shell"
import { CodeBlock } from "@/components/docs/code-block"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { constructPageMetadata } from "@/lib/seo/metadata"
export const metadata: Metadata = constructPageMetadata({title:"Playground",description:"Experiment with Plotcn chart data, themes, interaction, motion and responsive behavior in real time.",path:"/playground"})
export default function PlaygroundPage(){const sources=Object.fromEntries(playgroundIds.map(id=>{const chart=getChartById(id)!;return [id,<CodeBlock key={id} code={fs.readFileSync(chart.componentPath,"utf8")} language="tsx" title={chart.componentPath}/>]}));return <><SiteHeader/><div className="charts-surface" data-theme="dark"><Suspense fallback={<main className="lens-shell"><h1>Playground</h1><p>Loading the workbench...</p></main>}><PlaygroundShell sources={sources}/></Suspense></div><SiteFooter/></>}
