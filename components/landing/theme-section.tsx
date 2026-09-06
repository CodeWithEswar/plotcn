"use client"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlotLineChart } from "@/components/charts/plot-line-chart"
import { activity } from "./demo-data"
import { CopyButton } from "./copy-button"
export function ThemeSection() {
  const [theme,setTheme]=useState("dark")
  const palettes:Record<string,{surface:string;ink:string;muted:string;grid:string}>={dark:{surface:"#101012",ink:"#fafafa",muted:"#a1a1aa",grid:"#28282d"},light:{surface:"#fafafa",ink:"#18181b",muted:"#52525b",grid:"#d4d4d8"},monochrome:{surface:"#27272a",ink:"#d4d4d8",muted:"#a1a1aa",grid:"#52525b"},contrast:{surface:"#000000",ink:"#ffffff",muted:"#d4d4d8",grid:"#71717a"}}
  const palette=palettes[theme]
  const css=`.my-chart {\n  --plot-surface: ${palette.surface};\n  --plot-ink: ${palette.ink};\n  --plot-muted: ${palette.muted};\n  --plot-grid: ${palette.grid};\n  color: var(--plot-ink);\n}`
  return <section id="themes" className="section site-container theme-section"><div className="theme-copy"><span className="eyebrow">06 / YOUR VISUAL LANGUAGE</span><h2>Fits your theme.<br /><span>Feels like you.</span></h2><p>One component. A different point of view. Use CSS variables to make the entire canvas belong in your product.</p><Tabs value={theme} onValueChange={value=>setTheme(String(value))}><TabsList aria-label="Chart theme"><TabsTrigger value="dark">Dark</TabsTrigger><TabsTrigger value="light">Light</TabsTrigger><TabsTrigger value="monochrome">Mono</TabsTrigger><TabsTrigger value="contrast">High contrast</TabsTrigger></TabsList></Tabs><div className="theme-tokens">{Object.entries(palette).map(([key,value])=><div key={key}><i style={{background:value}} /><span>{key}</span><code>{value}</code></div>)}</div></div><div className={`theme-preview theme-${theme}`} style={{"--plot-surface":palette.surface,"--plot-ink":palette.ink,"--plot-muted":palette.muted,"--plot-grid":palette.grid,background:palette.surface,color:palette.ink} as React.CSSProperties}><div className="theme-preview-heading"><div><span>Monthly activity</span><strong>7,200</strong></div><span>DEMO DATA</span></div><div className="theme-chart"><PlotLineChart data={activity} label="Sessions" /></div><div className="theme-preview-footer"><code>Same source. Different tokens.</code><CopyButton value={css} label="Copy theme CSS" /></div></div></section>
}
