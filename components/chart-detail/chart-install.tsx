import { InstallCommand } from "@/components/registry/install-command"
export function ChartInstall({registryName}:{registryName:string}) {return <section className="my-6" aria-label="Install component"><InstallCommand registryName={registryName}/></section>}
