import React from "react"

export type FlowNodeKind =
  | "primary"
  | "secondary"
  | "file"
  | "folder"
  | "command"
  | "registry"
  | "package"
  | "runtime"
  | "data"
  | "theme"
  | "accessibility"
  | "output"

export type FlowNodeStatus = "default" | "active" | "completed" | "warning"

export interface FlowNodeProps {
  id?: string
  icon?: any
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  metadata?: React.ReactNode
  badge?: React.ReactNode
  badgeVariant?: "default" | "outline" | "accent" | "success" | "warning"
  status?: FlowNodeStatus
  variant?: FlowNodeKind
  className?: string
  as?: "div" | "li"
  children?: React.ReactNode
}

export interface FlowConnectorProps {
  direction?: "down" | "right" | "responsive" | "branch" | "merge"
  styleVariant?: "solid" | "dashed"
  label?: string
  animated?: boolean
  className?: string
}

export interface FlowZoneProps {
  title: string
  eyebrow?: string
  icon?: any
  badge?: string
  className?: string
  children: React.ReactNode
}

export interface FlowTimelineStep {
  step: string | number
  icon?: any
  title: string
  description?: string
  metadata?: string
  status?: FlowNodeStatus
}

export interface FlowTimelineProps {
  steps: FlowTimelineStep[]
  activeStep?: string | number
  className?: string
  title?: string
  eyebrow?: string
  description?: string
  ariaLabel?: string
}

export interface FlowDiagramProps {
  title?: string
  eyebrow?: string
  description?: string
  className?: string
  children: React.ReactNode
  ariaLabel?: string
}
