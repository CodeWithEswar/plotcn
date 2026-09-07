import React from "react"
import Link from "next/link"
import { HeadingAnchor } from "./heading-anchor"
import { DocsCallout, type CalloutType } from "./docs-callout"
import { PackageManagerTabs } from "./package-manager-tabs"
import { formatCommand } from "./package-manager-utils"
import { CodeBlock } from "./code-block"
import { highlightCode } from "@/lib/shiki"
import { slugify } from "@/lib/slugify"
import {
  DocsIntroHero,
  DocsMeta,
  DocsDivider,
  VisualizationSystemPreview,
  EngineGrid,
  RegistryFlow,
  PlotcnArchitecture,
  ProjectStatus,
  DocsNextSteps,
  PlotcnEcosystemMap,
  ProductDeliveryFlow,
  D3BoundaryCard,
  GoogleChartsTaxonomy,
  EngineIsolationOverview,
  GoogleRuntimePipeline,
  TargetDeveloperJourney,
  FullProductModel,
  GoogleChartsArchDiagram,
  GeoChartFeatureFlow,
  InstalledFilesCard,
} from "./intro-components"
import {
  InstallationProvider,
  InstallationHero,
  FrameworkSelector,
  PackageManagerSelector,
  SetupSummary,
  FrameworkRequirements,
  CreateProjectCommand,
  InitializeShadcnCommand,
  ConfigurePlotcnSection,
  FirstVisualizationCommand,
  VerificationSection,
} from "./installation"
import {
  ProjectSetupHero,
  SetupContextHeader,
  ProjectSetupOverview,
  FileTree,
  FrameworkAwareAliasConfig,
  FrameworkComponentsJson,
  ChartDirectoryOverview,
  SharedChartArchitecture,
  ClientBoundaryGuide,
  RegistryOutputFlow,
  ProjectSetupChecklist,
} from "./project-setup-components"
import {
  ShadcnSetupHero,
  ShadcnSetupFlow,
  ComponentsJsonExplorer,
  AliasMap,
  RscBoundaryGuide,
  RegistryNamespaceFlow,
  ComponentInstallFlow,
  RegistryDiff,
  ConfigurationTroubleshooting,
  RegistrySetupStatus,
} from "./shadcn-setup-components"
import {
  RegistryHero,
  PlotcnRegistryFlow,
  RegistryMentalModel,
  NamespaceResolver,
  RegistryCliExplorer,
  RegistryItemExplorer,
  RegistryFileDiff,
  DependencyGraph,
  EngineIsolationDiagram,
  RegistryInstallLifecycle,
  RegistryContributorFlow,
  RegistryPublishingFlow,
  RegistryTroubleshooting,
  RegistryVerificationMatrix,
  RegistryPathMapping,
  RegistryModificationSummary,
  SourceOwnershipFlow,
  UpdatePhilosophyFlow,
} from "./registry-components"
import {
  UsageHero,
  UsageFlow,
  ImportPathMap,
  ResponsiveChartGuide,
  ChartStateGuide,
  EngineApiComparison,
  UsageTroubleshooting,
  UsageWorkflow,
  D3PipelineFlow,
} from "./usage-components"
import {
  ThemingHero,
  ThemeSystemPreview,
  ChartTokenExplorer,
  SeriesColorGuide,
  TooltipLegendPreview,
  ThemeModePreview,
  GoogleThemeAdapterFlow,
  ThemeAccessibilityChecklist,
  ThemingTroubleshooting,
  ThemingWorkflow,
  CustomizationHierarchy,
  ThemingPipelineFlow,
  ReuseRuleGrid,
  VisualContrastHierarchy,
} from "./theming-components"
import {
  AccessibilityHero,
  AccessibilityModel,
  ChartSummaryPreview,
  AccessibleDataDisclosure,
  KeyboardInteractionGuide,
  NonColorEncodingPreview,
  AccessibilityTestMatrix,
  AccessibilityTroubleshooting,
  AccessibilityWorkflow,
} from "./accessibility-components"
import { DocsArticleActions } from "./docs-article-actions"

interface MDXRendererProps {
  content: string
  slug?: string
  rawContent?: string
}

