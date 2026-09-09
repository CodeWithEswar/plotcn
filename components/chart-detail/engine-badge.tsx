import Image from "next/image"
import type { ChartEngine } from "@/lib/charts/metadata"
import { cn } from "@/lib/utils"

export function RechartsLogoSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      viewBox="3 18 137 24"
      width={76}
      height={18}
      className={cn("h-4 w-auto object-contain shrink-0", className)}
      aria-label="Recharts"
    >
      <g fill="none" stroke="#0284c7" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5,25L5,30L14.5,35" />
        <path d="M114.25,37.5L123.75,22.5" />
        <path d="M128.5,25L138,30L128.5,35" />
      </g>
      <text
        x="19"
        y="30"
        className="text-[16px] font-semibold fill-foreground"
        textAnchor="start"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, monospace',
        }}
      >
        <tspan x="19" dy="0.355em">Recharts</tspan>
      </text>
    </svg>
  )
}

const labels: Record<ChartEngine, string> = {
  recharts: "Recharts",
  d3: "D3.js",
  google: "Google Charts",
}

export function EngineBrandBadge({ engine, className }: { engine: ChartEngine | string; className?: string }) {
  if (engine !== "recharts" && engine !== "d3" && engine !== "google") return null

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground", className)}>
      {engine === "recharts" ? (
        <RechartsLogoSvg />
      ) : (
        <Image src={`/brand/engines/${engine}.svg`} width={engine === "d3" ? 36 : 72} height={18} alt={labels[engine]} className="h-4 w-auto object-contain" style={{ width: "auto" }} />
      )}
    </span>
  )
}

export function EngineBadge({ engine, className }: { engine: ChartEngine; className?: string }) {
  return <EngineBrandBadge engine={engine} className={className} />
}

export const RechartsBrandLogo = ({ className }: { className?: string }) => (
  <RechartsLogoSvg className={className} />
)

export const D3BrandLogo = ({ className }: { className?: string }) => (
  <Image src="/brand/engines/d3.svg" width={36} height={22} alt="D3.js" className={className} style={{ width: "auto" }} />
)

export const GoogleBrandLogo = ({ className }: { className?: string }) => (
  <Image src="/brand/engines/google.svg" width={72} height={20} alt="Google Charts" className={className} style={{ width: "auto" }} />
)
