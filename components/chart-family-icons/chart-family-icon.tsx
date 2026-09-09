import React from "react"
import type { ChartCategory } from "@/lib/charts/metadata"

export type ChartFamilyGlyph =
  | ChartCategory
  | "column"
  | "columns"
  | "bar-column"
  | "pie-donut"

export interface ChartFamilyIconProps extends React.SVGProps<SVGSVGElement> {
  family: ChartFamilyGlyph | string
  className?: string
}

export function ChartFamilyIcon({
  family,
  className = "size-4",
  ...props
}: ChartFamilyIconProps) {
  const normalized = family.toLowerCase().trim()

  switch (normalized) {
    case "line":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <path
            d="M3 13.5L7.5 8.5L11.5 11.5L17 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "area":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <path
            d="M3 14.5L7.5 8.5L11.5 11.5L17 5V15H3V14.5Z"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <path
            d="M3 14.5L7.5 8.5L11.5 11.5L17 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2.5 15H17.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      )

    case "bar":
    case "bar & column":
    case "bars":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <rect x="3" y="10.5" width="3" height="5.5" rx="0.75" fill="currentColor" />
          <rect x="8.5" y="6.5" width="3" height="9.5" rx="0.75" fill="currentColor" />
          <rect x="14" y="3" width="3" height="13" rx="0.75" fill="currentColor" />
        </svg>
      )

    case "column":
    case "columns":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <rect x="3" y="9" width="2.6" height="7" rx="0.7" fill="currentColor" />
          <rect x="6.4" y="5.5" width="2.6" height="10.5" rx="0.7" fill="currentColor" />
          <rect x="11" y="7.5" width="2.6" height="8.5" rx="0.7" fill="currentColor" />
          <rect x="14.4" y="3.5" width="2.6" height="12.5" rx="0.7" fill="currentColor" />
        </svg>
      )

    case "pie":
    case "donut":
    case "pie & donut":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <path
            d="M10 3A7 7 0 1 1 3 10L10 10V3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 2.5A7.5 7.5 0 0 1 17.5 9.5L10.5 9.5V2.5Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "geo":
    case "geographic":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="10" cy="10" rx="3.5" ry="7" stroke="currentColor" strokeWidth="1.2" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )

    case "network":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <line x1="5" y1="7" x2="15" y2="5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="5" y1="7" x2="9" y2="14" stroke="currentColor" strokeWidth="1.3" />
          <line x1="15" y1="5" x2="16" y2="13" stroke="currentColor" strokeWidth="1.3" />
          <line x1="9" y1="14" x2="16" y2="13" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="5" cy="7" r="2" fill="currentColor" />
          <circle cx="15" cy="5" r="2" fill="currentColor" />
          <circle cx="9" cy="14" r="2" fill="currentColor" />
          <circle cx="16" cy="13" r="2" fill="currentColor" />
        </svg>
      )

    case "hierarchy":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <line x1="9.5" y1="3" x2="9.5" y2="17" stroke="currentColor" strokeWidth="1.3" />
          <line x1="9.5" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )

    case "specialized":
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <path
            d="M4 14A6.5 6.5 0 1 1 16 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="13"
            x2="13.5"
            y2="8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="10" cy="13" r="1.5" fill="currentColor" />
        </svg>
      )

    default:
      return (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className={className}
          {...props}
        >
          <path
            d="M3 13.5L7.5 8.5L11.5 11.5L17 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
