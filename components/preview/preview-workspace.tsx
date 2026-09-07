"use client"
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerIcon, SmartPhone01Icon, Tablet01Icon, Maximize01Icon, RefreshIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
export type PreviewTheme = "dark" | "light" | "system"
export interface PreviewContext { width: number; height: number; reducedMotion: boolean; iteration: number }
interface PreviewWorkspaceProps {
  title: string
  children: (context: PreviewContext) => ReactNode
  height?: number
  width?: number
  onWidthChange?: (width: number) => void
  theme?: PreviewTheme
  onThemeChange?: (theme: PreviewTheme) => void
  animate?: boolean
  reducedMotion?: boolean
  palette?: "default" | "mono"
  inspector?: (context: PreviewContext) => ReactNode
  autoHeight?: boolean
}
function PreviewCanvas({ title, children, width, height, reducedMotion, iteration, theme, palette, inspector, autoHeight }: PreviewWorkspaceProps & { width: number; height: number; reducedMotion: boolean; iteration: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(0)
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new ResizeObserver(entries => setMeasuredWidth(Math.floor(entries[0].contentRect.width))); observer.observe(node); return () => observer.disconnect() }, [])
  const context = { width: measuredWidth, height, reducedMotion, iteration }
  const colors = palette === "mono" ? { "--chart-1": "var(--foreground)", "--chart-2": "var(--muted-foreground)", "--chart-3": "#a1a1aa", "--chart-4": "#71717a" } as CSSProperties : undefined
  return <div className="preview-canvas-area"><div className="charts-surface preview-canvas" data-theme={theme} style={{ width, maxWidth: "100%", ...colors }}><div className="preview-ruler"><span>{measuredWidth || "…"} × {autoHeight ? "auto" : height}</span><span>Container width</span></div><div ref={ref} className="preview-render" role="group" aria-label={`${title} live preview`} style={{ minHeight: autoHeight ? 180 : height }}>{measuredWidth > 0 ? children(context) : <span className="lens-preview-loading">Measuring preview...</span>}</div>{inspector && <div className="preview-runtime">{inspector(context)}</div>}</div></div>
}
export function PreviewWorkspace(props: PreviewWorkspaceProps) {
  const [localWidth, setLocalWidth] = useState(1100)
  const [localTheme, setLocalTheme] = useState<PreviewTheme>("dark")
  const [iteration, setIteration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const systemReduced = useReducedMotion()
  const width = props.width ?? localWidth, theme = props.theme ?? localTheme, height = props.height ?? 360
  const reducedMotion = !!systemReduced || !!props.reducedMotion
  const setWidth = props.onWidthChange ?? setLocalWidth, setTheme = props.onThemeChange ?? setLocalTheme
  const canvasProps = { ...props, width, height, theme, reducedMotion, iteration }
  return <div className="preview-workspace"><div className="lens-preview-controls"><div className="lens-devices" role="group" aria-label="Preview container width">{[{width:1100,label:"Desktop",icon:ComputerIcon},{width:768,label:"Tablet",icon:Tablet01Icon},{width:390,label:"Mobile",icon:SmartPhone01Icon}].map(d => <Button key={d.width} variant="ghost" aria-pressed={width === d.width} aria-label={`${d.label} ${d.width}px`} onClick={() => setWidth(d.width)}><HugeiconsIcon icon={d.icon} size={16}/><span>{d.label}</span><small>{d.width}</small></Button>)}</div><div className="lens-preview-utilities"><Select value={theme} onValueChange={value => { if(value) setTheme(value as PreviewTheme) }}><SelectTrigger aria-label="Preview theme" size="sm" className="w-24"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem><SelectItem value="system">System</SelectItem></SelectContent></Select>{props.animate && <Button variant="ghost" aria-label="Replay animation" disabled={reducedMotion} onClick={() => setIteration(n => n + 1)}><HugeiconsIcon icon={RefreshIcon} size={17}/></Button>}<Dialog open={fullscreen} onOpenChange={setFullscreen}><DialogTrigger render={<Button variant="ghost" aria-label="Open fullscreen preview"/>}><HugeiconsIcon icon={Maximize01Icon} size={17}/></DialogTrigger><DialogContent className="charts-surface lens-fullscreen" data-theme={theme}><DialogTitle>{props.title}</DialogTitle><DialogDescription>Expanded preview. Press Escape to return.</DialogDescription><PreviewCanvas {...canvasProps} width={1600}/></DialogContent></Dialog></div></div>{!fullscreen && <PreviewCanvas {...canvasProps}/>}</div>
}
