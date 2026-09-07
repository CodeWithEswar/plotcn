"use client"

import * as React from "react"
import { forceSimulation, forceManyBody, forceCenter, forceLink, type SimulationNodeDatum } from "d3-force"
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
    if (!motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(frame)
      simulation.stop().tick(180)
      frame = requestAnimationFrame(publish)
    } else simulation.on("tick", publish)

    return () => {
      simulation.stop()
    }
  }, [initialNodes, initialLinks, width, height, motion])

  const [hoveredNode, setHoveredNode] = React.useState<NetworkNode | null>(null)

  return (
    <div className={cn("relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4 select-none", className)}>
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
              stroke="var(--chart-grid, rgba(255,255,255,0.15))"
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
                  fill={isHovered ? "#ffffff" : "var(--chart-1, #10b981)"}
                  stroke={isHovered ? "var(--chart-1, #10b981)" : "var(--background, #09090b)"}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                />
                <text
                  dy={isHovered ? 20 : 16}
                  textAnchor="middle"
                  fill={isHovered ? "#ffffff" : "var(--chart-axis, #a1a1aa)"}
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
          <div className="rounded-lg border border-white/[0.14] bg-zinc-950/95 p-2.5 text-white shadow-xl backdrop-blur-md text-xs min-w-[130px]">
            <div className="text-xs font-semibold text-white mb-1 flex items-center justify-between gap-2 border-b border-white/[0.08] pb-1">
              <span>{hoveredNode.label}</span>
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Node ID</span>
              <span className="text-zinc-200">{hoveredNode.id}</span>
            </div>
            {hoveredNode.group !== undefined && (
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>Cluster</span>
                <span className="text-emerald-400 font-semibold font-mono">Group {hoveredNode.group}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
