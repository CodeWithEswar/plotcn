import React from "react"
import { cn } from "@/lib/utils"

export interface WordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-sm font-semibold tracking-tight",
  md: "text-base font-semibold tracking-tight",
  lg: "text-lg font-bold tracking-tight",
  xl: "text-2xl font-bold tracking-tight",
}

export function Wordmark({ className, size = "md", ...props }: WordmarkProps) {
  return (
    <span
      className={cn(
        sizeClasses[size],
        "text-foreground select-none inline-flex items-center",
        className
      )}
      {...props}
    >
      Plotcn
    </span>
  )
}
