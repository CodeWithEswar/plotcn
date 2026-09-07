import React from "react"
import type { AccessibilityDoc } from "@/lib/charts/detail-docs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

interface AccessibilitySectionProps {
  accessibility: AccessibilityDoc
}

export function AccessibilitySection({ accessibility }: AccessibilitySectionProps) {
  return (
    <section id="section-accessibility" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
          06 / Assistive Technology
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-sans">
          Accessibility & Navigation Standards
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {accessibility.summary}
        </p>
      </div>

      {/* Verification Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Semantic Role & Landmark</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Container mounts as <code className="text-zinc-300 font-mono text-[11px]">{accessibility.role}</code> with explicit assistive label.
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Color-Independent Legibility</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {accessibility.colorIndependence}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Screen Reader Summary</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Embeds visually hidden summary (<code className="text-zinc-300 font-mono text-[11px]">.sr-only</code>) declaring: &ldquo;{accessibility.screenReader}&rdquo;
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Reduced Motion Support</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {accessibility.reducedMotion}
          </p>
        </div>
      </div>

      {/* Keyboard Interaction Shortcuts Table */}
      {accessibility.keyboardShortcuts.length > 0 && (
        <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 overflow-hidden">
          <div className="p-3 border-b border-white/[0.08] bg-white/[0.02] text-xs font-mono text-zinc-400 font-medium">
            Keyboard Interaction Model
          </div>
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {accessibility.keyboardShortcuts.map((sc) => (
                <tr key={sc.key} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono font-semibold text-emerald-400 w-36">
                    <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.1] text-zinc-200">
                      {sc.key}
                    </kbd>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 leading-relaxed font-sans">{sc.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
