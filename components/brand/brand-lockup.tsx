import React from "react"
import { PlotcnMark } from "./plotcn-mark"
import { Wordmark } from "./wordmark"
import { cn } from "@/lib/utils"

export interface BrandLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  subtitle?: string
}

export function BrandLockup({
  size = "md",
  subtitle,
  className,
  ...props
}: BrandLockupProps) {
  const markSizes = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  }

  return (
    <div className={cn("inline-flex items-center gap-3", className)} {...props}>
      <PlotcnMark className={markSizes[size]} />
      <div className="flex flex-col">
        <Wordmark size={size === "lg" ? "lg" : "md"} />
        {subtitle && (
          <span className="text-[11px] text-muted-foreground font-mono leading-none mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
