"use client"
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
  Maximize01Icon,
  Minimize01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PreviewTheme = "follow" | "dark" | "light" | "system"
export interface PreviewContext {
  width: number
  height: number
  reducedMotion: boolean
  iteration: number
}

interface PreviewWorkspaceProps {
  title: string
  children: (context: PreviewContext) => ReactNode
  height?: number
  width?: number
  onWidthChange?: (width: number) => void
  theme?: PreviewTheme
  onThemeChange?: (theme: PreviewTheme) => void
  animate?: boolean
  reducedMotion?: boolean
  palette?: "default" | "mono"
  inspector?: (context: PreviewContext) => ReactNode
  autoHeight?: boolean
  className?: string
  toolbarActions?: ReactNode
  customStyle?: CSSProperties
}

function PreviewCanvas({
  title,
  children,
  width,
  height,
  reducedMotion,
  iteration,
  theme,
  palette,
  inspector,
  autoHeight,
  customStyle,
}: PreviewWorkspaceProps & {
  width: number
  height: number
  reducedMotion: boolean
  iteration: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setMeasuredWidth(Math.floor(entries[0].contentRect.width))
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const context = { width: measuredWidth, height, reducedMotion, iteration }
  const colors =
    palette === "mono"
      ? ({
          "--chart-1": "var(--foreground)",
          "--chart-2": "var(--muted-foreground)",
          "--chart-3": "#a1a1aa",
          "--chart-4": "#71717a",
        } as CSSProperties)
      : undefined

  return (
    <div className="preview-canvas-area">
      <div
        className="charts-surface preview-canvas"
        data-theme={theme === "follow" ? undefined : theme}
        style={{ width, maxWidth: "100%", ...colors, ...customStyle }}
      >
        <div className="preview-ruler">
          <span>
            {measuredWidth || "…"} × {autoHeight ? "auto" : height}
          </span>
          <span>Container width</span>
        </div>
        <div
          ref={ref}
          className="preview-render"
          role="group"
          aria-label={`${title} live preview`}
          style={{ minHeight: autoHeight ? 180 : height }}
        >
          {measuredWidth > 0 ? (
            children(context)
          ) : (
            <span className="lens-preview-loading">Measuring preview...</span>
          )}
        </div>
        {inspector && <div className="preview-runtime">{inspector(context)}</div>}
      </div>
    </div>
  )
}

export function PreviewWorkspace(props: PreviewWorkspaceProps) {
  const [localWidth, setLocalWidth] = useState(1100)
  const [iteration, setIteration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const systemReduced = useReducedMotion()
  const width = props.width ?? localWidth
  const theme = props.theme ?? "follow"
  const height = props.height ?? 360
  const reducedMotion = !!systemReduced || !!props.reducedMotion
  const setWidth = props.onWidthChange ?? setLocalWidth

  useEffect(() => {
    setMounted(true)
  }, [])

  const enterFullscreen = async () => {
    setFullscreen(true)
    try {
      if (typeof document !== "undefined" && document.fullscreenEnabled && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.()
      }
    } catch {
      // Fallback overlay mode works even if browser denies native fullscreen
    }
  }

  const exitFullscreen = async () => {
    try {
      if (typeof document !== "undefined" && document.fullscreenElement) {
        await document.exitFullscreen?.()
      }
    } catch {}
    setFullscreen(false)
  }

  useEffect(() => {
    if (!fullscreen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exitFullscreen()
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && fullscreen) {
        setFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [fullscreen])

  const canvasProps = { ...props, width, height, theme, reducedMotion, iteration }
  const fullscreenCanvasProps = {
    ...props,
    width,
    height: props.autoHeight ? height : Math.max(height, 520),
    theme,
    reducedMotion,
    iteration,
  }

  return (
    <div className={cn("preview-workspace", props.className)}>
      <div className="lens-preview-controls">
        <div className="lens-devices" role="group" aria-label="Preview container width">
          {[
            { width: 1100, label: "Desktop", icon: ComputerIcon },
            { width: 768, label: "Tablet", icon: Tablet01Icon },
            { width: 390, label: "Mobile", icon: SmartPhone01Icon },
          ].map((d) => (
            <Button
              key={d.width}
              variant="ghost"
              aria-pressed={width === d.width}
              aria-label={`${d.label} ${d.width}px`}
              onClick={() => setWidth(d.width)}
            >
              <HugeiconsIcon icon={d.icon} size={16} />
              <span>{d.label}</span>
              <small>{d.width}</small>
            </Button>
          ))}
        </div>

        <div className="lens-preview-utilities">
          {props.toolbarActions}

          {props.animate && (
            <Button
              variant="ghost"
              aria-label="Replay animation"
              disabled={reducedMotion}
              onClick={() => setIteration((n) => n + 1)}
            >
              <HugeiconsIcon icon={RefreshIcon} size={17} />
            </Button>
          )}

          <Button
            variant="ghost"
            aria-label="Open fullscreen preview"
            onClick={enterFullscreen}
          >
            <HugeiconsIcon icon={Maximize01Icon} size={17} />
          </Button>
        </div>
      </div>

      <PreviewCanvas {...canvasProps} />

      {fullscreen &&
        mounted &&
        createPortal(
          <div
            className="preview-fullscreen-overlay charts-surface"
            data-theme={theme === "follow" ? undefined : theme}
            role="dialog"
            aria-modal="true"
            aria-label={`${props.title} full-screen preview`}
          >
            <header className="preview-fullscreen-header">
              <div className="preview-fullscreen-title-group">
                <span className="preview-fullscreen-badge">FULLSCREEN PREVIEW</span>
                <h2 className="preview-fullscreen-title">{props.title}</h2>
              </div>

              <div className="lens-devices" role="group" aria-label="Fullscreen preview width">
                {[
                  { width: 1100, label: "Desktop", icon: ComputerIcon },
                  { width: 768, label: "Tablet", icon: Tablet01Icon },
                  { width: 390, label: "Mobile", icon: SmartPhone01Icon },
                ].map((d) => (
                  <Button
                    key={d.width}
                    variant="ghost"
                    size="sm"
                    aria-pressed={width === d.width}
                    aria-label={`${d.label} ${d.width}px`}
                    onClick={() => setWidth(d.width)}
                  >
                    <HugeiconsIcon icon={d.icon} size={15} />
                    <span>{d.label}</span>
                    <small>{d.width}</small>
                  </Button>
                ))}
              </div>

              <div className="preview-fullscreen-actions">
                {props.toolbarActions}

                {props.animate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Replay animation"
                    disabled={reducedMotion}
                    onClick={() => setIteration((n) => n + 1)}
                  >
                    <HugeiconsIcon icon={RefreshIcon} size={16} />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exitFullscreen}
                  className="preview-exit-fullscreen-btn gap-1.5"
                >
                  <HugeiconsIcon icon={Minimize01Icon} size={15} />
                  <span>Exit Fullscreen</span>
                  <kbd className="preview-esc-kbd">ESC</kbd>
                </Button>
              </div>
            </header>

            <div className="preview-fullscreen-stage">
              <PreviewCanvas {...fullscreenCanvasProps} />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
