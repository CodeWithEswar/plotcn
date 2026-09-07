import type { ChartDimensions } from "../types/dimensions"

/**
 * Calculates height from a container width and aspect ratio (e.g. 16/9, 4/3, 2/1).
 * Optionally clamps to an explicit maxHeight.
 */
export function calculateAspectRatioDimensions(
  width: number,
  aspectRatio: number,
  maxHeight?: number
): ChartDimensions {
  const safeWidth = Math.max(0, width)
  const safeRatio = aspectRatio > 0 ? aspectRatio : 16 / 9
  let height = safeWidth / safeRatio

  if (maxHeight !== undefined && maxHeight > 0) {
    height = Math.min(height, maxHeight)
  }

  return {
    width: safeWidth,
    height: Math.max(0, Math.round(height)),
  }
}
