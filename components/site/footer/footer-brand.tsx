import Link from "next/link"
import { AppLogo } from "@/components/brand"
import { Icon } from "@/components/landing/icons"

export function FooterBrand() {
  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight text-white group"
        aria-label="Plotcn Home"
      >
        <AppLogo className="size-7 transition-transform group-hover:scale-105" />
        <span className="font-semibold tracking-tight">Plotcn</span>
        <span className="font-mono text-[10px] text-zinc-400 border border-zinc-700/80 px-1.5 py-0.5 rounded tracking-normal">
          v0.1
        </span>
      </Link>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Beautiful React visualizations powered by Recharts and D3, delivered as source through the shadcn Registry.
      </p>
      <div className="pt-1">
        <Link
          href="/#charts"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors group"
        >
          <span>Explore visualization catalog</span>
          <Icon name="arrow" className="size-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
