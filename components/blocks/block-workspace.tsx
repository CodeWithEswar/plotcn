"use client"
import { useState, useEffect, useRef, type ReactNode } from "react"
import { PreviewWorkspace } from "@/components/preview/preview-workspace"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { BlockDemo, type DemoState } from "./block-demo"
export function BlockGalleryPreview({ slug }: { slug: string }) {
  const ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false)
  useEffect(()=>{if(!ref.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect()}},{rootMargin:"120px"});observer.observe(ref.current);return()=>observer.disconnect()},[])
  return <div ref={ref} className="block-gallery-preview">{visible ? <BlockDemo slug={slug}/> : <p className="workbench-empty">Dashboard preview loads as you scroll.</p>}</div>
}
export function BlockWorkspace({slug,title,source,data,usage}:{slug:string;title:string;source:ReactNode;data:ReactNode;usage:ReactNode}) {
  const [state,setState]=useState<DemoState>("ready")
  return <div className="block-workspace"><Tabs defaultValue="preview"><TabsList><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="usage">Usage</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="data">Data</TabsTrigger></TabsList><TabsContent value="preview"><div className="block-demo-state"><span>Sample data · state simulation</span><Select value={state} onValueChange={v=>v&&setState(v as DemoState)}><SelectTrigger aria-label="Dashboard demo state"><SelectValue/></SelectTrigger><SelectContent>{["ready","loading","empty","error","partial"].map(value=><SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><PreviewWorkspace title={title} autoHeight animate inspector={ctx=><><span>Recharts · SVG</span><span>{ctx.width}px container</span><span>Motion {ctx.reducedMotion ? "off" : "on"}</span></>}>{ctx=><BlockDemo key={ctx.iteration} slug={slug} state={state} motion={!ctx.reducedMotion}/>}</PreviewWorkspace></TabsContent><TabsContent value="usage">{usage}</TabsContent><TabsContent value="code">{source}</TabsContent><TabsContent value="data">{data}</TabsContent></Tabs></div>
}
