import fs from "node:fs/promises"
import path from "node:path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blocks, getBlock } from "@/config/blocks"
import { getChartById } from "@/config/charts"
import { chartHref } from "@/lib/charts/filters"
import { SiteHeader } from "@/components/site/site-header"
import { BlockWorkspace } from "@/components/blocks/block-workspace"
import { ChartInstall } from "@/components/chart-detail/chart-install"
import { CodeBlock } from "@/components/docs/code-block"
import { constructPageMetadata } from "@/lib/seo/metadata"
export function generateStaticParams(){return blocks.map(b=>({block:b.slug}))}
export async function generateMetadata({params}:{params:Promise<{block:string}>}){const item=getBlock((await params).block);return item ? constructPageMetadata({title:item.title,description:item.description,path:"/blocks/"+item.slug}) : {title:"Block not found"}}
export default async function BlockPage({params}:{params:Promise<{block:string}>}){
 const item=getBlock((await params).block);if(!item)notFound()
 const read=(file:string)=>fs.readFile(path.join(process.cwd(),"registry/blocks",file),"utf8")
 const [source,data,frame]=await Promise.all([read(item.slug+".tsx"),read(item.slug+"-data.ts"),read("block-frame.tsx")])
 const usage='import { '+item.exportName+' } from "@/components/charts/blocks/'+item.slug+'"\nimport { '+item.fixtureName+' } from "@/components/charts/blocks/'+item.slug+'-data"\n\nexport function Example() {\n  return <'+item.exportName+' data={'+item.fixtureName+'} />\n}'
 return <div className="charts-surface"><SiteHeader/><main className="lens-shell product-shell"><header className="product-heading"><div><Link href="/blocks" className="lens-eyebrow">PLOTCN / BLOCKS</Link><h1>{item.title}</h1><p>{item.description}</p></div><span className="lens-eyebrow">RECHARTS / {item.charts.length} CHARTS</span></header><BlockWorkspace slug={item.slug} title={item.title} source={<><CodeBlock code={source} language="tsx" title={item.slug+".tsx"}/><CodeBlock code={frame} language="tsx" title="block-frame.tsx"/></>} data={<CodeBlock code={data} language="typescript" title={item.slug+"-data.ts"}/>} usage={<CodeBlock code={usage.replaceAll('\\n','\n')} language="tsx" title="Usage"/>}/><ChartInstall registryName={item.slug}/><div className="block-detail-notes"><section><h2>Dependency trace</h2><p>This block composes the installed chart components. Every file stays in your project.</p><ul>{item.charts.map(id=>{const chart=getChartById(id)!;return <li key={id}><Link href={chartHref(chart)}>{chart.title}</Link><span>{chart.registryName}</span></li>})}<li>shadcn Select<span>select</span></li><li>Local panel and state helpers<span>block-frame</span></li></ul><a href={"/r/"+item.slug+".json"}>Inspect local registry JSON</a></section><section><h2>Data & customization</h2><p>{item.fields}</p><p>{item.customization}</p><h2>States & accessibility</h2><p>Loading, empty and error states are explicit. A breakdown failure preserves the main trend. Filters have accessible names; value tables provide a textual alternative. Motion respects the system preference. Preview data is a fixture, not live business data.</p></section></div></main></div>
}
