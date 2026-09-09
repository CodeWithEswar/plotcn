"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Sun03Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons"
import { useTheme, type ThemeMode } from "./theme-provider"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ThemeToggleProps {
  className?: string
  align?: "start" | "center" | "end"
}

export function ThemeToggle({ className, align = "end" }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const triggerIcon = theme === "system" ? ComputerIcon : theme === "dark" ? Moon02Icon : Sun03Icon
  const triggerLabel = `Change appearance (current: ${theme}, resolved: ${resolvedTheme})`

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            aria-label={triggerLabel}
            aria-haspopup="menu"
            title="Appearance"
            className={cn(
              "theme-toggle-btn !size-8 !p-0 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              className
            )}
          >
            <HugeiconsIcon icon={triggerIcon} size={16} strokeWidth={1.8} />
          </Button>
        }
      />

      <DropdownMenuContent
        align={align}
        sideOffset={6}
        className="w-36 min-w-[140px] p-1 bg-popover text-popover-foreground border border-border shadow-xl rounded-lg"
      >
        <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium font-mono uppercase tracking-wider text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/60 my-1" />
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(val) => {
            const nextTheme = val as ThemeMode
            setOpen(false)
            setTheme(nextTheme)
          }}
        >
          <DropdownMenuRadioItem
            value="system"
            className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-md cursor-pointer select-none transition-colors"
          >
            <HugeiconsIcon icon={ComputerIcon} size={15} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
            <span className="flex-1">System</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="light"
            className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-md cursor-pointer select-none transition-colors"
          >
            <HugeiconsIcon icon={Sun03Icon} size={15} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
            <span className="flex-1">Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="flex items-center gap-2 px-2 py-1.5 text-xs rounded-md cursor-pointer select-none transition-colors"
          >
            <HugeiconsIcon icon={Moon02Icon} size={15} strokeWidth={1.8} className="shrink-0 text-muted-foreground" />
            <span className="flex-1">Dark</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Mobile-specific inline appearance control row for drawers and sheets.
 * Touch target >= 44px with clear visual feedback.
 */
export function MobileThemeSelector({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const options: Array<{
    value: ThemeMode
    label: string
    icon: React.ComponentProps<typeof HugeiconsIcon>["icon"]
  }> = [
    { value: "system", label: "System", icon: ComputerIcon },
    { value: "light", label: "Light", icon: Sun03Icon },
    { value: "dark", label: "Dark", icon: Moon02Icon },
  ]

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-muted-foreground px-1">
        Appearance
      </div>
      <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-muted/40 border border-border">
        {options.map((opt) => {
          const isSelected = theme === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              aria-pressed={isSelected}
              aria-label={`${opt.label} appearance`}
              className={cn(
                "flex items-center justify-center gap-1.5 h-[30px] px-2 rounded-md text-xs font-medium transition-all select-none cursor-pointer",
                isSelected
                  ? "bg-background text-foreground shadow-xs border border-border/80 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <HugeiconsIcon icon={opt.icon} size={13.5} strokeWidth={1.8} className="shrink-0" />
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
