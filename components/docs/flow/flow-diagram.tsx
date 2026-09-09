import React from "react"
import type { FlowDiagramProps } from "./types"

export function FlowDiagram({
  title,
  eyebrow,
  description,
  className = "",
  children,
  ariaLabel,
}: FlowDiagramProps) {
  return (
    <figure
      role="region"
      aria-label={ariaLabel || title || "Technical Flow Diagram"}
      className={`plotcn-flow-diagram my-8 w-full rounded-xl border border-border bg-card p-4 sm:p-6 lg:p-7 relative overflow-hidden not-prose shadow-sm @container ${className}`}
    >
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--diagram-border) 1px, transparent 1px), linear-gradient(90deg, var(--diagram-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Header if title or eyebrow provided */}
      {(title || eyebrow) && (
        <div className="relative z-10 mb-5 border-b border-border pb-3 select-none">
          {eyebrow && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold block mb-1">
              {eyebrow}
            </span>
          )}
          {title && (
            <h4 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Main flow content */}
      <div className="relative z-10">{children}</div>
    </figure>
  )
}
