"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"

export const heroPhrases = ["modern React apps.", "developers who want control.", "dashboards you actually own.", "Recharts and D3.", "data that deserves better."]
type TypeState = { index:number; count:number; phase:"paused"|"deleting"|"waiting"|"typing" }
function subscribeVisibility(callback:()=>void) { document.addEventListener("visibilitychange",callback); return ()=>document.removeEventListener("visibilitychange",callback) }

export function HeroTypewriter() {
  const reduced = useReducedMotion()
  const visible = useSyncExternalStore(subscribeVisibility,()=>document.visibilityState === "visible",()=>true)
  const [paused,setPaused] = useState(false)
  const [state,setState] = useState<TypeState>({index:0,count:heroPhrases[0].length,phase:"paused"})
  useEffect(()=>{
    if(reduced !== false || paused || !visible) return
    const delay = state.phase === "paused" ? 2400 : state.phase === "waiting" ? 320 : state.phase === "deleting" ? 24 : 44
    const timeout = setTimeout(()=>setState(current=>{
      if(current.phase === "paused") return {...current,phase:"deleting"}
      if(current.phase === "deleting") return current.count > 0 ? {...current,count:current.count-1} : {...current,phase:"waiting"}
      if(current.phase === "waiting") return {index:(current.index+1)%heroPhrases.length,count:0,phase:"typing"}
      const count=current.count+1
      return {...current,count,phase:count >= heroPhrases[current.index].length ? "paused":"typing"}
    }),delay)
    return ()=>clearTimeout(timeout)
  },[state,reduced,paused,visible])
  const phrase=reduced ? heroPhrases[0] : heroPhrases[state.index]
  const count=reduced ? phrase.length : state.count
  return <div className="hero-heading-wrap"><h1 id="hero-heading"><span className="sr-only">Beautiful visualizations for modern React apps.</span><span className="hero-static" aria-hidden="true">Beautiful visualizations<br />for</span>
    <span className="typewriter-space" aria-hidden="true">
      {heroPhrases.map(text=><span className="typewriter-reserve" key={text}>{text}</span>)}
      <span className="typewriter-line"><span>{phrase.slice(0,count)}</span><span className={`typewriter-caret ${state.phase === "paused" && !paused ? "is-resting" : ""}`} aria-hidden="true" /><span className="typewriter-remainder">{phrase.slice(count)}</span></span>
    </span>
    </h1>{!reduced && <Button variant="ghost" className="typewriter-toggle" aria-label={paused?"Resume heading animation":"Pause heading animation"} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?"Resume animation":"Pause animation"}</Button>}
  </div>
}
