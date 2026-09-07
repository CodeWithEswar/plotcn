"use client"

import { plotcnRegistry } from "@/config/registry"
import { CopyButton } from "./copy-button"
import { Icon } from "./icons"

export function InstallCommand({
  name = "line-basic",
  compact = false,
}: {
  name?: string
  compact?: boolean
}) {
  const origin = plotcnRegistry.origin
  const cleanName = name.replace(/\.json$/, "")
  const command = `npx shadcn@latest add ${origin}/r/${cleanName}.json`

  return (
    <div className={`install-command ${compact ? "compact" : ""}`}>
      <Icon name="terminal" />
      <code title={command}>
        {command}
      </code>
      <CopyButton value={command} />
    </div>
  )
}
