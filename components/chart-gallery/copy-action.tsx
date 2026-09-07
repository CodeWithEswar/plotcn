"use client"
import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Tick02Icon,
  ComputerTerminal01Icon,
} from "@hugeicons/core-free-icons"
import { checkRegistryAvailability } from "@/lib/registry/availability"
import { Button } from "@/components/ui/button"
export function CopyAction({
  text,
  label = "Copy",
  className,
  registryName,
}: {
  text: string
  label?: string
  className?: string
  registryName?: string
}) {
  const [status, setStatus] = useState<
    "idle" | "copied" | "error" | "checking" | "unpublished" | "unavailable"
  >("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  async function copy() {
    try {
      if (registryName) {
        setStatus("checking")
        const availability = await checkRegistryAvailability(registryName)
        if (!mounted.current) return
        if (availability !== "ready") {
          setStatus(availability)
          return
        }
      }
      await navigator.clipboard.writeText(text)
      if (mounted.current) {
        setStatus("copied")
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setStatus("idle"), 2500)
      }
    } catch {
      if (mounted.current) setStatus("error")
    }
  }
  return (
    <span className="lens-copy">
      <Button
        variant="outline"
        disabled={status === "checking"}
        className={className}
        onClick={copy}
        aria-label={`${label}${status === "copied" ? ": copied" : ""}`}
      >
        <HugeiconsIcon
          icon={
            status === "copied"
              ? Tick02Icon
              : label === "Install"
                ? ComputerTerminal01Icon
                : Copy01Icon
          }
          size={16}
        />
        {status === "copied"
          ? "Copied"
          : status === "checking"
            ? "Checking..."
            : label}
      </Button>
      <span
        role="status"
        className={
          ["error", "unpublished", "unavailable"].includes(status)
            ? "lens-copy-error"
            : "sr-only"
        }
      >
        {status === "unpublished" ? (
          "Registry publication pending. Open the chart to inspect its local source."
        ) : status === "unavailable" ? (
          "Could not verify the public registry. Check your connection and try again."
        ) : status === "copied" ? (
          "Copied to clipboard."
        ) : status === "error" ? (
          <>
            Clipboard unavailable. Select and copy this command:{" "}
            <code>{text}</code>
          </>
        ) : (
          ""
        )}
      </span>
    </span>
  )
}
