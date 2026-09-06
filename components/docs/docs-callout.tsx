import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  InformationCircleIcon,
  Alert02Icon,
  AlertCircleIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons"

export type CalloutType = "note" | "tip" | "warning" | "important"

interface DocsCalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const calloutConfig = {
  note: {
    icon: InformationCircleIcon,
    label: "Note",
    border: "border-zinc-800 bg-zinc-950/70 text-zinc-300",
    iconColor: "text-zinc-400",
    badgeColor: "bg-zinc-800 text-zinc-300",
  },
  tip: {
    icon: HelpCircleIcon,
    label: "Tip",
    border: "border-zinc-800/80 bg-zinc-900/50 text-zinc-300",
    iconColor: "text-zinc-300",
    badgeColor: "bg-zinc-800 text-zinc-200",
  },
  warning: {
    icon: Alert02Icon,
    label: "Warning",
    border: "border-amber-500/20 bg-amber-950/10 text-amber-200/90",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-900/30 text-amber-300 border border-amber-500/30",
  },
  important: {
    icon: AlertCircleIcon,
    label: "Important",
    border: "border-zinc-700 bg-zinc-900/80 text-zinc-200",
    iconColor: "text-white",
    badgeColor: "bg-zinc-800 text-white border border-zinc-600",
  },
}

export function DocsCallout({
  type = "note",
  title,
  children,
}: DocsCalloutProps) {
  const config = calloutConfig[type] || calloutConfig.note
  const Icon = config.icon

  return (
    <aside
      className={`my-6 flex gap-3.5 rounded-xl border p-4 text-sm leading-relaxed ${config.border}`}
      role="note"
      aria-label={title || config.label}
    >
      <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
        <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        {title && (
          <p className="font-medium text-zinc-100 flex items-center gap-2">
            <span>{title}</span>
          </p>
        )}
        <div className="text-zinc-300 text-sm leading-relaxed [&>p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  )
}
