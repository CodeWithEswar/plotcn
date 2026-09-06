import React from "react"
import { PlotcnMark, type PlotcnMarkProps } from "./plotcn-mark"
import { cn } from "@/lib/utils"

export interface PlotcnLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  markClassName?: string
  textClassName?: string
  markProps?: PlotcnMarkProps
  showText?: boolean
}

/**
 * PlotcnLogo - Combines the vector brand mark with accessible HTML typography.
 * The wordmark "Plotcn" is rendered in HTML typography, never inside the SVG.
 */
export function PlotcnLogo({
  className,
  markClassName = "size-7",
  textClassName,
  markProps,
  showText = true,
  ...props
}: PlotcnLogoProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      <PlotcnMark className={cn("shrink-0", markClassName)} {...markProps} />
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-base leading-none text-foreground",
            textClassName
          )}
        >
          Plotcn
        </span>
      )}
    </div>
  )
}
