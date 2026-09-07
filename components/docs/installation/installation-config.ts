export type SupportedFramework =
  | "next"
  | "vite"
  | "tanstack-start"
  | "laravel"
  | "react-router"
  | "astro"
  | "manual"

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"

export interface FrameworkInfo {
  id: SupportedFramework
  name: string
  description: string
  template?: string
  starterGuide?: string
  requirements: string[]
  notes?: string
}

export const frameworks: readonly FrameworkInfo[] = [
  {
    id: "next",
    name: "Next.js",
    description: "App Router & React",
    template: "next",
    requirements: [
      "Node.js 18.18.0 or newer (Node 20+ LTS recommended)",
      "Next.js 14, 15, or 16 with App Router",
      "Tailwind CSS v4 or v3 with CSS variables",
      "TypeScript enabled",
    ],
    notes: "Plotcn is built natively for Next.js with React Server Component and client boundary support.",
  },
  {
    id: "vite",
    name: "Vite",
    description: "React + Vite",
    template: "vite",
    requirements: [
      "Node.js 18+ LTS",
      "Vite 5 or 6 with React plugin",
      "Tailwind CSS v4 or v3",
      "Path alias (@/*) configured in vite.config.ts & tsconfig.json",
    ],
    notes: "Ultra-fast HMR and bundling. Ensure path aliases resolve to project root.",
  },
  {
    id: "tanstack-start",
    name: "TanStack Start",
    description: "Full-stack React",
    template: "start",
    requirements: [
      "Node.js 18+ LTS",
      "TanStack Start with Nitro server engine",
      "Tailwind CSS integration",
      "TypeScript strictly configured",
    ],
    notes: "Full-stack SSR React architecture powered by TanStack Router and Nitro.",
  },
  {
    id: "laravel",
    name: "Laravel",
    description: "React + Inertia",
    requirements: [
      "PHP 8.2+ and Composer installed",
      "Laravel 11+ with Inertia.js React starter kit",
      "Vite frontend pipeline",
      "Tailwind CSS configured in resources/css/app.css",
    ],
    notes: "Create your Laravel project using the React Starter Kit, then initialize shadcn/ui.",
  },
  {
    id: "react-router",
    name: "React Router",
    description: "Framework mode",
    template: "react-router",
    requirements: [
      "Node.js 18+ LTS",
      "React Router v7 in Framework / SSR mode",
      "Tailwind CSS configured with app.css",
      "TypeScript enabled",
    ],
    notes: "Standard web-standards routing and SSR data loading with React Router v7.",
  },
  {
    id: "astro",
    name: "Astro",
    description: "React islands",
    template: "astro",
    requirements: [
      "Node.js 18.17.1+ or 20+",
      "Astro 4 or 5 with @astrojs/react integration",
      "Tailwind CSS integration (@astrojs/tailwind)",
      "Client directive (client:load / client:visible) for interactive charts",
    ],
    notes: "Fast content-first sites with islands architecture. Use client:load on interactive visualizations.",
  },
  {
    id: "manual",
    name: "Manual setup",
    description: "Custom React setup",
    requirements: [
      "Existing React 18 or 19 project",
      "Tailwind CSS v3 or v4 configured with theme variables",
      "Path aliases (@/*) resolving to components and lib directories",
      "shadcn/ui compatible components.json configuration",
    ],
    notes: "Install dependencies directly and wire components into your existing build system.",
  },
] as const

export function getFramework(id: string): FrameworkInfo {
  const found = frameworks.find((f) => f.id === id)
  return found || frameworks[0]
}

/**
 * Returns package-manager prefix for running CLI commands
 */
export function getExecPrefix(pkg: PackageManager): string {
  switch (pkg) {
    case "npm":
      return "npx"
    case "yarn":
      return "yarn dlx"
    case "bun":
      return "bunx --bun"
    case "pnpm":
    default:
      return "pnpm dlx"
  }
}

/**
 * Returns package-manager command for installing dependencies
 */
export function getInstallPrefix(pkg: PackageManager, isDev = false): string {
  switch (pkg) {
    case "npm":
      return isDev ? "npm install -D" : "npm install"
    case "yarn":
      return isDev ? "yarn add -D" : "yarn add"
    case "bun":
      return isDev ? "bun add -d" : "bun add"
    case "pnpm":
    default:
      return isDev ? "pnpm add -D" : "pnpm add"
  }
}

/**
 * Derives the exact create/scaffold command for framework + package manager
 */
export function getCreateCommand(framework: SupportedFramework, pkg: PackageManager): {
  command: string
  note?: string
} {
  const exec = getExecPrefix(pkg)

  switch (framework) {
    case "next":
      return {
        command: `${exec} shadcn@latest init --template next`,
        note: "Automatically configures Next.js App Router, Tailwind CSS, TypeScript, and shadcn/ui.",
      }
    case "vite":
      return {
        command: `${exec} shadcn@latest init --template vite`,
        note: "Sets up Vite + React + Tailwind CSS with the required path aliases.",
      }
    case "tanstack-start":
      return {
        command: `${exec} shadcn@latest init --template start`,
        note: "Scaffolds a TanStack Start full-stack application with Nitro engine.",
      }
    case "laravel":
      return {
        command: "composer create-project laravel/laravel my-app",
        note: "Choose the React starter kit when prompted by Laravel installer, then run shadcn initialization.",
      }
    case "react-router":
      return {
        command: `${exec} shadcn@latest init --template react-router`,
        note: "Scaffolds a React Router v7 framework-mode application with SSR.",
      }
    case "astro":
      return {
        command: `${exec} shadcn@latest init --template astro`,
        note: "Sets up Astro with @astrojs/react and Tailwind CSS integrations.",
      }
    case "manual":
      return {
        command: `${getInstallPrefix(pkg)} recharts d3 @hugeicons/react @hugeicons/core-free-icons\n${getInstallPrefix(pkg, true)} @types/d3`,
        note: "Install required visualization and icon libraries into your existing React project.",
      }
  }
}

/**
 * Derives the shadcn init command
 */
export function getShadcnInitCommand(pkg: PackageManager): string {
  return `${getExecPrefix(pkg)} shadcn@latest init`
}

/**
 * Derives the first component install command
 */
export function getFirstComponentCommand(pkg: PackageManager): string {
  return `${getExecPrefix(pkg)} shadcn@latest add @plotcn/line`
}

/**
 * Package manager brand design tokens
 */
export const packageManagerTokens: Record<
  PackageManager,
  {
    name: string
    accentColor: string
    borderColor: string
    bgTint: string
    railColor: string
  }
> = {
  pnpm: {
    name: "pnpm",
    accentColor: "#F9AD00",
    borderColor: "rgba(249, 173, 0, 0.4)",
    bgTint: "rgba(249, 173, 0, 0.08)",
    railColor: "#F9AD00",
  },
  npm: {
    name: "npm",
    accentColor: "#CB3837",
    borderColor: "rgba(203, 56, 55, 0.45)",
    bgTint: "rgba(203, 56, 55, 0.09)",
    railColor: "#CB3837",
  },
  yarn: {
    name: "Yarn",
    accentColor: "#2C8EBB",
    borderColor: "rgba(44, 142, 187, 0.45)",
    bgTint: "rgba(44, 142, 187, 0.09)",
    railColor: "#2C8EBB",
  },
  bun: {
    name: "Bun",
    accentColor: "#F472B6",
    borderColor: "rgba(244, 114, 182, 0.4)",
    bgTint: "rgba(244, 114, 182, 0.08)",
    railColor: "#F472B6",
  },
}
