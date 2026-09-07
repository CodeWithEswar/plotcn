import React from "react"
import { cn } from "@/lib/utils"

export interface RendererBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  renderer: "svg" | "canvas" | "google-runtime" | string
  className?: string
}

/**
 * RendererBadge Standard (Section 66)
 * Subtle technical renderer indicator (SVG, Canvas, Google Runtime).
 */
export function RendererBadge({ renderer, className, ...props }: RendererBadgeProps) {
  const label =
    renderer === "google-runtime"
      ? "GOOGLE RUNTIME"
      : renderer === "canvas"
        ? "CANVAS"
        : "SVG"

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] font-medium tracking-wider uppercase text-muted-foreground/80 bg-muted/40 px-2 py-0.5 rounded border border-border/60",
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}
