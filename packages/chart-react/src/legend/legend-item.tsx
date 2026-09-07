import React, { forwardRef, type HTMLAttributes } from "react"

export interface LegendItemData {
  id: string
  label: string
  color?: string
  value?: string | number
  disabled?: boolean
  hidden?: boolean
}

export interface LegendItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onToggle"> {
  item: LegendItemData
  /** Called when item is toggled via click or Enter/Space keyboard event */
  onToggle?: (id: string) => void
  /** Render custom color swatch */
  renderSwatch?: (item: LegendItemData) => React.ReactNode
}

/**
 * LegendItem renders an accessible, interactive series identifier in chart legends.
 */
export const LegendItem = forwardRef<HTMLDivElement, LegendItemProps>(
  function LegendItem(
    {
      item,
      onToggle,
      renderSwatch,
      className,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) {
    const isInteractive = Boolean(onToggle && !item.disabled)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      if (isInteractive) {
        onToggle?.(item.id)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (isInteractive && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault()
        onToggle?.(item.id)
      }
    }

    return (
      <div
        ref={ref}
        role={isInteractive ? "button" : "listitem"}
        tabIndex={isInteractive ? 0 : undefined}
        aria-pressed={isInteractive ? !item.hidden : undefined}
        aria-disabled={item.disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={
          className
            ? `plotcn-legend-item inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity select-none ${
                item.hidden ? "opacity-35 line-through" : ""
              } ${isInteractive ? "cursor-pointer hover:text-foreground" : ""} ${className}`
            : `plotcn-legend-item inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity select-none ${
                item.hidden ? "opacity-35 line-through" : ""
              } ${isInteractive ? "cursor-pointer hover:text-foreground" : ""}`
        }
        {...props}
      >
        {renderSwatch ? (
          renderSwatch(item)
        ) : (
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color || "currentColor" }}
            aria-hidden="true"
          />
        )}
        <span className="font-medium text-foreground/90">{item.label}</span>
        {item.value !== undefined && (
          <span className="font-mono text-muted-foreground">({item.value})</span>
        )}
      </div>
    )
  }
)
