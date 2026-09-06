"use client"
import { useSyncExternalStore } from "react"
import { site } from "@/lib/site"
import { CopyButton } from "./copy-button"
import { Icon } from "./icons"
const subscribe = () => () => {}
export function InstallCommand({ name = "line", compact = false }: { name?: string; compact?: boolean }) {
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => site.url)
  const command = `npx shadcn@latest add ${origin}/r/${name}.json`
  return <div className={`install-command ${compact ? "compact" : ""}`}><Icon name="terminal" /><code title={command}>{compact ? `npx shadcn@latest add …/r/${name}.json` : command}</code><CopyButton value={command} /></div>
}
