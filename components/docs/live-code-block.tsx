"use client"
import { useEffect, useId, useState } from "react"
import { CodeBlockActions } from "./code-block-actions"
let highlighter: Promise<import("shiki/core").HighlighterCore> | undefined
async function highlight(code: string, language: "tsx" | "json") {
  highlighter ??= Promise.all([import("shiki/core"),import("shiki/engine/javascript"),import("shiki/langs/tsx.mjs"),import("shiki/langs/json.mjs"),import("shiki/themes/vesper.mjs")]).then(([core,engine,tsx,json,theme]) => core.createHighlighterCore({themes:[theme.default],langs:[tsx.default,json.default],engine:engine.createJavaScriptRegexEngine()}))
  const rawHtml = await (await highlighter).codeToHtml(code.replace(/\r\n/g, "\n").trim(),{lang:language,theme:"vesper"})
  return rawHtml.replace(/<\/span>\r?\n<span class="line">/g, '</span><span class="line">')
}
export function LiveCodeBlock({code,language="tsx",title="Generated usage"}:{code:string;language?:"tsx"|"json";title?:string}) {
  const id = useId(), [result,setResult] = useState<{code:string;html:string} | null>(null)
  useEffect(() => { let active=true; const timer=setTimeout(() => { highlight(code,language).then(html => {if(active)setResult({code,html})}).catch(()=>{}) },150);return()=>{active=false;clearTimeout(timer)} },[code,language])
  return <div className="live-code-block"><div className="live-code-heading"><span>{title}</span><CodeBlockActions rawCode={code} codeElementId={id}/></div>{result?.code === code ? <div id={id} className="plotcn-code-content" dangerouslySetInnerHTML={{__html:result.html}}/> : <pre id={id} className="plotcn-code-content"><code>{code}</code></pre>}</div>
}
