import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, ArrowUpRight01Icon, GithubIcon, SourceCodeIcon, Copy01Icon, Tick02Icon, Menu01Icon, SearchIcon, ComputerTerminal01Icon, Layers01Icon, ChartLineData01Icon, Sun01Icon, Moon02Icon, RefreshIcon } from "@hugeicons/core-free-icons"

const icons = { arrow: ArrowRight01Icon, external: ArrowUpRight01Icon, github: GithubIcon, code: SourceCodeIcon, copy: Copy01Icon, check: Tick02Icon, menu: Menu01Icon, search: SearchIcon, terminal: ComputerTerminal01Icon, layers: Layers01Icon, chart: ChartLineData01Icon, sun: Sun01Icon, moon: Moon02Icon, refresh: RefreshIcon }
export function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  return <HugeiconsIcon icon={icons[name]} size={18} strokeWidth={1.6} className={className} aria-hidden="true" />
}
