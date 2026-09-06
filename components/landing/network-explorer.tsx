"use client"

import { useMemo, useState } from "react"
import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceLink, randomLcg, type SimulationNodeDatum } from "d3"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "./icons"

type Node = SimulationNodeDatum & { id:string; group:number; size:number }
const names=["React","Recharts","D3","Scales","Shapes","Motion","SVG","Axes","Tooltip","Legend","Area","Line","Bar","Pie","Hierarchy","Network","TypeScript","Registry","Tokens","Your app","Interaction","Data","Layout","Accessibility"]
const connections=names.slice(1).map((_,i)=>({source:i<3?0:i%3===0?2:i%3===1?1:0,target:i+1}))
const r = (val: number) => Math.round(val * 10) / 10

export default function NetworkExplorer() {
  const [active,setActive]=useState(0)
  const [group,setGroup]=useState("all")
  const [layout,setLayout]=useState("organic")
  const nodes=useMemo(()=>{
    const points:Node[]=names.map((id,i)=>({id,group:i%3,size:i<3?20:6+i%5,x:r(380+Math.cos(i*2.4)*120),y:r(190+Math.sin(i*2.4)*100)}))
    if(layout==="radial") return points.map((p,i)=>({...p,x:r(i===0?380:380+Math.cos(i/(names.length-1)*Math.PI*2)*270),y:r(i===0?210:210+Math.sin(i/(names.length-1)*Math.PI*2)*145)}))
    const simulation=forceSimulation(points).randomSource(randomLcg(.42)).force("charge",forceManyBody().strength(-380)).force("center",forceCenter(380,200)).force("collision",forceCollide<Node>().radius(d=>d.size+18)).force("link",forceLink<Node, {source:number;target:number}>(connections.map(link=>({...link}))).distance(95).strength(.35)).stop()
    simulation.tick(180)
    return points.map(p=>({...p,x:r(Math.max(35,Math.min(725,p.x||380))),y:r(Math.max(35,Math.min(375,p.y||200)))}))
  },[layout])
  const connected=connections.filter(link=>link.source===active||link.target===active).map(link=>link.source===active?link.target:link.source)
  return <div className="network-explorer"><div className="network-toolbar"><div><span className="status-dot" />ECOSYSTEM EXPLORER <span className="demo-label">/ DEMO DATA</span></div><Tabs value={layout} onValueChange={value=>setLayout(String(value))}><TabsList aria-label="Network layout"><TabsTrigger value="organic">Organic</TabsTrigger><TabsTrigger value="radial">Radial</TabsTrigger></TabsList></Tabs><Button variant="ghost" size="icon" aria-label="Reset network" onClick={()=>{setActive(0);setGroup("all");setLayout("organic")}}><Icon name="refresh" /></Button></div>
    <div className="network-body"><div className="network-canvas"><svg viewBox="0 0 760 420" role="group" aria-label="Interactive sample ecosystem network. Select a node to inspect its connections.">
      <defs><radialGradient id="network-light"><stop stopColor="#a1a1aa" stopOpacity=".09" /><stop offset="1" stopColor="#a1a1aa" stopOpacity="0" /></radialGradient></defs><ellipse cx="380" cy="210" rx="340" ry="205" fill="url(#network-light)" />
      {connections.map((link,i)=>{const from=nodes[link.source];const to=nodes[link.target];const lit=link.source===active||link.target===active;const midX=r((from.x!+to.x!)/2);return <path key={i} d={`M${from.x} ${from.y}Q${midX} ${from.y} ${to.x} ${to.y}`} fill="none" stroke={lit?"#a1a1aa":"#3f3f46"} strokeWidth={lit?1.3:.8} opacity={group==="all"||from.group.toString()===group?.toString()?1:.25} />})}
      {nodes.map((node,i)=>{const visible=group==="all"||node.group.toString()===group;return <g key={node.id} role="button" tabIndex={visible?0:-1} aria-label={`${node.id}, ${connections.filter(l=>l.source===i||l.target===i).length} connections`} aria-pressed={active===i} onClick={()=>setActive(i)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setActive(i)}}} className="network-node" opacity={visible?1:.18} style={{cursor:visible?"pointer":"default",pointerEvents:visible?"auto":"none"}}><circle cx={node.x} cy={node.y} r={Math.max(22,node.size+7)} fill="transparent" /><circle cx={node.x} cy={node.y} r={node.size+7} fill="none" stroke={active===i?"#d4d4d8":"transparent"} strokeWidth="1" /><circle cx={node.x} cy={node.y} r={node.size} fill={i<3?"#e4e4e7":node.group===0?"#a1a1aa":node.group===1?"#71717a":"#3f3f46"} stroke="#111113" strokeWidth="2" /><text x={node.x} y={r(node.y!+node.size+20)} textAnchor="middle" fill={active===i?"#fafafa":"#a1a1aa"} fontSize="10">{node.id}</text></g>})}
    </svg><div className="network-hint"><Icon name="search" />Select a node. Follow a connection.</div></div>
    <aside className="network-inspector"><span className="eyebrow">SELECTED NODE</span><h3>{names[active]}</h3><p>A sample relationship in the visualization ecosystem.</p><div className="network-stats"><strong>{connected.length.toString().padStart(2,"0")}</strong><span>connections</span></div><span className="eyebrow">CONNECTED TO</span><div className="connection-list" aria-live="polite">{connected.map(i=><Button key={i} variant="ghost" onClick={()=>{setGroup("all");setActive(i)}}>{names[i]}<Icon name="arrow" /></Button>)}</div></aside></div>
    <div className="network-footer"><span>D3 FORCE LAYOUT · {names.length} NODES · {connections.length} EDGES</span><div>{["all","0","1","2"].map((value,i)=><Button key={value} variant="ghost" aria-pressed={group===value} onClick={()=>{setGroup(value);if(value!=="all")setActive(Number(value))}}>{["All nodes","Core","Components","Tools"][i]}</Button>)}</div></div>
  </div>
}
