"use client"

import * as React from "react"
import { forceSimulation, forceManyBody, forceCenter, forceLink, type SimulationNodeDatum } from "d3-force"
import { useChartReducedMotion } from "../shared/use-chart-reduced-motion"
import { ChartEmptyState, ChartErrorState } from "../shared/chart-state"
import { cn } from "@/lib/utils"

export interface NetworkNode extends SimulationNodeDatum {
  id: string
  label: string
  group?: number
}

export interface NetworkLink {
  source: string | NetworkNode
  target: string | NetworkNode
  value?: number
}

export interface SimulationLink {
  source: NetworkNode
  target: NetworkNode
  value?: number
}

export interface D3ForceNetworkProps {
  nodes: NetworkNode[]
  links: NetworkLink[]
  width?: number
  height?: number
  motion?: boolean
  className?: string
}

/**
 * D3 Force-Directed Network Graph
 * D3 calculates physics coordinates (repulsion, centering, link springs); React renders the SVG graph.
 */
export function D3ForceNetwork({
  nodes: initialNodes,
  links: initialLinks,
  width = 600,
  height = 360,
  className,
  motion = true,
}: D3ForceNetworkProps) {
  const reducedMotion = useChartReducedMotion()
  const [nodes, setNodes] = React.useState<NetworkNode[]>([])
  const [links, setLinks] = React.useState<SimulationLink[]>([])

  React.useEffect(() => {
    const nodesCopy = initialNodes.map((n) => ({ ...n }))
    const linksCopy = initialLinks.map((l) => ({ ...l }))

    const simulation = forceSimulation(nodesCopy)
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "link",
        forceLink<NetworkNode, SimulationLink>(linksCopy as unknown as SimulationLink[])
          .id((d) => d.id)
          .distance(60)
      )

    const publish = () => {
      setNodes([...nodesCopy])
      setLinks([...(linksCopy as unknown as SimulationLink[])])
    }
    let frame = 0
    if (!motion || reducedMotion) {
      cancelAnimationFrame(frame)
      simulation.stop().tick(180)
      frame = requestAnimationFrame(publish)
    } else simulation.on("tick", publish)

    return () => {
      simulation.stop()
    }
  }, [initialNodes, initialLinks, width, height, motion, reducedMotion])

  const [hoveredNode, setHoveredNode] = React.useState<NetworkNode | null>(null)

  const invalidData = initialNodes.some((node) => !node.id || !node.label)

  if (!initialNodes.length) return <ChartEmptyState />
  if (invalidData) return <ChartErrorState description="Every node requires an id and label." />

  return (
    <div className={cn("plotcn-chart relative w-full overflow-hidden rounded-xl border border-[var(--chart-border)] bg-[var(--chart-background)] p-4 select-none", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        aria-label="Force-directed network visualization"
      >
        <g>
          {links.map((link, idx) => (
            <line
              key={idx}
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
              stroke="var(--chart-grid)"
              strokeWidth={1.5}
            />
          ))}
        </g>
        <g>
          {nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id
            return (
              <g
                key={node.id}
                transform={`translate(${node.x || 0},${node.y || 0})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle
                  r={isHovered ? 11 : 8}
                  fill={isHovered ? "var(--chart-background)" : "var(--chart-1)"}
                  stroke={isHovered ? "var(--chart-1)" : "var(--chart-background)"}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
                <text
                  dy={isHovered ? 20 : 16}
                  textAnchor="middle"
                  fill={isHovered ? "var(--chart-foreground)" : "var(--chart-axis)"}
                  className="text-[10px] font-mono select-none transition-colors"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* Floating Theme Tooltip */}
      {hoveredNode && hoveredNode.x !== undefined && hoveredNode.y !== undefined && (
        <div
          className="absolute pointer-events-none z-30 -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{
            left: `${((hoveredNode.x) / width) * 100}%`,
            top: `${((hoveredNode.y) / height) * 100}%`,
            marginTop: "-16px",
          }}
        >
          <div className="plotcn-chart-tooltip">
            <div className="mb-1 flex items-center justify-between gap-2 border-b border-[var(--chart-tooltip-border)] pb-1 text-xs font-semibold">
              <span>{hoveredNode.label}</span>
              <span className="size-2 rounded-full bg-[var(--chart-1)]" />
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
              <span>Node ID</span>
              <span className="text-[var(--chart-tooltip-foreground)]">{hoveredNode.id}</span>
            </div>
            {hoveredNode.group !== undefined && (
              <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-[var(--chart-tooltip-muted)]">
                <span>Cluster</span>
                <span className="font-mono font-semibold text-[var(--chart-1)]">Group {hoveredNode.group}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
