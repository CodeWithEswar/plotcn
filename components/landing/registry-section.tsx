"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartPreview } from "./chart-preview"
import { chartCode, charts } from "./chart-catalog"
import { CopyButton } from "./copy-button"
import { InstallCommand } from "./install-command"
import { Icon } from "./icons"
import { plotcnRegistry } from "@/config/registry"

export function RegistrySection() {
  const code=chartCode(charts[0])
  const registryUrl = plotcnRegistry.getItemUrl("line-basic")

  return <section id="registry" className="section registry-section site-container"><div className="registry-copy"><span className="eyebrow">03 / NO BLACK BOXES</span><h2>Install the source.<br /><span>Own the component.</span></h2><p>Not another dependency to work around. A starting point that becomes part of your codebase. Read it, change it, make it unmistakably yours.</p><InstallCommand name="line-basic" /><div className="ownership-path"><span><Icon name="layers" />Registry</span><Icon name="arrow" /><span><Icon name="code" />Your codebase</span></div><p className="registry-note">Run in a React project with shadcn/ui initialized. The CLI adds the source and required dependencies.</p><a href={registryUrl} className="text-link" target="_blank" rel="noreferrer">Inspect the registry file<Icon name="external" /></a></div><div className="code-window"><div className="window-title"><span className="window-dots"><i /><i /><i /></span><span>your-app / components / charts</span><Icon name="code" /></div><Tabs defaultValue="code"><div className="code-tab-row"><TabsList variant="line"><TabsTrigger value="preview">Preview</TabsTrigger><TabsTrigger value="code">Code</TabsTrigger><TabsTrigger value="registry">Registry</TabsTrigger></TabsList><CopyButton value={code} label="Copy chart example" /></div><TabsContent value="code"><pre className="code-block numbered-code"><code>{code.split("\n").map((line,i)=><span className="code-line" key={i}><span>{String(i+1).padStart(2,"0")}</span>{line || " "}</span>)}</code></pre></TabsContent><TabsContent value="preview"><div className="registry-preview"><ChartPreview kind="line" /></div></TabsContent><TabsContent value="registry"><div className="registry-tab"><span className="eyebrow">DIRECT URL INSTALL</span><h3>One command. Real source.</h3><p>The registry item includes the chart source and its Recharts dependency. Nothing is hidden behind an API.</p><InstallCommand name="line-basic" /><a href={registryUrl} className="text-link" target="_blank" rel="noreferrer">View registry JSON<Icon name="arrow" /></a></div></TabsContent></Tabs><div className="code-window-footer"><span>TypeScript</span><span><Icon name="check" />100% editable</span></div></div></section>
}
