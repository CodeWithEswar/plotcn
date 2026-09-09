import React from "react"
import Link from "next/link"
import katex from "katex"
import { HeadingAnchor } from "./heading-anchor"
import { DocsCallout, type CalloutType } from "./docs-callout"
import { PackageManagerTabs } from "./package-manager-tabs"
import { InstallCommand } from "@/components/registry/install-command"
import { ChartPreview } from "@/components/chart-detail/chart-preview"
import { formatCommand } from "./package-manager-utils"
import { CodeBlock } from "./code-block"
import { highlightCode } from "@/lib/shiki"
import { slugify } from "@/lib/slugify"
import { apiTableStyles, inferColumnKind } from "./api-table"
import { cn } from "@/lib/utils"
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
  ArchitectureHero,
  HighLevelArchitectureDiagram,
  ProductEquationCard,
  ArchitecturalDomainsCard,
  EnginePipelinesCard,
  GoogleLoaderArchitectureCard,
  RenderingModelsComparison,
  SharedLayerScopeCard,
  ArchitecturalBoundaryRulesCard,
  ClientServerBoundaryCard,
  ResponsiveArchitectureFlow,
  ThemeAndA11yArchitectureCard,
  RegistryAndDependencyFlow,
  ArchitecturalInvariantsCard,
  FinalSystemMentalModelDiagram,
} from "./architecture-components"
import {
  EngineStrategyHero,
  EngineTrioSummaryFlow,
  RechartsPhilosophyCard,
  RechartsRoadmapCard,
  D3CoreFlowCard,
  D3DependencyIsolationCard,
  GoogleGeoChartTreeCard,
  GoogleRuntimeBoundaryCard,
  GoogleThemeAdapterFlow,
  GoogleResponsiveLifecycleCard,
  RegistryNamingAndIsolationCard,
  GalleryAndDocsHierarchyCard,
  EngineBuildRoadmapFlow,
  EnginePrinciplesCard,
  EngineStrategyMentalModelDiagram,
} from "./engine-strategy-components"
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
import {
  StepSignalFlowDiagram,
  StepSignalTransitionModelFlow,
} from "./charts/step-signal-diagrams"
import {
  MilestoneAnnotationFlow,
  MilestoneLayerFlow,
} from "./charts/milestone-diagrams"
import {
  ThresholdModelFlow,
  ThresholdContextFlow,
} from "./charts/threshold-diagrams"
import {
  FocusModelFlow,
  FocusInspectionFlow,
} from "./charts/focus-diagrams"
import {
  MultiSignalIdentityFlow,
  MultiSignalInspectionFlow,
} from "./charts/multi-signal-diagrams"
import {
  ForecastModelFlow,
  ForecastTransitionFlow,
} from "./charts/forecast-diagrams"
import {
  AreaMagnitudeFlow,
  AreaBaselineFlow,
  AreaCrossingFlow,
  StackFlowCompositionFlow,
  StackFlowMissingModelFlow,
  PercentStreamCompositionFlow,
  PercentStreamReNormalizationFlow,
  RangeAreaEnvelopeFlow,
  RangeAreaValidityFlow,
  ComparisonAreaModelFlow,
  ComparisonVsStackFlow,
  GradientDepthModelFlow,
  BaselineAreaModelDiagram,
  BaselineAreaCrossingDiagram,
  BaselineAreaArchitectureDiagram,
} from "./charts/area-diagrams"
import {
  InteractiveAreaInspectionDiagram,
  InteractiveAreaNearestXDiagram,
  InteractiveAreaStateDiagram,
  InteractiveAreaArchitectureDiagram,
} from "./charts/interactive-area-diagrams"
import {
  SignalBarsMagnitudeDiagram,
  SignalBarsCategoryBandDiagram,
  SignalBarsGroupedIdentityDiagram,
  SignalBarsSignedZeroDiagram,
  SignalBarsArchitectureDiagram,
} from "./charts/bar-diagrams"
import {
  StackCompositionModelDiagram,
  GroupedVsStackedDiagram,
  AdditiveDataContractDiagram,
  StableStackOrderDiagram,
  MissingVsZeroVsHiddenDiagram,
  CompleteVsIncompleteCompositionDiagram,
  LegendVisibilityDiagram,
  CategorySegmentHitRegionsDiagram,
  VerticalVsHorizontalOrientationDiagram,
  RenderingArchitectureFlowDiagram,
} from "./charts/stack-ledger-diagrams"
import {
  GroupedComparisonModelDiagram,
  GroupedVsStackedComparisonDiagram,
  StableSeriesIdentityDiagram,
  MissingSeriesSlotDiagram,
  SharedQuantitativeScaleDiagram,
  CategoryBarHitRegionsDiagram,
  ResponsiveOrientationDiagram,
  GroupCompareArchitectureFlowDiagram,
} from "./charts/group-compare-diagrams"
import {
  RankingPipelineDiagram,
  TopNSemanticsDiagram,
  TieStabilityDiagram,
  HorizontalRowHitRegionDiagram,
  RankBarsArchitectureFlowDiagram,
} from "./charts/rank-bar-diagrams"
import {
  NormalizationPipelineDiagram,
  AbsoluteStackVsPercentStackDiagram,
  CompositionVsMagnitudeLossDiagram,
  RawValueVsDerivedShareDiagram,
  ZeroTotalSemanticsDiagram,
  PercentStackMissingVsZeroVsHiddenDiagram,
  LegendRenormalizationDiagram,
  PercentStackStableStackOrderDiagram,
  PercentStackHitRegionsDiagram,
  PercentStackOrientationDiagram,
  PercentStackRenderingArchitectureDiagram,
} from "./charts/percent-stack-diagrams"
import {
  DivergingModelDiagram,
  RawValueVsDeviationDiagram,
  ZeroBaselineDiagram,
  NonZeroReferenceDiagram,
  NegativeReferenceDiagram,
  SymmetricDomainDiagram,
  AboveBelowOnReferenceDiagram,
  MissingVsOnReferenceDiagram,
  DirectionNotJudgmentDiagram,
  DivergingOrientationDiagram,
  CategoryHitRegionDiagram,
  DataUpdateCrossingBaselineDiagram,
  DivergingArchitectureFlowDiagram,
} from "./charts/diverging-bars-diagrams"
import {
  BulletAnatomyDiagram,
  BelowEqualAboveTargetDiagram,
  PerCategoryTargetMarkerDiagram,
  BulletSharedScaleDiagram,
  ActualTargetDeltaDiagram,
  MissingActualVsTargetDiagram,
  ZeroTargetDiagram,
  RowHitRegionDiagram,
  ResponsiveRowRecompositionDiagram,
  BulletRenderingArchitectureDiagram,
} from "./charts/bullet-bars-diagrams"
import {
  VarianceDerivationModelDiagram,
  ActualPlanDeltaDiagram,
  ZeroVarianceBaselineDiagram,
  PositiveZeroNegativeGeometryDiagram,
  DirectionNotFavorabilityDiagram,
  NegativeInputArithmeticDiagram,
  MissingPairSemanticsDiagram,
  MixedSignSymmetricDomainDiagram,
  CategoryBandHitRegionDiagram,
  VerticalVsHorizontalCompositionDiagram,
  VarianceRenderingArchitectureDiagram,
} from "./charts/variance-bars-diagrams"
import {
  IntervalModelDiagram,
  FloatingVsBaselineBarDiagram,
  StartEndSpanAnatomyDiagram,
  BoundsValidationDiagram,
  MissingBoundsDiagram,
  NumericDomainResolutionDiagram,
  TemporalIntervalModelDiagram,
  NegativeCrossZeroDiagram,
  CategoryBandHitRegionDiagram as IntervalCategoryBandHitRegionDiagram,
  ZeroWidthInteractionDiagram,
  IntervalOrientationDiagram,
  IntervalRenderingArchitectureDiagram,
  ConventionalVsIntervalAnimationDiagram,
} from "./charts/interval-bars-diagrams"
import {
  InteractionStateMachineDiagram,
  ActiveVsLockedDiagram,
  CategoryBandVsRectangleDiagram,
  ZeroTinyBarHitRegionDiagram,
  TouchLockLifecycleDiagram,
  KeyboardTraversalDiagram,
  GroupedSeriesInspectionDiagram,
  InputHandoffDiagram,
  FocusVsActiveVsLockedDiagram,
  InteractiveLegendStateDiagram,
  OrientationInteractionDiagram,
  RenderingInteractionArchitectureDiagram,
  InteractionHierarchyDiagram,
} from "./charts/interactive-bars-diagrams"



