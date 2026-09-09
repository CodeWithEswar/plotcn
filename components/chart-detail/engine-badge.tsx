import Image from "next/image"
import type { ChartEngine } from "@/lib/charts/metadata"
import { cn } from "@/lib/utils"

const labels: Record<ChartEngine, string> = {
  recharts: "Recharts",
  d3: "D3.js",
  google: "Google Charts",
}

export function EngineBrandBadge({ engine, className }: { engine: ChartEngine | string; className?: string }) {
  if (engine !== "recharts" && engine !== "d3" && engine !== "google") return null

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium", className)}>
      <Image src={`/brand/engines/${engine}.svg`} width={76} height={18} alt={labels[engine]} className="h-4 w-auto object-contain" style={{ width: "auto" }} />
    </span>
  )
}

export function EngineBadge({ engine, className }: { engine: ChartEngine; className?: string }) {
  return <EngineBrandBadge engine={engine} className={className} />
}

export const RechartsBrandLogo = ({ className }: { className?: string }) => (
  <Image src="/brand/engines/recharts.svg" width={76} height={18} alt="Recharts" className={className} style={{ width: "auto" }} />
)

export const D3BrandLogo = ({ className }: { className?: string }) => (
  <Image src="/brand/engines/d3.svg" width={36} height={22} alt="D3.js" className={className} style={{ width: "auto" }} />
)

export const GoogleBrandLogo = ({ className }: { className?: string }) => (
  <Image src="/brand/engines/google.svg" width={72} height={20} alt="Google Charts" className={className} style={{ width: "auto" }} />
)
