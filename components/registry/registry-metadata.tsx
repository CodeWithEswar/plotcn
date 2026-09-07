import * as React from "react"
import type { RegistryItemInfo } from "@/lib/registry/manifest"
import { cn } from "@/lib/utils"

export interface RegistryMetadataProps {
  info: RegistryItemInfo | null
  engine?: string
  className?: string
}

/**
 * Technical metadata rail with truthful file & dependency counts (Section 42, 43)
 */
export function RegistryMetadata({
  info,
  engine = "recharts",
  className,
}: RegistryMetadataProps) {
  const engineLabel =
    engine === "d3" ? "D3.js" : engine === "google" ? "Google Charts" : "Recharts"

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-border/60 pt-2.5 font-mono text-[10px] text-muted-foreground",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span>
          <strong className="text-foreground/80 font-medium">REGISTRY</strong> @plotcn
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <strong className="text-foreground/80 font-medium">ENGINE</strong> {engineLabel}
        </span>
        {info && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>
              <strong className="text-foreground/80 font-medium">FILES</strong> {info.fileCount}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>
              <strong className="text-foreground/80 font-medium">DEPENDENCIES</strong>{" "}
              {info.dependencies.length + info.registryDependencies.length}
            </span>
          </>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground/80 m-0">
        {info?.dependencies?.length
          ? `Copied as source into your project (requires ${info.dependencies.join(", ")}).`
          : "Copied as source. No Plotcn runtime required."}
      </p>
    </div>
  )
}