export async function MDXRenderer({ content, slug, rawContent }: MDXRendererProps) {
  const elements = await parseMarkdownToReact(content, { slug, rawContent })
  if (
    slug === "installation" ||
    slug === "project-setup" ||
    slug === "shadcn" ||
    slug === "registry" ||
    slug === "usage" ||
    slug === "theming" ||
    slug === "accessibility"
  ) {
    return (
      <InstallationProvider>
        <div className="docs-content max-w-none text-zinc-300">{elements}</div>
      </InstallationProvider>
    )
  }
  return <div className="docs-content max-w-none text-zinc-300">{elements}</div>
}

interface ParseContext {
  slug?: string
  rawContent?: string
}

/**
 * Parses markdown body into a structured array of React server elements.
 */
async function parseMarkdownToReact(
  markdown: string,
  context?: ParseContext
): Promise<React.ReactNode[]> {
  const lines = markdown.split(/\r?\n/)
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // Horizontal Rule / Divider: ---, ***, ___, <hr />, <hr>
    if (
      /^(?:\s*[-*_]\s*){3,}$/.test(trimmed) ||
      trimmed === "<hr />" ||
      trimmed === "<hr/>" ||
      trimmed === "<hr>"
    ) {
      i++
      elements.push(<DocsDivider key={`divider-${i}`} />)
      continue
    }

    // 1. Package Manager block: :::package-manager ... :::
    if (trimmed === ":::package-manager") {
      i++
      const cmdLines: string[] = []
      while (i < lines.length && lines[i].trim() !== ":::") {
        cmdLines.push(lines[i])
        i++
      }
      i++ // skip closing :::
      const fullCmd = cmdLines.join("\n").trim()

      const pnpmCmd = formatCommand(fullCmd, "pnpm")
      const npmCmd = formatCommand(fullCmd, "npm")
      const yarnCmd = formatCommand(fullCmd, "yarn")
      const bunCmd = formatCommand(fullCmd, "bun")

      let highlighted: { pnpm?: string; npm?: string; yarn?: string; bun?: string } = {}
      try {
        const [pnpmHtml, npmHtml, yarnHtml, bunHtml] = await Promise.all([
          highlightCode(pnpmCmd, "bash"),
          highlightCode(npmCmd, "bash"),
          highlightCode(yarnCmd, "bash"),
          highlightCode(bunCmd, "bash"),
        ])
        highlighted = {
          pnpm: pnpmHtml,
          npm: npmHtml,
          yarn: yarnHtml,
          bun: bunHtml,
        }
      } catch (err) {
        console.error("[mdx-components] Failed to highlight package manager command:", err)
      }

      elements.push(
        <PackageManagerTabs
          key={`pkg-${i}`}
          command={fullCmd}
          highlightedCommands={highlighted}
        />
      )
      continue
    }

    // 2. Code Block: ```[lang] [title="..."]
    if (trimmed.startsWith("```")) {
      const info = trimmed.slice(3).trim()
      // Extract title if present e.g. ```json title="components.json"
      let language = info
      let title: string | undefined

      const titleMatch = info.match(/title="([^"]+)"/)
      if (titleMatch) {
        title = titleMatch[1]
        language = info.replace(titleMatch[0], "").trim()
      } else {
        const parts = info.split(/\s+/)
        language = parts[0] || "text"
      }

      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      const rawCode = codeLines.join("\n")

      elements.push(
        <CodeBlock
          key={`code-${i}`}
          code={rawCode}
          language={language || "typescript"}
          title={title}
        />
      )
      continue
    }

    // 3. GitHub Alert / Callout block: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
    const alertMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT)\]/i)
    if (alertMatch) {
      const calloutType = alertMatch[1].toLowerCase() as CalloutType
      i++
      const calloutLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        calloutLines.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      const calloutText = calloutLines.join(" ").trim()
      elements.push(
        <DocsCallout key={`callout-${i}`} type={calloutType}>
          {renderInlineFormatting(calloutText)}
        </DocsCallout>
      )
      continue
    }

    // 4. Standard Blockquote: > text
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""))
        i++
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-4 border-l-2 border-zinc-700 pl-4 italic text-zinc-400 text-sm leading-relaxed"
        >
          {renderInlineFormatting(quoteLines.join(" ").trim())}
        </blockquote>
      )
      continue
    }

    // 5. Custom Docs Component Tags
    if (trimmed.startsWith("<DocsIntroHero")) {
      const tagLines: string[] = []
      while (i < lines.length) {
        tagLines.push(lines[i])
        if (lines[i].includes("/>") || lines[i].includes("</DocsIntroHero>")) {
          i++
          break
        }
        i++
      }
      const fullTag = tagLines.join(" ")
      const eyebrowMatch = fullTag.match(/eyebrow="([^"]*)"/)
      const titleMatch = fullTag.match(/title="([^"]*)"/)
      const descMatch = fullTag.match(/description="([^"]*)"/)

      elements.push(
        <DocsIntroHero
          key={`hero-${i}`}
          eyebrow={eyebrowMatch ? eyebrowMatch[1] : undefined}
          title={titleMatch ? titleMatch[1] : undefined}
          description={descMatch ? descMatch[1] : undefined}
        />
      )
      continue
    }

    if (trimmed.startsWith("<DocsMeta")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DocsMeta>")) {
        i++
      }
      i++
      elements.push(<DocsMeta key={`meta-${i}`} />)
      if (context?.slug === "introduction" && context?.rawContent) {
        elements.push(
          <div key={`meta-actions-${i}`} className="my-2 not-prose">
            <DocsArticleActions rawContent={context.rawContent} slug={context.slug} />
          </div>
        )
      }
      continue
    }

    if (trimmed.startsWith("<VisualizationSystemPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VisualizationSystemPreview>")) {
        i++
      }
      i++
      elements.push(<VisualizationSystemPreview key={`vis-prev-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineGrid")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineGrid>")) {
        i++
      }
      i++
      elements.push(<EngineGrid key={`engine-grid-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryFlow key={`reg-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PlotcnArchitecture")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PlotcnArchitecture>")) {
        i++
      }
      i++
      elements.push(<PlotcnArchitecture key={`arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PlotcnEcosystemMap")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PlotcnEcosystemMap>")) {
        i++
      }
      i++
      elements.push(<PlotcnEcosystemMap key={`eco-map-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProductDeliveryFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProductDeliveryFlow>")) {
        i++
      }
      i++
      elements.push(<ProductDeliveryFlow key={`prod-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<D3BoundaryCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</D3BoundaryCard>")) {
        i++
      }
      i++
      elements.push(<D3BoundaryCard key={`d3-bound-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleChartsTaxonomy")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleChartsTaxonomy>")) {
        i++
      }
      i++
      elements.push(<GoogleChartsTaxonomy key={`gc-tax-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineIsolationOverview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineIsolationOverview>")) {
        i++
      }
      i++
      elements.push(<EngineIsolationOverview key={`iso-over-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleRuntimePipeline")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleRuntimePipeline>")) {
        i++
      }
      i++
      elements.push(<GoogleRuntimePipeline key={`gc-pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TargetDeveloperJourney")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TargetDeveloperJourney>")) {
        i++
      }
      i++
      elements.push(<TargetDeveloperJourney key={`dev-journ-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FullProductModel")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FullProductModel>")) {
        i++
      }
      i++
      elements.push(<FullProductModel key={`full-prod-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleChartsArchDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleChartsArchDiagram>")) {
        i++
      }
      i++
      elements.push(<GoogleChartsArchDiagram key={`gc-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GeoChartFeatureFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GeoChartFeatureFlow>")) {
        i++
      }
      i++
      elements.push(<GeoChartFeatureFlow key={`gc-feat-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InstalledFilesCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InstalledFilesCard>")) {
        i++
      }
      i++
      elements.push(<InstalledFilesCard key={`inst-files-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProjectStatus")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProjectStatus>")) {
        i++
      }
      i++
      elements.push(<ProjectStatus key={`proj-status-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsDivider")) {
      const tagLines: string[] = []
      while (i < lines.length) {
        tagLines.push(lines[i])
        if (lines[i].includes("/>") || lines[i].includes("</DocsDivider>")) {
          i++
          break
        }
        i++
      }
      const fullTag = tagLines.join(" ")
      const labelMatch = fullTag.match(/label="([^"]*)"/)
      elements.push(
        <DocsDivider
          key={`divider-${i}`}
          label={labelMatch ? labelMatch[1] : undefined}
        />
      )
      continue
    }

    if (trimmed.startsWith("<Separator")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</Separator>")) {
        i++
      }
      i++
      elements.push(<DocsDivider key={`sep-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsNextSteps")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DocsNextSteps>")) {
        i++
      }
      i++
      elements.push(<DocsNextSteps key={`next-steps-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InstallationHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InstallationHero>")) {
        i++
      }
      i++
      elements.push(<InstallationHero key={`inst-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FrameworkSelector")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FrameworkSelector>")) {
        i++
      }
      i++
      elements.push(<FrameworkSelector key={`fw-sel-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PackageManagerSelector")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PackageManagerSelector>")) {
        i++
      }
      i++
      elements.push(<PackageManagerSelector key={`pm-sel-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SetupSummary")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SetupSummary>")) {
        i++
      }
      i++
      elements.push(<SetupSummary key={`setup-sum-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FrameworkRequirements")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FrameworkRequirements>")) {
        i++
      }
      i++
      elements.push(<FrameworkRequirements key={`fw-req-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CreateProjectCommand")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CreateProjectCommand>")) {
        i++
      }
      i++
      elements.push(<CreateProjectCommand key={`create-cmd-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InitializeShadcnCommand")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InitializeShadcnCommand>")) {
        i++
      }
      i++
      elements.push(<InitializeShadcnCommand key={`init-cmd-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ConfigurePlotcnSection")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ConfigurePlotcnSection>")) {
        i++
      }
      i++
      elements.push(<ConfigurePlotcnSection key={`cfg-plotcn-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FirstVisualizationCommand")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FirstVisualizationCommand>")) {
        i++
      }
      i++
      elements.push(<FirstVisualizationCommand key={`first-viz-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VerificationSection")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VerificationSection>")) {
        i++
      }
      i++
      elements.push(<VerificationSection key={`verif-sec-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProjectSetupHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProjectSetupHero>")) {
        i++
      }
      i++
      elements.push(<ProjectSetupHero key={`ps-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SetupContextHeader")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SetupContextHeader>")) {
        i++
      }
      i++
      elements.push(<SetupContextHeader key={`ps-ctx-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProjectSetupOverview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProjectSetupOverview>")) {
        i++
      }
      i++
      elements.push(<ProjectSetupOverview key={`ps-overview-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FileTree")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FileTree>")) {
        i++
      }
      i++
      elements.push(<FileTree key={`ps-filetree-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FrameworkAwareAliasConfig")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FrameworkAwareAliasConfig>")) {
        i++
      }
      i++
      elements.push(<FrameworkAwareAliasConfig key={`ps-alias-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FrameworkComponentsJson")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FrameworkComponentsJson>")) {
        i++
      }
      i++
      elements.push(<FrameworkComponentsJson key={`ps-compjson-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ChartDirectoryOverview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ChartDirectoryOverview>")) {
        i++
      }
      i++
      elements.push(<ChartDirectoryOverview key={`ps-chartdir-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SharedChartArchitecture")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SharedChartArchitecture>")) {
        i++
      }
      i++
      elements.push(<SharedChartArchitecture key={`ps-sharedarch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ClientBoundaryGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ClientBoundaryGuide>")) {
        i++
      }
      i++
      elements.push(<ClientBoundaryGuide key={`ps-clientguide-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryOutputFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryOutputFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryOutputFlow key={`ps-regflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProjectSetupChecklist")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProjectSetupChecklist>")) {
        i++
      }
      i++
      elements.push(<ProjectSetupChecklist key={`ps-checklist-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ShadcnSetupHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ShadcnSetupHero>")) {
        i++
      }
      i++
      elements.push(<ShadcnSetupHero key={`ss-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ShadcnSetupFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ShadcnSetupFlow>")) {
        i++
      }
      i++
      elements.push(<ShadcnSetupFlow key={`ss-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ComponentsJsonExplorer")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ComponentsJsonExplorer>")) {
        i++
      }
      i++
      elements.push(<ComponentsJsonExplorer key={`ss-explorer-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AliasMap")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AliasMap>")) {
        i++
      }
      i++
      elements.push(<AliasMap key={`ss-alias-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RscBoundaryGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RscBoundaryGuide>")) {
        i++
      }
      i++
      elements.push(<RscBoundaryGuide key={`ss-rsc-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryNamespaceFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryNamespaceFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryNamespaceFlow key={`ss-regflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ComponentInstallFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ComponentInstallFlow>")) {
        i++
      }
      i++
      elements.push(<ComponentInstallFlow key={`ss-instflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryDiff")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryDiff>")) {
        i++
      }
      i++
      elements.push(<RegistryDiff key={`ss-diff-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ConfigurationTroubleshooting")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ConfigurationTroubleshooting>")) {
        i++
      }
      i++
      elements.push(<ConfigurationTroubleshooting key={`ss-trouble-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistrySetupStatus")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistrySetupStatus>")) {
        i++
      }
      i++
      elements.push(<RegistrySetupStatus key={`ss-status-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryHero>")) {
        i++
      }
      i++
      elements.push(<RegistryHero key={`reg-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PlotcnRegistryFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PlotcnRegistryFlow>")) {
        i++
      }
      i++
      elements.push(<PlotcnRegistryFlow key={`reg-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryMentalModel")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryMentalModel>")) {
        i++
      }
      i++
      elements.push(<RegistryMentalModel key={`reg-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NamespaceResolver")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NamespaceResolver>")) {
        i++
      }
      i++
      elements.push(<NamespaceResolver key={`reg-ns-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryCliExplorer")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryCliExplorer>")) {
        i++
      }
      i++
      elements.push(<RegistryCliExplorer key={`reg-cli-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryItemExplorer")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryItemExplorer>")) {
        i++
      }
      i++
      elements.push(<RegistryItemExplorer key={`reg-item-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryFileDiff")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryFileDiff>")) {
        i++
      }
      i++
      elements.push(<RegistryFileDiff key={`reg-diff-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryPathMapping")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryPathMapping>")) {
        i++
      }
      i++
      elements.push(<RegistryPathMapping key={`reg-pathmap-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DependencyGraph")) {
      const modeMatch = trimmed.match(/mode="([^"]*)"/)
      const mode = (modeMatch ? modeMatch[1] : undefined) as "packages" | "registry" | undefined
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DependencyGraph>")) {
        i++
      }
      i++
      elements.push(<DependencyGraph key={`reg-dep-${i}`} mode={mode} />)
      continue
    }

    if (trimmed.startsWith("<EngineIsolationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineIsolationDiagram>")) {
        i++
      }
      i++
      elements.push(<EngineIsolationDiagram key={`reg-engine-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryInstallLifecycle")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryInstallLifecycle>")) {
        i++
      }
      i++
      elements.push(<RegistryInstallLifecycle key={`reg-lifecycle-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryModificationSummary")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryModificationSummary>")) {
        i++
      }
      i++
      elements.push(<RegistryModificationSummary key={`reg-modsum-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SourceOwnershipFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SourceOwnershipFlow>")) {
        i++
      }
      i++
      elements.push(<SourceOwnershipFlow key={`reg-ownership-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<UpdatePhilosophyFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</UpdatePhilosophyFlow>")) {
        i++
      }
      i++
      elements.push(<UpdatePhilosophyFlow key={`reg-updateflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryContributorFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryContributorFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryContributorFlow key={`reg-contrib-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryPublishingFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryPublishingFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryPublishingFlow key={`reg-pub-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryTroubleshooting")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryTroubleshooting>")) {
        i++
      }
      i++
      elements.push(<RegistryTroubleshooting key={`reg-trouble-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryVerificationMatrix")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryVerificationMatrix>")) {
        i++
      }
      i++
      elements.push(<RegistryVerificationMatrix key={`reg-matrix-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<UsageHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</UsageHero>")) {
        i++
      }
      i++
      elements.push(<UsageHero key={`usage-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<UsageFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</UsageFlow>")) {
        i++
      }
      i++
      elements.push(<UsageFlow key={`usage-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ImportPathMap")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ImportPathMap>")) {
        i++
      }
      i++
      elements.push(<ImportPathMap key={`usage-path-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ResponsiveChartGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ResponsiveChartGuide>")) {
        i++
      }
      i++
      elements.push(<ResponsiveChartGuide key={`usage-resp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ChartStateGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ChartStateGuide>")) {
        i++
      }
      i++
      elements.push(<ChartStateGuide key={`usage-state-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineApiComparison")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineApiComparison>")) {
        i++
      }
      i++
      elements.push(<EngineApiComparison key={`usage-engine-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<UsageTroubleshooting")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</UsageTroubleshooting>")) {
        i++
      }
      i++
      elements.push(<UsageTroubleshooting key={`usage-trouble-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<UsageWorkflow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</UsageWorkflow>")) {
        i++
      }
      i++
      elements.push(<UsageWorkflow key={`usage-workflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<D3PipelineFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</D3PipelineFlow>")) {
        i++
      }
      i++
      elements.push(<D3PipelineFlow key={`usage-d3pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemingHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemingHero>")) {
        i++
      }
      i++
      elements.push(<ThemingHero key={`theme-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemeSystemPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemeSystemPreview>")) {
        i++
      }
      i++
      elements.push(<ThemeSystemPreview key={`theme-sys-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ChartTokenExplorer")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ChartTokenExplorer>")) {
        i++
      }
      i++
      elements.push(<ChartTokenExplorer key={`theme-tok-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SeriesColorGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SeriesColorGuide>")) {
        i++
      }
      i++
      elements.push(<SeriesColorGuide key={`theme-series-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TooltipLegendPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TooltipLegendPreview>")) {
        i++
      }
      i++
      elements.push(<TooltipLegendPreview key={`theme-tip-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemeModePreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemeModePreview>")) {
        i++
      }
      i++
      elements.push(<ThemeModePreview key={`theme-mode-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleThemeAdapterFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleThemeAdapterFlow>")) {
        i++
      }
      i++
      elements.push(<GoogleThemeAdapterFlow key={`theme-google-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemeAccessibilityChecklist")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemeAccessibilityChecklist>")) {
        i++
      }
      i++
      elements.push(<ThemeAccessibilityChecklist key={`theme-a11y-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemingTroubleshooting")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemingTroubleshooting>")) {
        i++
      }
      i++
      elements.push(<ThemingTroubleshooting key={`theme-trouble-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemingWorkflow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemingWorkflow>")) {
        i++
      }
      i++
      elements.push(<ThemingWorkflow key={`theme-workflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CustomizationHierarchy")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CustomizationHierarchy>")) {
        i++
      }
      i++
      elements.push(<CustomizationHierarchy key={`theme-hier-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemingPipelineFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemingPipelineFlow>")) {
        i++
      }
      i++
      elements.push(<ThemingPipelineFlow key={`theme-pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ReuseRuleGrid")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ReuseRuleGrid>")) {
        i++
      }
      i++
      elements.push(<ReuseRuleGrid key={`theme-reuse-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VisualContrastHierarchy")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VisualContrastHierarchy>")) {
        i++
      }
      i++
      elements.push(<VisualContrastHierarchy key={`theme-contrast-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibilityHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibilityHero>")) {
        i++
      }
      i++
      elements.push(<AccessibilityHero key={`a11y-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibilityModel")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibilityModel>")) {
        i++
      }
      i++
      elements.push(<AccessibilityModel key={`a11y-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ChartSummaryPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ChartSummaryPreview>")) {
        i++
      }
      i++
      elements.push(<ChartSummaryPreview key={`a11y-summary-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibleDataDisclosure")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibleDataDisclosure>")) {
        i++
      }
      i++
      elements.push(<AccessibleDataDisclosure key={`a11y-data-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<KeyboardInteractionGuide")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</KeyboardInteractionGuide>")) {
        i++
      }
      i++
      elements.push(<KeyboardInteractionGuide key={`a11y-kb-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NonColorEncodingPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NonColorEncodingPreview>")) {
        i++
      }
      i++
      elements.push(<NonColorEncodingPreview key={`a11y-noncolor-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibilityTestMatrix")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibilityTestMatrix>")) {
        i++
      }
      i++
      elements.push(<AccessibilityTestMatrix key={`a11y-matrix-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibilityTroubleshooting")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibilityTroubleshooting>")) {
        i++
      }
      i++
      elements.push(<AccessibilityTroubleshooting key={`a11y-trouble-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AccessibilityWorkflow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AccessibilityWorkflow>")) {
        i++
      }
      i++
      elements.push(<AccessibilityWorkflow key={`a11y-workflow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DocsCallout")) {
      const openLine = trimmed
      const titleMatch = openLine.match(/title="([^"]*)"/)
      const typeMatch = openLine.match(/type="([^"]*)"/)
      const title = titleMatch ? titleMatch[1] : undefined
      const calloutType = (typeMatch ? typeMatch[1] : "note") as CalloutType

      i++
      const bodyLines: string[] = []
      while (i < lines.length && !lines[i].includes("</DocsCallout>")) {
        bodyLines.push(lines[i])
        i++
      }
      i++ // skip closing </DocsCallout>

      const calloutBody = bodyLines.join("\n").trim()
      elements.push(
        <DocsCallout key={`callout-${i}`} title={title} type={calloutType}>
          {renderInlineFormatting(calloutBody)}
        </DocsCallout>
      )
      continue
    }

    if (trimmed.startsWith("<")) {
      // Skip unhandled HTML/JSX opening tag
      i++
      continue
    }

    // 6. Headings: ## and ###
    const h2Match = line.match(/^##\s+(.+)$/)
    if (h2Match) {
      const title = h2Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      elements.push(
        <HeadingAnchor key={`h2-${i}-${id}`} level={2} id={id}>
          {renderInlineFormatting(title)}
        </HeadingAnchor>
      )
      i++
      continue
    }

    const h3Match = line.match(/^###\s+(.+)$/)
    if (h3Match) {
      const title = h3Match[1].trim()
      const cleanTitle = title.replace(/`([^`]+)`/g, "$1")
      const id = slugify(cleanTitle)
      elements.push(
        <HeadingAnchor key={`h3-${i}-${id}`} level={3} id={id}>
          {renderInlineFormatting(title)}
        </HeadingAnchor>
      )
      i++
      continue
    }

    const h4Match = line.match(/^####\s+(.+)$/)
    if (h4Match) {
      const title = h4Match[1].trim()
      elements.push(
        <h4 key={`h4-${i}`} className="mt-8 mb-2.5 text-base sm:text-[15px] font-semibold tracking-tight text-zinc-100">
          {renderInlineFormatting(title, `h4-${i}`)}
        </h4>
      )
      i++
      continue
    }

    // 7. Markdown Table: | col | col |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        elements.push(renderTable(tableLines, `table-${i}`))
      }
      continue
    }

    // 7. Unordered List: - item or * item
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length) {
        const itemLine = lines[i]
        const itemTrimmed = itemLine.trim()
        if (/^[-*]\s+/.test(itemTrimmed)) {
          listItems.push(itemTrimmed.replace(/^[-*]\s+/, ""))
          i++
        } else if (
          listItems.length > 0 &&
          itemTrimmed &&
          !itemTrimmed.startsWith("#") &&
          !itemTrimmed.startsWith("```") &&
          !itemTrimmed.startsWith(":::") &&
          !itemTrimmed.startsWith(">") &&
          !itemTrimmed.startsWith("|") &&
          !itemTrimmed.startsWith("<") &&
          !/^(?:\s*[-*_]\s*){3,}$/.test(itemTrimmed) &&
          !/^\d+\.\s+/.test(itemTrimmed) &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t"))
        ) {
          listItems[listItems.length - 1] += " " + itemTrimmed
          i++
        } else {
          break
        }
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 ml-5 list-disc space-y-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item, `ul-${i}-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    // 8. Ordered List: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length) {
        const itemLine = lines[i]
        const itemTrimmed = itemLine.trim()
        if (/^\d+\.\s+/.test(itemTrimmed)) {
          listItems.push(itemTrimmed.replace(/^\d+\.\s+/, ""))
          i++
        } else if (
          listItems.length > 0 &&
          itemTrimmed &&
          !itemTrimmed.startsWith("#") &&
          !itemTrimmed.startsWith("```") &&
          !itemTrimmed.startsWith(":::") &&
          !itemTrimmed.startsWith(">") &&
          !itemTrimmed.startsWith("|") &&
          !itemTrimmed.startsWith("<") &&
          !/^(?:\s*[-*_]\s*){3,}$/.test(itemTrimmed) &&
          !/^[-*]\s+/.test(itemTrimmed) &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t"))
        ) {
          listItems[listItems.length - 1] += " " + itemTrimmed
          i++
        } else {
          break
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 ml-5 list-decimal space-y-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInlineFormatting(item, `ol-${i}-${idx}`)}</li>
          ))}
        </ol>
      )
      continue
    }

    // 9. Standard Paragraph
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("<") &&
      !/^(?:\s*[-*_]\s*){3,}$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i].trim())
      i++
    }

    if (paragraphLines.length > 0) {
      const paragraphText = paragraphLines.join(" ")
      elements.push(
        <p key={`p-${i}`} className="my-4 text-sm sm:text-[15px] leading-relaxed text-zinc-300">
          {renderInlineFormatting(paragraphText)}
        </p>
      )
    }
  }

  return elements
}

/**
 * Render Markdown table to responsive HTML table
 */
function renderTable(tableLines: string[], key: string): React.ReactNode {
  const headerRow = tableLines[0]
  const rows = tableLines.slice(2) // Skip header and separator

  const parseCells = (line: string) =>
    line
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim())

  const headers = parseCells(headerRow)

  return (
    <div key={key} className="my-6 w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-zinc-950/60 shadow-sm">
      <table className="w-full text-left text-xs sm:text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08] bg-zinc-900/40 text-zinc-200 font-mono text-[11px] uppercase tracking-wider">
            {headers.map((h, idx) => (
              <th key={idx} className="px-4 py-3 font-semibold">
                {renderInlineFormatting(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {rows.map((rowLine, rIdx) => {
            const cells = parseCells(rowLine)
            return (
              <tr key={rIdx} className="hover:bg-zinc-900/30 transition-colors">
                {cells.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-3 text-zinc-300">
                    {renderInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Formats inline Markdown: **bold**, *italic*, ***bold italic***, `code`, [link](url), ~~strikethrough~~
 */
function renderInlineFormatting(text: string, keyPrefix = "inline"): React.ReactNode {
  if (!text) return null

  // Regex matches:
  // 1. Code: `...`
  // 2. Link: [...](...)
  // 3. Bold-Italic: ***...***
  // 4. Bold: **...**
  // 5. Italic: *...* (where * is not followed/preceded by whitespace)
  // 6. Strikethrough: ~~...~~
  const inlineRegex = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*|~~[^~]+~~)/g

  let match: RegExpExecArray | null
  let lastIndex = 0
  const nodes: React.ReactNode[] = []
  let tokenIdx = 0

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    const key = `${keyPrefix}-${tokenIdx++}`

    // 1. Inline code: `code`
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border border-zinc-800 bg-zinc-900/80 px-1.5 py-0.5 font-mono text-[12px] text-zinc-200"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    // 2. Bold + Italic: ***text***
    else if (token.startsWith("***") && token.endsWith("***") && token.length >= 6) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-100">
          <em className="italic text-zinc-200">
            {renderInlineFormatting(token.slice(3, -3), `${key}-bi`)}
          </em>
        </strong>
      )
    }
    // 3. Bold: **text**
    else if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-100">
          {renderInlineFormatting(token.slice(2, -2), `${key}-b`)}
        </strong>
      )
    }
    // 4. Strikethrough: ~~text~~
    else if (token.startsWith("~~") && token.endsWith("~~") && token.length >= 4) {
      nodes.push(
        <del key={key} className="line-through text-zinc-500">
          {renderInlineFormatting(token.slice(2, -2), `${key}-del`)}
        </del>
      )
    }
    // 5. Italic: *text*
    else if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      nodes.push(
        <em key={key} className="italic text-zinc-200">
          {renderInlineFormatting(token.slice(1, -1), `${key}-i`)}
        </em>
      )
    }
    // 6. Link: [label](href)
    else if (token.startsWith("[") && token.includes("](")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        const label = linkMatch[1]
        const href = linkMatch[2]
        const isExternal = href.startsWith("http://") || href.startsWith("https://")

        if (isExternal) {
          nodes.push(
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-white font-medium underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-colors"
            >
              {renderInlineFormatting(label, `${key}-a`)}
            </a>
          )
        } else {
          nodes.push(
            <Link
              key={key}
              href={href}
              className="text-white font-medium underline decoration-zinc-600 underline-offset-4 hover:decoration-white transition-colors"
            >
              {renderInlineFormatting(label, `${key}-l`)}
            </Link>
          )
        }
      } else {
        nodes.push(token)
      }
    } else {
      nodes.push(token)
    }

    lastIndex = inlineRegex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length === 1 ? nodes[0] : nodes
}
