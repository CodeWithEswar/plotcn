"use client"

import React, { useState, useEffect, useRef } from "react"

interface LazyDemoProps {
  children: React.ReactNode
  height?: number | string
  title?: string
  fallback?: React.ReactNode
}

export function LazyDemo({
  children,
  height = 360,
  title = "Chart Preview",
  fallback,
}: LazyDemoProps) {
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "200px 0px", // Trigger slightly before entering viewport
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ minHeight: typeof height === "number" ? `${height}px` : height }}
      className="my-6 rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden flex flex-col justify-center items-center relative transition-colors"
    >
      {isInView ? (
        <DemoErrorBoundary title={title}>{children}</DemoErrorBoundary>
      ) : (
        fallback || (
          <div className="flex flex-col items-center justify-center gap-2 text-zinc-500 py-12">
            <div className="size-6 rounded-full border-2 border-zinc-700 border-t-zinc-400 animate-spin" />
            <span className="text-xs font-mono">Loading {title}…</span>
          </div>
        )
      )}
    </div>
  )
}

interface DemoErrorBoundaryProps {
  children: React.ReactNode
  title: string
}

interface DemoErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  constructor(props: DemoErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): DemoErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center text-xs text-zinc-400">
          <p className="text-amber-400 font-medium mb-1">Failed to load preview</p>
          <p className="font-mono text-[11px] text-zinc-500">
            {this.state.error?.message || "An error occurred rendering this demo"}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
