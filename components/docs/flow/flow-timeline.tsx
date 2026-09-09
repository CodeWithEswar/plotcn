import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import type { FlowTimelineProps } from "./types"
import { FlowDiagram } from "./flow-diagram"

export function FlowTimeline({
  steps,
  activeStep,
  className = "",
  title,
  eyebrow,
  description,
  ariaLabel,
}: FlowTimelineProps) {
  const timelineContent = (
    <ol
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 list-none p-0 m-0 ${className}`}
    >
      {steps.map((step, idx) => {
        const Icon = step.icon
        const isActive = activeStep !== undefined && step.step === activeStep
        const stepNum = typeof step.step === "number" ? String(step.step).padStart(2, "0") : step.step

        return (
          <li
            key={String(step.step) || idx}
            className={`flex flex-col justify-between p-3.5 rounded-xl border transition-colors select-none ${
              isActive
                ? "border-foreground/20 bg-muted shadow-sm"
                : "border-border bg-card hover:border-foreground/20"
            }`}
          >
            <div>
              {/* Header: Step Number + Status */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="font-mono text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted border border-border">
                  {stepNum}
                </span>

                {step.status === "completed" && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Done
                  </span>
                )}
                {step.status === "active" && (
                  <span className="text-[10px] font-mono text-foreground flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-foreground animate-pulse motion-reduce:animate-none" />
                    Active
                  </span>
                )}
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-2 mb-1.5">
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
                <span className="text-xs font-semibold text-foreground tracking-tight leading-snug">
                  {step.title}
                </span>
              </div>

              {/* Description */}
              {step.description && (
                <p className="text-[11px] text-muted-foreground leading-relaxed m-0">
                  {step.description}
                </p>
              )}
            </div>

            {/* Metadata footer */}
            {step.metadata && (
              <div className="mt-3 pt-2 border-t border-border text-[10px] font-mono text-muted-foreground truncate">
                {step.metadata}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )

  if (title || eyebrow || description) {
    return (
      <FlowDiagram
        title={title}
        eyebrow={eyebrow}
        description={description}
        ariaLabel={ariaLabel}
      >
        {timelineContent}
      </FlowDiagram>
    )
  }

  return timelineContent
}
