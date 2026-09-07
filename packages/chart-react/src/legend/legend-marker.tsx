import React from "react"
import type { LegendMarker } from "../types/interaction"

export interface LegendMarkerProps {
  marker?: LegendMarker
  color?: string
  className?: string
  size?: number
}

/**
 * LegendMarker renders non-color and color-coded visual markers for series identity.
 * Supports dot (circle), square, and line (solid, dashed, dotted) strokes.
 * Section 8.25, 8.26, 8.44.
 */
export function LegendMarkerIcon({
  marker,
  color = "currentColor",
  className = "",
  size = 12,
}: LegendMarkerProps) {
  const shape = marker?.shape ?? "dot"
  const lineStyle = marker?.lineStyle ?? "solid"
  const resolvedColor = marker?.color ?? color

  if (shape === "line") {
    let dashArray: string | undefined
    if (lineStyle === "dashed") dashArray = "4 2"
    if (lineStyle === "dotted") dashArray = "2 2"

    return (
      <svg
        width={size * 1.5}
        height={size}
        viewBox="0 0 18 12"
        className={`inline-block flex-shrink-0 ${className}`}
        aria-hidden="true"
      >
        <line
          x1={1}
          y1={6}
          x2={17}
          y2={6}
          stroke={resolvedColor}
          strokeWidth={2.5}
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (shape === "square") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        className={`inline-block flex-shrink-0 ${className}`}
        aria-hidden="true"
      >
        <rect
          x={1.5}
          y={1.5}
          width={9}
          height={9}
          rx={1.5}
          fill={resolvedColor}
        />
      </svg>
    )
  }

  // Default "dot" (circle)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx={6} cy={6} r={4.5} fill={resolvedColor} />
    </svg>
  )
}
