"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { charts, chartCode, chartFilters, type ChartEntry } from "./chart-catalog"
import { ChartPreview } from "./chart-preview"
import { CopyButton } from "./copy-button"
import { InstallCommand } from "./install-command"
import { Icon } from "./icons"
import { plotcnRegistry } from "@/config/registry"

export function FeaturedCharts() {
  const [filter,setFilter]=useState("All")
  const [expanded,setExpanded]=useState(false)
  const [selected,setSelected]=useState<ChartEntry|null>(null)
  const filtered=charts.filter(chart=>filter==="All" || filter==="Popular" && ["line","area","network"].includes(chart.id) || chart.engine===filter || chart.category===filter)
  const visible=expanded?filtered:filtered.slice(0,6)
  function filterBy(value:string) { setFilter(value); setExpanded(true) }
  return <>
    <section id="charts" className="section site-container"><div className="section-topline"><span className="eyebrow">01 / THE COLLECTION</span><span className="section-note">BUILT TO BE TAKEN APART</span></div><div className="section-heading"><div><h2>A better starting point.</h2><p>Thoughtful defaults. Remarkable possibilities. Find your next visualization.</p></div><Button variant="ghost" onClick={()=>{setFilter("All");setExpanded(!expanded)}}>{expanded?"Show featured":"View all charts"}<Icon name="arrow" /></Button></div>
    <Tabs value={filter} onValueChange={value=>filterBy(String(value))}><div className="filter-scroll no-scrollbar"><TabsList variant="line" aria-label="Filter visualizations">{chartFilters.map(item=><TabsTrigger key={item} value={item}>{item}{item==="All" && <span className="filter-count">{charts.length}</span>}</TabsTrigger>)}</TabsList></div><TabsContent value={filter} className="chart-gallery">{visible.map((chart,i)=><article className="gallery-card" key={chart.id}><div className="gallery-preview"><div className="gallery-badges"><Badge variant="outline">{chart.engine}</Badge><span>{String(i+1).padStart(2,"0")}</span></div><div className="gallery-chart"><ChartPreview kind={chart.kind} compact /></div><span className="demo-watermark">DEMO DATA</span></div><div className="gallery-description"><div><h3>{chart.title}</h3><p>{chart.description}</p></div><Button variant="ghost" size="icon" aria-label={`Open ${chart.title} preview`} onClick={()=>setSelected(chart)}><Icon name="external" /></Button></div><div className="gallery-tags">{chart.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</TabsContent></Tabs>
    </section>
    <section className="category-section site-container" aria-labelledby="category-heading"><div><span className="eyebrow">FOLLOW YOUR CURIOSITY</span><h2 id="category-heading">There’s a plot<br />for that.</h2><p>From familiar axes to entirely new perspectives.</p></div><div className="category-index">{["Cartesian","Statistical","Hierarchy","Network","Financial","Geographic","Experimental"].map((category,i)=><Button key={category} variant="ghost" onClick={()=>{filterBy(category);document.getElementById("charts")?.scrollIntoView({behavior:"instant"})}}><span className="category-number">0{i+1}</span><span>{category}</span><span className="category-count">{charts.filter(c=>c.category===category).length.toString().padStart(2,"0")}</span><Icon name="arrow" /></Button>)}</div></section>
    <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="dark chart-dialog">{selected && <><DialogTitle>{selected.title}</DialogTitle><DialogDescription>{selected.description} All values are sample data.</DialogDescription><Tabs defaultValue="preview"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="registry">Registry</TabsTrigger></TabsList><TabsContent value="preview"><div className="dialog-chart"><ChartPreview kind={selected.kind} /></div><p className="muted text-sm">{selected.engine} · {selected.tags.join(" · ")}</p></TabsContent><TabsContent value="code"><div className="code-toolbar"><span>example.tsx</span><CopyButton value={chartCode(selected)} label="Copy example code" /></div><pre className="code-block"><code>{chartCode(selected)}</code></pre></TabsContent><TabsContent value="registry"><p className="registry-dialog-copy">Add the component source to your shadcn-enabled project.</p><InstallCommand name={selected.id} /><a className="text-link" href={plotcnRegistry.getItemUrl(selected.id)} target="_blank" rel="noreferrer">Inspect registry file <Icon name="external" /></a></TabsContent></Tabs></>}</DialogContent></Dialog>
  </>
}
