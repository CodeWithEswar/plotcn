import React from "react"
import type { AccessibilityDoc } from "@/lib/charts/detail-docs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { ApiTable, type ApiTableColumn } from "@/components/docs/api-table"

interface AccessibilitySectionProps {
  accessibility: AccessibilityDoc
}

export function AccessibilitySection({ accessibility }: AccessibilitySectionProps) {
  const keyboardColumns: readonly ApiTableColumn[] = [
    { key: "key", label: "Key", width: "24%", kind: "name" },
    { key: "action", label: "Action", width: "76%", kind: "description" },
  ]
  return (
    <section id="section-accessibility" className="space-y-6 pt-4 scroll-mt-20">
      <div className="space-y-1">
        <div className="text-[11px] font-mono tracking-widest text-muted-foreground font-semibold uppercase">
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
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Semantic Role & Landmark</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Container mounts as <code className="text-foreground font-mono text-[11px]">{accessibility.role}</code> with explicit assistive label.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Color-Independent Legibility</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {accessibility.colorIndependence}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Screen Reader Summary</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            Embeds visually hidden summary (<code className="text-foreground font-mono text-[11px]">.sr-only</code>) declaring: &ldquo;{accessibility.screenReader}&rdquo;
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            <span>Reduced Motion Support</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {accessibility.reducedMotion}
          </p>
        </div>
      </div>

      {/* Keyboard Interaction Shortcuts Table */}
      {accessibility.keyboardShortcuts.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-muted-foreground font-medium">
            Keyboard Interaction Model
          </div>
          <ApiTable
            caption="Keyboard interaction model"
            columns={keyboardColumns}
            rows={accessibility.keyboardShortcuts.map((shortcut) => ({
              id: `key-${shortcut.key.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
              cells: {
                key: <kbd className="rounded border border-border bg-muted px-2 py-1 font-mono text-foreground">{shortcut.key}</kbd>,
                action: shortcut.action,
              },
            }))}
          />
        </div>
      )}
    </section>
  )
}
