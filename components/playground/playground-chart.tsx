"use client"
import { memo } from "react"
import dynamic from "next/dynamic"
import type { PlaygroundId, PlaygroundSettings, PlaygroundRow } from "@/lib/playground/model"
const Line = dynamic(()=>import("@/registry/recharts/line-basic").then(m=>m.LineBasic),{ssr:false})
const Bar = dynamic(()=>import("@/registry/recharts/bar-basic").then(m=>m.BarBasic),{ssr:false})
const Donut = dynamic(()=>import("@/registry/recharts/donut-basic").then(m=>m.DonutBasic),{ssr:false})
const D3Line = dynamic(()=>import("@/registry/d3/d3-animated-line").then(m=>m.D3AnimatedLine),{ssr:false})
export const PlaygroundChart = memo(function PlaygroundChart({id,settings,data,width,reducedMotion}:{id:PlaygroundId;settings:PlaygroundSettings;data:PlaygroundRow[];width:number;reducedMotion:boolean}) {
  if(!data.length)return <div className="workbench-empty" role="status">No data rows. Add a row or reset the sample data.</div>
  const motion = settings.motion && !reducedMotion ? {duration:settings.duration} : false
  const categorical = data as {label:string;value:number}[]
  if(id === "line-basic")return <Line data={categorical} height={settings.height} curve={settings.curve} showXAxis={settings.showXAxis} showYAxis={settings.showYAxis} grid={settings.grid} tooltip={settings.tooltip} legend={settings.legend} motion={motion}/>
  if(id === "bar-basic")return <Bar data={categorical} height={settings.height} showXAxis={settings.showXAxis} showYAxis={settings.showYAxis} grid={settings.grid} tooltip={settings.tooltip} legend={settings.legend} motion={motion}/>
  if(id === "donut-basic")return <Donut data={categorical} height={settings.height} innerRadius={settings.innerRadius} tooltip={settings.tooltip} legend={settings.legend} motion={motion}/>
  return <D3Line data={data as {x:string|number;y:number}[]} width={width} height={settings.height} curve={settings.curve} grid={settings.grid === "off" ? "off" : "horizontal"} motion={motion}/>
})