interface MDXRendererProps {
  content: string
  slug?: string
  rawContent?: string
}

export async function MDXRenderer({ content, slug, rawContent }: MDXRendererProps) {
  const elements = await parseMarkdownToReact(content, { slug, rawContent })
  if (
    slug === "architecture" ||
    slug === "engine-strategy" ||
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
        <div className="docs-content prose-docs max-w-none text-foreground">{elements}</div>
      </InstallationProvider>
    )
  }
  return <div className="docs-content prose-docs max-w-none text-foreground">{elements}</div>
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
      const registryMatch = fullCmd.match(/\/r\/([a-z0-9-]+)\.json/)

      if (registryMatch) {
        elements.push(
          <InstallCommand key={`registry-${i}`} registryName={registryMatch[1]} />
        )
        continue
      }

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

    if (trimmed.startsWith("<ArchitectureHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ArchitectureHero>")) {
        i++
      }
      i++
      elements.push(<ArchitectureHero key={`arch-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<HighLevelArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</HighLevelArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<HighLevelArchitectureDiagram key={`hl-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ProductEquationCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ProductEquationCard>")) {
        i++
      }
      i++
      elements.push(<ProductEquationCard key={`prod-eq-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ArchitecturalDomainsCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ArchitecturalDomainsCard>")) {
        i++
      }
      i++
      elements.push(<ArchitecturalDomainsCard key={`arch-dom-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EnginePipelinesCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EnginePipelinesCard>")) {
        i++
      }
      i++
      elements.push(<EnginePipelinesCard key={`eng-pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleLoaderArchitectureCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleLoaderArchitectureCard>")) {
        i++
      }
      i++
      elements.push(<GoogleLoaderArchitectureCard key={`gc-load-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RenderingModelsComparison")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RenderingModelsComparison>")) {
        i++
      }
      i++
      elements.push(<RenderingModelsComparison key={`rend-mod-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SharedLayerScopeCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SharedLayerScopeCard>")) {
        i++
      }
      i++
      elements.push(<SharedLayerScopeCard key={`sh-scope-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ArchitecturalBoundaryRulesCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ArchitecturalBoundaryRulesCard>")) {
        i++
      }
      i++
      elements.push(<ArchitecturalBoundaryRulesCard key={`bound-rules-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ClientServerBoundaryCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ClientServerBoundaryCard>")) {
        i++
      }
      i++
      elements.push(<ClientServerBoundaryCard key={`cs-bound-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ResponsiveArchitectureFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ResponsiveArchitectureFlow>")) {
        i++
      }
      i++
      elements.push(<ResponsiveArchitectureFlow key={`resp-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThemeAndA11yArchitectureCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThemeAndA11yArchitectureCard>")) {
        i++
      }
      i++
      elements.push(<ThemeAndA11yArchitectureCard key={`theme-a11y-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryAndDependencyFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryAndDependencyFlow>")) {
        i++
      }
      i++
      elements.push(<RegistryAndDependencyFlow key={`reg-dep-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ArchitecturalInvariantsCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ArchitecturalInvariantsCard>")) {
        i++
      }
      i++
      elements.push(<ArchitecturalInvariantsCard key={`arch-inv-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FinalSystemMentalModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FinalSystemMentalModelDiagram>")) {
        i++
      }
      i++
      elements.push(<FinalSystemMentalModelDiagram key={`fin-ment-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineStrategyHero")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineStrategyHero>")) {
        i++
      }
      i++
      elements.push(<EngineStrategyHero key={`eng-strat-hero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineTrioSummaryFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineTrioSummaryFlow>")) {
        i++
      }
      i++
      elements.push(<EngineTrioSummaryFlow key={`eng-trio-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RechartsPhilosophyCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RechartsPhilosophyCard>")) {
        i++
      }
      i++
      elements.push(<RechartsPhilosophyCard key={`rech-phil-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RechartsRoadmapCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RechartsRoadmapCard>")) {
        i++
      }
      i++
      elements.push(<RechartsRoadmapCard key={`rech-road-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<D3CoreFlowCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</D3CoreFlowCard>")) {
        i++
      }
      i++
      elements.push(<D3CoreFlowCard key={`d3-core-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<D3DependencyIsolationCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</D3DependencyIsolationCard>")) {
        i++
      }
      i++
      elements.push(<D3DependencyIsolationCard key={`d3-dep-iso-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleGeoChartTreeCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleGeoChartTreeCard>")) {
        i++
      }
      i++
      elements.push(<GoogleGeoChartTreeCard key={`gc-geo-tree-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleRuntimeBoundaryCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleRuntimeBoundaryCard>")) {
        i++
      }
      i++
      elements.push(<GoogleRuntimeBoundaryCard key={`gc-run-bound-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleThemeAdapterFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleThemeAdapterFlow>")) {
        i++
      }
      i++
      elements.push(<GoogleThemeAdapterFlow key={`gc-theme-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GoogleResponsiveLifecycleCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GoogleResponsiveLifecycleCard>")) {
        i++
      }
      i++
      elements.push(<GoogleResponsiveLifecycleCard key={`gc-resp-life-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RegistryNamingAndIsolationCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RegistryNamingAndIsolationCard>")) {
        i++
      }
      i++
      elements.push(<RegistryNamingAndIsolationCard key={`reg-name-iso-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GalleryAndDocsHierarchyCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GalleryAndDocsHierarchyCard>")) {
        i++
      }
      i++
      elements.push(<GalleryAndDocsHierarchyCard key={`gal-doc-hier-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineBuildRoadmapFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineBuildRoadmapFlow>")) {
        i++
      }
      i++
      elements.push(<EngineBuildRoadmapFlow key={`eng-build-road-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EnginePrinciplesCard")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EnginePrinciplesCard>")) {
        i++
      }
      i++
      elements.push(<EnginePrinciplesCard key={`eng-princ-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<EngineStrategyMentalModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</EngineStrategyMentalModelDiagram>")) {
        i++
      }
      i++
      elements.push(<EngineStrategyMentalModelDiagram key={`eng-strat-ment-${i}`} />)
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

    if (trimmed.startsWith("<StepSignalFlowDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StepSignalFlowDiagram>")) {
        i++
      }
      i++
      elements.push(<StepSignalFlowDiagram key={`step-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StepSignalTransitionModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StepSignalTransitionModelFlow>")) {
        i++
      }
      i++
      elements.push(<StepSignalTransitionModelFlow key={`step-trans-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MilestoneAnnotationFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MilestoneAnnotationFlow>")) {
        i++
      }
      i++
      elements.push(<MilestoneAnnotationFlow key={`milestone-ann-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MilestoneLayerFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MilestoneLayerFlow>")) {
        i++
      }
      i++
      elements.push(<MilestoneLayerFlow key={`milestone-layer-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThresholdModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThresholdModelFlow>")) {
        i++
      }
      i++
      elements.push(<ThresholdModelFlow key={`threshold-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ThresholdContextFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ThresholdContextFlow>")) {
        i++
      }
      i++
      elements.push(<ThresholdContextFlow key={`threshold-ctx-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FocusModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FocusModelFlow>")) {
        i++
      }
      i++
      elements.push(<FocusModelFlow key={`focus-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FocusInspectionFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FocusInspectionFlow>")) {
        i++
      }
      i++
      elements.push(<FocusInspectionFlow key={`focus-inspect-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MultiSignalIdentityFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MultiSignalIdentityFlow>")) {
        i++
      }
      i++
      elements.push(<MultiSignalIdentityFlow key={`multi-signal-identity-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MultiSignalInspectionFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MultiSignalInspectionFlow>")) {
        i++
      }
      i++
      elements.push(<MultiSignalInspectionFlow key={`multi-signal-inspect-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ForecastModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ForecastModelFlow>")) {
        i++
      }
      i++
      elements.push(<ForecastModelFlow key={`forecast-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ForecastTransitionFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ForecastTransitionFlow>")) {
        i++
      }
      i++
      elements.push(<ForecastTransitionFlow key={`forecast-trans-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AreaMagnitudeFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AreaMagnitudeFlow>")) {
        i++
      }
      i++
      elements.push(<AreaMagnitudeFlow key={`area-magnitude-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AreaBaselineFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AreaBaselineFlow>")) {
        i++
      }
      i++
      elements.push(<AreaBaselineFlow key={`area-baseline-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AreaCrossingFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AreaCrossingFlow>")) {
        i++
      }
      i++
      elements.push(<AreaCrossingFlow key={`area-crossing-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StackFlowCompositionFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StackFlowCompositionFlow>")) {
        i++
      }
      i++
      elements.push(<StackFlowCompositionFlow key={`stack-comp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StackFlowMissingModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StackFlowMissingModelFlow>")) {
        i++
      }
      i++
      elements.push(<StackFlowMissingModelFlow key={`stack-missing-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStreamCompositionFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStreamCompositionFlow>")) {
        i++
      }
      i++
      elements.push(<PercentStreamCompositionFlow key={`percent-comp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStreamReNormalizationFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStreamReNormalizationFlow>")) {
        i++
      }
      i++
      elements.push(<PercentStreamReNormalizationFlow key={`percent-renorm-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RangeAreaEnvelopeFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RangeAreaEnvelopeFlow>")) {
        i++
      }
      i++
      elements.push(<RangeAreaEnvelopeFlow key={`range-envelope-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RangeAreaValidityFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RangeAreaValidityFlow>")) {
        i++
      }
      i++
      elements.push(<RangeAreaValidityFlow key={`range-validity-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ComparisonAreaModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ComparisonAreaModelFlow>")) {
        i++
      }
      i++
      elements.push(<ComparisonAreaModelFlow key={`comp-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ComparisonVsStackFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ComparisonVsStackFlow>")) {
        i++
      }
      i++
      elements.push(<ComparisonVsStackFlow key={`comp-stack-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GradientDepthModelFlow")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GradientDepthModelFlow>")) {
        i++
      }
      i++
      elements.push(<GradientDepthModelFlow key={`grad-depth-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BaselineAreaModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BaselineAreaModelDiagram>")) {
        i++
      }
      i++
      elements.push(<BaselineAreaModelDiagram key={`baseline-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BaselineAreaCrossingDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BaselineAreaCrossingDiagram>")) {
        i++
      }
      i++
      elements.push(<BaselineAreaCrossingDiagram key={`baseline-crossing-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BaselineAreaArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BaselineAreaArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<BaselineAreaArchitectureDiagram key={`baseline-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractiveAreaInspectionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractiveAreaInspectionDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractiveAreaInspectionDiagram key={`interactive-inspect-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractiveAreaNearestXDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractiveAreaNearestXDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractiveAreaNearestXDiagram key={`interactive-nearestx-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractiveAreaStateDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractiveAreaStateDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractiveAreaStateDiagram key={`interactive-state-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractiveAreaArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractiveAreaArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractiveAreaArchitectureDiagram key={`interactive-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SignalBarsMagnitudeDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SignalBarsMagnitudeDiagram>")) {
        i++
      }
      i++
      elements.push(<SignalBarsMagnitudeDiagram key={`signalbars-mag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SignalBarsCategoryBandDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SignalBarsCategoryBandDiagram>")) {
        i++
      }
      i++
      elements.push(<SignalBarsCategoryBandDiagram key={`signalbars-band-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SignalBarsGroupedIdentityDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SignalBarsGroupedIdentityDiagram>")) {
        i++
      }
      i++
      elements.push(<SignalBarsGroupedIdentityDiagram key={`signalbars-grouped-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SignalBarsSignedZeroDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SignalBarsSignedZeroDiagram>")) {
        i++
      }
      i++
      elements.push(<SignalBarsSignedZeroDiagram key={`signalbars-signed-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SignalBarsArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SignalBarsArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<SignalBarsArchitectureDiagram key={`signalbars-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StackCompositionModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StackCompositionModelDiagram>")) {
        i++
      }
      i++
      elements.push(<StackCompositionModelDiagram key={`stack-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GroupedVsStackedDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GroupedVsStackedDiagram>")) {
        i++
      }
      i++
      elements.push(<GroupedVsStackedDiagram key={`grouped-stacked-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AdditiveDataContractDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AdditiveDataContractDiagram>")) {
        i++
      }
      i++
      elements.push(<AdditiveDataContractDiagram key={`additive-contract-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StableStackOrderDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StableStackOrderDiagram>")) {
        i++
      }
      i++
      elements.push(<StableStackOrderDiagram key={`stable-order-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingVsZeroVsHiddenDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingVsZeroVsHiddenDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingVsZeroVsHiddenDiagram key={`mzh-diagram-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CompleteVsIncompleteCompositionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CompleteVsIncompleteCompositionDiagram>")) {
        i++
      }
      i++
      elements.push(<CompleteVsIncompleteCompositionDiagram key={`comp-incomp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<LegendVisibilityDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</LegendVisibilityDiagram>")) {
        i++
      }
      i++
      elements.push(<LegendVisibilityDiagram key={`legend-vis-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CategorySegmentHitRegionsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CategorySegmentHitRegionsDiagram>")) {
        i++
      }
      i++
      elements.push(<CategorySegmentHitRegionsDiagram key={`hit-regions-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VerticalVsHorizontalOrientationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VerticalVsHorizontalOrientationDiagram>")) {
        i++
      }
      i++
      elements.push(<VerticalVsHorizontalOrientationDiagram key={`orientation-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RenderingArchitectureFlowDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RenderingArchitectureFlowDiagram>")) {
        i++
      }
      i++
      elements.push(<RenderingArchitectureFlowDiagram key={`arch-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GroupedComparisonModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GroupedComparisonModelDiagram>")) {
        i++
      }
      i++
      elements.push(<GroupedComparisonModelDiagram key={`group-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GroupedVsStackedComparisonDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GroupedVsStackedComparisonDiagram>")) {
        i++
      }
      i++
      elements.push(<GroupedVsStackedComparisonDiagram key={`group-vs-stacked-comp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StableSeriesIdentityDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StableSeriesIdentityDiagram>")) {
        i++
      }
      i++
      elements.push(<StableSeriesIdentityDiagram key={`stable-identity-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingSeriesSlotDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingSeriesSlotDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingSeriesSlotDiagram key={`missing-slot-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SharedQuantitativeScaleDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SharedQuantitativeScaleDiagram>")) {
        i++
      }
      i++
      elements.push(<SharedQuantitativeScaleDiagram key={`shared-scale-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CategoryBarHitRegionsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CategoryBarHitRegionsDiagram>")) {
        i++
      }
      i++
      elements.push(<CategoryBarHitRegionsDiagram key={`category-hit-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ResponsiveOrientationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ResponsiveOrientationDiagram>")) {
        i++
      }
      i++
      elements.push(<ResponsiveOrientationDiagram key={`resp-orientation-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GroupCompareArchitectureFlowDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GroupCompareArchitectureFlowDiagram>")) {
        i++
      }
      i++
      elements.push(<GroupCompareArchitectureFlowDiagram key={`gc-arch-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RankingPipelineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RankingPipelineDiagram>")) {
        i++
      }
      i++
      elements.push(<RankingPipelineDiagram key={`rank-pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TopNSemanticsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TopNSemanticsDiagram>")) {
        i++
      }
      i++
      elements.push(<TopNSemanticsDiagram key={`top-n-sem-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TieStabilityDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TieStabilityDiagram>")) {
        i++
      }
      i++
      elements.push(<TieStabilityDiagram key={`tie-stab-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<HorizontalRowHitRegionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</HorizontalRowHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<HorizontalRowHitRegionDiagram key={`row-hit-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RankBarsArchitectureFlowDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RankBarsArchitectureFlowDiagram>")) {
        i++
      }
      i++
      elements.push(<RankBarsArchitectureFlowDiagram key={`rank-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ComponentPreview")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ComponentPreview>")) {
        i++
      }
      i++
      continue
    }

    if (trimmed.startsWith("<NormalizationPipelineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NormalizationPipelineDiagram>")) {
        i++
      }
      i++
      elements.push(<NormalizationPipelineDiagram key={`norm-pipe-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AbsoluteStackVsPercentStackDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AbsoluteStackVsPercentStackDiagram>")) {
        i++
      }
      i++
      elements.push(<AbsoluteStackVsPercentStackDiagram key={`abs-vs-pct-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CompositionVsMagnitudeLossDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CompositionVsMagnitudeLossDiagram>")) {
        i++
      }
      i++
      elements.push(<CompositionVsMagnitudeLossDiagram key={`mag-loss-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RawValueVsDerivedShareDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RawValueVsDerivedShareDiagram>")) {
        i++
      }
      i++
      elements.push(<RawValueVsDerivedShareDiagram key={`raw-share-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroTotalSemanticsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroTotalSemanticsDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroTotalSemanticsDiagram key={`zero-total-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStackMissingVsZeroVsHiddenDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStackMissingVsZeroVsHiddenDiagram>")) {
        i++
      }
      i++
      elements.push(<PercentStackMissingVsZeroVsHiddenDiagram key={`ps-missing-zero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<LegendRenormalizationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</LegendRenormalizationDiagram>")) {
        i++
      }
      i++
      elements.push(<LegendRenormalizationDiagram key={`legend-renorm-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStackStableStackOrderDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStackStableStackOrderDiagram>")) {
        i++
      }
      i++
      elements.push(<PercentStackStableStackOrderDiagram key={`ps-stable-order-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStackHitRegionsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStackHitRegionsDiagram>")) {
        i++
      }
      i++
      elements.push(<PercentStackHitRegionsDiagram key={`ps-cat-hit-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStackOrientationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStackOrientationDiagram>")) {
        i++
      }
      i++
      elements.push(<PercentStackOrientationDiagram key={`ps-orient-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PercentStackRenderingArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PercentStackRenderingArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<PercentStackRenderingArchitectureDiagram key={`ps-arch-flow-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DivergingModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DivergingModelDiagram>")) {
        i++
      }
      i++
      elements.push(<DivergingModelDiagram key={`div-model-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RawValueVsDeviationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RawValueVsDeviationDiagram>")) {
        i++
      }
      i++
      elements.push(<RawValueVsDeviationDiagram key={`raw-vs-dev-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroBaselineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroBaselineDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroBaselineDiagram key={`zero-base-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NonZeroReferenceDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NonZeroReferenceDiagram>")) {
        i++
      }
      i++
      elements.push(<NonZeroReferenceDiagram key={`nonzero-ref-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NegativeReferenceDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NegativeReferenceDiagram>")) {
        i++
      }
      i++
      elements.push(<NegativeReferenceDiagram key={`neg-ref-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<SymmetricDomainDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</SymmetricDomainDiagram>")) {
        i++
      }
      i++
      elements.push(<SymmetricDomainDiagram key={`symm-dom-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<AboveBelowOnReferenceDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</AboveBelowOnReferenceDiagram>")) {
        i++
      }
      i++
      elements.push(<AboveBelowOnReferenceDiagram key={`above-below-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingVsOnReferenceDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingVsOnReferenceDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingVsOnReferenceDiagram key={`missing-on-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DirectionNotJudgmentDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DirectionNotJudgmentDiagram>")) {
        i++
      }
      i++
      elements.push(<DirectionNotJudgmentDiagram key={`dir-not-judg-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DivergingOrientationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DivergingOrientationDiagram>")) {
        i++
      }
      i++
      elements.push(<DivergingOrientationDiagram key={`div-orient-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CategoryHitRegionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CategoryHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<CategoryHitRegionDiagram key={`cat-hit-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DataUpdateCrossingBaselineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DataUpdateCrossingBaselineDiagram>")) {
        i++
      }
      i++
      elements.push(<DataUpdateCrossingBaselineDiagram key={`data-cross-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DivergingArchitectureFlowDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DivergingArchitectureFlowDiagram>")) {
        i++
      }
      i++
      elements.push(<DivergingArchitectureFlowDiagram key={`div-arch-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BulletAnatomyDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BulletAnatomyDiagram>")) {
        i++
      }
      i++
      elements.push(<BulletAnatomyDiagram key={`bullet-anat-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BelowEqualAboveTargetDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BelowEqualAboveTargetDiagram>")) {
        i++
      }
      i++
      elements.push(<BelowEqualAboveTargetDiagram key={`below-eq-above-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PerCategoryTargetMarkerDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PerCategoryTargetMarkerDiagram>")) {
        i++
      }
      i++
      elements.push(<PerCategoryTargetMarkerDiagram key={`per-cat-target-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BulletSharedScaleDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BulletSharedScaleDiagram>")) {
        i++
      }
      i++
      elements.push(<BulletSharedScaleDiagram key={`bullet-shared-scale-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ActualTargetDeltaDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ActualTargetDeltaDiagram>")) {
        i++
      }
      i++
      elements.push(<ActualTargetDeltaDiagram key={`act-target-delta-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingActualVsTargetDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingActualVsTargetDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingActualVsTargetDiagram key={`missing-act-target-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroTargetDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroTargetDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroTargetDiagram key={`zero-target-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RowHitRegionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RowHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<RowHitRegionDiagram key={`row-hit-reg-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ResponsiveRowRecompositionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ResponsiveRowRecompositionDiagram>")) {
        i++
      }
      i++
      elements.push(<ResponsiveRowRecompositionDiagram key={`resp-row-recomp-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BulletRenderingArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BulletRenderingArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<BulletRenderingArchitectureDiagram key={`bullet-arch-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VarianceDerivationModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VarianceDerivationModelDiagram>")) {
        i++
      }
      i++
      elements.push(<VarianceDerivationModelDiagram key={`var-deriv-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ActualPlanDeltaDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ActualPlanDeltaDiagram>")) {
        i++
      }
      i++
      elements.push(<ActualPlanDeltaDiagram key={`act-plan-delta-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroVarianceBaselineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroVarianceBaselineDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroVarianceBaselineDiagram key={`zero-var-base-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<PositiveZeroNegativeGeometryDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</PositiveZeroNegativeGeometryDiagram>")) {
        i++
      }
      i++
      elements.push(<PositiveZeroNegativeGeometryDiagram key={`pos-zero-neg-geom-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<DirectionNotFavorabilityDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</DirectionNotFavorabilityDiagram>")) {
        i++
      }
      i++
      elements.push(<DirectionNotFavorabilityDiagram key={`dir-not-fav-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NegativeInputArithmeticDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NegativeInputArithmeticDiagram>")) {
        i++
      }
      i++
      elements.push(<NegativeInputArithmeticDiagram key={`neg-in-arith-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingPairSemanticsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingPairSemanticsDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingPairSemanticsDiagram key={`miss-pair-sem-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MixedSignSymmetricDomainDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MixedSignSymmetricDomainDiagram>")) {
        i++
      }
      i++
      elements.push(<MixedSignSymmetricDomainDiagram key={`mix-sign-symm-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CategoryBandHitRegionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CategoryBandHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<CategoryBandHitRegionDiagram key={`cat-band-hit-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VerticalVsHorizontalCompositionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VerticalVsHorizontalCompositionDiagram>")) {
        i++
      }
      i++
      elements.push(<VerticalVsHorizontalCompositionDiagram key={`vert-vs-horiz-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<VarianceRenderingArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</VarianceRenderingArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<VarianceRenderingArchitectureDiagram key={`var-arch-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<IntervalModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</IntervalModelDiagram>")) {
        i++
      }
      i++
      elements.push(<IntervalModelDiagram key={`int-model-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FloatingVsBaselineBarDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FloatingVsBaselineBarDiagram>")) {
        i++
      }
      i++
      elements.push(<FloatingVsBaselineBarDiagram key={`flt-vs-base-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<StartEndSpanAnatomyDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</StartEndSpanAnatomyDiagram>")) {
        i++
      }
      i++
      elements.push(<StartEndSpanAnatomyDiagram key={`start-end-anat-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<BoundsValidationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</BoundsValidationDiagram>")) {
        i++
      }
      i++
      elements.push(<BoundsValidationDiagram key={`bnd-val-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<MissingBoundsDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</MissingBoundsDiagram>")) {
        i++
      }
      i++
      elements.push(<MissingBoundsDiagram key={`miss-bnd-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NumericDomainResolutionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NumericDomainResolutionDiagram>")) {
        i++
      }
      i++
      elements.push(<NumericDomainResolutionDiagram key={`num-dom-res-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TemporalIntervalModelDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TemporalIntervalModelDiagram>")) {
        i++
      }
      i++
      elements.push(<TemporalIntervalModelDiagram key={`temp-int-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<NegativeCrossZeroDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</NegativeCrossZeroDiagram>")) {
        i++
      }
      i++
      elements.push(<NegativeCrossZeroDiagram key={`neg-cross-zero-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<IntervalCategoryBandHitRegionDiagram") || trimmed.startsWith("<CategoryBandHitRegionDiagram") && trimmed.includes("interval")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</IntervalCategoryBandHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<IntervalCategoryBandHitRegionDiagram key={`int-cat-band-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroWidthInteractionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroWidthInteractionDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroWidthInteractionDiagram key={`zero-w-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<IntervalOrientationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</IntervalOrientationDiagram>")) {
        i++
      }
      i++
      elements.push(<IntervalOrientationDiagram key={`int-orient-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<IntervalRenderingArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</IntervalRenderingArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<IntervalRenderingArchitectureDiagram key={`int-arch-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ConventionalVsIntervalAnimationDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ConventionalVsIntervalAnimationDiagram>")) {
        i++
      }
      i++
      elements.push(<ConventionalVsIntervalAnimationDiagram key={`conv-vs-int-anim-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractionStateMachineDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractionStateMachineDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractionStateMachineDiagram key={`state-mach-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ActiveVsLockedDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ActiveVsLockedDiagram>")) {
        i++
      }
      i++
      elements.push(<ActiveVsLockedDiagram key={`act-vs-lock-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<CategoryBandVsRectangleDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</CategoryBandVsRectangleDiagram>")) {
        i++
      }
      i++
      elements.push(<CategoryBandVsRectangleDiagram key={`band-vs-rect-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<ZeroTinyBarHitRegionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ZeroTinyBarHitRegionDiagram>")) {
        i++
      }
      i++
      elements.push(<ZeroTinyBarHitRegionDiagram key={`zero-tiny-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<TouchLockLifecycleDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</TouchLockLifecycleDiagram>")) {
        i++
      }
      i++
      elements.push(<TouchLockLifecycleDiagram key={`touch-lock-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<KeyboardTraversalDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</KeyboardTraversalDiagram>")) {
        i++
      }
      i++
      elements.push(<KeyboardTraversalDiagram key={`key-trav-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<GroupedSeriesInspectionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</GroupedSeriesInspectionDiagram>")) {
        i++
      }
      i++
      elements.push(<GroupedSeriesInspectionDiagram key={`grp-series-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InputHandoffDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InputHandoffDiagram>")) {
        i++
      }
      i++
      elements.push(<InputHandoffDiagram key={`inp-handoff-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<FocusVsActiveVsLockedDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</FocusVsActiveVsLockedDiagram>")) {
        i++
      }
      i++
      elements.push(<FocusVsActiveVsLockedDiagram key={`foc-act-lock-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractiveLegendStateDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractiveLegendStateDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractiveLegendStateDiagram key={`int-leg-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<OrientationInteractionDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</OrientationInteractionDiagram>")) {
        i++
      }
      i++
      elements.push(<OrientationInteractionDiagram key={`orient-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<RenderingInteractionArchitectureDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</RenderingInteractionArchitectureDiagram>")) {
        i++
      }
      i++
      elements.push(<RenderingInteractionArchitectureDiagram key={`render-arch-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InteractionHierarchyDiagram")) {
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InteractionHierarchyDiagram>")) {
        i++
      }
      i++
      elements.push(<InteractionHierarchyDiagram key={`interact-hier-diag-${i}`} />)
      continue
    }

    if (trimmed.startsWith("<InstallCommand")) {
      const tagContent = trimmed
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</InstallCommand>")) {
        i++
      }
      i++
      const match = tagContent.match(/registryName=["']([^"']+)["']/) || tagContent.match(/name=["']([^"']+)["']/)
      const regName = match ? match[1] : (context?.slug || "")
      if (regName) {
        elements.push(<InstallCommand key={`install-cmd-${i}`} registryName={regName} />)
      }
      continue
    }

    if (trimmed.startsWith("<ChartPreview")) {
      const tagContent = trimmed
      while (i < lines.length && !lines[i].includes("/>") && !lines[i].includes("</ChartPreview>")) {
        i++
      }
      i++
      const match = tagContent.match(/registryName=["']([^"']+)["']/) || tagContent.match(/name=["']([^"']+)["']/)
      const regName = match ? match[1] : (context?.slug || "")
      if (regName) {
        elements.push(<ChartPreview key={`chart-prev-${i}`} registryName={regName} />)
      }
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
      interface ListItemNode {
        text: string
        subItems: { text: string; subType: "ul" | "ol" }[]
      }
      const listItems: ListItemNode[] = []

      while (i < lines.length) {
        const itemLine = lines[i]
        const itemTrimmed = itemLine.trim()

        if (!itemTrimmed) {
          let lookAhead = i + 1
          while (lookAhead < lines.length && !lines[lookAhead].trim()) {
            lookAhead++
          }
          if (lookAhead < lines.length) {
            const nextLine = lines[lookAhead]
            const nextTrimmed = nextLine.trim()
            if (
              /^[-*]\s+/.test(nextTrimmed) ||
              ((nextLine.startsWith("  ") || nextLine.startsWith("\t")) && /^[-*]\s+/.test(nextTrimmed))
            ) {
              i = lookAhead
              continue
            }
          }
          break
        }

        // Top-level bullet: - ... or * ...
        if (/^[-*]\s+/.test(itemTrimmed) && !itemLine.startsWith("  ") && !itemLine.startsWith("\t")) {
          listItems.push({
            text: itemTrimmed.replace(/^[-*]\s+/, ""),
            subItems: [],
          })
          i++
        }
        // Indented sub-bullet: "   - ..." or "  * ..."
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          /^[-*]\s+/.test(itemTrimmed)
        ) {
          listItems[listItems.length - 1].subItems.push({
            text: itemTrimmed.replace(/^[-*]\s+/, ""),
            subType: "ul",
          })
          i++
        }
        // Indented sub-number: "   1. ..."
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          /^\d+\.\s+/.test(itemTrimmed)
        ) {
          listItems[listItems.length - 1].subItems.push({
            text: itemTrimmed.replace(/^\d+\.\s+/, ""),
            subType: "ol",
          })
          i++
        }
        // Indented continuation line
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          !itemTrimmed.startsWith("#") &&
          !itemTrimmed.startsWith("```") &&
          !itemTrimmed.startsWith(":::") &&
          !itemTrimmed.startsWith(">") &&
          !itemTrimmed.startsWith("|") &&
          !itemTrimmed.startsWith("<") &&
          !/^(?:\s*[-*_]\s*){3,}$/.test(itemTrimmed)
        ) {
          const currentItem = listItems[listItems.length - 1]
          if (currentItem.subItems.length > 0) {
            currentItem.subItems[currentItem.subItems.length - 1].text += " " + itemTrimmed
          } else {
            currentItem.text += " " + itemTrimmed
          }
          i++
        } else {
          break
        }
      }

      elements.push(
        <ul
          key={`ul-${i}`}
          className="my-4 ml-5 list-disc space-y-2 text-sm sm:text-[15px] leading-relaxed text-zinc-300 marker:text-zinc-500"
        >
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1">
              <div>{renderInlineFormatting(item.text, `ul-${i}-${idx}`)}</div>
              {item.subItems.length > 0 && (
                <ul className="my-2 ml-4 list-[circle] space-y-1.5 text-sm text-zinc-400 marker:text-zinc-600">
                  {item.subItems.map((sub, sIdx) => (
                    <li key={sIdx} className="pl-1">
                      {renderInlineFormatting(sub.text, `ul-sub-${i}-${idx}-${sIdx}`)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // 8. Ordered List: 1. item
    if (/^\d+\.\s+/.test(trimmed)) {
      const startMatch = trimmed.match(/^(\d+)\.\s+/)
      const startNumber = startMatch ? parseInt(startMatch[1], 10) : 1
      interface ListItemNode {
        text: string
        subItems: { text: string; subType: "ul" | "ol" }[]
      }
      const listItems: ListItemNode[] = []

      while (i < lines.length) {
        const itemLine = lines[i]
        const itemTrimmed = itemLine.trim()

        if (!itemTrimmed) {
          let lookAhead = i + 1
          while (lookAhead < lines.length && !lines[lookAhead].trim()) {
            lookAhead++
          }
          if (lookAhead < lines.length) {
            const nextLine = lines[lookAhead]
            const nextTrimmed = nextLine.trim()
            if (
              /^\d+\.\s+/.test(nextTrimmed) ||
              ((nextLine.startsWith("  ") || nextLine.startsWith("\t")) && /^[-*]\s+/.test(nextTrimmed))
            ) {
              i = lookAhead
              continue
            }
          }
          break
        }

        // Top-level ordered item: 1. ... or 2. ...
        if (/^\d+\.\s+/.test(itemTrimmed) && !itemLine.startsWith("  ") && !itemLine.startsWith("\t")) {
          listItems.push({
            text: itemTrimmed.replace(/^\d+\.\s+/, ""),
            subItems: [],
          })
          i++
        }
        // Indented sub-bullet: "   - ..." or "  * ..."
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          /^[-*]\s+/.test(itemTrimmed)
        ) {
          listItems[listItems.length - 1].subItems.push({
            text: itemTrimmed.replace(/^[-*]\s+/, ""),
            subType: "ul",
          })
          i++
        }
        // Indented sub-number: "   1. ..."
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          /^\d+\.\s+/.test(itemTrimmed)
        ) {
          listItems[listItems.length - 1].subItems.push({
            text: itemTrimmed.replace(/^\d+\.\s+/, ""),
            subType: "ol",
          })
          i++
        }
        // Indented continuation line
        else if (
          listItems.length > 0 &&
          (itemLine.startsWith("  ") || itemLine.startsWith("\t")) &&
          !itemTrimmed.startsWith("#") &&
          !itemTrimmed.startsWith("```") &&
          !itemTrimmed.startsWith(":::") &&
          !itemTrimmed.startsWith(">") &&
          !itemTrimmed.startsWith("|") &&
          !itemTrimmed.startsWith("<") &&
          !/^(?:\s*[-*_]\s*){3,}$/.test(itemTrimmed)
        ) {
          const currentItem = listItems[listItems.length - 1]
          if (currentItem.subItems.length > 0) {
            currentItem.subItems[currentItem.subItems.length - 1].text += " " + itemTrimmed
          } else {
            currentItem.text += " " + itemTrimmed
          }
          i++
        } else {
          break
        }
      }

      elements.push(
        <ol
          key={`ol-${i}`}
          start={startNumber !== 1 ? startNumber : undefined}
          className="my-4 ml-5 list-decimal space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-zinc-300 marker:text-zinc-400 marker:font-mono"
        >
          {listItems.map((item, idx) => (
            <li key={idx} className="pl-1">
              <div>{renderInlineFormatting(item.text, `ol-${i}-${idx}`)}</div>
              {item.subItems.length > 0 && (
                <ul className="my-2 ml-4 list-disc space-y-1.5 text-sm text-zinc-400 marker:text-zinc-500">
                  {item.subItems.map((sub, sIdx) => (
                    <li key={sIdx} className="pl-1">
                      {renderInlineFormatting(sub.text, `ol-sub-${i}-${idx}-${sIdx}`)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // 8.5. Math Block: $$ ... $$
    if (trimmed.startsWith("$$")) {
      let mathContent = ""
      if (trimmed === "$$") {
        i++
        const mathLines: string[] = []
        while (i < lines.length && lines[i].trim() !== "$$") {
          mathLines.push(lines[i])
          i++
        }
        if (i < lines.length && lines[i].trim() === "$$") {
          i++ // skip closing $$
        }
        mathContent = mathLines.join("\n").trim()
      } else if (trimmed.slice(2).includes("$$")) {
        const afterOpen = trimmed.slice(2)
        const closeIdx = afterOpen.indexOf("$$")
        mathContent = afterOpen.slice(0, closeIdx).trim()
        i++
      } else {
        const mathLines: string[] = [trimmed.slice(2)]
        i++
        while (i < lines.length && !lines[i].trim().includes("$$")) {
          mathLines.push(lines[i])
          i++
        }
        if (i < lines.length) {
          const lastLine = lines[i].trim()
          const closeIdx = lastLine.indexOf("$$")
          mathLines.push(lastLine.slice(0, closeIdx))
          i++
        }
        mathContent = mathLines.join("\n").trim()
      }

      if (mathContent) {
        try {
          const html = katex.renderToString(mathContent, {
            displayMode: true,
            throwOnError: false,
          })
          elements.push(
            <div
              key={`math-block-${i}`}
              className="my-6 overflow-x-auto py-3 px-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 flex justify-center text-zinc-100 shadow-sm not-prose"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        } catch {
          elements.push(
            <div
              key={`math-err-${i}`}
              className="my-6 overflow-x-auto py-2 font-mono text-xs text-zinc-300 flex justify-center"
            >
              $${mathContent}$$
            </div>
          )
        }
        continue
      }
    }

    // 9. Standard Paragraph
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith("$$") &&
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
    } else {
      // Advance i to guarantee loop termination if line wasn't handled
      i++
    }
  }

  return elements
}

/**
 * Safely parse a markdown table row into cells, respecting:
 * - Escaped pipes (\|)
 * - Inline code fences (`...` or ``...``) containing pipes
 */
export function parseMarkdownTableRow(line: string): string[] {
  let trimmed = line.trim()
  if (trimmed.startsWith("|")) {
    trimmed = trimmed.slice(1)
  }
  if (trimmed.endsWith("|")) {
    trimmed = trimmed.slice(0, -1)
  }

  const cells: string[] = []
  let current = ""
  let inCode = false
  let codeFenceLength = 0
  let escaped = false

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]

    if (escaped) {
      if (char === "|") {
        current += "|"
      } else {
        current += "\\" + char
      }
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if (char === "`") {
      current += char
      let count = 1
      while (i + 1 < trimmed.length && trimmed[i + 1] === "`") {
        current += "`"
        count++
        i++
      }
      if (!inCode) {
        inCode = true
        codeFenceLength = count
      } else if (codeFenceLength === count) {
        inCode = false
        codeFenceLength = 0
      }
      continue
    }

    if (char === "|" && !inCode) {
      cells.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  if (escaped) {
    current += "\\"
  }
  cells.push(current.trim())

  return cells
}

function getColumnWidths(headers: string[]): string[] {
  const count = headers.length
  if (count === 5) {
    // Prop | Type | Default | Required | Description
    return ["18%", "24%", "12%", "10%", "36%"]
  }
  if (count === 4) {
    const h0 = headers[0].toLowerCase()
    if (h0.includes("prop") || h0.includes("param")) {
      return ["20%", "26%", "14%", "40%"]
    }
    if (h0.includes("field")) {
      return ["18%", "25%", "12%", "45%"]
    }
    return ["22%", "26%", "16%", "36%"]
  }
  if (count === 3) {
    return ["24%", "30%", "46%"]
  }
  if (count === 2) {
    return ["35%", "65%"]
  }
  const equal = `${Math.floor(100 / count)}%`
  return Array(count).fill(equal)
}

function cleanPropAnchor(rawText: string): string | undefined {
  const cleaned = rawText.replace(/[`*]/g, "").trim()
  if (!cleaned || cleaned.includes(" ") || cleaned.length > 40) return undefined
  return `prop-${cleaned.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`
}

/**
 * Render Markdown table to responsive HTML table powered by container queries
 */
function renderTable(tableLines: string[], key: string): React.ReactNode {
  const headerRow = tableLines[0]
  const rows = tableLines.slice(2) // Skip header and separator

  const headers = parseMarkdownTableRow(headerRow)
  const widths = getColumnWidths(headers)
  const columnKinds = headers.map((h) => inferColumnKind(h))

  return (
    <div key={key} className={apiTableStyles.shell}>
      <table className={apiTableStyles.table}>
        <caption className="sr-only">{headers.join(" ")}</caption>
        <colgroup>
          {widths.map((w, idx) => (
            <col key={idx} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} scope="col">
                {renderInlineFormatting(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowLine, rIdx) => {
            const cells = parseMarkdownTableRow(rowLine)
            const firstCellText = cells[0] || ""
            const anchorId = columnKinds[0] === "name" ? cleanPropAnchor(firstCellText) : undefined

            return (
              <tr key={rIdx} id={anchorId}>
                {cells.map((cell, cIdx) => {
                  const kind = columnKinds[cIdx] || "description"
                  const headerLabel = headers[cIdx] || ""
                  const isPropName = cIdx === 0 && kind === "name" && anchorId

                  // Status column formatting (Required / Optional)
                  let cellContent: React.ReactNode = renderInlineFormatting(cell)
                  if (kind === "status") {
                    const lower = cell.toLowerCase().trim()
                    if (lower === "yes" || lower === "true" || lower.includes("req")) {
                      cellContent = (
                        <span className={cn(apiTableStyles.statusBadge, apiTableStyles.statusRequired)}>
                          Required
                        </span>
                      )
                    } else if (lower === "no" || lower === "false" || lower.includes("opt")) {
                      cellContent = (
                        <span className={cn(apiTableStyles.statusBadge, apiTableStyles.statusOptional)}>
                          Optional
                        </span>
                      )
                    }
                  }

                  return (
                    <td
                      key={cIdx}
                      data-label={headerLabel}
                      className={kind ? apiTableStyles[kind] : undefined}
                    >
                      {isPropName ? (
                        <a className={apiTableStyles.propertyLink} href={`#${anchorId}`}>
                          {cellContent}
                        </a>
                      ) : (
                        cellContent
                      )}
                    </td>
                  )
                })}
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
  // 0. Keyboard key: <kbd>...</kbd>
  // 1. Code: `...`
  // 2. Link: [...](...)
  // 3. Bold-Italic: ***...***
  // 4. Bold: **...**
  // 5. Italic: *...* (where * is not followed/preceded by whitespace)
  // 6. Strikethrough: ~~...~~
  const inlineRegex = /(<kbd>[\s\S]*?<\/kbd>|\$\$[^\$\n]+?\$\$|\$(?!\s)[^\$\n]+?(?<!\s)\$|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*|~~[^~]+~~)/gi

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

    // 0. Keyboard key badge: <kbd>key</kbd>
    if (token.toLowerCase().startsWith("<kbd>") && token.toLowerCase().endsWith("</kbd>")) {
      const kbdInner = token.slice(5, -6).trim()
      nodes.push(
        <kbd
          key={key}
          className="inline-flex items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground shadow-xs select-none mx-0.5 align-baseline"
        >
          {renderInlineFormatting(kbdInner, `${key}-k`)}
        </kbd>
      )
    }
    // 0.5 Inline display math: $$...$$
    else if (token.startsWith("$$") && token.endsWith("$$") && token.length >= 4) {
      const mathText = token.slice(2, -2).trim()
      try {
        const html = katex.renderToString(mathText, {
          displayMode: true,
          throwOnError: false,
        })
        nodes.push(
          <span
            key={key}
            className="my-3 block overflow-x-auto py-2 text-center text-foreground not-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      } catch {
        nodes.push(token)
      }
    }
    // 0.6 Inline math: $...$
    else if (token.startsWith("$") && token.endsWith("$") && token.length >= 2) {
      const mathText = token.slice(1, -1).trim()
      if (/^\d+([.,]\d+)?$/.test(mathText)) {
        nodes.push(token)
      } else {
        try {
          const html = katex.renderToString(mathText, {
            displayMode: false,
            throwOnError: false,
          })
          nodes.push(
            <span
              key={key}
              className="inline-math px-0.5 text-foreground"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        } catch {
          nodes.push(token)
        }
      }
    }
    // 1. Inline code: `code`
    else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      nodes.push(
        <code
          key={key}
          dir="ltr"
          className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    // 2. Bold + Italic: ***text***
    else if (token.startsWith("***") && token.endsWith("***") && token.length >= 6) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          <em className="italic text-foreground/90">
            {renderInlineFormatting(token.slice(3, -3), `${key}-bi`)}
          </em>
        </strong>
      )
    }
    // 3. Bold: **text**
    else if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {renderInlineFormatting(token.slice(2, -2), `${key}-b`)}
        </strong>
      )
    }
    // 4. Strikethrough: ~~text~~
    else if (token.startsWith("~~") && token.endsWith("~~") && token.length >= 4) {
      nodes.push(
        <del key={key} className="line-through text-muted-foreground">
          {renderInlineFormatting(token.slice(2, -2), `${key}-del`)}
        </del>
      )
    }
    // 5. Italic: *text*
    else if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      nodes.push(
        <em key={key} className="italic text-foreground/90">
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
              className="text-foreground font-medium underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground transition-colors"
            >
              {renderInlineFormatting(label, `${key}-a`)}
            </a>
          )
        } else {
          nodes.push(
            <Link
              key={key}
              href={href}
              className="text-foreground font-medium underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground transition-colors"
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
