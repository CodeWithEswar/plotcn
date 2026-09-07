export interface TruncatedLabel {
  display: string
  isTruncated: boolean
  original: string
}

/**
 * Shortens long axis labels while preserving full semantic value for accessibility and tooltips.
 * Section 7.65.
 */
export function truncateResponsiveLabel(
  label: string,
  maxLength: number
): TruncatedLabel {
  if (!label || label.length <= maxLength || maxLength <= 3) {
    return {
      display: label,
      isTruncated: false,
      original: label,
    }
  }

  return {
    display: `${label.slice(0, maxLength - 1).trimEnd()}…`,
    isTruncated: true,
    original: label,
  }
}

/**
 * Derives recommended max label length based on container breakpoint.
 * Section 7.29 & 7.30.
 */
export function getRecommendedLabelLength(breakpoint: "xs" | "sm" | "md" | "lg" | "xl"): number {
  switch (breakpoint) {
    case "xs":
      return 8
    case "sm":
      return 12
    case "md":
      return 18
    case "lg":
      return 24
    case "xl":
      return 36
  }
}
