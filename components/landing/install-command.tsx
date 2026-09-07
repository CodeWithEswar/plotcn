"use client"

import { plotcnRegistry } from "@/config/registry"
import { CopyButton } from "./copy-button"
import { Icon } from "./icons"

export function InstallCommand({
  name = "line",
  compact = false,
}: {
  name?: string
  compact?: boolean
}) {
  const origin = plotcnRegistry.origin
  const command = `npx shadcn@latest add ${origin}/r/${name}.json`

  return (
    <div className={`install-command ${compact ? "compact" : ""}`}>
      <Icon name="terminal" />
      <code title={command}>
        {compact ? `npx shadcn@latest add …/r/${name}.json` : command}
      </code>
      <CopyButton value={command} />
    </div>
  )
}
