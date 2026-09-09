"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export function BackToTop({ className }: { className?: string }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0
      setScrollProgress(progress)
      setVisible(scrollTop > 160)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const radius = 9
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`Scroll back to top (${scrollProgress}% scrolled)`}
      title={`Back to top (${scrollProgress}%)`}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/[0.12] bg-zinc-950/90 hover:border-emerald-500/40 hover:bg-zinc-900 shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer group active:scale-95",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
        className
      )}
    >
      <div className="relative flex items-center justify-center size-5">
        {/* SVG Circular Progress Track and Animated Fill */}
        <svg className="size-5 -rotate-90" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
        </svg>
        <HugeiconsIcon
          icon={ArrowUp02Icon}
          size={11}
          className="absolute text-emerald-400 group-hover:-translate-y-0.5 transition-transform"
        />
      </div>
      <span className="text-[11px] font-mono font-medium text-zinc-300 group-hover:text-white tabular-nums tracking-tight">
        {scrollProgress}%
      </span>
    </button>
  )
}
