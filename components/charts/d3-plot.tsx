"use client"

import { useMemo, useState } from "react"
import { arc, pie, scaleBand, scaleLinear, hierarchy, treemap, geoOrthographic, geoGraticule10, geoPath, line, curveBasis } from "d3"

export type D3PlotKind = "donut" | "heatmap" | "treemap" | "network" | "candles" | "geographic" | "scatter" | "stream"
export type D3PlotProps = { kind: D3PlotKind; compact?: boolean; values?: number[] }
const defaults = [42, 28, 18, 12, 24, 38, 16, 31, 22, 46, 35, 27]
const colors = ["#e4e4e7", "#a1a1aa", "#71717a", "#52525b", "#3f3f46"]

/** D3 calculates geometry; React owns the SVG and interactions. */
export function D3Plot({ kind, compact = false, values = defaults }: D3PlotProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const data = useMemo(() => values.filter(Number.isFinite), [values])
  const x = scaleLinear().domain([0, Math.max(data.length - 1, 1)]).range([30, 370])
  const y = scaleLinear().domain([0, Math.max(...data, 1) * 1.5]).range([200, 20])
  const projection = geoOrthographic().scale(100).translate([200, 118]).rotate([-10, -20])
  const geo = geoPath(projection)
  if (!data.length) return <div role="status" style={{ padding:32 }}>No data available.</div>
  let graphic
  if (kind === "donut") {
    const parts = pie<number>().sort(null).value(d => d)(data.slice(0,4))
    const shape = arc<(typeof parts)[number]>().innerRadius(65).outerRadius(92).padAngle(0.035).cornerRadius(2)
    graphic = <g transform="translate(200 115)">{parts.map((part,i) => <path key={i} d={shape(part) || ""} fill={colors[i]} aria-label={`Segment ${i+1}: ${part.value}`} onPointerEnter={() => setSelected(`Segment ${i+1}: ${part.value}`)} />)}<text fill="currentColor" textAnchor="middle" fontSize="29" y="6">{data.slice(0,4).reduce((a,b)=>a+b,0)}</text><text fill="#a1a1aa" textAnchor="middle" fontSize="10" y="26">TOTAL / DEMO</text></g>
  } else if (kind === "heatmap") {
    const band = scaleBand<number>().domain(Array.from({length:16},(_,i)=>i)).range([22,380]).padding(0.18)
    graphic = <g>{Array.from({length:96},(_,i) => { const value = (data[i % data.length] * (i % 5 + 1)) % 100; return <rect key={i} x={band(i%16)} y={28+Math.floor(i/16)*28} width={band.bandwidth()} height={22} rx={3} fill={colors[Math.min(4,Math.floor(value/20))]} aria-label={`Day ${i+1}: ${value} events`} onPointerEnter={() => setSelected(`Day ${i+1}: ${value} events`)} /> })}<text x="22" y="222" fill="#a1a1aa" fontSize="10">16 WEEKS OF ACTIVITY</text></g>
  } else if (kind === "treemap") {
    const root = hierarchy<{name:string;value?:number;children?:{name:string;value:number}[]}>({name:"Usage",children:data.slice(0,6).map((value,i)=>({name:["Compute","Storage","Network","API","Builds","Other"][i],value}))}).sum(d=>d.value || 0)
    const nodes = treemap<{name:string;value?:number}>().size([360,190]).padding(4).round(true)(root).leaves()
    graphic = <g transform="translate(20 20)">{nodes.map((node,i) => <g key={i}><rect x={node.x0} y={node.y0} width={node.x1-node.x0} height={node.y1-node.y0} fill={colors[i%5]} rx={3} aria-label={`${node.data.name}: ${node.value}`} /><text x={node.x0+9} y={node.y0+19} fill={i%5<2?"#09090b":"#fafafa"} fontSize="10">{node.data.name}</text></g>)}</g>
  } else if (kind === "network") {
    const points = data.map((value,i)=>({x:200+Math.cos(i*2.399)*Math.sqrt(i+1)*43,y:115+Math.sin(i*2.399)*Math.sqrt(i+1)*26,r:4+value/8}))
    graphic = <g>{points.map((point,i)=><path key={`l${i}`} d={`M200 115Q${point.x} 115 ${point.x} ${point.y}`} stroke="#52525b" fill="none" />)}{points.map((point,i)=><circle key={i} cx={point.x} cy={point.y} r={point.r} fill={colors[i%5]} stroke="#09090b" strokeWidth="2" aria-label={`Node ${i+1}: ${data[i]} connections`} onPointerEnter={()=>setSelected(`Node ${i+1}: ${data[i]} connections`)} />)}<circle cx="200" cy="115" r="16" fill="#fafafa" /></g>
  } else if (kind === "candles") {
    graphic = <g>{data.map((value,i)=>{const open=value+8;const close=value+(i%2?19:2);return <g key={i}><path d={`M${x(i)} ${y(value+25)}V${y(value-5)}`} stroke="#a1a1aa" /><rect x={x(i)-8} y={y(Math.max(open,close))} width="16" height={Math.max(3,Math.abs(y(open)-y(close)))} fill={close>open?"#d4d4d8":"#27272a"} stroke="#a1a1aa" aria-label={`Session ${i+1}, open ${open}, close ${close}`} /></g>})}</g>
  } else if (kind === "geographic") {
    const cities:[string,number,number][]=[["London",0,51],["Nairobi",36,-1],["Delhi",77,28],["Cape Town",18,-34],["Paris",2,48],["Dubai",55,25]]
    graphic = <g><path d={geo({type:"Sphere"}) || ""} fill="#111113" stroke="#52525b" /><path d={geo(geoGraticule10()) || ""} fill="none" stroke="#3f3f46" strokeWidth=".6" />{cities.map(([name,lon,lat])=>{const point=projection([lon,lat]);return point && <g key={name}><circle cx={point[0]} cy={point[1]} r="4" fill="#e4e4e7" aria-label={`${name}: sample location`} /><text x={point[0]+7} y={point[1]} fontSize="9" fill="#d4d4d8">{name}</text></g>})}</g>
  } else if (kind === "stream") {
    const shape=line<[number,number]>().curve(curveBasis)
    graphic=<g>{[0,1,2,3,4].map(index=><path key={index} d={shape(data.map((value,i)=>[x(i),80+index*24-Math.sin(i)*value])) || ""} stroke={colors[index]} strokeWidth="18" fill="none" opacity=".8" />)}</g>
  } else {
    graphic=<g>{Array.from({length:40},(_,i)=><circle key={i} cx={30+(i*79)%340} cy={30+(data[i%data.length]*13+i*7)%170} r={3+i%4} fill={colors[i%5]} opacity=".8" aria-label={`Observation ${i+1}`} />)}</g>
  }
  return <div className="d3-plot" style={{position:"relative",width:"100%",height:"100%"}}><svg viewBox="0 0 400 240" width="100%" height="100%" role="img" aria-label={`${kind} visualization using sample data`} onPointerLeave={()=>setSelected(null)}>{!["donut","geographic","heatmap","treemap"].includes(kind) && <g stroke="#27272a" strokeDasharray="2 5">{[40,80,120,160,200].map(yy=><path key={yy} d={`M20 ${yy}H380`} />)}</g>}{graphic}</svg>{selected && !compact && <div className="d3-tooltip" role="status">{selected}</div>}</div>
}
