"use client"

import React, { useMemo } from "react"
import type { ChartMetadata } from "@/lib/charts/metadata"
import { DynamicChartRenderer } from "@/components/chart-gallery/chart-renderer"
import { PreviewWorkspace } from "@/components/preview/preview-workspace"
import { ChartColorControl } from "./chart-color-control"
import { getChartColorRoles } from "@/lib/charts/chart-colors"
import { useChartColors } from "./chart-color-context"

interface HeroPreviewWorkspaceProps {
  chart: ChartMetadata
}

export function HeroPreviewWorkspace({ chart }: HeroPreviewWorkspaceProps) {
  const context = useChartColors()
  const fallbackRoles = useMemo(() => getChartColorRoles(chart.registryName), [chart.registryName])
  const colorRoles = context.colorRoles.length > 0 ? context.colorRoles : fallbackRoles
  const customColors = context.customColors

  return (
    <PreviewWorkspace
      title={`${chart.title} live preview`}
      height={340}
      animate
      customStyle={context.cssVariables}
      toolbarActions={
        colorRoles.length > 0 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[280px] sm:max-w-none">
            {colorRoles.map((role) => (
              <ChartColorControl
                key={role.id}
                role={role}
                value={customColors[role.propName]}
                onChange={(val) => context.setColor(role.propName, val)}
                onReset={() => context.resetColor(role.propName)}
                compact
              />
            ))}
          </div>
        ) : undefined
      }
      inspector={({ width, height, reducedMotion }) => (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>{chart.engine.toUpperCase()} · {chart.renderer.toUpperCase()} · {width} × {height}px</span>
          <span>{reducedMotion ? "Reduced motion" : "Motion enabled"} · ResizeObserver</span>
        </div>
      )}
    >
      {({ height, reducedMotion, iteration }) => (
        <DynamicChartRenderer
          key={iteration}
          registryName={chart.registryName}
          height={height}
          motion={!reducedMotion}
          color={customColors["color"] || customColors["primaryColor"]}
          chartProps={customColors}
        />
      )}
    </PreviewWorkspace>
  )
}

