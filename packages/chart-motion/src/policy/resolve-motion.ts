import type {
  MotionPreset,
  ChartMotionConfig,
  ResolvedMotionPolicy,
} from "../types"
import type { ChartFamily, MotionPolicyOptions } from "./types"
import { detectReducedMotion, resolveReducedMotionFallback } from "./reduced-motion"
import { presetDefinitions, chartMotionDuration, chartMotionEasing } from "./tokens"

/**
 * Returns canonical chart-specific default presets.
 * Section 10.8.
 */
export function getDefaultPresetsForFamily(family?: ChartFamily): {
  enter: MotionPreset
  update: MotionPreset
  exit: MotionPreset
} {
  switch (family) {
    case "line":
      return { enter: "draw", update: "morph", exit: "fade" }
    case "area":
      return { enter: "reveal", update: "morph", exit: "fade" }
    case "bar":
      return { enter: "grow", update: "grow", exit: "fade" }
    case "pie":
    case "donut":
      return { enter: "sweep", update: "sweep", exit: "fade" }
    case "scatter":
      return { enter: "fade", update: "fade", exit: "fade" }
    case "network":
      // Network node positions are owned by D3 force simulation, UI states use fade
      return { enter: "fade", update: "none", exit: "fade" }
    case "heatmap":
    case "geo":
      return { enter: "fade", update: "fade", exit: "fade" }
    default:
      return { enter: "fade", update: "fade", exit: "fade" }
  }
}

/**
 * Resolves comprehensive motion policy from chart config, chart family, and environmental options.
 * Section 10.1, 10.5 - 10.8, 10.35, 10.57 - 10.63.
 */
export function resolveMotionPolicy(
  config?: ChartMotionConfig | MotionPreset | boolean,
  family?: ChartFamily,
  options?: MotionPolicyOptions
): ResolvedMotionPolicy {
  // 1. Explicit boolean false disables motion entirely
  if (config === false) {
    return {
      enabled: false,
      reducedMotion: options?.reducedMotion ?? false,
      enter: "none",
      update: "none",
      exit: "none",
      duration: 0,
      easing: chartMotionEasing.linear,
    }
  }

  // 2. Resolve environment & reduced motion preference
  const reducedMotion = options?.reducedMotion ?? detectReducedMotion()

  // 3. Resolve baseline defaults for this chart family
  const defaults = getDefaultPresetsForFamily(family)

  // 4. Parse user config
  let rawEnter: MotionPreset = defaults.enter
  let rawUpdate: MotionPreset = defaults.update
  let rawExit: MotionPreset = defaults.exit
  let rawDuration: number = chartMotionDuration.normal

  if (typeof config === "string") {
    // Simple preset string shorthand: <Chart animation="draw" />
    rawEnter = config
    rawUpdate = config === "draw" ? "morph" : config
  } else if (typeof config === "object" && config !== null) {
    if (config.enter) rawEnter = config.enter
    if (config.update) rawUpdate = config.update
    if (config.exit) rawExit = config.exit
    if (typeof config.duration === "number" && config.duration >= 0) {
      rawDuration = config.duration
    }
  }

  // 5. Continuous resize rule (Section 10.35): bypass animations to avoid lag behind container
  if (options?.isContinuousResize) {
    return {
      enabled: false,
      reducedMotion,
      enter: "none",
      update: "none",
      exit: "none",
      duration: 0,
      easing: chartMotionEasing.linear,
    }
  }

  // 6. Streaming data rule (Section 10.70): clamp duration to micro or fast
  if (options?.isStreaming) {
    rawDuration = Math.min(rawDuration, chartMotionDuration.micro)
  }

  // 7. Apply reduced motion policy (Section 10.58)
  if (reducedMotion) {
    const enter = resolveReducedMotionFallback(rawEnter)
    const update = resolveReducedMotionFallback(rawUpdate)
    const exit = resolveReducedMotionFallback(rawExit)
    const duration = enter === "none" && update === "none" && exit === "none" ? 0 : chartMotionDuration.micro

    return {
      enabled: enter !== "none" || update !== "none" || exit !== "none",
      reducedMotion: true,
      enter,
      update,
      exit,
      duration,
      easing: chartMotionEasing.linear,
    }
  }

  // 8. Normal resolution
  const presetDef = presetDefinitions[rawEnter] || presetDefinitions.fade

  return {
    enabled: rawEnter !== "none" || rawUpdate !== "none" || rawExit !== "none",
    reducedMotion: false,
    enter: rawEnter,
    update: rawUpdate,
    exit: rawExit,
    duration: rawDuration,
    easing: presetDef.easing,
  }
}
