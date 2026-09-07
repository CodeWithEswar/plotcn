import React, { forwardRef, type SVGProps, type ReactNode } from "react"

export interface AnnotationProps extends SVGProps<SVGGElement> {
  children?: ReactNode
  /** Accessible label for the annotation layer */
  label?: string
}

/**
 * Annotation groups visual milestones, threshold lines, and reference bands.
 */
export const Annotation = forwardRef<SVGGElement, AnnotationProps>(
  function Annotation(
    { children, label = "Chart Annotations", className, ...props },
    ref
  ) {
    return (
      <g
        ref={ref}
        role="region"
        aria-label={label}
        className={className ? `plotcn-annotations ${className}` : "plotcn-annotations"}
        {...props}
      >
        {children}
      </g>
    )
  }
)
