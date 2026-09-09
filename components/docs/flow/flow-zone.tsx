import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { FlowZoneProps } from "./types"

export function FlowZone({
  title,
  eyebrow,
  icon: Icon,
  badge,
  className = "",
  children,
}: FlowZoneProps) {
  return (
    <div
      className={`relative rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between ${className}`}
    >
      {/* Zone Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4 select-none">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <span className="text-muted-foreground shrink-0">
              {React.isValidElement(Icon) ? (
                Icon
              ) : typeof Icon === "function" ? (
                React.createElement(Icon, { size: 15, strokeWidth: 1.8 })
              ) : (
                <HugeiconsIcon icon={Icon} size={15} strokeWidth={1.8} />
              )}
            </span>
          )}
          <div>
            {eyebrow && (
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground block leading-none mb-0.5">
                {eyebrow}
              </span>
            )}
            <span className="text-xs font-semibold tracking-tight text-foreground">{title}</span>
          </div>
        </div>

        {badge && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
            {badge}
          </span>
        )}
      </div>

      {/* Zone Content */}
      <div className="space-y-3">{children}</div>
    </div>
  )
}
