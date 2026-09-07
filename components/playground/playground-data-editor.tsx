"use client"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Delete02Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Tabs,TabsList,TabsTrigger,TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { dataKeys, type PlaygroundId, type PlaygroundRow } from "@/lib/playground/model"
export function PlaygroundDataEditor({id,draft,onDraftChange,onReset,error}:{id:PlaygroundId;draft:string;onDraftChange:(draft:string)=>void;onReset:()=>void;error?:string}) {
  const [mode,setMode]=useState("table")
  const keys=dataKeys(id)
  let rows: PlaygroundRow[] | null=null
  try { const value=JSON.parse(draft); if(Array.isArray(value)&&value.every(r=>r&&typeof r==="object"&&!Array.isArray(r)))rows=value } catch {}
  function changeCell(index:number,key:string,value:string){if(!rows)return;const next=rows.map((row,i)=>i===index?{...row,[key]:key===keys[1]&&value.trim()!==""&&Number.isFinite(Number(value))?Number(value):value}:row);onDraftChange(JSON.stringify(next,null,2))}
  return <section className="workbench-data"><div className="workbench-panel-heading"><div><span className="lens-eyebrow">DATA INPUT</span><h2>Edit the sample.</h2></div><Button variant="outline" onClick={onReset}><HugeiconsIcon icon={RefreshIcon} size={15}/>Reset data</Button></div><Tabs value={mode} onValueChange={v=>setMode(String(v))}><TabsList aria-label="Data editor mode"><TabsTrigger value="table">Table</TabsTrigger><TabsTrigger value="json">JSON</TabsTrigger></TabsList><TabsContent value="table">{rows ? <><div className="workbench-table-scroll"><table><caption className="sr-only">Editable chart sample data</caption><thead><tr>{keys.map(key=><th key={key}>{key}</th>)}<th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{keys.map(key=><td key={key}><Input aria-label={`Row ${i+1} ${key}`} inputMode={key===keys[1]?"decimal":"text"} value={String(row[key]??"")} onChange={e=>changeCell(i,key,e.target.value)}/></td>)}<td><Button variant="ghost" size="icon" aria-label={`Delete row ${i+1}`} onClick={()=>onDraftChange(JSON.stringify(rows!.filter((_,j)=>j!==i),null,2))}><HugeiconsIcon icon={Delete02Icon} size={16}/></Button></td></tr>)}</tbody></table></div><Button variant="outline" disabled={rows.length>=200} onClick={()=>onDraftChange(JSON.stringify([...rows!,{[keys[0]]:id==="d3-animated-line"?rows!.length:"New",[keys[1]]:0}],null,2))}><HugeiconsIcon icon={PlusSignIcon} size={15}/>Add row</Button></> : <p role="status">Fix the JSON syntax to use the table editor.</p>}</TabsContent><TabsContent value="json"><label className="sr-only" htmlFor="playground-json">Chart data JSON</label><Textarea id="playground-json" spellCheck={false} value={draft} onChange={e=>onDraftChange(e.target.value)} aria-invalid={!!error} aria-describedby={error?"data-error":undefined}/></TabsContent></Tabs>{error&&<p className="workbench-diagnostic" id="data-error" role="alert">{error} The preview uses the last valid data.</p>}</section>
}
