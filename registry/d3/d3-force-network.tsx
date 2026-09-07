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

export interface D3ForceNetworkProps {
  nodes: NetworkNode[]
  links: NetworkLink[]
  width?: number
  height?: number
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
}: D3ForceNetworkProps) {
  const [nodes, setNodes] = React.useState<NetworkNode[]>([])
  const [links, setLinks] = React.useState<any[]>([])

  React.useEffect(() => {
    const nodesCopy = initialNodes.map((n) => ({ ...n }))
    const linksCopy = initialLinks.map((l) => ({ ...l }))

    const simulation = forceSimulation(nodesCopy)
      .force("charge", forceManyBody().strength(-120))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "link",
        forceLink(linksCopy).id((d: any) => d.id).distance(60)
      )

    simulation.on("tick", () => {
      setNodes([...nodesCopy])
      setLinks([...linksCopy])
    })

    return () => {
      simulation.stop()
    }
  }, [initialNodes, initialLinks, width, height])

  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/70 p-4", className)}>
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
              stroke="hsl(var(--border) / 0.6)"
              strokeWidth={1.5}
            />
          ))}
        </g>
        <g>
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x || 0},${node.y || 0})`}>
              <circle
                r={8}
                fill="hsl(var(--chart-1, 142 71% 45%))"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
              <text
                dy={16}
                textAnchor="middle"
                className="fill-zinc-400 text-[10px] font-mono select-none"
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
