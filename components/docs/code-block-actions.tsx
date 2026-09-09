"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  CheckmarkCircle01Icon,
  TextWrapIcon,
} from "@hugeicons/core-free-icons"

interface CodeBlockActionsProps {
  rawCode: string
  codeElementId: string
}

export function CodeBlockActions({ rawCode, codeElementId }: CodeBlockActionsProps) {
  const [copied, setCopied] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode)
      setCopied(true)
      setCopyError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 3000)
    }
  }

  const handleToggleWrap = () => {
    const el = document.getElementById(codeElementId)
    if (el) {
      if (!isWrapped) {
        el.classList.add("plotcn-code-wrapped")
      } else {
        el.classList.remove("plotcn-code-wrapped")
      }
    }
    setIsWrapped(!isWrapped)
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <TooltipProvider>
        {/* Wrap / Unwrap Toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleWrap}
                aria-label={isWrapped ? "Unwrap code" : "Wrap code"}
                className={`h-7 px-2 text-xs gap-1 transition-colors ${
                  isWrapped
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              />
            }
          >
            <HugeiconsIcon icon={TextWrapIcon} size={14} strokeWidth={1.8} />
            <span className="text-[11px] font-mono hidden sm:inline">
              {isWrapped ? "Wrapped" : "Wrap"}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs font-mono bg-popover border-border text-popover-foreground">
            {isWrapped ? "Disable line wrapping" : "Enable line wrapping"}
          </TooltipContent>
        </Tooltip>

        {/* Copy Button */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                aria-label="Copy code to clipboard"
                className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted text-xs gap-1"
              />
            }
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              size={14}
              strokeWidth={1.8}
              className={copied ? "text-emerald-500 dark:text-emerald-400" : ""}
            />
            <span className="text-[11px] font-mono">
              {copied ? "Copied" : copyError ? "Failed" : "Copy"}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs font-mono bg-popover border-border text-popover-foreground">
            {copied ? "Copied to clipboard!" : copyError ? "Unable to copy" : "Copy code"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
