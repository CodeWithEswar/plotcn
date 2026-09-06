"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Icon } from "./icons"
export function CopyButton({ value, label = "Copy command" }: { value: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle")
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  async function copy() {
    if (timeout.current) clearTimeout(timeout.current)
    try { await navigator.clipboard.writeText(value); setStatus("copied") } catch { setStatus("error") }
    timeout.current = setTimeout(() => setStatus("idle"), 2600)
  }
  return <span className="copy-action"><Tooltip><TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={label} onClick={copy} />}><Icon name={status === "copied" ? "check" : "copy"} /></TooltipTrigger><TooltipContent>{status === "copied" ? "Copied" : label}</TooltipContent></Tooltip><span role="status" className={status === "error" ? "copy-error" : "sr-only"}>{status === "copied" ? "Copied to clipboard" : status === "error" ? "Copy failed. Select and copy the text." : ""}</span></span>
}
