import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { FlowNodeProps } from "./types"

const variantStyles: Record<string, { card: string; iconWrapper: string; iconColor: string }> = {
  primary: {
    card: "border-white/[0.16] bg-zinc-900/90 shadow-lg",
    iconWrapper: "bg-white/[0.1] border-white/[0.15] text-white",
    iconColor: "text-white",
  },
  secondary: {
    card: "border-white/[0.08] bg-zinc-900/50 hover:border-white/[0.14]",
    iconWrapper: "bg-white/[0.05] border-white/[0.08] text-zinc-300",
    iconColor: "text-zinc-300",
  },
  file: {
    card: "border-zinc-800 bg-zinc-950/90 hover:border-zinc-700",
    iconWrapper: "bg-zinc-900 border-zinc-800 text-zinc-300",
    iconColor: "text-zinc-300",
  },
  folder: {
    card: "border-zinc-800 bg-zinc-950/90 hover:border-zinc-700",
    iconWrapper: "bg-zinc-900 border-zinc-800 text-zinc-400",
    iconColor: "text-zinc-400",
  },
  command: {
    card: "border-zinc-800 bg-zinc-950/95 font-mono",
    iconWrapper: "bg-zinc-900 border-zinc-800 text-zinc-200",
    iconColor: "text-zinc-300",
  },
  registry: {
    card: "border-zinc-800 bg-zinc-900/70 hover:border-white/[0.14]",
    iconWrapper: "bg-zinc-800/80 border-zinc-700 text-zinc-200",
    iconColor: "text-zinc-200",
  },
  package: {
    card: "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700",
    iconWrapper: "bg-zinc-900 border-zinc-800 text-zinc-400",
    iconColor: "text-zinc-400",
  },
  runtime: {
    card: "border-white/[0.1] bg-zinc-900/60",
    iconWrapper: "bg-white/[0.06] border-white/[0.1] text-zinc-200",
    iconColor: "text-zinc-200",
  },
  data: {
    card: "border-zinc-800 bg-zinc-950/80",
    iconWrapper: "bg-zinc-900 border-zinc-800 text-zinc-300",
    iconColor: "text-zinc-300",
  },
  theme: {
    card: "border-white/[0.1] bg-zinc-950/80",
    iconWrapper: "bg-white/[0.06] border-white/[0.1] text-zinc-200",
    iconColor: "text-zinc-200",
  },
  accessibility: {
    card: "border-white/[0.1] bg-zinc-950/80",
    iconWrapper: "bg-white/[0.06] border-white/[0.1] text-zinc-200",
    iconColor: "text-zinc-200",
  },
  output: {
    card: "border-emerald-500/20 bg-emerald-950/10 hover:border-emerald-500/30",
    iconWrapper: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    iconColor: "text-emerald-400",
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
    default: "bg-zinc-800/80 text-zinc-400 border-zinc-700/50",
    outline: "bg-transparent text-zinc-400 border-zinc-800",
    accent: "bg-white/[0.08] text-zinc-200 border-white/[0.12]",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40",
    warning: "bg-amber-950/40 text-amber-400 border-amber-800/40",
  }[badgeVariant]

  const statusIndicators = {
    default: null,
    active: (
      <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-300">
        <span className="size-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" />
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
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold truncate">
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
            <div className="text-xs sm:text-sm font-semibold tracking-tight text-white leading-snug break-words [overflow-wrap:anywhere]">
              {title}
            </div>

            {description && (
              <div className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed mt-1 break-words [overflow-wrap:anywhere]">
                {description}
              </div>
            )}
          </div>
        </div>

        {children && <div className="mt-3">{children}</div>}
      </div>

      {/* Metadata footer */}
      {metadata && (
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500 break-words [overflow-wrap:anywhere]">
          {metadata}
        </div>
      )}
    </Component>
  )
}
