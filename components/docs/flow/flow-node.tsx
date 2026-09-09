import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { FlowNodeProps } from "./types"

const variantStyles: Record<string, { card: string; iconWrapper: string; iconColor: string }> = {
  primary: {
    card: "border-foreground/20 bg-muted shadow-sm",
    iconWrapper: "bg-accent border-border text-foreground",
    iconColor: "text-foreground",
  },
  secondary: {
    card: "border-border bg-card hover:border-foreground/20",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  file: {
    card: "border-border bg-card hover:border-foreground/20",
    iconWrapper: "bg-muted border-border text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  folder: {
    card: "border-border bg-card hover:border-foreground/20",
    iconWrapper: "bg-muted border-border text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  command: {
    card: "border-border bg-card font-mono",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  registry: {
    card: "border-border bg-muted hover:border-foreground/20",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  package: {
    card: "border-border bg-card hover:border-foreground/20",
    iconWrapper: "bg-muted border-border text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  runtime: {
    card: "border-border bg-muted",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  data: {
    card: "border-border bg-card",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  theme: {
    card: "border-border bg-card",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  accessibility: {
    card: "border-border bg-card",
    iconWrapper: "bg-muted border-border text-foreground",
    iconColor: "text-foreground",
  },
  output: {
    card: "border-foreground/20 bg-muted hover:border-foreground/30",
    iconWrapper: "bg-accent border-border text-foreground",
    iconColor: "text-foreground",
  },
}

export function FlowNode({
  icon: Icon,
  eyebrow,
  title,
  description,
  metadata,
  badge,
  badgeVariant = "default",
  status = "default",
  variant = "secondary",
  className = "",
  as: Component = "div",
  children,
}: FlowNodeProps) {
  const styles = variantStyles[variant] || variantStyles.secondary

  const badgeClasses = {
    default: "bg-muted text-muted-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
    accent: "bg-accent text-accent-foreground border-border",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40",
    warning: "bg-amber-950/40 text-amber-400 border-amber-800/40",
  }[badgeVariant]

  const statusIndicators = {
    default: null,
    active: (
      <span className="flex items-center gap-1 text-[10px] font-mono text-foreground">
        <span className="size-1.5 rounded-full bg-foreground animate-pulse motion-reduce:animate-none" />
        Active
      </span>
    ),
    completed: (
      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-400" />
        Ready
      </span>
    ),
    warning: (
      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-400" />
        Review
      </span>
    ),
  }[status]

  return (
    <Component
      className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-xl border transition-colors select-none ${styles.card} ${className}`}
    >
      <div>
        {/* Header: Eyebrow + Badge / Status */}
        {(eyebrow || badge || statusIndicators) && (
          <div className="flex items-center justify-between gap-2 mb-2">
            {eyebrow && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold truncate">
                {eyebrow}
              </span>
            )}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              {statusIndicators}
              {badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeClasses}`}
                >
                  {badge}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Node Body: Icon + Title */}
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div
              className={`size-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100 ${styles.iconWrapper}`}
            >
              {React.isValidElement(Icon) ? (
                Icon
              ) : typeof Icon === "function" ? (
                React.createElement(Icon, { size: 18, className: styles.iconColor })
              ) : (
                <HugeiconsIcon icon={Icon} size={18} strokeWidth={1.8} className={styles.iconColor} />
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-semibold tracking-tight text-foreground leading-snug break-words [overflow-wrap:anywhere]">
              {title}
            </div>

            {description && (
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mt-1 break-words [overflow-wrap:anywhere]">
                {description}
              </div>
            )}
          </div>
        </div>

        {children && <div className="mt-3">{children}</div>}
      </div>

      {/* Metadata footer */}
      {metadata && (
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground break-words [overflow-wrap:anywhere]">
          {metadata}
        </div>
      )}
    </Component>
  )
}
