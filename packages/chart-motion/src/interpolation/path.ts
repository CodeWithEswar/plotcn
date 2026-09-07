import type { PathInterpolationResult } from "../types"
import { interpolateNumber } from "./number"

interface PathCommand {
  command: string
  params: number[]
}

/**
 * Parses an SVG path `d` attribute into command tokens and numeric parameters.
 */
export function parseSvgPath(d: string): PathCommand[] {
  if (!d || typeof d !== "string") return []

  const commandRegex = /([a-df-z])([^a-df-z]*)/gi
  const commands: PathCommand[] = []

  let match: RegExpExecArray | null
  while ((match = commandRegex.exec(d)) !== null) {
    const command = match[1]
    const paramStr = match[2].trim()

    // Match floating point numbers (including negatives and scientific notation)
    const params = paramStr
      .match(/[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g)
      ?.map(Number) ?? []

    commands.push({ command, params })
  }

  return commands
}

/**
 * Checks whether two parsed SVG paths share compatible topology for morphing.
 * Section 10.22.
 */
export function arePathsCompatible(commandsA: PathCommand[], commandsB: PathCommand[]): boolean {
  if (commandsA.length !== commandsB.length) return false

  for (let i = 0; i < commandsA.length; i++) {
    const cmdA = commandsA[i]
    const cmdB = commandsB[i]

    if (cmdA.command !== cmdB.command) return false
    if (cmdA.params.length !== cmdB.params.length) return false
  }

  return true
}

/**
 * Serializes parsed path commands back into an SVG path string.
 */
export function serializeSvgPath(commands: PathCommand[]): string {
  return commands
    .map((c) => `${c.command}${c.params.length > 0 ? " " + c.params.join(" ") : ""}`)
    .join(" ")
}

/**
 * Interpolates between two SVG path strings.
 * Safely morphs compatible geometries and applies semantic fallback for mismatched topologies.
 * Section 10.21 - 10.23.
 */
export function interpolatePath(
  pathA: string,
  pathB: string,
  progress: number,
  options?: { reducedMotion?: boolean }
): PathInterpolationResult {
  const t = Math.max(0, Math.min(1, progress))

  if (options?.reducedMotion || t >= 1) {
    return { path: pathB, isCompatible: true, fallbackApplied: false }
  }
  if (t <= 0) {
    return { path: pathA, isCompatible: true, fallbackApplied: false }
  }
  if (pathA === pathB) {
    return { path: pathB, isCompatible: true, fallbackApplied: false }
  }

  const cmdsA = parseSvgPath(pathA)
  const cmdsB = parseSvgPath(pathB)

  const compatible = arePathsCompatible(cmdsA, cmdsB)

  if (!compatible) {
    // Section 10.23: Fall back safely when topologies mismatch
    const fallbackPath = t < 0.5 ? pathA : pathB
    return {
      path: fallbackPath,
      isCompatible: false,
      fallbackApplied: true,
    }
  }

  // Smooth coordinate interpolation across matched topology
  const interpolatedCmds: PathCommand[] = cmdsA.map((cmdA, i) => {
    const cmdB = cmdsB[i]
    const interpolatedParams = cmdA.params.map((valA, pIdx) => {
      const valB = cmdB.params[pIdx]
      return interpolateNumber(valA, valB, t)
    })

    return {
      command: cmdA.command,
      params: interpolatedParams,
    }
  })

  return {
    path: serializeSvgPath(interpolatedCmds),
    isCompatible: true,
    fallbackApplied: false,
  }
}
