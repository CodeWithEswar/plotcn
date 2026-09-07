import React from "react"
import type { ChartEngine } from "@/lib/charts/metadata"
import { cn } from "@/lib/utils"

export interface EngineBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  engine: ChartEngine
  size?: "sm" | "md"
}

export function EngineBadge({ engine, size = "md", className, ...props }: EngineBadgeProps) {
  const configs = {
    recharts: {
      label: "RECHARTS",
      dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
      container: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:border-sky-500/40",
    },
    d3: {
      label: "D3.JS",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      container: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40",
    },
    google: {
      label: "GOOGLE",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      container: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40",
    },
  }

  const current = configs[engine] || configs.recharts

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
        current.container,
        className
      )}
      {...props}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", current.dot)} />
      {current.label}
    </span>
  )
}

/**
 * High-fidelity, authentic vector mark for Recharts (<Recharts />)
 */
export function RechartsBrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="3 18 137 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-3.5 w-auto shrink-0", className)}
      aria-label="Recharts"
    >
      <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5,25L5,30L14.5,35" />
        <path d="M114.25,37.5L123.75,22.5" />
        <path d="M128.5,25L138,30L128.5,35" />
      </g>
      <text
        x="19"
        y="30"
        fill="#ffffff"
        fontFamily="var(--font-geist-mono), 'Roboto Mono', Consolas, monospace"
        fontWeight="600"
        fontSize="16"
        letterSpacing="0.02em"
      >
        <tspan x="19" dy="0.355em">Recharts</tspan>
      </text>
    </svg>
  )
}

/**
 * High-fidelity, authentic vector mark for Google Charts
 */
export function GoogleBrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <svg
        viewBox="0 0 24 24"
        className="size-3.5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span className="text-[11px] font-mono font-medium text-white/90">Google Charts</span>
    </div>
  )
}

/**
 * High-fidelity, authentic vector mark for D3.js
 */
export function D3BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <svg
        viewBox="-10 -10 116 111"
        className="size-3.5 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="d3-g1-brand" x1="7" y1="64" x2="50" y2="107" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f9a03c" />
            <stop offset="1" stopColor="#f7974e" />
          </linearGradient>
          <linearGradient id="d3-g2-brand" x1="2" y1="-2" x2="87" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f26d58" />
            <stop offset="1" stopColor="#f9a03c" />
          </linearGradient>
          <linearGradient id="d3-g3-brand" x1="45" y1="-10" x2="108" y2="53" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#b84e51" />
            <stop offset="1" stopColor="#f68e48" />
          </linearGradient>
          <clipPath id="d3-clip-brand">
            <path d="M0,0h7.75a45.5,45.5 0 1 1 0,91h-7.75v-20h7.75a25.5,25.5 0 1 0 0,-51h-7.75zm36.2510,0h32a27.75,27.75 0 0 1 21.331,45.5a27.75,27.75 0 0 1 -21.331,45.5h-32a53.6895,53.6895 0 0 0 18.7464,-20h13.2526a7.75,7.75 0 1 0 0,-15.5h-7.75a53.6895,53.6895 0 0 0 0,-20h7.75a7.75,7.75 0 1 0 0,-15.5h-13.2526a53.6895,53.6895 0 0 0 -18.7464,-20z" />
          </clipPath>
        </defs>
        <g clipPath="url(#d3-clip-brand)">
          <path d="M-100,-102m-28,0v300h300z" fill="url(#d3-g1-brand)" />
          <path d="M-100,-102m28,0h300v300z" fill="url(#d3-g3-brand)" />
          <path d="M-100,-102l300,300" fill="none" stroke="url(#d3-g2-brand)" strokeWidth="40" />
        </g>
      </svg>
      <span className="text-[11px] font-mono font-medium text-white/90">D3.js</span>
    </div>
  )
}

/**
 * Premium Brand Badge for Component Detail Header
 */
export function EngineBrandBadge({
  engine,
  className,
}: {
  engine: ChartEngine | string
  className?: string
}) {
  switch (engine) {
    case "recharts":
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-md bg-sky-500/10 border border-sky-500/25 px-2.5 py-1 text-sky-400 shadow-xs hover:bg-sky-500/15 hover:border-sky-500/35 transition-colors",
            className
          )}
        >
          <RechartsBrandLogo />
        </div>
      )
    case "google":
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-md bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-emerald-400 shadow-xs hover:bg-emerald-500/15 hover:border-emerald-500/35 transition-colors",
            className
          )}
        >
          <GoogleBrandLogo />
        </div>
      )
    case "d3":
      return (
        <div
          className={cn(
            "inline-flex items-center rounded-md bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 text-amber-400 shadow-xs hover:bg-amber-500/15 hover:border-amber-500/35 transition-colors",
            className
          )}
        >
          <D3BrandLogo />
        </div>
      )
    default:
      return null
  }
}

