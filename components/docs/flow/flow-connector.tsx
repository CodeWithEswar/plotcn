import React from "react"
import type { FlowConnectorProps } from "./types"

export function FlowConnector({
  direction = "down",
  styleVariant = "solid",
  label,
  animated = false,
  className = "",
}: FlowConnectorProps) {
  const isDashed = styleVariant === "dashed"

  if (direction === "responsive") {
    return (
      <div
        className={`flex items-center justify-center select-none ${className}`}
        aria-hidden="true"
      >
        {/* Desktop Horizontal Connector */}
        <div className="hidden md:flex items-center justify-center relative w-full px-2 py-1">
          <div
            className={`w-full h-px ${
              isDashed ? "border-t border-dashed border-border" : "bg-border"
            }`}
          />
          {label && (
            <span className="absolute bg-card px-2 py-0.5 rounded border border-border text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {label}
            </span>
          )}
          <svg
            className="w-2.5 h-2.5 text-muted-foreground -ml-1 shrink-0"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <polygon points="0,1 8,5 0,9" />
          </svg>
          {animated && (
            <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground/70 animate-ping motion-reduce:hidden" />
          )}
        </div>

        {/* Mobile Vertical Connector */}
        <div className="flex md:hidden flex-col items-center justify-center py-2 relative my-1">
          <div
            className={`h-6 w-px ${
              isDashed ? "border-l border-dashed border-border" : "bg-border"
            }`}
          />
          {label && (
            <span className="my-1 bg-card px-2 py-0.5 rounded border border-border text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {label}
            </span>
          )}
          <svg
            className="w-2.5 h-2.5 text-muted-foreground -mt-0.5 shrink-0"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <polygon points="1,0 5,8 9,0" />
          </svg>
        </div>
      </div>
    )
  }

  if (direction === "right") {
    return (
      <div
        className={`hidden sm:flex items-center justify-center relative px-2 py-1 select-none min-w-[28px] ${className}`}
        aria-hidden="true"
      >
        <div
          className={`w-full h-px ${
            isDashed ? "border-t border-dashed border-border" : "bg-border"
          }`}
        />
        {label && (
          <span className="absolute bg-card px-1.5 py-0.5 rounded border border-border text-[9px] font-mono text-muted-foreground whitespace-nowrap">
            {label}
          </span>
        )}
        <svg
          className="w-2.5 h-2.5 text-muted-foreground -ml-1 shrink-0"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <polygon points="0,1 8,5 0,9" />
        </svg>
      </div>
    )
  }

  // Direction: "down"
  return (
    <div
      className={`flex flex-col items-center justify-center py-2 relative select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`h-5 sm:h-6 w-px ${
          isDashed ? "border-l border-dashed border-border" : "bg-border"
        }`}
      />
      {label && (
        <span className="my-1 bg-card px-2 py-0.5 rounded border border-border text-[10px] font-mono text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
      <svg
        className="w-2.5 h-2.5 text-muted-foreground -mt-0.5 shrink-0"
        viewBox="0 0 10 10"
        fill="currentColor"
      >
        <polygon points="1,0 5,8 9,0" />
      </svg>
      {animated && (
        <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-foreground/70 animate-pulse motion-reduce:hidden" />
      )}
    </div>
  )
}
